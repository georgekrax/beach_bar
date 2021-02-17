import dayjs, { Dayjs } from "dayjs";
import Image from "next/image";
import styles from "./Item.module.scss";

type Props = {
  date: Dayjs;
  people: number;
  searchValue: string | { beachBar: { name: string; thumbnailUrl: string } };
};

export const Item: React.FC<Props> = ({ searchValue, date, people }) => {
  return (
    <div className={styles["recent-search__beach-bar"] + " flex-column-center-flex-start"}>
      {typeof searchValue === "object" && (
        <div className={styles["recent-search__img"] + " w-100"}>
          <Image
            src="https://images.unsplash.com/photo-1523568129082-a8d6c095638e?ixid=MXwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
            // TODO: Change later with data fetching
            // src={searchValue.beachBar.thumbnailUrl}
            className={styles["recent-search__img"] + " w-100"}
            alt={`${searchValue.beachBar.name} #beach_bar thumbnail image`}
            objectFit="cover"
            objectPosition="center"
            quality={50}
            layout="fill"
          />
        </div>
      )}
      <div className={styles["recent-search__content"] + " w-100"}>
        <p className="semibold">{typeof searchValue === "string" ? searchValue : searchValue.beachBar.name}</p>
        <div className="flex-row-flex-start-flex-start">
          <p className="light">{date.format(`${date.year() === dayjs().year() ? "DD/MM" : "DD/MM/YYYY"}`)}</p>
          <span className={styles.divider}></span>
          <p className="light">{people} People</p>
        </div>
      </div>
    </div>
  );
};

Item.displayName = "RecentSearchesItem";
