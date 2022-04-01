import { ACTIONTYPE } from "@/components/Search";
import { GetAllBeachBarsQuery, SearchInputValuesQuery, SearchQuery, SearchSort } from "@/graphql/generated";
import { userIpAddr } from "@/lib/apollo/cache";
import { QueryResult } from "@apollo/client";
import { createCtx } from "@hashtag-design-system/components";
import { Dayjs } from "dayjs";
import { ViewportProps } from "react-map-gl";
import { DATA } from "@/config/data";

type InfoObj = {
  primary: string;
  secondary?: string;
};

export type SearchContextType = {
  inputValue?: SearchInputValuesQuery["searchInputValues"][number];
  sort?: Omit<SearchSort, "__typename">;
  isCartShown: boolean;
  cartId?: string;
  map: {
    isDialogShown: boolean;
    isActive: boolean;
    filterPublicIds: string[];
    // sort?: SearchSort;
    sortId?: SearchSort["id"];
    filteredArr?: GetAllBeachBarsQuery["getAllBeachBars"];
  };
  coordinates: {
    latitude: number;
    longitude: number;
  };
  _query: {
    searchId?: string;
    searchValue?: string;
    inputId?: string;
    isBox: boolean;
    date?: Dayjs;
    adults: number;
    children?: number;
    redirect?: string;
    filterIds: string[];
    time: {
      start: number;
      end: number;
    };
  };
  form: {
    suggestions: Pick<QueryResult<SearchInputValuesQuery>, "loading" | "error"> & {
      data: SearchInputValuesQuery["searchInputValues"];
      sliced: SearchContextType["form"]["suggestions"]["data"];
    };
  };
  results: {
    isLoading: boolean;
    arr: SearchQuery["search"]["results"];
    filtered: SearchQuery["search"]["results"];
  };
  dispatch: React.Dispatch<ACTIONTYPE>;
  // handleChange: (newVal: string) => void;
  handleSearch: () => Promise<void>;
  // handleSelect: (newInputVal: NonNullable<SearchContextType["form"]["inputValue"]>) => void;
  handleFilterIds: (newVal: string) => Promise<void>;
  formatInputValue: (
    params: Pick<SearchInputValuesQuery["searchInputValues"][number], "beachBar" | "country" | "city" | "region">
  ) => InfoObj;
  fetchSearchValueCoords: (
    inputVal: SearchContextType["inputValue"]
  ) => Promise<Pick<Required<ViewportProps>, "longitude" | "latitude" | "zoom"> | undefined>;
};

export const INITIAL_SEARCH_VALUES: SearchContextType = {
  isCartShown: false,
  map: {
    isDialogShown: false,
    isActive: false,
    filterPublicIds: [],
  },
  _query: {
    adults: 1,
    children: 0,
    isBox: false,
    filterIds: [],
    time: { start: DATA.MIN_HOUR, end: DATA.MAX_HOUR },
  },
  coordinates: {
    latitude: userIpAddr()?.lon || 0,
    longitude: userIpAddr()?.lon || 0,
  },
  form: {
    suggestions: { data: [], loading: false, sliced: [] },
  },
  results: {
    isLoading: true,
    arr: [],
    filtered: [],
  },
  dispatch: () => {},
  handleSearch: () => Promise.resolve(),
  handleFilterIds: () => Promise.resolve(),
  formatInputValue: () => ({ primary: "" }),
  fetchSearchValueCoords: () => Promise.resolve(undefined),
};

export const [SearchContextProvider, useSearchContext] = createCtx<SearchContextType>();
