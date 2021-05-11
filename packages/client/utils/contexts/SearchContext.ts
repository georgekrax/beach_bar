<<<<<<< HEAD
import { ACTIONTYPE } from "@/components/Search";
import { GetAllBeachBarsQuery, SearchInputValuesQuery, SearchQuery, SearchSort } from "@/graphql/generated";
import { userIpAddr } from "@/lib/apollo/cache";
import { createCtx } from "@hashtag-design-system/components";
import { Dayjs } from "dayjs";

export type SearchContextType = {
  id: string;
  inputValue?: SearchInputValuesQuery["searchInputValues"][number];
  sort?: Omit<SearchSort, "__typename">;
  filterPublicIds: string[];
  date?: Dayjs;
  hourTime?: number;
  isCartShown: boolean;
  people?: {
    adults: number;
    children: number;
  };
  map: {
    isDialogShown: boolean;
    isActive: boolean;
    sort?: SearchSort;
    sortedResults?: GetAllBeachBarsQuery["getAllBeachBars"];
  };
  coordinates: {
    latitude: number;
    longitude: number;
  };
  form: {
    searchValue: string;
    suggestions: SearchInputValuesQuery["searchInputValues"];
    showRest: boolean;
    isTimePickerShown: boolean;
    isPeopleShown: boolean;
  };
  results: {
    arr: SearchQuery["search"]["results"];
    filtered: SearchQuery["search"]["results"];
  };
  dispatch: React.Dispatch<ACTIONTYPE>;
};

export const INITIAL_SEARCH_VALUES: SearchContextType = {
  id: "",
  date: undefined,
  filterPublicIds: [],
  people: undefined,
  isCartShown: false,
  map: {
    isDialogShown: false,
    isActive: false,
    sortedResults: undefined,
  },
  coordinates: {
    latitude: userIpAddr().lat,
    longitude: userIpAddr().lon,
  },
  form: {
    searchValue: "",
    suggestions: [],
    showRest: false,
    isTimePickerShown: false,
    isPeopleShown: false,
  },
  inputValue: undefined,
  results: {
    arr: [],
    filtered: [],
  },
  dispatch: () => {},
};

export const [SearchContextProvider, useSearchContext] = createCtx<SearchContextType>();
=======
import { ACTIONTYPE } from "@/components/Search";
import { GetAllBeachBarsQuery, SearchInputValuesQuery, SearchQuery, SearchSort } from "@/graphql/generated";
import { userIpAddr } from "@/lib/apollo/cache";
import { createCtx } from "@hashtag-design-system/components";
import { Dayjs } from "dayjs";

export type SearchContextType = {
  id: string;
  inputValue?: SearchInputValuesQuery["searchInputValues"][number];
  sort?: Omit<SearchSort, "__typename">;
  filterPublicIds: string[];
  date?: Dayjs;
  hourTime?: number;
  isCartShown: boolean;
  people?: {
    adults: number;
    children: number;
  };
  map: {
    isDialogShown: boolean;
    isActive: boolean;
    sort?: SearchSort;
    sortedResults?: GetAllBeachBarsQuery["getAllBeachBars"];
  };
  coordinates: {
    latitude: number;
    longitude: number;
  };
  form: {
    searchValue: string;
    suggestions: SearchInputValuesQuery["searchInputValues"];
    showRest: boolean;
    isTimePickerShown: boolean;
    isPeopleShown: boolean;
  };
  results: {
    arr: SearchQuery["search"]["results"];
    filtered: SearchQuery["search"]["results"];
  };
  dispatch: React.Dispatch<ACTIONTYPE>;
};

export const INITIAL_SEARCH_VALUES: SearchContextType = {
  id: "",
  date: undefined,
  filterPublicIds: [],
  people: undefined,
  isCartShown: false,
  map: {
    isDialogShown: false,
    isActive: false,
    sortedResults: undefined,
  },
  coordinates: {
    latitude: userIpAddr().lat,
    longitude: userIpAddr().lon,
  },
  form: {
    searchValue: "",
    suggestions: [],
    showRest: false,
    isTimePickerShown: false,
    isPeopleShown: false,
  },
  inputValue: undefined,
  results: {
    arr: [],
    filtered: [],
  },
  dispatch: () => {},
};

export const [SearchContextProvider, useSearchContext] = createCtx<SearchContextType>();
>>>>>>> 3c094b84c4b6a5e6c8400166ac60b7393b7ddcff
