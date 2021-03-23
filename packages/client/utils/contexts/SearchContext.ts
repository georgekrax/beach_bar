import { ACTIONTYPE } from "@/components/Search";
import { GetAllBeachBarsQuery, Search, SearchFilter, SearchInputValuesQuery, SearchSort } from "@/graphql/generated";
import { userIpAddr } from "@/lib/apollo/cache";
import { createCtx } from "@hashtag-design-system/components";
import { Dayjs } from "dayjs";

export type SearchContextType = {
  id: string;
  inputValue?: SearchInputValuesQuery["searchInputValues"][number]["inputValue"];
  sort?: SearchSort;
  filters: SearchFilter[];
  date?: Dayjs;
  hourTime?: number;
  people?: {
    adults: number;
    children: number;
  };
  map: {
    isActive: boolean;
    sort?: SearchSort;
    sortedResults?: GetAllBeachBarsQuery["getAllBeachBars"];
  };
  coordinates: {
    latitude: number;
    longitude: number;
  },
  dispatch: React.Dispatch<ACTIONTYPE>;
  form: {
    searchValue: string;
    suggestions: SearchInputValuesQuery["searchInputValues"];
    showRest: boolean;
    isTimePickerShown: boolean;
    isPeopleShown: boolean;
  };
  results: Search["results"];
};

export const INITIAL_SEARCH_VALUES: SearchContextType = {
  id: "",
  date: undefined,
  filters: [],
  people: undefined,
  map: {
    isActive: false,
    sortedResults: undefined,
  },
  coordinates: {
    latitude: userIpAddr().lat,
    longitude: userIpAddr().lon,
  },
  dispatch: () => {},
  form: {
    searchValue: "",
    suggestions: [],
    showRest: false,
    isTimePickerShown: false,
    isPeopleShown: false,
  },
  inputValue: {
    id: "",
    publicId: "",
    formattedValue: "",
    beachBar: undefined,
    country: undefined,
    city: undefined,
    region: undefined,
  },
  results: [],
};

export const [SearchContextProvider, useSearchContext] = createCtx<SearchContextType>();
