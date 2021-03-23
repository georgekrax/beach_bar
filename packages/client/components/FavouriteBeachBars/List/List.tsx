import { CarouselItemOptions, Item } from "../../Carousel";
import styles from "./List.module.scss";

export type Props = {
  items: CarouselItemOptions[];
};

export const List: React.FC<Props> = ({ items }) => {
  return (
    <div className={styles.list + " index__section__list flex-column-center-center"}>
      {items.map(({ idx: id, ...props }) => (
        <Item data-length={items.length} className={styles.item} active key={id} idx={id as never} {...props} />
      ))}
    </div>
  );
};

List.displayName = "FavouriteBeachBarList";
