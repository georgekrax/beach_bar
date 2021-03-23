import { SearchSort } from "@/graphql/generated";
import { SearchContextType } from "@/utils/contexts";
import { calcDist } from "@/utils/search";
import { COMMON_CONFIG } from "@beach_bar/common";
import { Dayjs } from "dayjs";

const {
  DISTANCE,
  POPULARITY,
  "STARS (0 to 5)": STARS_ASC,
  "STARS (5 to 0)": STARS_DESC,
} = COMMON_CONFIG.DATA.searchSortFilters;

export const SEARCH_ACTIONS = {
  SET_STATE: "set:state",
  TOGGLE_REST_FORM: "toggle:rest_form",
  HANDLE_CLEAR: "handle:clear",
  HANDLE_CHANGE: "handle:change",
  HANDLE_PEOPLE_CHANGE: "handle:people_change",
  HANDLE_HOUR_TIME_CHANGE: "handle:time_hour_change",
  HANDLE_SELECT: "handle:select",
  HANDLE_DATE_SELECT: "handle:date_select",
  HANDLE_CURRENT_LOCATION: "handle:current_location",
  HANDLE_SORT: "handle:sort",
} as const;

export type SEARCH_REDUCER_INITIAL_STATE_TYPE = Omit<SearchContextType, "dispatch">;

export type SET_STATE_PAYLOAD = Partial<SEARCH_REDUCER_INITIAL_STATE_TYPE>;
export type HANDLE_SELECT_PAYLOAD = SEARCH_REDUCER_INITIAL_STATE_TYPE["inputValue"] & { content: string };
export type HANDLE_PEOPLE_CHANGE_PAYLOAD = NonNullable<Partial<SearchContextType["people"]>>;
export type HANDLE_HOUR_TIME_PAYLOAD = { newHour: SearchContextType["hourTime"] };
export type HANDLE_SORT_PAYLOAD = {
  sortId: SearchSort["id"];
  beachBars?: SearchContextType["map"]["sortedResults"];
  coords?: Partial<SearchContextType["coordinates"]>;
};

type SearchInputValuesData = { data: SearchContextType["form"]["suggestions"] };

export type ACTIONTYPE =
  | {
      type: typeof SEARCH_ACTIONS.SET_STATE;
      payload: SET_STATE_PAYLOAD;
    }
  | {
      type: typeof SEARCH_ACTIONS.TOGGLE_REST_FORM;
      payload: { bool: boolean };
    }
  | { type: typeof SEARCH_ACTIONS.HANDLE_CLEAR; payload: SearchInputValuesData }
  | {
      type: typeof SEARCH_ACTIONS.HANDLE_CHANGE;
      payload: { newVal: string } & SearchInputValuesData;
    }
  | {
      type: typeof SEARCH_ACTIONS.HANDLE_PEOPLE_CHANGE;
      payload: HANDLE_PEOPLE_CHANGE_PAYLOAD;
    }
  | {
      type: typeof SEARCH_ACTIONS.HANDLE_HOUR_TIME_CHANGE;
      payload: HANDLE_HOUR_TIME_PAYLOAD;
    }
  | {
      type: typeof SEARCH_ACTIONS.HANDLE_SELECT;
      payload: { newInputValue: HANDLE_SELECT_PAYLOAD };
    }
  | {
      type: typeof SEARCH_ACTIONS.HANDLE_DATE_SELECT;
      payload: { newDate: Dayjs };
    }
  | {
      type: typeof SEARCH_ACTIONS.HANDLE_CURRENT_LOCATION;
      payload: { searchValue: string };
    }
  | {
      type: typeof SEARCH_ACTIONS.HANDLE_SORT;
      payload: HANDLE_SORT_PAYLOAD;
    };

export const reducer = (
  state: SEARCH_REDUCER_INITIAL_STATE_TYPE,
  action: ACTIONTYPE
): SEARCH_REDUCER_INITIAL_STATE_TYPE => {
  const { form, people, hourTime, results, coordinates, map } = state;

  switch (action.type) {
    case SEARCH_ACTIONS.SET_STATE: {
      const newState = action.payload;
      return { ...state, ...newState, form: { ...state.form, ...newState.form } };
    }
    case SEARCH_ACTIONS.TOGGLE_REST_FORM: {
      const { bool } = action.payload;
      return { ...state, form: { ...state.form, showRest: bool } };
    }
    case SEARCH_ACTIONS.HANDLE_CLEAR: {
      const { data } = action.payload;
      return { ...state, form: { ...form, suggestions: data, searchValue: "" } };
    }
    case SEARCH_ACTIONS.HANDLE_CHANGE: {
      const { newVal, data } = action.payload;

      const newSuggestions =
        data.filter(({ inputValue: { formattedValue } }) =>
          [...newVal].every(val => formattedValue.toLowerCase().indexOf(val.toLowerCase()) > -1)
        ) || [];
      return { ...state, form: { ...form, searchValue: newVal, suggestions: newSuggestions } };
    }
    case SEARCH_ACTIONS.HANDLE_PEOPLE_CHANGE: {
      const { adults, children } = action.payload;
      return {
        ...state,
        people: { adults: adults ?? people?.adults ?? 1, children: children ?? people?.children ?? 0 },
      };
    }
    case SEARCH_ACTIONS.HANDLE_HOUR_TIME_CHANGE: {
      const { newHour } = action.payload;
      return { ...state, hourTime: newHour ?? hourTime };
    }
    case SEARCH_ACTIONS.HANDLE_SELECT: {
      const { newInputValue } = action.payload;
      return {
        ...state,
        form: { ...form, searchValue: newInputValue.content },
        inputValue: newInputValue,
      };
    }
    case SEARCH_ACTIONS.HANDLE_DATE_SELECT: {
      const { newDate } = action.payload;
      return { ...state, date: newDate };
    }
    case SEARCH_ACTIONS.HANDLE_CURRENT_LOCATION: {
      return { ...state, form: { ...form, searchValue: action.payload.searchValue } };
    }
    case SEARCH_ACTIONS.HANDLE_SORT: {
      const { sortId, beachBars, coords } = action.payload;
      const inputArr = beachBars ?? results.map(({ beachBar }) => beachBar);
      const arr = Array.from(inputArr);
      const fCoords = coords && coords.latitude && coords.longitude ? (coords as Required<typeof coords>) : coordinates;

      let newArr: typeof arr | undefined = arr;
      switch (sortId) {
        case DISTANCE.id.toString():
          newArr = arr.sort((a, b) => {
            const aDis = calcDist(fCoords, a.location);
            const bDis = calcDist(fCoords, b.location);
            return aDis - bDis;
          });
          break;
        case POPULARITY.id.toString():
          newArr = arr.sort((a, b) => b.payments.length - a.payments.length);
          break;
        case STARS_ASC.id.toString():
          newArr = arr.sort((a, b) => a.avgRating - b.avgRating);
          break;
        case STARS_DESC.id.toString():
          newArr = arr.sort((a, b) => b.avgRating - a.avgRating);
          break;

        default:
          newArr = undefined;
          break;
      }
      return { ...state, map: { ...map, sortedResults: newArr } };
    }

    default:
      return state;
  }
};
