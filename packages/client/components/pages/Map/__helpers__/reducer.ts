import { AnimationControls } from "framer-motion";
import { ViewportProps } from "react-map-gl";
import { GetAllBeachBarsQuery } from "../../../../graphql/generated";

// ------------ Reducer types ------------ //
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
  selectedBeachBar: Pick<GetAllBeachBarsQuery["getAllBeachBars"][number], "name" | "thumbnailUrl" | "description">;
};

export type ACTIONTYPE =
  | { type: typeof MAP_ACTIONS.SET_VIEWPORT; payload: { newViewport: ViewportProps } }
  | { type: typeof MAP_ACTIONS.SET_SUGGESTIONS_BOX; payload: MapReducerInitialStateType["suggestionsBox"] }
  | { type: typeof MAP_ACTIONS.SET_SELECTED_BEACH_BAR; payload: MapReducerInitialStateType["selectedBeachBar"] }
  | { type: typeof MAP_ACTIONS.HANDLE_TOUCH_START; payload: { touchY: number } }
  | {
      type: typeof MAP_ACTIONS.HANDLE_VIEWPORT_CHANGE;
      payload: { newViewport: ViewportProps; suggestionsControls: AnimationControls };
    }
  | { type: typeof MAP_ACTIONS.HANDLE_MARKER_CLICK; payload?: { open: boolean } };

// ------------ The reducer ------------ //
export const reducer = (state: MapReducerInitialStateType, action: ACTIONTYPE): MapReducerInitialStateType => {
  const { viewport, isSuggestionsBoxTouch, timer, suggestionsBox } = state;

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
      return { ...state, isBottomSheetShown: action.payload !== undefined ? action.payload.open : false };
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
