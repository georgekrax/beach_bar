<<<<<<< HEAD
import { GetAllBeachBarsQuery } from "@/graphql/generated";
import { memo } from "react";
import styles from "./Suggestions.module.scss";
import { MAP_ACTIONTYPE } from "./__helpers__";

type Props = {
  beachBars: {
    beachBar: GetAllBeachBarsQuery["getAllBeachBars"][number];
  }[];
  dispatch: React.Dispatch<MAP_ACTIONTYPE>;
};

export const Suggestions: React.FC<Props> = memo(({ dispatch }) => {
  return (
    <div className={styles.container + " w100"}>
      {/* {beachBars.length > 0 && ( */}
      {/* <IndexPage.Header header={false}>
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
      </IndexPage.Header> */}
      {/* )} */}
    </div>
  );
});

Suggestions.displayName = "MapSuggestions";
=======
import { GetAllBeachBarsQuery } from "@/graphql/generated";
import { memo } from "react";
import styles from "./Suggestions.module.scss";
import { MAP_ACTIONTYPE } from "./__helpers__";

type Props = {
  beachBars: {
    beachBar: GetAllBeachBarsQuery["getAllBeachBars"][number];
  }[];
  dispatch: React.Dispatch<MAP_ACTIONTYPE>;
};

export const Suggestions: React.FC<Props> = memo(({ dispatch }) => {
  return (
    <div className={styles.container + " w100"}>
      {/* {beachBars.length > 0 && ( */}
      {/* <IndexPage.Header header={false}>
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
      </IndexPage.Header> */}
      {/* )} */}
    </div>
  );
});

Suggestions.displayName = "MapSuggestions";
>>>>>>> 3c094b84c4b6a5e6c8400166ac60b7393b7ddcff
