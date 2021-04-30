import Icons from "@/components/Icons";
import Search from "@/components/Search";
import { useSearchContext } from "@/utils/contexts";
import { formatDateShort, formatHourTime } from "@/utils/search";
import dayjs from "dayjs";
import { useMemo } from "react";
import styles from "./SearchInfo.module.scss";

const PEOPLE_ICON_SIZES = { width: 20, height: 20 };

type Props = {
  bg?: "blue" | "white";
};

export const SearchInfo: React.FC<Props> = ({ bg = "white" }) => {
  const { people } = useSearchContext();

  const totalPeople = useMemo(() => (people ? (people.adults || 1) + (people.children || 0) : 0), [people]);

  return (
    <div className={styles.header + " " + (bg === "white" ? styles.white : styles.blue) + " text--grey"}>
      {true ? (
        <div className="flex-row-flex-start-center">
          {/* <div>{formattedSearchDate}</div> */}
          <div>{formatDateShort(dayjs())}</div>
          {/* {hourTime && ( */}
          <>
            <div className={styles.bull}>&bull;</div>
            <div>{formatHourTime(13)}</div>
          </>
          {/* )} */}
          {/* {totalPeople > 0 && ( */}
          <>
            <div className={styles.bull}>&bull;</div>
            <div className="flex-row-center-center">
              <div>{totalPeople || 5}</div>
              {totalPeople > 1 ? (
                <Icons.People.Filled {...PEOPLE_ICON_SIZES} />
              ) : (
                <Icons.UserAvatar {...PEOPLE_ICON_SIZES} style={{ x: "-15%" }} />
              )}
            </div>
          </>
          {/* )} */}
        </div>
      ) : (
        <Search.Box />
      )}
    </div>
  );
};

SearchInfo.displayName = "BeachBarSearchInfo";
