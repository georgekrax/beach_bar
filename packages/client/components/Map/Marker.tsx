import Icons from "@/components/Icons";
import { GetAllBeachBarsQuery } from "@/graphql/generated";
import { Button } from "@hashtag-design-system/components";
import React, { memo, useMemo } from "react";
import { Marker as MapboxMarker, ViewportProps } from "react-map-gl";
import styles from "./Marker.module.scss";

const ICON_SIZE = 20;

type Props = {
  isSelected?: boolean;
  cluster?: {
    pointCount: number;
    pointsLength: number;
  };
};

type FProps = Props &
  Pick<GetAllBeachBarsQuery["getAllBeachBars"][number]["location"], "latitude" | "longitude"> &
  Pick<React.ComponentPropsWithoutRef<"button">, "onClick"> &
  Required<Pick<ViewportProps, "zoom">>;

export const Marker = memo(
  React.forwardRef<HTMLButtonElement, FProps>(({ isSelected, zoom, latitude, longitude, onClick, cluster }, ref) => {
    const { zoomScale, active, size } = useMemo(() => {
      const scale = +((zoom / 20).toFixed(2)) * (cluster ? 3 : 1);
      return {
        zoomScale: scale,
        active: scale * 1.25,
        size: (cluster ? 10 + (cluster.pointCount / cluster.pointsLength) * 20 : ICON_SIZE + 14) * scale,
      };
    }, [zoom]);

    return (
      <MapboxMarker latitude={latitude} longitude={longitude}>
        <Button
          className={
            styles.btn +
            (isSelected ? " " + styles.active : "") +
            (cluster ? " semibold text--primary " : "") +
            " iborder-radius--lg flex-row-center-center"
          }
          ref={ref}
          onClick={onClick}
          whileHover={{ scale: active }}
          style={
            !cluster
              ? {
                  translateX: -size / 2,
                  translateY: -size,
                }
              : {
                  translateX: -size / 2,
                  translateY: -size,
                  width: size,
                  height: size,
                  fontSize: (zoomScale * 10) / 16 + "em",
                }
          }
          animate={!cluster && { width: size, height: size, padding: 4 * zoomScale + "px" }}
          // animate={{ scale: isSelected ? active : zoomScale }}
          // transition={{ duration: 0.1 }}
        >
          {cluster ? cluster.pointCount : <Icons.MapMarker.Dot.Filled />}
        </Button>
      </MapboxMarker>
    );
  })
);
