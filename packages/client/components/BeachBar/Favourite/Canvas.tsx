import Carousel from "@/components/Carousel";
import Section from "@/components/Section";
import { MeQuery } from "@/graphql/generated";
import { useClassnames } from "@hashtag-design-system/components";
import { useMemo } from "react";
import styles from "./Canvas.module.scss";

type Props = {
  arr: NonNullable<MeQuery["me"]>["favoriteBars"];
};

export const Canvas: React.FC<Props & Pick<React.ComponentPropsWithoutRef<"section">, "className">> = ({
  arr,
  ...props
}) => {
  const [classNames, rest] = useClassnames("", props);
  const sliced = useMemo(() => arr.slice(0, 6), [arr]);

  return (
    <section className={classNames} {...rest}>
      <Section.Header href="/account/favourites" link="View all">
        My Favourites
      </Section.Header>
      <div className={styles.container + " " + styles["length" + arr.length]}>
        {sliced.map(({ beachBar }, i) => (
          <Carousel.BeachBar
            key={"favourite_" + beachBar.id}
            className={styles.item + (i % 2 === 0 ? " " + styles.reverse : "") + " iw100 ih100"}
            showLocationIcon={false}
            {...beachBar}
          />
        ))}
      </div>
    </section>
  );
};

Canvas.displayName = "BeachBarFavouriteCanvas";

export type { Props as BeachBarFavouriteCanvasProps };
