import Icons from "@/components/Icons";
import { DATA } from "@/config/data";
import { GetAllBeachBarsQuery } from "@/graphql/generated";
import { Button } from "@hashtag-design-system/components";
import React, { memo, useMemo } from "react";
import { Marker as MapboxMarker, ViewportProps } from "react-map-gl";
import styles from "./Marker.module.scss";

type FProps = Pick<GetAllBeachBarsQuery["getAllBeachBars"][number], "location"> &
  Pick<React.ComponentPropsWithoutRef<"button">, "onClick"> &
  Required<Pick<ViewportProps, "zoom">>;

export const Marker = memo(
  React.forwardRef<HTMLButtonElement, FProps>(({ zoom, location: { latitude, longitude }, onClick }, ref) => {
    const size = useMemo(() => {
      let newSize = Math.round((DATA.ICON_SIZE / 10) * (zoom || 0));
      return newSize <= 16 ? 16 : newSize;
    }, [zoom]);

    return (
      <MapboxMarker latitude={latitude} longitude={longitude} offsetLeft={-12} offsetTop={-12}>
        <Button className={styles.btn} ref={ref} onClick={onClick}>
          <Icons.MapMarker.Dot.Filled width={size} height={size} />
        </Button>
      </MapboxMarker>
    );
  })
);

Marker.displayName = "MapMarker";
