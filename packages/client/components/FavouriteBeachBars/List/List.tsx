import { CarouselItem, CarouselItemProps } from "../../BeachBarCarousel";
import styles from "./List.module.scss";

export type Props = {
  items: CarouselItemProps[];
};

export const List: React.FC<Props> = ({ items }) => {
  return (
    <div className={styles.list + " index__section__list flex-column-center-center"}>
      {items.map(({ idx, ...props }) => (
        <CarouselItem className={styles.item} key={idx} idx={idx} {...props} />
      ))}
    </div>
  );
};

List.displayName = "FavouriteBeachBarList";
