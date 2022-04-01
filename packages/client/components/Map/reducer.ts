import { GetAllBeachBarsQuery } from "@/graphql/generated";
import { AnimationControls } from "framer-motion";
import { ViewportProps as VPProps } from "react-map-gl";

type ViewportProps = Omit<VPProps, "transitionDuration"> & {
  transitionDuration?: number | "auto";
};

export const MAP_ACTIONS = {
  SET_VIEWPORT: "set:viewport",
  SET_SUGGESTIONS_BOX: "set:suggestions_box",
  SET_SELECTED_BEACH_BAR: "set:selected_beach_bar",
  SET_SHOWN_BEACH_BARS: "set:shown_beach_bars",
  // SET_FILTERED_ARR_UNDEFINED: "set:filtered_arr_undefined",
  HANDLE_TOUCH_START: "handle:touch_start",
  HANDLE_VIEWPORT_CHANGE: "handle:viewport_change",
  HANDLE_MARKER_CLICK: "handle:marker_click",
  // HANDLE_FILTER: "handle:filter",
  // HANDLE_SORT: "handle:sort",
} as const;

export type MapReducerInitialStateType = {
  isSuggestionsBoxTouch: boolean;
  timer: NodeJS.Timeout | null;
  suggestionsBox: { height: number; top: number };
  viewport: ViewportProps;
  shownBeachBars: GetAllBeachBarsQuery["getAllBeachBars"];
  // filteredArr?: GetAllBeachBarsQuery["getAllBeachBars"];
  isBottomSheetShown: boolean;
  selectedBeachBar?: Pick<
    GetAllBeachBarsQuery["getAllBeachBars"][number],
    "id" | "name" | "description" | "slug" | "thumbnailUrl"
  >;
};

export const MapInitialState: MapReducerInitialStateType = {
  isSuggestionsBoxTouch: false,
  suggestionsBox: { height: 0, top: 0 },
  timer: null,
  viewport: { latitude: 0, longitude: 0, zoom: 10 },
  shownBeachBars: [],
  // filteredArr: undefined,
  isBottomSheetShown: false,
  selectedBeachBar: undefined,
};

export type MAP_ACTIONTYPE =
  | { type: typeof MAP_ACTIONS.SET_VIEWPORT; payload: { newViewport: ViewportProps } }
  | { type: typeof MAP_ACTIONS.SET_SUGGESTIONS_BOX; payload: MapReducerInitialStateType["suggestionsBox"] }
  | {
      type: typeof MAP_ACTIONS.SET_SELECTED_BEACH_BAR;
      payload: NonNullable<MapReducerInitialStateType["selectedBeachBar"]>;
    }
  | { type: typeof MAP_ACTIONS.HANDLE_TOUCH_START; payload: { touchY: number } }
  | {
      type: typeof MAP_ACTIONS.HANDLE_VIEWPORT_CHANGE;
      payload: { newViewport: ViewportProps; suggestionsControls: AnimationControls };
    }
  | { type: typeof MAP_ACTIONS.HANDLE_MARKER_CLICK; payload?: { bool: boolean } }
  // | {
  //     type: typeof MAP_ACTIONS.HANDLE_SORT;
  //     payload: { sortId: string };
  //   }
  | {
      type: typeof MAP_ACTIONS.SET_SHOWN_BEACH_BARS;
      payload: { arr: MapReducerInitialStateType["shownBeachBars"] };
    };
  // | {
  //     type: typeof MAP_ACTIONS.SET_FILTERED_ARR_UNDEFINED;
  //   };

export const reducer = (state: MapReducerInitialStateType, action: MAP_ACTIONTYPE): MapReducerInitialStateType => {
  const { viewport, selectedBeachBar, isSuggestionsBoxTouch, isBottomSheetShown, timer, suggestionsBox } = state;

  switch (action.type) {
    case MAP_ACTIONS.SET_SUGGESTIONS_BOX:
      const { height, top } = action.payload;
      return { ...state, suggestionsBox: { height, top } };
    case MAP_ACTIONS.SET_VIEWPORT:
      const { newViewport } = action.payload;
      return { ...state, viewport: { ...viewport, ...newViewport } };
    case MAP_ACTIONS.SET_SELECTED_BEACH_BAR:
      return { ...state, selectedBeachBar: { ...action.payload } };
    case MAP_ACTIONS.SET_SHOWN_BEACH_BARS:
      return { ...state, shownBeachBars: action.payload.arr };
    // case MAP_ACTIONS.SET_FILTERED_ARR_UNDEFINED:
    //   return { ...state, filteredArr: undefined };
    case MAP_ACTIONS.HANDLE_MARKER_CLICK:
      const isShown = action.payload !== undefined ? action.payload.bool : !isBottomSheetShown;
      return { ...state, isBottomSheetShown: isShown, selectedBeachBar: !isShown ? undefined : selectedBeachBar };
    case MAP_ACTIONS.HANDLE_TOUCH_START: {
      const { touchY } = action.payload;
      const touchInSuggestionsBox = suggestionsBox.top < touchY;

      // Memoize and do not rerender
      if (touchInSuggestionsBox) {
        if (isSuggestionsBoxTouch !== true) return { ...state, isSuggestionsBoxTouch: true };
      } else {
        if (isSuggestionsBoxTouch !== false) return { ...state, isSuggestionsBoxTouch: false };
      }
      return state;
    }
    case MAP_ACTIONS.HANDLE_VIEWPORT_CHANGE: {
      const { newViewport, suggestionsControls } = action.payload;
      if (timer) clearTimeout(timer);
      let isViewportChanging = false;
      const newTimer = setTimeout(async () => {
        suggestionsControls.start("shown", { stiffness: 750, duration: 0.5 });
        isViewportChanging = false;
      }, 2500);

      const isVewportSame =
        viewport.latitude === newViewport.latitude &&
        viewport.longitude === newViewport.longitude &&
        viewport.zoom === newViewport.zoom;
      if (!isViewportChanging && !isVewportSame && !isSuggestionsBoxTouch) {
        isViewportChanging = true;
        suggestionsControls.start("hidden", { duration: 0.5 });
      }
      return { ...state, viewport: newViewport, timer: newTimer };
    }
    // case MAP_ACTIONS.HANDLE_FILTER:
    //   const { filterPublicIds } = action.payload;
    //   const filteredArr = filterBeachBars(
    //     shownBeachBars.map(beachBar => ({ beachBar })),
    //     filterPublicIds,
    //     {
    //       latitude: viewport.latitude || 0,
    //       longitude: viewport.longitude || 0,
    //     }
    //   ).map(({ beachBar }) => beachBar);

    //   return { ...state, filteredArr };
    // case MAP_ACTIONS.HANDLE_SORT:
    //   const newArr = sortBeachBars(
    //     shownBeachBars.map(beachBar => ({ beachBar })),
    //     action.payload.sortId,
    //     {
    //       latitude: viewport.latitude || 0,
    //       longitude: viewport.longitude || 0,
    //     }
    //   ).map(({ beachBar }) => beachBar);

    //   return { ...state, shownBeachBars: newArr, filteredArr: newArr };

    default:
      return state;
  }
};
