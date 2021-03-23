import { CarouselItemOptions } from "@/components/Carousel";
import { GetAllBeachBarsQuery } from "@/graphql/generated";
import { memo } from "react";
import { FlyToInterpolator } from "react-map-gl";
import { Item } from "../../Carousel";
import { default as IndexPage } from "../Index/index";
import styles from "./Suggestions.module.scss";
import { MAP_ACTIONS, MAP_ACTIONTYPE } from "./__helpers__";

type Props = {
  beachBars: (CarouselItemOptions & {
    beachBar: GetAllBeachBarsQuery["getAllBeachBars"][number];
  })[];
  dispatch: React.Dispatch<MAP_ACTIONTYPE>;
};

export const Suggestions: React.FC<Props> = memo(({ beachBars, dispatch }) => {
  const handleClick = (location: Props["beachBars"][number]["beachBar"]["location"]) => {
    const { longitude, latitude } = location;
    dispatch({
      type: MAP_ACTIONS.SET_VIEWPORT,
      payload: {
        newViewport: {
          latitude,
          longitude,
          zoom: 17,
          transitionDuration: 6500,
          transitionInterpolator: new FlyToInterpolator(),
        },
      },
    });
  };

  return (
    <div className={styles.container + " w-100"}>
      {/* {beachBars.length > 0 && ( */}
        <IndexPage.Header header={false}>
          {({ position, itemsRef }) => {
            return beachBars.map(({ idx, imgProps, beachBar: { name, location, ...beachBar } }, i) => (
              <Item
                key={idx}
                className={styles.suggestion}
                idx={i}
                imgProps={imgProps}
                beachBar={{ id: beachBar.id, name }}
                onClick={() => handleClick(location)}
                active={i === position}
                ref={el => (itemsRef.current[i] = el)}
              />
            ));
          }}
        </IndexPage.Header>
      {/* )} */}
    </div>
  );
});

Suggestions.displayName = "MapSuggestions";
