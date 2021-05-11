import { UserSearchesQuery } from "@/graphql/generated";
import { genBarThumbnailAlt } from "@/utils/format";
import { formatSearchValue } from "@/utils/search";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import Section from "../Section";
import styles from "./Recent.module.scss";

type Props = {
  searches: UserSearchesQuery["userSearches"];
};

export const Recent: React.FC<Props> = ({ searches }) => {
  return searches.length === 0 ? null : (
    <section style={{ flex: 1 }}>
      <Section.Header href="/account/history" link="View search history">
        Recent searches
      </Section.Header>
      <div className={styles.container + " flex-row-flex-start-flex-start"}>
        {searches.map(({ id, ...rest }) => (
          <Item key={"recent_search_" + id} id={id} {...rest} />
        ))}
      </div>
    </section>
  );
};

Recent.displayName = "SearchRecent";

const Item: React.FC<Props["searches"][number]> = ({ id, searchAdults, searchChildren, inputValue, searchDate }) => {
  const people = useMemo(() => searchAdults + (searchChildren || 0), [searchAdults, searchChildren]);
  const searchValue = useMemo(() => formatSearchValue(inputValue), [inputValue]);
  const parsedDate = useMemo(() => dayjs(searchDate), [searchDate]);

  return (
    <Link href={{ pathname: "/search", query: { id, redirect: "/" } }}>
      <div className={styles.item + " flex-row-flex-start-center"}>
        {inputValue.beachBar && (
          <div className={styles.img + " flex-row-center-center"}>
            <Image
              src={inputValue.beachBar.thumbnailUrl}
              alt={genBarThumbnailAlt(searchValue)}
              width={72}
              height={72}
              objectFit="cover"
              objectPosition="center bottom"
              quality={50}
            />
          </div>
        )}
        <div className={styles.content + " w100"}>
          <div className="semibold">{searchValue}</div>
          <div className="flex-row-flex-start-flex-start">
            <div className="light">
              {parsedDate.format(parsedDate.year() === dayjs().year() ? "MM/DD" : "MM/DD/YYYY")}
            </div>
            <span className={styles.divider}></span>
            {people > 0 && (
              <div className="light">
                {people} {people <= 1 ? "person" : "people"}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

Item.displayName = "SearchRecentItem";
