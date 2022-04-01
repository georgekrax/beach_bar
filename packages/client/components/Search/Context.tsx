import {
  Country,
  SearchDocument,
  SearchQuery,
  SearchQueryVariables,
  useSearchInputValuesQuery,
} from "@/graphql/generated";
import { userIpAddr } from "@/lib/apollo/cache";
import { INITIAL_SEARCH_VALUES, SearchContextProvider, SearchContextType } from "@/utils/contexts";
import { useIsDevice } from "@/utils/hooks";
import { notify } from "@/utils/notify";
import { checkSearchDate } from "@/utils/search";
import { useApolloClient, useReactiveVar } from "@apollo/client";
import { dayjsFormat } from "@beach_bar/common";
import isEmpty from "lodash/isEmpty";
import { useRouter } from "next/router";
import { memo, useMemo, useReducer } from "react";
import { reducer, SEARCH_ACTIONS } from "./reducer";

type Props = {
  initializer?: () => typeof INITIAL_SEARCH_VALUES;
};

export const Context: React.FC<Props> = memo(({ initializer, children }) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_SEARCH_VALUES, () => {
    let state = INITIAL_SEARCH_VALUES;
    if (initializer) state = { ...state, ...initializer() };
    return state;
  });

  const { form, inputValue } = state;

  const router = useRouter();
  const { isMobile } = useIsDevice();

  const _query: SearchContextType["_query"] = useMemo(() => {
    const { query } = router;
    const { time, ...rest } = INITIAL_SEARCH_VALUES._query;

    const isBox =
      isMobile && isEmpty(query) && !inputValue
        ? false
        : (query.box && Boolean(+query.box)) || (!inputValue && isMobile);
    const [starting, ending] = query.time?.toString().split("_") || [];
    const arr = query.filterIds || [];

    return {
      ...rest,
      isBox,
      searchId: query.id?.toString(),
      searchValue: query.searchValue?.toString(),
      inputId: query.inputId?.toString(),
      redirect: query.redirect?.toString(),
      date: query.date ? checkSearchDate(query.date.toString()) : undefined,
      time: { start: +starting || time.start, end: +ending || time.end },
      filterIds: arr ? [...new Set(Array.isArray(arr) ? Array.from(arr) : [arr])] : [],
      ...(query.adults && { adults: +query.adults?.toString() }),
      ...(query.children && { children: +query.children?.toString() }),
    };
  }, [router.query, router.query.filterIds?.length, isMobile]);

  const ipAdress = useReactiveVar(userIpAddr);
  const apolloClient = useApolloClient();

  const slicedSuggestions = useMemo(() => form.suggestions.data?.slice(0, 7), [form.suggestions.data?.length]);

  const searchInputValues = useSearchInputValuesQuery({
    nextFetchPolicy: "cache-first",
    onCompleted: ({ searchInputValues }) => {
      dispatch({
        type: SEARCH_ACTIONS.SET_STATE,
        payload: { form: { ...form, suggestions: { ...form.suggestions, data: searchInputValues } } },
      });
    },
  });

  // const handleChange = (newVal: string) => {
  //   dispatch({
  //     type: SEARCH_ACTIONS.HANDLE_CHANGE,
  //     payload: { newVal, data: searchInputValues.data?.searchInputValues || [] },
  //   });
  // };

  // const handleSelect: SearchContextType["handleSelect"] = newInputVal => {
  //   const { primary } = formatInputValue(newInputVal);
  //   dispatch({ type: SEARCH_ACTIONS.HANDLE_SELECT, payload: { newInputValue: { ...newInputVal, content: primary } } });
  // };

  const handleFilterIds: SearchContextType[ "handleFilterIds"] = async newVal => {
    const { filterIds } = _query;
    const newArr = !filterIds.includes(newVal) ? [...filterIds, newVal] : filterIds.filter(val => val !== newVal);
    // const newArr = isIncluded ? [...filterIds, newVal] : filterIds.filter(val => val !== newVal);
    // let newQuery = new URLSearchParams({ ...(router.query as any), filterIds: newArr });
    // if (newArr.length === 0) newQuery.delete("filterIds");
    await router.replace({ pathname: router.pathname, query: { ...router.query, filterIds: newArr } }, undefined, {
      shallow: true,
      scroll: false,
    });
  };

  const formatInputValue: SearchContextType["formatInputValue"] = ({ beachBar, country, city, region }) => {
    let value: ReturnType<typeof formatInputValue> = { primary: "", secondary: undefined };
    if (beachBar) value = { primary: beachBar.name, secondary: beachBar.location.formattedLocation };
    else if (region) {
      value = {
        primary: region.name,
        secondary: (city ? city.name : "") + (country ? `, ${country?.alpha2Code}` : ""),
      };
    } else if (city) value = { primary: city.name, secondary: country?.name };
    else if (country) value = { primary: country.name };
    return value;
  };

  const fetchSearchValueCoords: SearchContextType["fetchSearchValueCoords"] = async (inputVal = state.inputValue) => {
    let newCoordinates: Awaited<ReturnType<SearchContextType["fetchSearchValueCoords"]>> = undefined;
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
          `/mapbox.places/${inputVal ? formattedQuery : _query.searchValue}.json?access_token=${
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

  const handleSearch: SearchContextType["handleSearch"] = async () => {
    if (!_query.time.start || !_query.time.end) {
      return notify("error", "Please provide the arrival and the departure time of your visit", {
        somethingWentWrong: false,
      });
    }
    if (!_query.date) return notify("error", "Please provide a date for your visit", { somethingWentWrong: false });

    const availability: SearchQueryVariables["availability"] = {
      adults: _query.adults,
      children: _query.children,
      date: _query.date.format(dayjsFormat.ISO_STRING),
      startTimeId: _query.time.start.toString() || "",
      endTimeId: _query.time.end.toString() || "",
    };

    const { data: res, errors: searchErrors } = await apolloClient.query<SearchQuery>({
      query: SearchDocument,
      variables: {
        availability,
        inputId: _query.inputId || inputValue?.publicId,
        searchValue: _query.searchValue,
        filterIds: undefined,
        searchId: _query.searchId,
        sortId: undefined,
      } as SearchQueryVariables,
    });
    console.log(searchErrors);
    if (searchErrors) return searchErrors.forEach(({ message }) => notify("error", message, { duration: 6000 }));
    const { results: newResults, search: newSearch } = res.search;
    console.log("SearchContext");
    console.log(newSearch.inputValue);
    console.log(_query.searchValue);
    dispatch({
      type: SEARCH_ACTIONS.SET_STATE,
      payload: {
        results: { isLoading: false, arr: newResults, filtered: newResults },
        // date: dayjs(availability?.date),
        // time: { start: +(availability?.startTimeId || 0), end: +(availability?.endTimeId || 0) },
        // filterPublicIds: newSearch.filters.map(({ publicId }) => publicId),
        sort: newSearch.sort,
        inputValue: newSearch.inputValue,
        // form: { ...form, searchValue: formatSearchValue(newSearch.inputValue) },
      },
    });
    await fetchSearchValueCoords(res.search.search.inputValue);
    // if (redirect) {
    //   const { box, ...rest } = router.query;
    //   router.push({ query: rest, pathname: "/search" });
    // }
  };

  // useEffect(() => {
  //   const [starting, ending] = query.time?.toString().split("_") || [];
  //   dispatch({
  //     type: SEARCH_ACTIONS.SET_STATE,
  //     payload: {
  //       date: query.date ? dayjs(query.date.toString()) : undefined,
  //       time: { start: starting ? +starting : 0, end: ending ? +ending : 0 },
  //       people: {
  //         ...state.people,
  //         ...(query.adults && { adults: +query.adults }),
  //         ...(query.children && { children: +query.children }),
  //       },
  //       // form: {
  //       ...state.form,
  //       // id: query.id?.toString(),
  //       // ...(query.searchValue && { searchValue: query.searchValue.toString() }),
  //       // },
  //     },
  //   });
  // }, [Object.keys(query).length]);

  return (
    <SearchContextProvider
      value={{
        ...state,
        _query,
        form: {
          ...form,
          suggestions: {
            ...searchInputValues,
            data: searchInputValues.data?.searchInputValues || [],
            sliced: slicedSuggestions,
          },
        },
        dispatch,
        handleSearch,
        handleFilterIds,
        formatInputValue,
        fetchSearchValueCoords,
      }}
    >
      {children}
    </SearchContextProvider>
  );
});

Context.displayName = "SearchContext";
