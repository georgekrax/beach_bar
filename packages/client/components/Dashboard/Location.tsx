import { Marker } from "@/components/Map/Marker";
import { DATA } from "@/config/data";
import {
  AddBeachBarLocationMutationVariables,
  useAddBeachBarLocationMutation,
  useCitiesAndRegionsQuery,
} from "@/graphql/generated";
import { LocationFormData } from "@/typings/beachBar";
import { useConfig, useHookForm } from "@/utils/hooks";
import { notify } from "@/utils/notify";
import { Autosuggest, Input, InputFProps, Select } from "@hashtag-design-system/components";
import { COUNTRIES_ARR } from "@the_hashtag/common";
import { debounce } from "lodash";
import { memo, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ReactMapGL, { MapEvent, NavigationControl, ViewportProps } from "react-map-gl";
import styles from "./Location.module.scss";

const COORDS_INPUT_PROPS: InputFProps = {
  maxLength: 12,
  characterLimit: true,
  overrideOnChange: true,
};

type Props = {
  skip?: boolean;
  defaultValues?: Partial<LocationFormData>;
  setIsNextDisabled?: React.Dispatch<React.SetStateAction<boolean>>;
  handleChange?: (
    fieldName: keyof LocationFormData,
    newVal: LocationFormData[typeof fieldName],
    checkCurVal?: boolean
  ) => void;
} & Pick<Partial<AddBeachBarLocationMutationVariables>, "beachBarId">;

export const Location: React.FC<Props> = memo(
  ({ beachBarId = "3", skip = false, defaultValues, setIsNextDisabled, handleChange: handlePropsChange }) => {
    const [viewport, setViewport] = useState({ latitude: 0, longitude: 0, zoom: 14 });
    const [clickViewport, setClickViewport] = useState<
      Required<Pick<ViewportProps, "latitude" | "longitude">> | undefined
    >();

    const {
      variables: { ipAddr },
    } = useConfig();

    const { data } = useCitiesAndRegionsQuery({ skip });
    const [addLocation] = useAddBeachBarLocationMutation();

    const partialFieldsArr: (keyof LocationFormData)[] = ["address", "country", "city"];
    const { formState, watch, handleSubmit, ...form } = useForm<LocationFormData>({ mode: "onChange" });
    // // @ts-expect-error
    const { handleChange: handleFormChange } = useHookForm<LocationFormData>({
      ...form,
      data: defaultValues,
      registeredFields: ["zipCode", "region", "latitude", "longitude"].concat(
        partialFieldsArr
      ) as typeof partialFieldsArr,
      registerOptions: fieldName => (partialFieldsArr.includes(fieldName) ? { required: true, minLength: 1 } : {}),
    });

    type Params = {
      fieldName: Extract<
        Parameters<typeof handleFormChange>["0"],
        "address" | "zipCode" | "country" | "city" | "region"
      >;
      newVal: Parameters<typeof handleFormChange>["1"];
    };

    const handleChange = async ({ fieldName, newVal }: Params) => {
      handleFormChange(fieldName, newVal);
      if (handlePropsChange) handlePropsChange(fieldName, newVal);
      await handleAutosuggest();
    };

    const handleMapClick = (lngLat: MapEvent["lngLat"]) => {
      const longitude = lngLat[0];
      const latitude = lngLat[1];
      setClickViewport({ longitude, latitude });
      handleFormChange("latitude", latitude.toFixed(6));
      handleFormChange("longitude", longitude.toFixed(6));
    };

    const onSubmit = async ({ countryId, country, latitude, longitude, ...formData }: LocationFormData) => {
      if (!beachBarId) return notify("error", "");
      const { data: addData, errors } = await addLocation({
        variables: {
          beachBarId,
          countryId: countryId || country,
          latitude: String(latitude),
          longitude: String(longitude),
          ...formData,
        },
      });
      if (!addData && errors) errors.forEach(({ message }) => notify("error", message));
    };

    const handleAutosuggest = debounce(
      handleSubmit(async ({ address, zipCode, country, ...formData }) => {
        const countryItem = COUNTRIES_ARR.find(
          ({ name }) => name.toLowerCase().replace(" ", "") === country.toLowerCase().replace(" ", "")
        );
        if (countryItem) handleFormChange("countryId", countryItem.id);
        const city = formData.city.split(", ")[0];
        const region = formData.region?.split(", ")[0];
        const res = await fetch(
          process.env.NEXT_PUBLIC_MAPBOX_API_URL +
            `/mapbox.places/${address + " " + (zipCode || "") + " " + (region || "") + " " + city}.json?access_token=${
              process.env.NEXT_PUBLIC_MAPBOX_TOKEN
            }&autocomplete=true&${
              countryItem ? "country=" + countryItem.alpha2Code : ""
            }&types=district%2Caddress%2Cplace%2Cpostcode%2Cpoi&limit=3&language=el%2Cen`
        );
        const data = await res.json();
        if (data.features && data.features.length > 0) {
          const { center } = data.features[0];
          const longitude = center[0];
          const latitude = center[1];
          setViewport(prev => ({ ...prev, zoom: 16, longitude, latitude }));
          setClickViewport(prev => ({ ...prev, longitude, latitude }));
          handleFormChange("latitude", latitude);
          handleFormChange("longitude", longitude);
        }
      }),
      2500
    );

    useEffect(() => {
      if (setIsNextDisabled) setIsNextDisabled(!formState.isValid);
    }, [formState]);

    useEffect(() => {
      if (!ipAddr) return;
      const { lat, lon } = ipAddr;
      if (lat && lon) {
        setViewport(prev => ({ ...prev, latitude: lat, longitude: lon }));
        setClickViewport(prev => ({ ...prev, latitude: lat, longitude: lon }));
      }
    }, [ipAddr]);

    return (
      <form
        className={styles.container + " w100 flex-column-space-between-flex-start"}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="w--inherit flex-column-flex-start-flex-start">
          <div className={styles.inputGroup + " w--inherit flex-row-space-between-flex-end"}>
            <Input
              placeholder="Address"
              overrideOnChange
              value={watch("address")}
              onChange={async e => await handleChange({ fieldName: "address", newVal: e.target.value })}
            />
            <Input
              optional
              placeholder="Zip code"
              overrideOnChange
              value={watch("zipCode")}
              onChange={async e => await handleChange({ fieldName: "zipCode", newVal: e.target.value })}
            />
          </div>
          <Autosuggest
            value={watch("country")}
            // overrideOnChange
            placeholder="Country"
            onChange={async newVal => await handleChange({ fieldName: "country", newVal })}
          >
            {/* TODO: Change afterwards */}
            <Select.Countries withFlags={false} />
          </Autosuggest>
          <Autosuggest
            placeholder="City"
            value={watch("city")}
            onChange={async newVal => await handleChange({ fieldName: "city", newVal })}
          >
            {data?.citiesAndRegions.cities.map(({ id, name, country }) => (
              <Select.Item key={"city_" + id} id={id} content={name + (country ? ", " + country?.name : "")} />
            ))}
          </Autosuggest>
          <Autosuggest
            optional
            placeholder="Region"
            value={watch("region")}
            onChange={async newVal => await handleChange({ fieldName: "region", newVal })}
          >
            {data?.citiesAndRegions.regions.map(({ id, name, city, country }) => (
              <Select.Item
                key={"city_" + id}
                id={id}
                content={name + (city ? ", " + city.name : "") + (country ? ", " + country.name : "")}
              />
            ))}
          </Autosuggest>
          <div className={styles.inputGroup + " w--inherit flex-row-space-between-flex-end"}>
            <Input
              {...COORDS_INPUT_PROPS}
              placeholder="Latitude"
              value={watch("latitude")}
              onChange={e => handleFormChange("latitude", e.target.value)}
            />
            <Input
              {...COORDS_INPUT_PROPS}
              placeholder="Longitude"
              value={watch("longitude")}
              onChange={e => handleFormChange("longitude", e.target.value)}
            />
          </div>
        </div>
        <ReactMapGL
          {...viewport}
          width="100%"
          height={320}
          attributionControl
          className={styles.map}
          maxZoom={DATA.MAP_MAX_ZOOM}
          mapStyle="mapbox://styles/mapbox/outdoors-v11"
          mapboxApiAccessToken={String(process.env.NEXT_PUBLIC_MAPBOX_TOKEN)}
          onClick={({ lngLat }) => handleMapClick(lngLat)}
          onViewportChange={setViewport}
        >
          <NavigationControl className={styles.navigationCtrl + " zi--md flex-row-flex-start-center"} />
          {clickViewport && (
            <Marker zoom={viewport.zoom} latitude={clickViewport.latitude} longitude={clickViewport.longitude} />
          )}
        </ReactMapGL>
      </form>
    );
  }
);
