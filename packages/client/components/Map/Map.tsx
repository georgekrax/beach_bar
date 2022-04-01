import Icons from "@/components/Icons";
import { IconBox } from "@/components/Next/IconBox";
import Search, { SEARCH_ACTIONS } from "@/components/Search";
import { DATA } from "@/config/data";
import { useGetAllBeachBarsQuery } from "@/graphql/generated";
import { SearchContextType, useSearchContext } from "@/utils/contexts";
import { isElemVisible } from "@/utils/data";
import { useConfig } from "@/utils/hooks";
import { calcDist, filterSuggestions } from "@/utils/search";
import { BottomSheet, useClassnames } from "@hashtag-design-system/components";
import { motion, useAnimation, Variants } from "framer-motion";
import isEmpty from "lodash/isEmpty";
import throttle from "lodash/throttle";
import Link from "next/link";
import { useRouter } from "next/router";
import { memo, useEffect, useMemo, useReducer, useRef, useState } from "react";
import ReactMapGL, { FlyToInterpolator, MapRef, NavigationControl, ViewportProps } from "react-map-gl";
import useSupercluster from "use-supercluster";
import styles from "./Map.module.scss";
import { Marker } from "./Marker";
import { MapInitialState, MAP_ACTIONS, reducer } from "./reducer";
import { SelectedDetails } from "./SelectedDetails";
import { Suggestions } from "./Suggestions";

const { MAP_MAX_ZOOM } = DATA;

const suggestionsBoxVariants: Variants = {
  shown: { y: 0, opacity: 1 },
  hidden: (height: number) => ({ y: height, opacity: 0 }),
};

const Map: React.FC<Pick<React.ComponentPropsWithoutRef<"div">, "className">> = memo(props => {
  const { query } = useRouter();
  const [searchInput, setSearchInput] = useState<SearchContextType["form"]["suggestions"]["data"][number]>();
  const mapRef = useRef<MapRef>(null);
  const suggestionsBoxRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Record<string, HTMLButtonElement>>({});
  const [classNames, rest] = useClassnames(styles.container, props);

  const { data, error } = useGetAllBeachBarsQuery();
  const suggestionsControls = useAnimation();
  const {
    variables: { mapDialogWidth, ipAddr },
  } = useConfig();

  const {
    map,
    form: { suggestions },
    dispatch: searchDispatch,
    fetchSearchValueCoords,
  } = useSearchContext();
  const { isDialogShown, isActive, filterPublicIds, filteredArr, sortId } = map;
  const [{ viewport, suggestionsBox, shownBeachBars, isBottomSheetShown, selectedBeachBar }, dispatch] = useReducer(
    reducer,
    MapInitialState
  );

  const redirect = useMemo(() => query.redirect as string, [query]);
  const querySearchValue = useMemo(() => query.searchValue as string, [query]);
  const zoom = useMemo(
    () => viewport.zoom || MapInitialState.viewport.zoom || MAP_MAX_ZOOM / 2,
    [viewport, MapInitialState, MAP_MAX_ZOOM]
  );
  console.log(filteredArr);
  const beachBars = useMemo(() => filteredArr ?? data?.getAllBeachBars ?? [], [filteredArr, data]);
  // Should update as viewport changes
  const bounds = mapRef.current ? mapRef.current.getMap().getBounds().toArray().flat() : null;
  const points = useMemo(
    () =>
      beachBars.map(({ location: { latitude, longitude }, ...beachBar }) => ({
        type: "Feature",
        properties: { cluster: false, ...beachBar },
        geometry: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
      })),
    [beachBars]
  );

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom,
    options: { radius: 0, maxZoom: MAP_MAX_ZOOM },
  });

  const handleSearchBarChange = (newVal: string) => {
    const filteredSuggestions = filterSuggestions(suggestions.data || [], newVal);
    if (filteredSuggestions.length <= 0) return;
    setSearchInput(filteredSuggestions[0]);
  };

  const clustersAndMarkers = useMemo(
    () =>
      clusters.map(({ id: clusterId, geometry, properties }) => {
        const [longitude, latitude] = geometry.coordinates;
        const { cluster: isCluster, point_count: pointCount, id } = properties;

        return isCluster ? (
          <Marker
            key={clusterId}
            zoom={zoom}
            latitude={latitude}
            longitude={longitude}
            cluster={{ pointCount, pointsLength: points.length }}
            onClick={() =>
              dispatch({
                type: MAP_ACTIONS.SET_VIEWPORT,
                payload: {
                  newViewport: {
                    ...viewport,
                    latitude,
                    longitude,
                    zoom: Math.min(supercluster.getClusterExpansionZoom(clusterId), MAP_MAX_ZOOM),
                    transitionDuration: "auto",
                    transitionInterpolator: new FlyToInterpolator(),
                  },
                },
              })
            }
          />
        ) : (
          <Marker
            key={id}
            isSelected={selectedBeachBar?.id === id}
            zoom={zoom}
            latitude={latitude}
            longitude={longitude}
            onClick={() => handleMarkerClick(id)}
            ref={el => (markersRef.current[id] = el!)}
          />
        );
      }),
    [clusters, viewport, selectedBeachBar]
  );
  const searchBar = useMemo(
    () => (
      <div className={styles.searchBar + " w100 zi--md flex-row-space-between-center"}>
        {redirect && (
          <Link href={redirect}>
            <IconBox className={styles.redirectBtn} aria-label="Return to search results">
              <Icons.Arrow.Left />
            </IconBox>
          </Link>
        )}
        <Search.Box
          // className="map__searchbar"
          layoutId="map-searchBar"
          style={{ flexShrink: 1 }}
          fields={{ date: false, people: false }}
          input={{ onChange: val => handleSearchBarChange(val) }}
          cta={{ onClick: async () => await fetchCoordinates() }}
          redirectUri="/map"
          onClick={() =>
            searchDispatch({ type: SEARCH_ACTIONS.SET_STATE, payload: { map: { ...map, isActive: true } } })
          }
        />
        {/* {isDialogShown && ( */}
        <IconBox
          className={styles.closeDialog}
          aria-label="Close map dialog"
          onClick={() => searchDispatch({ type: SEARCH_ACTIONS.TOGGLE_MAP_DIALOG, payload: { bool: false } })}
        >
          <Icons.Close />
        </IconBox>
        {/* )} */}
      </div>
    ),
    [redirect, map, searchInput]
  );
  // const suggestions = useMemo(
  const suggestionsCompo = useMemo(
    () =>
      (data?.getAllBeachBars || []).length < 1 ? null : (
        <motion.div
          className={styles.suggestions + " w100 cursor--pointer flex-column-flex-end-center"}
          initial="shown"
          animate={suggestionsControls}
          variants={suggestionsBoxVariants}
          custom={suggestionsBox.height}
          ref={suggestionsBoxRef}
        >
          <Suggestions dispatch={dispatch} beachBars={(filteredArr || shownBeachBars).slice(0, 7)} />
          <Search.Filters
            allBeachBars={shownBeachBars}
            mobileView
            onFilter={() =>
              searchDispatch({
                type: SEARCH_ACTIONS.HANDLE_MAP_FILTER,
                payload: { filterPublicIds, shownBeachBars, viewport },
              })
            }
          />
        </motion.div>
      ),
    [map, filteredArr, shownBeachBars, suggestionsBox, suggestionsBoxRef, suggestionsControls, suggestionsBoxVariants]
  );

  const handleMarkerClick = (id: string) => {
    const newSelectedBeachBar = data?.getAllBeachBars.find(({ id: barId }) => barId === id);
    if (!newSelectedBeachBar) return;
    dispatch({ type: MAP_ACTIONS.HANDLE_MARKER_CLICK, payload: { bool: true } });
    dispatch({ type: MAP_ACTIONS.SET_SELECTED_BEACH_BAR, payload: newSelectedBeachBar });
  };

  const getNearBeachBar = () => {
    return data?.getAllBeachBars.find(({ location }) => {
      if (!ipAddr?.lat || !ipAddr?.lon) return false;
      return Math.floor(calcDist({ latitude: ipAddr.lat, longitude: ipAddr.lon }, location)) <= 45;
    });
  };

  const handleSort = throttle(
    () => {
      if (sortId) searchDispatch({ type: SEARCH_ACTIONS.HANDLE_MAP_SORT, payload: { shownBeachBars, viewport } });
    },
    5000,
    { leading: true }
  );

  const handleVisibleElems = throttle(
    () => {
      if (!markersRef || isEmpty(markersRef.current) || !data) return;
      // https://stackoverflow.com/a/55616626/13142787
      const arr = data.getAllBeachBars.filter(({ id }) => {
        try {
          return isElemVisible({
            ref: markersRef.current[id],
            windowWidth: mapDialogWidth,
            includeElemWidth: false,
            parent: { closest: ".dialog", useClosestOffsetLeft: true },
          });
        } catch {
          return false;
        }
      });
      dispatch({ type: MAP_ACTIONS.SET_SHOWN_BEACH_BARS, payload: { arr } });
    },
    5000,
    { leading: true }
  );

  const fetchCoordinates = async () => {
    const newCoordinates = await fetchSearchValueCoords(searchInput);
    if (newCoordinates)
      dispatch({
        // type: MAP_ACTIONS.HANDLE_VIEWPORT_CHANGE,
        // payload: { newViewport: { ...viewport, ...newCoordinates }, suggestionsControls },
        type: MAP_ACTIONS.SET_VIEWPORT,
        payload: {
          newViewport: {
            ...newCoordinates,
            transitionDuration: "auto",
            transitionInterpolator: new FlyToInterpolator(),
          },
        },
      });
  };

  useEffect(() => {
    if (!ipAddr) return;
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
    // Do not include `viewport` itself, to avoid re-renders
  }, [ipAddr]);

  useEffect(() => {
    if ((isActive || isDialogShown) && querySearchValue) {
      handleSearchBarChange(querySearchValue);
      fetchCoordinates();
    }
    if (!querySearchValue) setSearchInput(undefined);
  }, [querySearchValue]);

  useEffect(() => {
    const current = suggestionsBoxRef.current;
    if (suggestionsBoxRef && current && (!suggestionsBox.height || !suggestionsBox.top)) {
      const height = current.offsetHeight;
      const top = current.getBoundingClientRect().top;
      dispatch({ type: MAP_ACTIONS.SET_SUGGESTIONS_BOX, payload: { height, top } });
    }
  }, [suggestionsBoxRef.current]);

  useEffect(() => handleVisibleElems(), [viewport]);

  useEffect(() => handleSort(), [sortId, viewport]);

  // TODO: Change mapDialog width to responsive with viewport width and height, so that is not static to 700px
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
        maxZoom={MAP_MAX_ZOOM}
        ref={mapRef}
        className={classNames}
        mapboxApiAccessToken={String(process.env.NEXT_PUBLIC_MAPBOX_TOKEN)}
        onTouchStart={e => dispatch({ type: MAP_ACTIONS.HANDLE_TOUCH_START, payload: { touchY: e.point[1] } })}
        onViewportChange={(newViewport: ViewportProps) => {
          dispatch({ type: MAP_ACTIONS.HANDLE_VIEWPORT_CHANGE, payload: { newViewport, suggestionsControls } });
        }}
      >
        <NavigationControl className={styles.navigationControl + " zi--md flex-row-flex-start-center"} />
        {error ? (
          <div className={styles.error + " shadow-lg flex-row-center-center"}>
            <span className="header-5 d--block">Error</span>
          </div>
        ) : (
          <>
            {clustersAndMarkers}
            {suggestionsCompo}
            <BottomSheet
              isOpen={isBottomSheetShown}
              allowedPositions={{ middle: true, expanded: false, hidden: false, "input-focused": true }}
              onDismiss={() => dispatch({ type: MAP_ACTIONS.HANDLE_MARKER_CLICK, payload: { bool: false } })}
            >
              {selectedBeachBar && <SelectedDetails {...selectedBeachBar} />}
            </BottomSheet>
          </>
        )}
      </ReactMapGL>
    </div>
  );
});

export default Map;
