import { HANDLE_SELECT_PAYLOAD, SEARCH_ACTIONS } from "@/components/Search";
import {
  Country,
  SearchDocument,
  SearchInputValuesQuery,
  SearchQuery,
  useSearchInputValuesQuery,
} from "@/graphql/generated";
import { userIpAddr } from "@/lib/apollo/cache";
import { useSearchContext } from "@/utils/contexts";
import { useIsDesktop } from "@/utils/hooks";
import { notify } from "@/utils/notify";
import { checkSearchDate, formatSearchValue } from "@/utils/search";
import { useApolloClient } from "@apollo/client";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { ViewportProps } from "react-map-gl";

type InfoObj = {
  primary: string;
  secondary?: string;
};

export const useSearchForm = () => {
  const isDesktop = useIsDesktop();
  const router = useRouter();
  const { form, inputValue, date, hourTime, people, dispatch } = useSearchContext();
  const { suggestions } = form;

  const apolloClient = useApolloClient();
  const { data, loading, error } = useSearchInputValuesQuery({
    onCompleted: ({ searchInputValues }) => {
      if (isDesktop)
        dispatch({ type: SEARCH_ACTIONS.SET_STATE, payload: { form: { ...form, suggestions: searchInputValues } } });
    },
  });

  const slicedSuggestions = useMemo(() => suggestions.slice(0, 7), [suggestions]);
  const queryId = useMemo(() => router.query.id as string, [router]);
  const isBox = useMemo(() => router.query.box === "true" || (!inputValue && !isDesktop), [router, isDesktop]);
  const redirect = useMemo(() => router.query.redirect as string, [router]);

  const fetchSearchValueCoords = async (inputVal: typeof inputValue = inputValue) => {
    let newCoordinates: Required<Pick<ViewportProps, "longitude" | "latitude" | "zoom">> | undefined = undefined;
    let countryCoords: Pick<Country, "alpha2Code"> | undefined = undefined;
    let countryCode: string | undefined = undefined;
    if (inputVal) {
      const { beachBar, country, city, region } = inputVal;
      if (beachBar) {
        const { longitude, latitude } = beachBar.location;
        newCoordinates = { zoom: 12, longitude, latitude };
      } else {
        countryCoords = country ? country : city ? city.country : region ? region.country : undefined;
        if (countryCoords) countryCode = countryCoords.alpha2Code.toLowerCase();
      }
    }
    const formattedCountryCode = countryCode || userIpAddr().countryCode.toLowerCase();
    const res = await fetch(
      process.env.NEXT_PUBLIC_MAPBOX_API_URL +
        `/mapbox.places/${
          form.searchValue || (inputVal ? formatSearchValue(inputVal) : "undefined")
        }.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&autocomplete=false${
          formattedCountryCode ? `&country=${formattedCountryCode}` : ""
        }&types=country%2Cregion%2Cplace%2Clocality%2Cneighborhood`
    );
    const data = await res.json();
    const locationCoord = data.features[0]?.center;
    console.log(locationCoord);
    newCoordinates = { zoom: 12, longitude: locationCoord?.[0], latitude: locationCoord?.[1] };
    if (inputVal) {
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
    if (beachBar) value = { primary: beachBar.name, secondary: beachBar.formattedLocation };
    else if (region)
      value = {
        primary: region.name,
        secondary: (city ? city.name : "") + (country ? `, ${country?.alpha2Code}` : ""),
      };
    else if (city) value = { primary: city.name, secondary: country?.name };
    else if (country) value = { primary: country.name };
    return value;
  };

  const handleChange = (newVal: string) =>
    dispatch({ type: SEARCH_ACTIONS.HANDLE_CHANGE, payload: { newVal, data: data?.searchInputValues || [] } });

  const handleSelect = (newInputVal: Omit<HANDLE_SELECT_PAYLOAD, "content">) => {
    const { primary } = formatInputValue(newInputVal);
    dispatch({ type: SEARCH_ACTIONS.HANDLE_SELECT, payload: { newInputValue: { ...newInputVal, content: primary } } });
  };

  const handleSearch = async (redirect = true) => {
    const newPeople = { adults: people?.adults || 1, children: people?.children || 0 };
    const availability = {
      ...newPeople,
      date: date || checkSearchDate(dayjs()),
      timeId: hourTime?.toString() || undefined,
    };
    const { data: res, errors: searchErrors } = await apolloClient.query<SearchQuery>({
      query: SearchDocument,
      variables: {
        inputId: inputValue?.publicId,
        inputValue: undefined,
        availability,
        filterIds: undefined,
        searchId: queryId,
        sortId: undefined,
      },
    });
    if (searchErrors) searchErrors.forEach(({ message }) => notify("error", message));
    else {
      const { results, search: newSearch } = res.search;
      await fetchSearchValueCoords(res.search.search.inputValue);
      dispatch({
        type: SEARCH_ACTIONS.SET_STATE,
        payload: {
          id: newSearch.id,
          results: { arr: results, filtered: results },
          people: newPeople,
          date: availability.date,
          hourTime: availability.timeId ? parseInt(availability.timeId) : undefined,
          inputValue: newSearch.inputValue,
          filterPublicIds: newSearch.filters.map(({ publicId }) => publicId),
          sort: newSearch.sort,
          form: { ...form, searchValue: formatSearchValue(newSearch.inputValue) },
        },
      });
      if (redirect) {
        const { box, ...rest } = router.query;
        router.push({ query: rest, pathname: "/search" });
      }
    }
  };

  return {
    searchInputValues: { data, loading, error, sliced: slicedSuggestions },
    queryId,
    isBox,
    redirect,
    handleChange,
    handleSelect,
    handleSearch,
    formatInputValue,
    fetchSearchValueCoords,
  };
};
