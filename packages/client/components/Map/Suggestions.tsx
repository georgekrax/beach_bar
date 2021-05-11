<<<<<<< HEAD
import Carousel from "@/components/Carousel";
import { GetAllBeachBarsQuery } from "@/graphql/generated";
import { FlyToInterpolator } from "react-map-gl";
import { MAP_ACTIONS, MAP_ACTIONTYPE } from "./reducer";
import styles from "./Suggestions.module.scss";

type Props = {
  beachBars: GetAllBeachBarsQuery["getAllBeachBars"];
  dispatch: React.Dispatch<MAP_ACTIONTYPE>;
};

export const Suggestions: React.FC<Props> = ({ beachBars, dispatch }) => {
  const handleClick = (location: Props["beachBars"][number]["location"]) => {
    dispatch({
      type: MAP_ACTIONS.SET_VIEWPORT,
      payload: {
        newViewport: {
          ...location,
          zoom: 17,
          transitionDuration: 6500,
          transitionInterpolator: new FlyToInterpolator(),
        },
      },
    });
  };

  return beachBars.length < 1 ? null : (
    <div className="w100">
      <Carousel.Context>
        <Carousel.ControlBtns className={styles.controlBtns} />
        <Carousel className={styles.carousel}>
          {beachBars.map(({ id, location, ...rest }, i) => (
            <Carousel.Item key={"carousel_item_" + id} idx={i}>
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
=======
import Carousel from "@/components/Carousel";
import { GetAllBeachBarsQuery } from "@/graphql/generated";
import { FlyToInterpolator } from "react-map-gl";
import { MAP_ACTIONS, MAP_ACTIONTYPE } from "./reducer";
import styles from "./Suggestions.module.scss";

type Props = {
  beachBars: GetAllBeachBarsQuery["getAllBeachBars"];
  dispatch: React.Dispatch<MAP_ACTIONTYPE>;
};

export const Suggestions: React.FC<Props> = ({ beachBars, dispatch }) => {
  const handleClick = (location: Props["beachBars"][number]["location"]) => {
    dispatch({
      type: MAP_ACTIONS.SET_VIEWPORT,
      payload: {
        newViewport: {
          ...location,
          zoom: 17,
          transitionDuration: 6500,
          transitionInterpolator: new FlyToInterpolator(),
        },
      },
    });
  };

  return beachBars.length < 1 ? null : (
    <div className="w100">
      <Carousel.Context>
        <Carousel.ControlBtns className={styles.controlBtns} />
        <Carousel className={styles.carousel}>
          {beachBars.map(({ id, location, ...rest }, i) => (
            <Carousel.Item key={"carousel_item_" + id} idx={i}>
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
>>>>>>> 3c094b84c4b6a5e6c8400166ac60b7393b7ddcff
