import Carousel from "@/components/Carousel2";
import Section from "@/components/Section";
import { useMemo } from "react";
import styles from "./List.module.scss";

type Props = {
  beachBars: any[];
};

export const List: React.FC<Props> = ({ beachBars }) => {
  const items = useMemo(() => {
    const right: typeof beachBars = [];
    const left: typeof beachBars = [];
    beachBars.forEach((obj, i) => (i % 2 === 0 ? left.push(obj) : right.push(obj)));
    return { right, left };
  }, []);

  return beachBars.length <= 0 ? null : (
    <section className="w100">
      <Section.Header href="/account/favourites" link="View all">
        Favourites
      </Section.Header>
      <div className="flex-row-flex-start-flex-start">
        {["left", "right"].map((key, i) => (
          <Column
            key={i}
            beachBars={items[key].map(({ id, beachBar, imgProps }) => ({
              id,
              imgProps,
              beachBar,
            }))}
          />
        ))}
      </div>
    </section>
  );
};

List.displayName = "BeachBarFavouriteList";

export const Column: React.FC<Props> = ({ beachBars }) => (
  <div className={styles.column + " w100 flex-column-center-center"}>
    {beachBars.map(({ idx: id, ...props }) => (
      <Carousel.Item
        data-length={beachBars.length}
        className={styles.item + " iw100"}
        active
        key={id}
        idx={id as never}
        {...props}
      />
    ))}
  </div>
);

Column.displayName = "BeachBarFavouriteListColumn";
