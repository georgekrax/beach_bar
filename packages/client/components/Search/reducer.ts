import { SearchSort } from "@/graphql/generated";
import { SearchContextType } from "@/utils/contexts";
import { calcDist, filterByRating } from "@/utils/search";
import { COMMON_CONFIG } from "@beach_bar/common";
import { Dayjs } from "dayjs";

const {
  DISTANCE,
  POPULARITY,
  "STARS (0 to 5)": STARS_ASC,
  "STARS (5 to 0)": STARS_DESC,
} = COMMON_CONFIG.DATA.searchSortFilters;

const { SERVICES, STYLE, REVIEW_SCORES, DISTANCE_FILTERS, GENERAL } = COMMON_CONFIG.DATA.searchFilters;

export const SEARCH_ACTIONS = {
  SET_STATE: "set:state",
  HANDLE_CLEAR: "handle:clear",
  HANDLE_CHANGE: "handle:change",
  HANDLE_PEOPLE_CHANGE: "handle:people_change",
  HANDLE_HOUR_TIME_CHANGE: "handle:time_hour_change",
  HANDLE_SELECT: "handle:select",
  HANDLE_DATE_SELECT: "handle:date_select",
  HANDLE_CURRENT_LOCATION: "handle:current_location",
  HANDLE_SORT: "handle:sort",
  HANDLE_FILTER: "handle:filter",
  TOGGLE_REST_FORM: "toggle:rest_form",
  TOGGLE_FILTER: "toggle:filter",
  TOGGLE_CART: "toggle:cart",
  TOGGLE_MAP_DIALOG: "toggle:map_dialog",
  CLEAR_FILTERS: "clear:filters",
} as const;

export type SEARCH_REDUCER_INITIAL_STATE_TYPE = Omit<SearchContextType, "dispatch">;

export type SET_STATE_PAYLOAD = Partial<SEARCH_REDUCER_INITIAL_STATE_TYPE>;
export type HANDLE_SELECT_PAYLOAD = NonNullable<SEARCH_REDUCER_INITIAL_STATE_TYPE["inputValue"]>;
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
      type: typeof SEARCH_ACTIONS.CLEAR_FILTERS;
    }
  | {
      type: typeof SEARCH_ACTIONS.SET_STATE;
      payload: SET_STATE_PAYLOAD;
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
      payload: { newInputValue: HANDLE_SELECT_PAYLOAD & { content: string } };
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
    }
  | {
      type: typeof SEARCH_ACTIONS.HANDLE_FILTER;
      payload: Pick<HANDLE_SORT_PAYLOAD, "beachBars">;
    }
  | {
      type: typeof SEARCH_ACTIONS.TOGGLE_REST_FORM;
      payload: { bool: boolean };
    }
  | {
      type: typeof SEARCH_ACTIONS.TOGGLE_FILTER;
      payload: { id: string; bool: boolean };
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
  const { form, people, hourTime, results, coordinates, map, filterPublicIds, isCartShown } = state;

  switch (action.type) {
    case SEARCH_ACTIONS.SET_STATE: {
      const newState = action.payload;
      return { ...state, ...newState, form: { ...form, ...newState.form } };
    }
    case SEARCH_ACTIONS.TOGGLE_REST_FORM:
      const { bool } = action.payload;
      return { ...state, form: { ...state.form, showRest: bool } };
    case SEARCH_ACTIONS.TOGGLE_CART:
      return { ...state, isCartShown: action.payload ? action.payload.bool : !isCartShown };
    case SEARCH_ACTIONS.TOGGLE_MAP_DIALOG:
      return { ...state, map: { ...map, isDialogShown: action.payload ? action.payload.bool : !map.isDialogShown } };
    case SEARCH_ACTIONS.HANDLE_CLEAR:
      return { ...state, form: { ...form, suggestions: action.payload.data, searchValue: "" } };
    case SEARCH_ACTIONS.HANDLE_CHANGE: {
      const { newVal, data } = action.payload;

      const newSuggestions =
        data.filter(({ formattedValue }) =>
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
    case SEARCH_ACTIONS.HANDLE_HOUR_TIME_CHANGE:
      return { ...state, hourTime: action.payload.newHour ?? hourTime };
    case SEARCH_ACTIONS.HANDLE_SELECT: {
      const { newInputValue } = action.payload;
      return {
        ...state,
        form: { ...form, searchValue: newInputValue.content },
        inputValue: newInputValue,
      };
    }
    case SEARCH_ACTIONS.HANDLE_DATE_SELECT:
      return { ...state, date: action.payload.newDate };
    case SEARCH_ACTIONS.HANDLE_CURRENT_LOCATION:
      return { ...state, form: { ...form, searchValue: action.payload.searchValue } };
    case SEARCH_ACTIONS.HANDLE_SORT: {
      const { sortId, beachBars, coords } = action.payload;
      const inputArr = beachBars ?? results.filtered.map(({ beachBar }) => beachBar);
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
    case SEARCH_ACTIONS.TOGGLE_FILTER: {
      const { id, bool } = action.payload;
      let newArr = filterPublicIds;
      if (bool) filterPublicIds.push(id);
      else newArr = filterPublicIds.filter(publicId => publicId !== id);
      return { ...state, filterPublicIds: newArr };
    }
    case SEARCH_ACTIONS.CLEAR_FILTERS:
      return { ...state, filterPublicIds: [] };
    case SEARCH_ACTIONS.HANDLE_FILTER: {
      let newArr = results.arr;
      filterPublicIds.forEach(publicId => {
        switch (publicId) {
          case SERVICES.SWIMMING_POOL.publicId:
          case SERVICES.FOOD_SNACKS.publicId:
          case SERVICES.WATER_SLIDES.publicId:
          case SERVICES.SEA_INFLATABLE_TOYS.publicId:
          case SERVICES.PRIVATE_BAY.publicId:
          case SERVICES.FREE_PARKING.publicId:
          case GENERAL.FREE_PARKING.publicId:
            const service = Object.values(SERVICES).find(service => service.publicId === publicId);
            if (!service) break;
            newArr = newArr.filter(({ beachBar: { features } }) =>
              features.some(feature => feature?.service.name.toLowerCase() === service.name.toLowerCase())
            );
            break;
          case STYLE.FAMILY_FRIENDLY.publicId:
          case STYLE.LOUD_MUSIC.publicId:
          case STYLE.MODERN.publicId:
          case STYLE.PARTIES_AND_CONCERTS.publicId:
          case STYLE.ROMANTIC.publicId:
          case STYLE.SELF_SERVICE.publicId:
          case STYLE.TROPICAL.publicId:
            const style = Object.values(STYLE).find(style => style.publicId === publicId);
            if (!style) break;
            newArr = newArr.filter(({ beachBar: { styles } }) =>
              styles?.some(style => style?.name.toLowerCase() === style.name.toLowerCase())
            );
            break;
          case REVIEW_SCORES.VERY_GOOD.publicId:
          case REVIEW_SCORES.GOOD.publicId:
          case REVIEW_SCORES.DELIGHTFUL.publicId:
          case REVIEW_SCORES.EXCELLENT.publicId:
          case GENERAL.EXCELLENT.publicId:
            newArr = filterByRating<any>(
              filterPublicIds,
              newArr.map(({ beachBar: { __typename, ...rest } }) => rest)
            );
            break;
          case DISTANCE_FILTERS["5KM"].publicId:
          case DISTANCE_FILTERS["15KM"].publicId:
          case DISTANCE_FILTERS["15KM"].publicId:
            const disFilter = Object.values(DISTANCE_FILTERS).find(filter => filter.publicId === publicId);
            newArr = newArr.filter(
              ({ beachBar: { location } }) =>
                calcDist(coordinates, location) <= (disFilter?.km ?? DISTANCE_FILTERS["15KM"].km)
            );
            break;
          case GENERAL.AVAILABLE.publicId:
            newArr = newArr.filter(({ beachBar: { isAvailable } }) => isAvailable === true);
            break;
          case GENERAL.WITH_RESTAURANT.publicId:
            newArr = newArr.filter(({ beachBar: { restaurants } }) => restaurants && restaurants.length > 0);
            break;

          default:
            break;
        }
      });
      return {
        ...state,
        results: { ...results, filtered: newArr },
        // map: { ...map, sortedResults: newArr },
      };
    }

    default:
      return state;
  }
};
