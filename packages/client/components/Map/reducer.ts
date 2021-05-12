import { GetAllBeachBarsQuery } from "@/graphql/generated";
import { AnimationControls } from "framer-motion";
import { ViewportProps } from "react-map-gl";

export const MAP_ACTIONS = {
  SET_VIEWPORT: "set:viewport",
  SET_SUGGESTIONS_BOX: "set:suggestions_box",
  SET_SELECTED_BEACH_BAR: "set:selected_beach_bar",
  HANDLE_TOUCH_START: "handle:touch_start",
  HANDLE_VIEWPORT_CHANGE: "handle:viewport_change",
  HANDLE_MARKER_CLICK: "handle:marker_click",
} as const;

export type MapReducerInitialStateType = {
  isSuggestionsBoxTouch: boolean;
  timer: NodeJS.Timeout | null;
  suggestionsBox: { height: number; top: number };
  viewport: ViewportProps;
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
  | { type: typeof MAP_ACTIONS.HANDLE_MARKER_CLICK; payload?: { bool: boolean } };

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
    default:
      return state;
  }
};
