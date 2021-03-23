import dayjs, { Dayjs } from "dayjs";
import Image from "next/image";
import styles from "./Item.module.scss";

export type Props = {
  date?: Dayjs;
  people: number;
  searchValue: string | { beachBar: { name: string; thumbnailUrl: string } };
};

export const Item: React.FC<Props> = ({ searchValue, date, people }) => {
  return (
    <div className={styles["recent-search__beach-bar"] + " flex-column-center-flex-start"}>
      {typeof searchValue === "object" && (
        <div className={styles["recent-search__img"] + " w-100"}>
          <Image
            src={searchValue.beachBar.thumbnailUrl}
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
          {date && (
            <>
              <p className="light">{date.format(`${date.year() === dayjs().year() ? "MM/DD" : "MM/DD/YYYY"}`)}</p>
              <span className={styles.divider}></span>
            </>
          )}
          {people > 0 && <p className="light">{people} People</p>}
        </div>
      </div>
    </div>
  );
};

Item.displayName = "RecentSearchesItem";
