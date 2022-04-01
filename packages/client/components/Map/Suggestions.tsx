import Carousel from "@/components/Carousel2";
import { GetAllBeachBarsQuery } from "@/graphql/generated";
import { useConfig } from "@/utils/hooks";
import { useMemo, useRef } from "react";
import { FlyToInterpolator } from "react-map-gl";
import { MAP_ACTIONS, MAP_ACTIONTYPE } from "./reducer";
import styles from "./Suggestions.module.scss";

const PADDING = "1.5em";

type Props = {
  beachBars: GetAllBeachBarsQuery["getAllBeachBars"];
  dispatch: React.Dispatch<MAP_ACTIONTYPE>;
};

export const Suggestions: React.FC<Props> = ({ beachBars, dispatch }) => {
  const ref = useRef<HTMLDivElement>(null);
  const parentOffset = useMemo(() => {
    if (ref.current) {
      return (ref.current.closest(".dialog") as HTMLElement).offsetLeft
    } else return 0;
  }, [ref.current]);

  const {
    variables: { mapDialogWidth },
  } = useConfig();

  const handleClick = (location: Props["beachBars"][number]["location"]) => {
    dispatch({
      type: MAP_ACTIONS.SET_VIEWPORT,
      payload: {
        newViewport: {
          ...location,
          zoom: 17,
          transitionDuration: "auto",
          transitionInterpolator: new FlyToInterpolator(),
        },
      },
    });
  };

  return (
    <div className="w100" ref={ref} style={{ padding: `0 ${PADDING}` }}>
      <Carousel.Context windowWidth={mapDialogWidth} parentOffset={parentOffset}>
        <Carousel.ControlBtns className={styles.controlBtns} />
        <Carousel className={styles.carousel} maxWidth={`calc(${mapDialogWidth}px - ${PADDING})`}>
          {beachBars.map(({ id, location, ...rest }, i) => (
            <Carousel.Item
              key={"carousel_item_" + id}
              idx={i}
              overflowPadding={i === beachBars.length - 1 ? { style: { paddingRight: PADDING } } : undefined}
            >
              <Carousel.BeachBar
                className={styles.item}
                showLocation={false}
                navigateToBar={false}
                onClick={() => handleClick(location)}
                {...location}
                {...rest}
              />
            </Carousel.Item>
          ))}
        </Carousel>
      </Carousel.Context>
    </div>
  );
};

Suggestions.displayName = "MapSuggestions";
