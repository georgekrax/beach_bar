<<<<<<< HEAD
import Icons from "@/components/Icons";
import { UserHistoryQuery } from "@/graphql/generated";
import { formatPeopleShort } from "@/utils/search";
import dayjs from "dayjs";
import Link from "next/link";
import { useMemo } from "react";
import styles from "./HistoryAction.module.scss";

type Props = {};

type FProps = Props & Pick<UserHistoryQuery["userHistory"][number], "beachBar" | "search">;

export const HistoryAction: React.FC<FProps> = ({ beachBar, search }) => {
  const primaryInfo = useMemo(() => {
    if (beachBar) return beachBar.name;
    else if (search) return search.inputValue?.formattedValue;
  }, [beachBar, search]);
  const secondaryInfo = useMemo(() => {
    if (beachBar) return beachBar.formattedLocation;
    else if (search) return formatPeopleShort({ adults: search.searchAdults, children: search.searchChildren || 0 });
  }, [beachBar, search]);
  const date = useMemo(() => {
    if (!search) return "";
    const parsedDay = dayjs(search?.searchDate);
    return parsedDay.format(`MM/DD${parsedDay.year() !== dayjs().year() ? "/YYYY" : ""}`);
  }, [search]);

  const handleClick = () => {};

  return beachBar || search ? (
    <Link href={{ pathname: beachBar ? `/beach/${beachBar.id}` : search && `/search`, query: search && { id: "1" } }}>
      <div className={styles.container + " w100 flex-row-center-center"} onClick={() => handleClick()}>
        <div>
          {beachBar ? <Icons.Logo.Hashtag width={18} height={18} /> : search && <Icons.Search width={18} height={18} />}
        </div>
        <div className={styles.details + " flex-column-center-flex-start"}>
          <span className="semibold">{primaryInfo}</span>
          <span className="body-14">
            {secondaryInfo}
            {search && <span> &bull; </span>}
            {date}
          </span>
        </div>
      </div>
    </Link>
  ) : null;
};

HistoryAction.displayName = "AccountHistoryAction";
=======
import Icons from "@/components/Icons";
import { UserHistoryQuery } from "@/graphql/generated";
import { formatPeopleShort } from "@/utils/search";
import dayjs from "dayjs";
import Link from "next/link";
import { useMemo } from "react";
import styles from "./HistoryAction.module.scss";

type Props = {};

type FProps = Props & Pick<UserHistoryQuery["userHistory"][number], "beachBar" | "search">;

export const HistoryAction: React.FC<FProps> = ({ beachBar, search }) => {
  const primaryInfo = useMemo(() => {
    if (beachBar) return beachBar.name;
    else if (search) return search.inputValue?.formattedValue;
  }, [beachBar, search]);
  const secondaryInfo = useMemo(() => {
    if (beachBar) return beachBar.formattedLocation;
    else if (search) return formatPeopleShort({ adults: search.searchAdults, children: search.searchChildren || 0 });
  }, [beachBar, search]);
  const date = useMemo(() => {
    if (!search) return "";
    const parsedDay = dayjs(search?.searchDate);
    return parsedDay.format(`MM/DD${parsedDay.year() !== dayjs().year() ? "/YYYY" : ""}`);
  }, [search]);

  const handleClick = () => {};

  return beachBar || search ? (
    <Link href={{ pathname: beachBar ? `/beach/${beachBar.id}` : search && `/search`, query: search && { id: "1" } }}>
      <div className={styles.container + " w100 flex-row-center-center"} onClick={() => handleClick()}>
        <div>
          {beachBar ? <Icons.Logo.Hashtag width={18} height={18} /> : search && <Icons.Search width={18} height={18} />}
        </div>
        <div className={styles.details + " flex-column-center-flex-start"}>
          <span className="semibold">{primaryInfo}</span>
          <span className="body-14">
            {secondaryInfo}
            {search && <span> &bull; </span>}
            {date}
          </span>
        </div>
      </div>
    </Link>
  ) : null;
};

HistoryAction.displayName = "AccountHistoryAction";
>>>>>>> 3c094b84c4b6a5e6c8400166ac60b7393b7ddcff
