import { useMemo } from "react";
import { CarouselItemOptions } from "../Carousel";
import Section from "../Section";
import { List } from "./List";

export type Props = {
  beachBars: CarouselItemOptions[];
};

const FavouriteBeachBars: React.FC<Props> = ({ beachBars }) => {
  const items = useMemo(() => {
    const right: typeof beachBars = [];
    const left: typeof beachBars = [];

    beachBars.forEach((obj, i) => (i % 2 === 0 ? left.push(obj) : right.push(obj)));

    return {
      right,
      left,
    };
  }, []);

  return beachBars.length > 0 ? (
    <section className="index__section__container">
      {/* TODO: Change pathname later */}
      <Section.Header href={{ pathname: "/" }} link="View all">
        Favourites
      </Section.Header>
      <div className="flex-row-flex-start-flex-start">
        {["left", "right"].map((key, i) => (
          <List
            key={i}
            items={items[key].map(({ id, beachBar, imgProps }) => ({
              id,
              imgProps,
              beachBar,
            }))}
          />
        ))}
      </div>
    </section>
  ) : null;
};

FavouriteBeachBars.displayName = "FavouriteBeachBars";

export default FavouriteBeachBars;
