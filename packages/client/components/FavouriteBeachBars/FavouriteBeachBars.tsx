import range from "lodash/range";
import { useMemo } from "react";
import Section from "../Section";
import { List } from "./List";

type Props = {};

const FavouriteBeachBars: React.FC<Props> = () => {
  const items = useMemo(() => {
    const right: number[] = [];
    const left: number[] = [];

    range(0, 4).forEach(num => (num % 2 === 0 ? left.push(num) : right.push(num)));

    return {
      right,
      left,
    };
  }, []);

  return (
    <section className="index__section__container">
      <Section.PageHeader header="Favourites" link="View all" />
      <div className="flex-row-flex-start-flex-start">
        {["left", "right"].map((key, i) => (
          <List
            key={i}
            items={items[key].map(num => ({
              idx: num,
              active: true,
              imgProps: {
                src:
                  "https://images.unsplash.com/photo-1533105079780-92b9be482077?ixid=MXwxMjA3fDB8MHxzZWFyY2h8Nnx8Z3JlZWNlfGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
              },
              beachBar: { name: "Kikabu", city: "Mykonos", isFavourite: true },
            }))}
          />
        ))}
      </div>
    </section>
  );
};

FavouriteBeachBars.displayName = "FavouriteBeachBars";

export default FavouriteBeachBars;
