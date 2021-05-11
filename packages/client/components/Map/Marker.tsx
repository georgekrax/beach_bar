<<<<<<< HEAD
import Icons from "@/components/Icons";
import { GetAllBeachBarsQuery } from "@/graphql/generated";
import { Button } from "@hashtag-design-system/components";
import React, { memo, useMemo } from "react";
import { Marker as MapboxMarker, ViewportProps } from "react-map-gl";
import styles from "./Marker.module.scss";

const SELECTED_SCALE = 1;

type Props = {
  isSelected?: boolean;
};

type FProps = Props &
  Pick<GetAllBeachBarsQuery["getAllBeachBars"][number], "location"> &
  Pick<React.ComponentPropsWithoutRef<"button">, "onClick"> &
  Required<Pick<ViewportProps, "zoom">>;

export const Marker = memo(
  React.forwardRef<HTMLButtonElement, FProps>(
    ({ isSelected, zoom, location: { latitude, longitude }, onClick }, ref) => {
      const { zoomScale, active } = useMemo(() => {
        const scale = zoom / 18;
        return { zoomScale: scale, active: scale * 1.25 };
      }, [zoom]);

      return (
        <MapboxMarker latitude={latitude} longitude={longitude} offsetLeft={-12} offsetTop={-12}>
          <Button
            className={
              styles.btn + (isSelected ? " " + styles.active : "") + " iborder-radius--lg flex-row-center-center"
            }
            ref={ref}
            onClick={onClick}
            whileHover={{ scale: active }}
            animate={{ scale: isSelected ? active : zoomScale }}
            transition={{ duration: 0.1 }}
          >
            <Icons.MapMarker.Dot.Filled />
          </Button>
        </MapboxMarker>
      );
    }
  )
);

Marker.displayName = "MapMarker";
=======
import Icons from "@/components/Icons";
import { GetAllBeachBarsQuery } from "@/graphql/generated";
import { Button } from "@hashtag-design-system/components";
import React, { memo, useMemo } from "react";
import { Marker as MapboxMarker, ViewportProps } from "react-map-gl";
import styles from "./Marker.module.scss";

const SELECTED_SCALE = 1;

type Props = {
  isSelected?: boolean;
};

type FProps = Props &
  Pick<GetAllBeachBarsQuery["getAllBeachBars"][number], "location"> &
  Pick<React.ComponentPropsWithoutRef<"button">, "onClick"> &
  Required<Pick<ViewportProps, "zoom">>;

export const Marker = memo(
  React.forwardRef<HTMLButtonElement, FProps>(
    ({ isSelected, zoom, location: { latitude, longitude }, onClick }, ref) => {
      const { zoomScale, active } = useMemo(() => {
        const scale = zoom / 18;
        return { zoomScale: scale, active: scale * 1.25 };
      }, [zoom]);

      return (
        <MapboxMarker latitude={latitude} longitude={longitude} offsetLeft={-12} offsetTop={-12}>
          <Button
            className={
              styles.btn + (isSelected ? " " + styles.active : "") + " iborder-radius--lg flex-row-center-center"
            }
            ref={ref}
            onClick={onClick}
            whileHover={{ scale: active }}
            animate={{ scale: isSelected ? active : zoomScale }}
            transition={{ duration: 0.1 }}
          >
            <Icons.MapMarker.Dot.Filled />
          </Button>
        </MapboxMarker>
      );
    }
  )
);

Marker.displayName = "MapMarker";
>>>>>>> 3c094b84c4b6a5e6c8400166ac60b7393b7ddcff
