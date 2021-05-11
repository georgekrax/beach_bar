<<<<<<< HEAD
import Icons from "@/components/Icons";
import Layout from "@/components/Layout";
import { IconBox } from "@/components/Next/IconBox";
import { MapPage, MapReducerInitialStateType, MAP_ACTIONS, reducer } from "@/components/pages";
import Search from "@/components/Search";
import { SEARCH_ACTIONS } from "@/components/Search/reducer";
import { Country, GetAllBeachBarsQuery, useGetAllBeachBarsQuery } from "@/graphql/generated";
import { userIpAddr } from "@/lib/apollo/cache";
import { useSearchContext } from "@/utils/contexts";
import { useConfig } from "@/utils/hooks";
import { calcDist } from "@/utils/search";
import { BottomSheet, isInViewport } from "@hashtag-design-system/components";
import { motion, useAnimation, Variants } from "framer-motion";
import { isEmpty } from "lodash";
import debounce from "lodash/debounce";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useReducer, useRef, useState } from "react";
import ReactMapGL, { NavigationControl, ViewportProps } from "react-map-gl";

const initialState: MapReducerInitialStateType = {
  isSuggestionsBoxTouch: false,
  suggestionsBox: { height: 0, top: 0 },
  timer: null,
  viewport: { latitude: 0, longitude: 0, zoom: 10 },
  isBottomSheetShown: false,
  selectedBeachBar: { name: "", thumbnailUrl: "", description: "" },
};

const suggestionsBoxVariants: Variants = {
  shown: {
    y: 0,
    opacity: 1,
  },
  hidden: (height: number) => ({
    y: height,
    opacity: 0,
  }),
};

const Map: React.FC = () => {
  const [shownBeachBars, setShownBeachBars] = useState<GetAllBeachBarsQuery["getAllBeachBars"]>([]);
  const router = useRouter();
  const { data, loading, error } = useGetAllBeachBarsQuery();

  const {
    variables: { ipAddr },
  } = useConfig();
  const {
    inputValue,
    form: { searchValue },
    map,
    dispatch: searchDispatch,
  } = useSearchContext();

  const redirectUri = useMemo(() => router.query.redirect as string, [router]);

  const getNearBeachBar = () => {
    const nearBeachBar = data?.getAllBeachBars.find(({ location }) => {
      if (!ipAddr?.lat && !ipAddr?.lon) return false;
      const dis = Math.floor(calcDist({ latitude: ipAddr.lat, longitude: ipAddr.lon }, location));
      return dis <= 45;
    });

    return nearBeachBar;
  };

  const [{ viewport, suggestionsBox, isBottomSheetShown, selectedBeachBar }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const suggestionsBoxRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Record<string, HTMLButtonElement>>({});
  const suggestionsControls = useAnimation();

  const markers = useMemo(
    () =>
      (map?.sortedResults ?? data?.getAllBeachBars ?? []).map(({ id, location }) => (
        <MapPage.Marker
          key={id}
          zoom={viewport.zoom || initialState.viewport.zoom || 10}
          location={location}
          onClick={() => handleMarkerClick(id)}
          ref={el => (markersRef.current[id] = el!)}
        />
      )),
    [map, data]
  );

  const handleMarkerClick = (id: string) => {
    const newSelectedBeachBar = data?.getAllBeachBars.find(({ id: barId }) => barId === id);
    if (!newSelectedBeachBar) return;
    dispatch({ type: MAP_ACTIONS.HANDLE_MARKER_CLICK });
    dispatch({ type: MAP_ACTIONS.SET_SELECTED_BEACH_BAR, payload: { ...newSelectedBeachBar } });
  };

  const fetchCoordinates = async () => {
    let newCoordinates: Required<Pick<typeof viewport, "longitude" | "latitude" | "zoom">> | undefined = undefined;
    if (inputValue?.beachBar) {
      const { longitude, latitude } = inputValue.beachBar.location;
      newCoordinates = { zoom: 12, longitude, latitude };
    } else {
      const country: Pick<Country, "alpha2Code"> | undefined = inputValue
        ? inputValue.country
          ? inputValue.country
          : inputValue.city
          ? inputValue.city.country
          : inputValue.region
          ? inputValue.region.country
          : undefined
        : undefined;
      const countryCode = country ? country.alpha2Code.toLowerCase() : undefined;
      const formattedCountryCode = countryCode || userIpAddr().countryCode.toLowerCase();
      const res = await fetch(
        process.env.NEXT_PUBLIC_MAPBOX_API_URL +
          `/mapbox.places/${searchValue}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&autocomplete=false${
            formattedCountryCode ? `&country=${formattedCountryCode}` : ""
          }&types=country%2Cregion%2Cplace%2Clocality%2Cneighborhood`
      );
      const data = await res.json();
      const locationCoord = data.features[0]?.center;
      newCoordinates = { zoom: 12, longitude: locationCoord[0], latitude: locationCoord[1] };
      if (inputValue?.region) newCoordinates = { ...newCoordinates, zoom: 14 };
      else if (inputValue?.city) newCoordinates = { ...newCoordinates, zoom: 11 };
      else if (inputValue?.country) newCoordinates = { ...newCoordinates, zoom: 5.5 };
    }
    if (newCoordinates) {
      dispatch({
        type: MAP_ACTIONS.HANDLE_VIEWPORT_CHANGE,
        payload: { newViewport: { ...viewport, ...newCoordinates }, suggestionsControls },
      });
      searchDispatch({
        type: SEARCH_ACTIONS.SET_STATE,
        payload: { coordinates: newCoordinates },
      });
    }
  };

  const handleSort = debounce(() => {
    if (map && map.sort)
      searchDispatch({
        type: SEARCH_ACTIONS.HANDLE_SORT,
        payload: {
          sortId: map?.sort.id,
          beachBars: shownBeachBars,
          coords: viewport,
        },
      });
  }, 1000);

  // useEffect(() => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(pos => console.log(pos), undefined, { enableHighAccuracy: true });
  //   }
  // }, []);

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
    if (map && searchValue) fetchCoordinates();
  }, []);

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
      const arr = (map.sortedResults || data.getAllBeachBars).filter(({ id }) => {
        try {
          const bool = isInViewport(markersRef.current[id]);
          return bool;
        } catch {
          return true;
        }
      });
      setShownBeachBars(arr);
    }
  }, [viewport, markersRef]);

  useEffect(() => handleSort(), [map.sort, viewport]);

  if (loading) return <h1>Loading...</h1>;

  if (error || !data) return <h2>Error</h2>;

  return (
    <Layout header={false} footer={false} container={{ className: "map__wrapper" }}>
      <motion.div className="h100" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit="initial">
        <ReactMapGL
          {...viewport}
          attributionControl={true}
          onTouchStart={e => dispatch({ type: MAP_ACTIONS.HANDLE_TOUCH_START, payload: { touchY: e.point[1] } })}
          width="100vw"
          height="100%"
          onViewportChange={(newViewport: ViewportProps) => {
            dispatch({
              type: MAP_ACTIONS.HANDLE_VIEWPORT_CHANGE,
              payload: { newViewport, suggestionsControls },
            });
          }}
          mapStyle="mapbox://styles/mapbox/outdoors-v11"
          mapboxApiAccessToken={String(process.env.NEXT_PUBLIC_MAPBOX_TOKEN)}
        >
          <div className="map__searchbar flex-row-center-center">
            {redirectUri && (
              <Link href={redirectUri}>
                <IconBox aria-label="Return to search results">
                  <Icons.Arrow.Left />
                </IconBox>
              </Link>
            )}
            <Search.Box
              // className="map__searchbar"
              redirectUri="/map"
              input={map ? { defaultValue: searchValue } : undefined}
              onClick={() =>
                searchDispatch({ type: SEARCH_ACTIONS.SET_STATE, payload: { map: { ...map, isActive: true } } })
              }
            />
          </div>
          <NavigationControl className="map__navigation-control" />
          {markers}
          <motion.div
            className="map__suggestions w100 flex-column-flex-end-center"
            initial="shown"
            animate={suggestionsControls}
            variants={suggestionsBoxVariants}
            custom={suggestionsBox.height}
            ref={suggestionsBoxRef}
          >
            <MapPage.Suggestions
              dispatch={dispatch}
              beachBars={(map.sortedResults || shownBeachBars).slice(0, 7).map(({ thumbnailUrl, ...rest }, i) => ({
                idx: i,
                beachBar: { thumbnailUrl, ...rest },
                imgProps: { src: thumbnailUrl },
              }))}
            />
            <Search.Filters allBeachBars={shownBeachBars} />
          </motion.div>
          <BottomSheet
            isShown={isBottomSheetShown}
            allowedPositions={{ middle: true, expanded: false, hidden: false, "input-focused": true }}
            onDismiss={() => dispatch({ type: MAP_ACTIONS.HANDLE_MARKER_CLICK })}
          >
            <MapPage.BeachBarDetails {...selectedBeachBar} />
          </BottomSheet>
        </ReactMapGL>
      </motion.div>
    </Layout>
  );
};

export default Map;
=======
import Icons from "@/components/Icons";
import Layout from "@/components/Layout";
import { IconBox } from "@/components/Next/IconBox";
import { MapPage, MapReducerInitialStateType, MAP_ACTIONS, reducer } from "@/components/pages";
import Search from "@/components/Search";
import { SEARCH_ACTIONS } from "@/components/Search/reducer";
import { Country, GetAllBeachBarsQuery, useGetAllBeachBarsQuery } from "@/graphql/generated";
import { userIpAddr } from "@/lib/apollo/cache";
import { useSearchContext } from "@/utils/contexts";
import { useConfig } from "@/utils/hooks";
import { calcDist } from "@/utils/search";
import { BottomSheet, isInViewport } from "@hashtag-design-system/components";
import { motion, useAnimation, Variants } from "framer-motion";
import { isEmpty } from "lodash";
import debounce from "lodash/debounce";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useReducer, useRef, useState } from "react";
import ReactMapGL, { NavigationControl, ViewportProps } from "react-map-gl";

const initialState: MapReducerInitialStateType = {
  isSuggestionsBoxTouch: false,
  suggestionsBox: { height: 0, top: 0 },
  timer: null,
  viewport: { latitude: 0, longitude: 0, zoom: 10 },
  isBottomSheetShown: false,
  selectedBeachBar: { name: "", thumbnailUrl: "", description: "" },
};

const suggestionsBoxVariants: Variants = {
  shown: {
    y: 0,
    opacity: 1,
  },
  hidden: (height: number) => ({
    y: height,
    opacity: 0,
  }),
};

const Map: React.FC = () => {
  const [shownBeachBars, setShownBeachBars] = useState<GetAllBeachBarsQuery["getAllBeachBars"]>([]);
  const router = useRouter();
  const { data, loading, error } = useGetAllBeachBarsQuery();

  const {
    variables: { ipAddr },
  } = useConfig();
  const {
    inputValue,
    form: { searchValue },
    map,
    dispatch: searchDispatch,
  } = useSearchContext();

  const redirectUri = useMemo(() => router.query.redirect as string, [router]);

  const getNearBeachBar = () => {
    const nearBeachBar = data?.getAllBeachBars.find(({ location }) => {
      if (!ipAddr?.lat && !ipAddr?.lon) return false;
      const dis = Math.floor(calcDist({ latitude: ipAddr.lat, longitude: ipAddr.lon }, location));
      return dis <= 45;
    });

    return nearBeachBar;
  };

  const [{ viewport, suggestionsBox, isBottomSheetShown, selectedBeachBar }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const suggestionsBoxRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Record<string, HTMLButtonElement>>({});
  const suggestionsControls = useAnimation();

  const markers = useMemo(
    () =>
      (map?.sortedResults ?? data?.getAllBeachBars ?? []).map(({ id, location }) => (
        <MapPage.Marker
          key={id}
          zoom={viewport.zoom || initialState.viewport.zoom || 10}
          location={location}
          onClick={() => handleMarkerClick(id)}
          ref={el => (markersRef.current[id] = el!)}
        />
      )),
    [map, data]
  );

  const handleMarkerClick = (id: string) => {
    const newSelectedBeachBar = data?.getAllBeachBars.find(({ id: barId }) => barId === id);
    if (!newSelectedBeachBar) return;
    dispatch({ type: MAP_ACTIONS.HANDLE_MARKER_CLICK });
    dispatch({ type: MAP_ACTIONS.SET_SELECTED_BEACH_BAR, payload: { ...newSelectedBeachBar } });
  };

  const fetchCoordinates = async () => {
    let newCoordinates: Required<Pick<typeof viewport, "longitude" | "latitude" | "zoom">> | undefined = undefined;
    if (inputValue?.beachBar) {
      const { longitude, latitude } = inputValue.beachBar.location;
      newCoordinates = { zoom: 12, longitude, latitude };
    } else {
      const country: Pick<Country, "alpha2Code"> | undefined = inputValue
        ? inputValue.country
          ? inputValue.country
          : inputValue.city
          ? inputValue.city.country
          : inputValue.region
          ? inputValue.region.country
          : undefined
        : undefined;
      const countryCode = country ? country.alpha2Code.toLowerCase() : undefined;
      const formattedCountryCode = countryCode || userIpAddr().countryCode.toLowerCase();
      const res = await fetch(
        process.env.NEXT_PUBLIC_MAPBOX_API_URL +
          `/mapbox.places/${searchValue}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&autocomplete=false${
            formattedCountryCode ? `&country=${formattedCountryCode}` : ""
          }&types=country%2Cregion%2Cplace%2Clocality%2Cneighborhood`
      );
      const data = await res.json();
      const locationCoord = data.features[0]?.center;
      newCoordinates = { zoom: 12, longitude: locationCoord[0], latitude: locationCoord[1] };
      if (inputValue?.region) newCoordinates = { ...newCoordinates, zoom: 14 };
      else if (inputValue?.city) newCoordinates = { ...newCoordinates, zoom: 11 };
      else if (inputValue?.country) newCoordinates = { ...newCoordinates, zoom: 5.5 };
    }
    if (newCoordinates) {
      dispatch({
        type: MAP_ACTIONS.HANDLE_VIEWPORT_CHANGE,
        payload: { newViewport: { ...viewport, ...newCoordinates }, suggestionsControls },
      });
      searchDispatch({
        type: SEARCH_ACTIONS.SET_STATE,
        payload: { coordinates: newCoordinates },
      });
    }
  };

  const handleSort = debounce(() => {
    if (map && map.sort)
      searchDispatch({
        type: SEARCH_ACTIONS.HANDLE_SORT,
        payload: {
          sortId: map?.sort.id,
          beachBars: shownBeachBars,
          coords: viewport,
        },
      });
  }, 1000);

  // useEffect(() => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(pos => console.log(pos), undefined, { enableHighAccuracy: true });
  //   }
  // }, []);

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
    if (map && searchValue) fetchCoordinates();
  }, []);

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
      const arr = (map.sortedResults || data.getAllBeachBars).filter(({ id }) => {
        try {
          const bool = isInViewport(markersRef.current[id]);
          return bool;
        } catch {
          return true;
        }
      });
      setShownBeachBars(arr);
    }
  }, [viewport, markersRef]);

  useEffect(() => handleSort(), [map.sort, viewport]);

  if (loading) return <h1>Loading...</h1>;

  if (error || !data) return <h2>Error</h2>;

  return (
    <Layout header={false} footer={false} container={{ className: "map__wrapper" }}>
      <motion.div className="h100" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit="initial">
        <ReactMapGL
          {...viewport}
          attributionControl={true}
          onTouchStart={e => dispatch({ type: MAP_ACTIONS.HANDLE_TOUCH_START, payload: { touchY: e.point[1] } })}
          width="100vw"
          height="100%"
          onViewportChange={(newViewport: ViewportProps) => {
            dispatch({
              type: MAP_ACTIONS.HANDLE_VIEWPORT_CHANGE,
              payload: { newViewport, suggestionsControls },
            });
          }}
          mapStyle="mapbox://styles/mapbox/outdoors-v11"
          mapboxApiAccessToken={String(process.env.NEXT_PUBLIC_MAPBOX_TOKEN)}
        >
          <div className="map__searchbar flex-row-center-center">
            {redirectUri && (
              <Link href={redirectUri}>
                <IconBox aria-label="Return to search results">
                  <Icons.Arrow.Left />
                </IconBox>
              </Link>
            )}
            <Search.Box
              // className="map__searchbar"
              redirectUri="/map"
              input={map ? { defaultValue: searchValue } : undefined}
              onClick={() =>
                searchDispatch({ type: SEARCH_ACTIONS.SET_STATE, payload: { map: { ...map, isActive: true } } })
              }
            />
          </div>
          <NavigationControl className="map__navigation-control" />
          {markers}
          <motion.div
            className="map__suggestions w100 flex-column-flex-end-center"
            initial="shown"
            animate={suggestionsControls}
            variants={suggestionsBoxVariants}
            custom={suggestionsBox.height}
            ref={suggestionsBoxRef}
          >
            <MapPage.Suggestions
              dispatch={dispatch}
              beachBars={(map.sortedResults || shownBeachBars).slice(0, 7).map(({ thumbnailUrl, ...rest }, i) => ({
                idx: i,
                beachBar: { thumbnailUrl, ...rest },
                imgProps: { src: thumbnailUrl },
              }))}
            />
            <Search.Filters allBeachBars={shownBeachBars} />
          </motion.div>
          <BottomSheet
            isShown={isBottomSheetShown}
            allowedPositions={{ middle: true, expanded: false, hidden: false, "input-focused": true }}
            onDismiss={() => dispatch({ type: MAP_ACTIONS.HANDLE_MARKER_CLICK })}
          >
            <MapPage.BeachBarDetails {...selectedBeachBar} />
          </BottomSheet>
        </ReactMapGL>
      </motion.div>
    </Layout>
  );
};

export default Map;
>>>>>>> 3c094b84c4b6a5e6c8400166ac60b7393b7ddcff
