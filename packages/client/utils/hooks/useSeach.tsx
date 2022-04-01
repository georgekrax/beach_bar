import { HANDLE_SELECT_PAYLOAD, SEARCH_ACTIONS } from "@/components/Search";
import {
  Country,
  SearchDocument,
  SearchInputValuesQuery,
  SearchQuery,
  SearchQueryVariables,
  useSearchInputValuesQuery,
} from "@/graphql/generated";
import { userIpAddr } from "@/lib/apollo/cache";
import { useSearchContext } from "@/utils/contexts";
import { useIsDevice } from "@/utils/hooks";
import { notify } from "@/utils/notify";
import { checkSearchDate } from "@/utils/search";
import { useApolloClient, useReactiveVar } from "@apollo/client";
import { dayjsFormat } from "@beach_bar/common";
import dayjs from "dayjs";
import isEmpty from "lodash/isEmpty";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import { ViewportProps } from "react-map-gl";

type UseSearchMeParams = {
  skipDataFetch?: boolean;
};

type InfoObj = {
  primary: string;
  secondary?: string;
};

type StringUndefined = string | undefined;

export const useSearchMe = (params?: UseSearchMeParams) => {
  const router = useRouter();
  const { isDesktop, isMobile } = useIsDevice();
  const { id, inputValue, date, time, people, form, results, dispatch } = useSearchContext();
  const { suggestions, searchValue } = form;

  const ipAdress = useReactiveVar(userIpAddr);
  const apolloClient = useApolloClient();
  const { data, loading, error } = useSearchInputValuesQuery({
    nextFetchPolicy: "cache-first",
    skip: params?.skipDataFetch,
    // onCompleted: () => console.log("fetched"),
  });

  const { query } = router;
  const redirect = query.redirect?.toString();
  const slicedSuggestions = useMemo(() => suggestions.data.slice(0, 7), [suggestions.data.length]);
  const queryId = useMemo(() => (query.id as string) || id || "", [query.id]);
  const isBox = useMemo(() => {
    return isMobile && isEmpty(query) && !inputValue
      ? false
      : (query.box && Boolean(+query.box)) || (!inputValue && isMobile);
  }, [isEmpty(query), query.box, inputValue?.id, isMobile]);

  // const filterIds = useMemo(() => {
  //   const arr = query.filterIds;
  //   return arr ? (Array.isArray(arr) ? Array.from(arr) : [arr]) : [];
  // }, [query.filterIds?.length || 0]);
  const filterIds = [];

  const fetchSearchValueCoords = async (inputVal: typeof inputValue = inputValue) => {
    let newCoordinates: Required<Pick<ViewportProps, "longitude" | "latitude" | "zoom">> | undefined = undefined;
    let countryCoords: Pick<Country, "alpha2Code"> | undefined = undefined;
    let countryCode: string | undefined = undefined;
    if (inputVal) {
      const { beachBar, country, city, region } = inputVal;
      if (beachBar) {
        const { longitude, latitude } = beachBar.location || {};
        newCoordinates = { zoom: 12, longitude, latitude };
      } else {
        countryCoords = country ? country : city ? city.country : region ? region.country : undefined;
        if (countryCoords) countryCode = countryCoords.alpha2Code.toLowerCase();
      }
    }
    if (!inputVal?.beachBar) {
      const formattedCountryCode = countryCode || ipAdress?.countryCode.toLowerCase();
      let formattedQuery = "";
      if (inputVal) {
        const { country, city, region } = inputVal;
        formattedQuery = region ? region.name : city ? city.name : country ? country.name : "";
      }
      const res = await fetch(
        process.env.NEXT_PUBLIC_MAPBOX_API_URL +
          `/mapbox.places/${inputVal ? formattedQuery : searchValue}.json?access_token=${
            process.env.NEXT_PUBLIC_MAPBOX_TOKEN
          }&autocomplete=false${
            formattedCountryCode ? `&country=${formattedCountryCode}` : ""
          }&types=country%2Cregion%2Cplace%2Clocality%2Cneighborhood`
      );
      const data = await res.json();
      const locationCoord = data.features[0]?.center;
      newCoordinates = { zoom: 12, longitude: locationCoord?.[0], latitude: locationCoord?.[1] };
    }
    if (inputVal && newCoordinates) {
      const { country, city, region } = inputVal;
      if (region) newCoordinates = { ...newCoordinates, zoom: 14 };
      else if (city) newCoordinates = { ...newCoordinates, zoom: 11 };
      else if (country) newCoordinates = { ...newCoordinates, zoom: 5.5 };
    }
    dispatch({ type: SEARCH_ACTIONS.SET_STATE, payload: { coordinates: newCoordinates } });
    return newCoordinates;
  };

  const formatInputValue = ({
    beachBar,
    country,
    city,
    region,
  }: Pick<SearchInputValuesQuery["searchInputValues"][number], "beachBar" | "country" | "city" | "region">) => {
    let value: InfoObj = { primary: "", secondary: undefined };
    if (beachBar) value = { primary: beachBar.name, secondary: beachBar.location?.formattedLocation };
    else if (region) {
      value = {
        primary: region.name,
        secondary: (city ? city.name : "") + (country ? `, ${country?.alpha2Code}` : ""),
      };
    } else if (city) value = { primary: city.name, secondary: country?.name };
    else if (country) value = { primary: country.name };
    return value;
  };

  // const handleChange = (newVal: string) => {
  //   dispatch({ type: SEARCH_ACTIONS.HANDLE_CHANGE, payload: { newVal, data: data?.searchInputValues || [] } });
  // };

  const handleSelect = (newInputVal: Omit<HANDLE_SELECT_PAYLOAD, "content">) => {
    const { primary } = formatInputValue(newInputVal);
    dispatch({ type: SEARCH_ACTIONS.HANDLE_SELECT, payload: { newInputValue: { ...newInputVal, content: primary } } });
  };

  const handleFilterIds = async (newArr: string[]) => {
    await router.replace({ pathname: router.pathname, query: { ...router.query, filterIds: newArr } }, undefined, {
      shallow: true,
      scroll: false,
    });
  };

  const handleSearch = async () => {
    const queryAdults = query.adults;
    const queryChildren = query.children;
    const newPeople = {
      adults: queryAdults ? +queryAdults?.toString() : people?.adults,
      children: queryChildren ? +queryChildren?.toString() : people?.children,
    };
    console.log("handleSearch");
    const queryTime = (query.time as StringUndefined)?.split("_");
    if (!queryTime || queryTime.length < 2) {
      return notify("error", "Please provide the arrival and the departure time of your visit", {
        somethingWentWrong: false,
      });
    }
    const availability: SearchQueryVariables["availability"] = {
      ...newPeople,
      date: (query.date as StringUndefined) || (date || checkSearchDate(dayjs())).format(dayjsFormat.ISO_STRING),
      startTimeId: queryTime[0] || time?.start.toString() || "",
      endTimeId: queryTime[1] || time?.end.toString() || "",
    };
    const { data: res, errors: searchErrors } = await apolloClient.query<SearchQuery>({
      query: SearchDocument,
      variables: {
        inputId: query.inputId || inputValue?.publicId,
        searchValue: query.searchValue || searchValue,
        availability,
        filterIds: undefined,
        searchId: queryId || undefined,
        sortId: undefined,
      } as SearchQueryVariables,
    });
    if (searchErrors) return searchErrors.forEach(({ message }) => notify("error", message, { duration: 6000 }));
    const { results: newResults, search: newSearch } = res.search;
    console.log("handleSearch");
    console.log(newSearch.inputValue);
    console.log(query.searchValue);
    console.log(newSearch.inputValue || query.searchValue);
    // dispatch({
    //   type: SEARCH_ACTIONS.SET_STATE,
    //   payload: {
    //     id: newSearch.id.toString(),
    //     results: { isLoading: false, arr: newResults, filtered: newResults },
    //     people: newPeople,
    //     date: dayjs(availability?.date),
    //     time: { start: +(availability?.startTimeId || 0), end: +(availability?.endTimeId || 0) },
    //     inputValue: newSearch.inputValue,
    //     // filterPublicIds: newSearch.filters.map(({ publicId }) => publicId),
    //     sort: newSearch.sort,
    //     form: { ...form, searchValue: formatSearchValue(newSearch.inputValue) },
    //   },
    // });
    await fetchSearchValueCoords(res.search.search.inputValue);
    // if (redirect) {
    //   const { box, ...rest } = router.query;
    //   router.push({ query: rest, pathname: "/search" });
    // }
  };

  // useEffect(() => {
  //   console.log("useEffect");
  //   if (isDesktop && data && suggestions.length === 0) {
  //     dispatch({ type: SEARCH_ACTIONS.SET_STATE, payload: { form: { ...form, suggestions: data.searchInputValues } } });
  //   }
  // }, [data?.searchInputValues.length, isDesktop]);

  useEffect(() => {
    dispatch({ type: SEARCH_ACTIONS.TOGGLE_IS_LOADING, payload: { bool: results.arr.length === 0 } });
  }, [results.arr.length]);

  return {
    // searchInputValues: { data, loading, error, sliced: slicedSuggestions },
    // queryId,
    // isBox,
    // redirect,
    // filterIds,
    // handleChange,
    // handleSelect,
    // handleSearch,
    // handleFilterIds,
    // formatInputValue,
    // fetchSearchValueCoords,
  };
};
