import Icons from "@/components/Icons";
import { IconBox } from "@/components/Next/IconBox";
import Search, { SEARCH_ACTIONS } from "@/components/Search";
import { GetAllBeachBarsQuery, useGetAllBeachBarsQuery } from "@/graphql/generated";
import { useSearchContext } from "@/utils/contexts";
import { useConfig, useSearchForm } from "@/utils/hooks";
import { calcDist } from "@/utils/search";
import { BottomSheet, isInViewport, useClassnames } from "@hashtag-design-system/components";
import { motion, useAnimation, Variants } from "framer-motion";
import debounce from "lodash/debounce";
import isEmpty from "lodash/isEmpty";
import Link from "next/link";
import { useRouter } from "next/router";
import { memo, useEffect, useMemo, useReducer, useRef, useState } from "react";
import ReactMapGL, { NavigationControl, ViewportProps } from "react-map-gl";
import styles from "./Map.module.scss";
import { Marker } from "./Marker";
import { MapInitialState, MAP_ACTIONS, reducer } from "./reducer";
import { SelectedDetails } from "./SelectedDetails";
import { Suggestions } from "./Suggestions";

const suggestionsBoxVariants: Variants = {
  shown: { y: 0, opacity: 1 },
  hidden: (height: number) => ({ y: height, opacity: 0 }),
};

const Map: React.FC<Pick<React.ComponentPropsWithoutRef<"div">, "className">> = memo(props => {
  const router = useRouter();
  const [shownBeachBars, setShownBeachBars] = useState<GetAllBeachBarsQuery["getAllBeachBars"]>([]);
  const suggestionsBoxRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Record<string, HTMLButtonElement>>({});
  const [classNames, rest] = useClassnames(styles.container, props);

  const { data, loading, error } = useGetAllBeachBarsQuery();
  const redirect = useMemo(() => router.query.redirect as string, [router]);
  const suggestionsControls = useAnimation();

  const {
    variables: { ipAddr },
  } = useConfig();
  const {
    form: { searchValue },
    inputValue,
    map,
    dispatch: searchDispatch,
  } = useSearchContext();
  const { isDialogShown, isActive, sort, sortedResults } = map;
  const { fetchSearchValueCoords } = useSearchForm();
  const [{ viewport, suggestionsBox, isBottomSheetShown, selectedBeachBar }, dispatch] = useReducer(
    reducer,
    MapInitialState
  );

  const markers = useMemo(
    () =>
      (sortedResults ?? data?.getAllBeachBars ?? []).map(({ id, location }) => (
        <Marker
          key={id}
          isSelected={selectedBeachBar?.id === id}
          zoom={viewport.zoom || MapInitialState.viewport.zoom || 10}
          location={location}
          onClick={() => handleMarkerClick(id)}
          ref={el => (markersRef.current[id] = el!)}
        />
      )),
    [sortedResults, data, viewport, selectedBeachBar]
  );
  const searchBar = useMemo(
    () => (
      <div className={styles.searchBar + " w100 zi--md flex-row-space-between-center"}>
        {redirect && (
          <Link href={redirect}>
            <IconBox aria-label="Return to search results">
              <Icons.Arrow.Left />
            </IconBox>
          </Link>
        )}
        <Search.Box
          // className="map__searchbar"
          layoutId="map-searchBar"
          redirectUri="/map"
          onClick={() =>
            searchDispatch({ type: SEARCH_ACTIONS.SET_STATE, payload: { map: { ...map, isActive: true } } })
          }
        />
        {isDialogShown && (
          <IconBox
            className={styles.closeDialog}
            aria-label="Close map dialog"
            onClick={() => searchDispatch({ type: SEARCH_ACTIONS.TOGGLE_MAP_DIALOG, payload: { bool: false } })}
          >
            <Icons.Close />
          </IconBox>
        )}
      </div>
    ),
    [redirect, map, searchValue]
  );
  const suggestions = useMemo(
    () => (
      <motion.div
        className={styles.suggestions + " w100 flex-column-flex-end-center"}
        initial="shown"
        animate={suggestionsControls}
        variants={suggestionsBoxVariants}
        custom={suggestionsBox.height}
        ref={suggestionsBoxRef}
      >
        <Suggestions dispatch={dispatch} beachBars={(sortedResults || shownBeachBars).slice(0, 7)} />
        <Search.Filters allBeachBars={shownBeachBars} />
      </motion.div>
    ),
    [map, shownBeachBars, suggestionsBox, suggestionsBoxRef, suggestionsControls, suggestionsBoxVariants]
  );

  const handleMarkerClick = (id: string) => {
    const newSelectedBeachBar = data?.getAllBeachBars.find(({ id: barId }) => barId === id);
    if (!newSelectedBeachBar) return;
    dispatch({ type: MAP_ACTIONS.HANDLE_MARKER_CLICK, payload: { bool: true } });
    dispatch({ type: MAP_ACTIONS.SET_SELECTED_BEACH_BAR, payload: newSelectedBeachBar });
  };

  const getNearBeachBar = () => {
    const nearBeachBar = data?.getAllBeachBars.find(({ location }) => {
      if (!ipAddr?.lat && !ipAddr?.lon) return false;
      const dis = Math.floor(calcDist({ latitude: ipAddr.lat, longitude: ipAddr.lon }, location));
      return dis <= 45;
    });
    return nearBeachBar;
  };

  const handleSort = debounce(() => {
    if (sort)
      searchDispatch({
        type: SEARCH_ACTIONS.HANDLE_SORT,
        payload: { sortId: sort.id, beachBars: shownBeachBars, coords: viewport },
      });
  }, 1000);

  const fetchCoordinates = async () => {
    const newCoordinates = await fetchSearchValueCoords();
    if (newCoordinates)
      dispatch({
        type: MAP_ACTIONS.HANDLE_VIEWPORT_CHANGE,
        payload: { newViewport: { ...viewport, ...newCoordinates }, suggestionsControls },
      });
  };

  useEffect(() => {
    if (viewport.latitude === 0 && viewport.longitude === 0 && ipAddr) {
      const { lat, lon } = ipAddr;
      if (lat && lon) {
        const nearBeachBar = getNearBeachBar();
        dispatch({
          type: MAP_ACTIONS.SET_VIEWPORT,
          payload: {
            newViewport: nearBeachBar
              ? { zoom: 12.5, latitude: nearBeachBar.location.latitude, longitude: nearBeachBar.location.longitude }
              : { latitude: lat, longitude: lon },
          },
        });
      }
    }
    // Do not include `viewport` itself, to avoid re-renders
  }, [ipAddr]);

  useEffect(() => {
    if ((isActive || isDialogShown) && inputValue) fetchCoordinates();
  }, [inputValue]);

  useEffect(() => {
    const current = suggestionsBoxRef.current;
    if (suggestionsBoxRef && current && (!suggestionsBox.height || !suggestionsBox.top)) {
      const height = current.offsetHeight;
      const top = current.getBoundingClientRect().top;
      dispatch({ type: MAP_ACTIONS.SET_SUGGESTIONS_BOX, payload: { height, top } });
    }
  }, [suggestionsBoxRef.current]);

  useEffect(() => {
    if (markersRef && !isEmpty(markersRef.current) && data) {
      // https://stackoverflow.com/a/55616626/13142787
      const arr = (sortedResults || data.getAllBeachBars).filter(({ id }) => {
        try {
          return isInViewport(markersRef.current[id]);
        } catch {
          return true;
        }
      });
      setShownBeachBars(arr);
    }
  }, [viewport, markersRef]);

  useEffect(() => handleSort(), [sort, viewport]);

  if (loading) return <h2>Loading...</h2>;

  if (error || !data) return <h2>Error</h2>;

  return (
    <div className="h100" style={{ position: "relative" }}>
      {searchBar}
      <ReactMapGL
        {...viewport}
        {...rest}
        width="100%"
        height="100%"
        mapStyle="mapbox://styles/mapbox/outdoors-v11"
        attributionControl
        className={classNames}
        mapboxApiAccessToken={String(process.env.NEXT_PUBLIC_MAPBOX_TOKEN)}
        onTouchStart={e => dispatch({ type: MAP_ACTIONS.HANDLE_TOUCH_START, payload: { touchY: e.point[1] } })}
        onViewportChange={(newViewport: ViewportProps) => {
          dispatch({ type: MAP_ACTIONS.HANDLE_VIEWPORT_CHANGE, payload: { newViewport, suggestionsControls } });
        }}
      >
        <NavigationControl className={styles.navigationControl + " zi--md flex-row-flex-start-center"} />
        {markers}
        {suggestions}
        <BottomSheet
          isShown={isBottomSheetShown}
          allowedPositions={{ middle: true, expanded: false, hidden: false, "input-focused": true }}
          onDismiss={() => dispatch({ type: MAP_ACTIONS.HANDLE_MARKER_CLICK, payload: { bool: false } })}
        >
          {selectedBeachBar && <SelectedDetails {...selectedBeachBar} />}
        </BottomSheet>
      </ReactMapGL>
    </div>
  );
});

Map.displayName = "Map";

export default Map;
