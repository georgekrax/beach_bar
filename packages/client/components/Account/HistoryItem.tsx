import Icons from "@/components/Icons";
import { UserHistoryQuery } from "@/graphql/generated";
import { formatPeopleShort } from "@/utils/search";
import dayjs from "dayjs";
import Link from "next/link";
import { useMemo } from "react";
import styles from "./HistoryItem.module.scss";

export const HistoryItem: React.FC<Pick<UserHistoryQuery["userHistory"][number], "beachBar" | "search">> = ({
  beachBar,
  search,
}) => {
  const primaryInfo = useMemo(() => {
    if (beachBar) return beachBar.name;
    else if (search) return search.inputValue?.formattedValue;
  }, [beachBar, search]);
  const secondaryInfo = useMemo(() => {
    if (beachBar) return beachBar.location?.formattedLocation;
    else if (search) return formatPeopleShort({ adults: search.adults, children: search.children || 0 });
  }, [beachBar, search]);
  const date = useMemo(() => {
    if (!search) return "";
    const parsedDay = dayjs(search?.date);
    return parsedDay.format(`MM/DD${parsedDay.year() !== dayjs().year() ? "/YYYY" : ""}`);
  }, [search]);

  const handleClick = () => {};

  return beachBar || search ? (
    <Link href={{ pathname: beachBar ? "/beach/" + beachBar.id : search && "/search", query: search && { id: "1" } }}>
      <div className={styles.container + " w100 cursor--pointer flex-row-center-center"} onClick={() => handleClick()}>
        <div>
          {beachBar ? <Icons.Logo.Hashtag width={18} height={18} /> : search && <Icons.Search width={18} height={18} />}
        </div>
        <div className={styles.details + " flex-column-center-flex-start"}>
          <span className="semibold">{primaryInfo}</span>
          <span className="body-14 text--grey">
            {secondaryInfo}
            {search && <span>&nbsp;&bull;&nbsp;</span>}
            {date}
          </span>
        </div>
      </div>
    </Link>
  ) : null;
};

HistoryItem.displayName = "AccountHistoryItem";
