import Icons from "@/components/Icons";
import { UserHistoryQuery } from "@/graphql/generated";
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
    else if (search) {
      const people = (search.searchAdults || 0) + (search.searchChildren || 0);
      return `${people} ${people <= 1 ? "Person" : "People"}`;
    }
  }, [beachBar, search]);
  const date = useMemo(() => {
    if (!search) return "";
    const parsedDay = dayjs(search?.searchDate);
    return parsedDay.format(`MM/DD${parsedDay.year() !== dayjs().year() ? "/YYYY" : ""}`);
  }, [search]);

  const handleClick = () => {};

  return beachBar || search ? (
    <Link
      href={{ pathname: beachBar ? `/beachbar/${beachBar.id}` : search && `/search`, query: search && { id: "1" } }}
    >
      <div className={styles.container + " w-100 flex-row-center-center"} onClick={() => handleClick()}>
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
