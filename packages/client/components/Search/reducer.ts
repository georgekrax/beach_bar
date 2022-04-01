import { SearchSort } from "@/graphql/generated";
import { SearchContextType } from "@/utils/contexts";
import { filterBeachBars, sortBeachBars } from "@/utils/search";
import { MapReducerInitialStateType } from "../Map/reducer";

export const SEARCH_ACTIONS = {
  SET_STATE: "set:state",
  HANDLE_CLEAR: "handle:clear",
  // HANDLE_CHANGE: "handle:change",
  // HANDLE_PEOPLE_CHANGE: "handle:people_change",
  // HANDLE_TIME_CHANGE: "handle:time_change",
  // HANDLE_SELECT: "handle:select",
  // HANDLE_DATE_SELECT: "handle:date_select",
  HANDLE_CURRENT_LOCATION: "handle:current_location",
  HANDLE_SORT: "handle:sort",
  HANDLE_FILTER: "handle:filter",
  HANDLE_MAP_FILTER: "handle:map_filter",
  TOGGLE_REST_FORM: "toggle:rest_form",
  // TOGGLE_FILTER: "toggle:filter",
  TOGGLE_MAP_FILTER: "toggle:map_filter",
  HANDLE_MAP_SORT: "handle:map_sort",
  TOGGLE_IS_LOADING: "toggle:is_loading",
  TOGGLE_CART: "toggle:cart",
  TOGGLE_MAP_DIALOG: "toggle:map_dialog",
  // CLEAR_FILTERS: "clear:filters",
} as const;

export type SEARCH_REDUCER_INITIAL_STATE_TYPE = Omit<SearchContextType, "dispatch">;

export type SET_STATE_PAYLOAD = Partial<SEARCH_REDUCER_INITIAL_STATE_TYPE>;
// export type HANDLE_SELECT_PAYLOAD = NonNullable<SEARCH_REDUCER_INITIAL_STATE_TYPE["form"]["inputValue"]>;
// export type HANDLE_PEOPLE_CHANGE_PAYLOAD = NonNullable<Partial<SearchContextType["people"]>>;
// export type HANDLE_TIME_PAYLOAD = { newHour: Required<SearchContextType>["time"] };
export type HANDLE_SORT_PAYLOAD = { sortId: SearchSort["id"]; coords?: Partial<SearchContextType["coordinates"]> };

type SearchInputValuesData = Pick<SearchContextType["form"]["suggestions"], "data">;
type FilterPublicIdsType = Pick<SearchContextType["map"], "filterPublicIds">;

export type ACTIONTYPE =
  // | {
  //     type: typeof SEARCH_ACTIONS.CLEAR_FILTERS;
  //   }
  | {
      type: typeof SEARCH_ACTIONS.SET_STATE;
      payload: SET_STATE_PAYLOAD;
    }
  | { type: typeof SEARCH_ACTIONS.HANDLE_CLEAR; payload: SearchInputValuesData }
  // | {
  //     type: typeof SEARCH_ACTIONS.HANDLE_CHANGE;
  //     payload: { newVal: string } & SearchInputValuesData;
  //   }
  // | {
  //     type: typeof SEARCH_ACTIONS.HANDLE_PEOPLE_CHANGE;
  //     payload: HANDLE_PEOPLE_CHANGE_PAYLOAD;
  //   }
  // | {
  //     type: typeof SEARCH_ACTIONS.HANDLE_TIME_CHANGE;
  //     payload: HANDLE_TIME_PAYLOAD;
  //   }
  // | {
  //     type: typeof SEARCH_ACTIONS.HANDLE_SELECT;
  //     payload: { newInputValue: HANDLE_SELECT_PAYLOAD & { content: string } };
  //   }
  // | {
  //     type: typeof SEARCH_ACTIONS.HANDLE_DATE_SELECT;
  //     payload: { newDate: Dayjs };
  //   }
  | {
      type: typeof SEARCH_ACTIONS.HANDLE_CURRENT_LOCATION;
      payload: { searchValue: string };
    }
  | {
      type: typeof SEARCH_ACTIONS.HANDLE_SORT;
      payload: HANDLE_SORT_PAYLOAD;
    }
  | {
      type: typeof SEARCH_ACTIONS.HANDLE_FILTER;
      payload: FilterPublicIdsType;
    }
  | {
      type: typeof SEARCH_ACTIONS.HANDLE_MAP_FILTER;
      payload: FilterPublicIdsType &
        Pick<MapReducerInitialStateType, "shownBeachBars"> & {
          viewport: Pick<MapReducerInitialStateType["viewport"], "latitude" | "longitude">;
        };
    }
  | {
      type: typeof SEARCH_ACTIONS.TOGGLE_MAP_FILTER;
      payload: { id: string; bool: boolean };
    }
  | {
      type: typeof SEARCH_ACTIONS.HANDLE_MAP_SORT;
      payload: Pick<MapReducerInitialStateType, "shownBeachBars"> & {
        viewport: Pick<MapReducerInitialStateType["viewport"], "latitude" | "longitude">;
      };
    }
  | {
      type: typeof SEARCH_ACTIONS.TOGGLE_REST_FORM;
      payload: { bool: boolean };
    }
  // | {
  //     type: typeof SEARCH_ACTIONS.TOGGLE_FILTER;
  //     payload: { id: string; bool: boolean };
  //   }
  | {
      type: typeof SEARCH_ACTIONS.TOGGLE_IS_LOADING;
      payload: { bool: boolean };
    }
  | {
      type: typeof SEARCH_ACTIONS.TOGGLE_CART;
      payload?: { bool: boolean };
    }
  | {
      type: typeof SEARCH_ACTIONS.TOGGLE_MAP_DIALOG;
      payload?: { bool: boolean };
    };

export const reducer = (
  state: SEARCH_REDUCER_INITIAL_STATE_TYPE,
  action: ACTIONTYPE
): SEARCH_REDUCER_INITIAL_STATE_TYPE => {
  const { form, results, coordinates, map, isCartShown } = state;

  switch (action.type) {
    case SEARCH_ACTIONS.SET_STATE: {
      const newState = action.payload;
      return { ...state, ...newState, form: { ...form, ...newState.form } };
    }
    // case SEARCH_ACTIONS.TOGGLE_REST_FORM:
    //   const { bool } = action.payload;
    //   return { ...state, form: { ...state.form, showRest: bool } };
    case SEARCH_ACTIONS.TOGGLE_CART:
      return { ...state, isCartShown: action.payload ? action.payload.bool : !isCartShown };
    case SEARCH_ACTIONS.TOGGLE_MAP_DIALOG:
      return {
        ...state,
        map: {
          ...map,
          isDialogShown: action.payload ? action.payload.bool : !map.isDialogShown,
          filterPublicIds: [],
          filteredArr: undefined,
          sortId: undefined,
        },
      };
    // case SEARCH_ACTIONS.HANDLE_CLEAR:
    //   return { ...state, form: { ...form, suggestions: action.payload.data, searchValue: "" } };
    // case SEARCH_ACTIONS.HANDLE_CHANGE: {
    //   const { newVal, data } = action.payload;

    //   const newSuggestions = filterSuggestions(data, newVal);
    //   return { ...state, form: { ...form, suggestions: { ...form.suggestions, data: newSuggestions } } };
    //   // return { ...state, form: { ...form, searchValue: newVal } };
    // }
    // case SEARCH_ACTIONS.HANDLE_PEOPLE_CHANGE: {
    //   const { adults, children } = action.payload;
    //   return {
    //     ...state,
    //     people: { adults: adults ?? people?.adults ?? 1, children: children ?? people?.children ?? 0 },
    //   };
    // }
    // case SEARCH_ACTIONS.HANDLE_TIME_CHANGE:
    //   return { ...state, time: action.payload.newHour };
    // case SEARCH_ACTIONS.HANDLE_SELECT: {
    //   const { newInputValue } = action.payload;
    //   return {
    //     ...state,
    //     form: { ...form, inputValue: newInputValue, searchValue: newInputValue.content },
    //   };
    // }
    // case SEARCH_ACTIONS.HANDLE_DATE_SELECT:
    //   return { ...state, date: action.payload.newDate };
    // case SEARCH_ACTIONS.HANDLE_CURRENT_LOCATION:
    //   return { ...state, form: { ...form, searchValue: action.payload.searchValue } };
    case SEARCH_ACTIONS.HANDLE_SORT: {
      const { sortId, coords } = action.payload;
      const sortedArr = sortBeachBars<typeof results.filtered[number]>(
        results.filtered,
        sortId,
        coords && coords.latitude && coords.longitude ? (coords as Required<typeof coords>) : coordinates
      );

      return { ...state, results: { ...results, filtered: sortedArr } };
    }
    // case SEARCH_ACTIONS.TOGGLE_FILTER: {
    // const { id, bool } = action.payload;
    // let newArr = filterPublicIds;
    // if (bool) filterPublicIds.push(id);
    // else newArr = filterPublicIds.filter(publicId => publicId !== id);
    // return { ...state, filterPublicIds: newArr };
    // }
    case SEARCH_ACTIONS.TOGGLE_MAP_FILTER: {
      const { id, bool } = action.payload;
      const { filterPublicIds } = map;
      let newArr = filterPublicIds;
      if (bool) filterPublicIds.push(id);
      else newArr = filterPublicIds.filter(publicId => publicId !== id);
      return { ...state, map: { ...map, filterPublicIds: newArr } };
    }
    case SEARCH_ACTIONS.TOGGLE_IS_LOADING: {
      return { ...state, results: { ...results, isLoading: action.payload.bool } };
    }
    case SEARCH_ACTIONS.HANDLE_FILTER: {
      const filteredArr = filterBeachBars<typeof results.arr[number]>(
        results.arr,
        action.payload.filterPublicIds,
        coordinates
      );
      return { ...state, results: { ...results, filtered: filteredArr } };
    }
    case SEARCH_ACTIONS.HANDLE_MAP_FILTER: {
      const {
        filterPublicIds,
        shownBeachBars,
        viewport: { latitude, longitude },
      } = action.payload;
      // Double check, like below, in order to display initially the all #beach_bars data
      if (filterPublicIds.length === 0) return { ...state, map: { ...map, filteredArr: undefined } };
      const filteredArr = filterBeachBars(
        shownBeachBars.map(beachBar => ({ beachBar, hasCapacity: true })),
        filterPublicIds,
        {
          latitude: latitude || 0,
          longitude: longitude || 0,
        }
      ).map(({ beachBar }) => beachBar);

      return { ...state, map: { ...map, filteredArr } };
    }
    case SEARCH_ACTIONS.HANDLE_MAP_SORT: {
      const {
        shownBeachBars,
        viewport: { latitude, longitude },
      } = action.payload;
      // Double check, like above, in order to display initially the all #beach_bars data
      if (!map.sortId) return { ...state, map: { ...map, filteredArr: undefined } };
      const newArr = sortBeachBars(
        shownBeachBars.map(beachBar => ({ beachBar })),
        map.sortId!,
        {
          latitude: latitude || 0,
          longitude: longitude || 0,
        }
      ).map(({ beachBar }) => beachBar);

      return { ...state, map: { ...map, filteredArr: newArr } };
    }

    default:
      return state;
  }
};
