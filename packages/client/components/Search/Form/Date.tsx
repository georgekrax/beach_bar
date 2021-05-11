<<<<<<< HEAD
import { useSearchContext } from "@/utils/contexts";
import { useIsDesktop } from "@/utils/hooks";
import { checkSearchDate, formatDateShort } from "@/utils/search";
import { DatePicker, Select } from "@hashtag-design-system/components";
import dayjs, { Dayjs } from "dayjs";
import { useMemo } from "react";
import { SEARCH_ACTIONS } from "../index";
import styles from "./Date.module.scss";

type Props = {};

export const Date: React.FC<Props> = () => {
  const isDesktop = useIsDesktop();
  const { date, dispatch } = useSearchContext();

  const defaultDate = useMemo(() => checkSearchDate(date ?? dayjs()), [date]);

  const handleDateSelect = (newDate: Dayjs) => {
    dispatch({ type: SEARCH_ACTIONS.HANDLE_DATE_SELECT, payload: { newDate } });
  };

  return (
    <DatePicker
      allowedModes={{ calendar: true, months: true, years: false }}
      selectBtn={({ selectedDate }) => {
        const formattedDate = useMemo(() => formatDateShort(selectedDate[0]), [selectedDate]);
        return (
          <Select.Button className={styles.btn + (isDesktop ? " header-6" : "")} style={{ width: "auto" }}>
            {isDesktop ? (
              <>
                <div>Date</div>
                <div>{formattedDate}</div>
              </>
            ) : (
              formattedDate
            )}
          </Select.Button>
        );
      }}
      onChange={({ selectedDate }) => {
        const newDate = selectedDate[0];
        if (!newDate.isSame(defaultDate)) handleDateSelect(newDate);
      }}
      disabledDays={{
        days: [],
        from: { date: checkSearchDate(dayjs()).startOf("day") },
        till: { date: dayjs().month(9).date(31) },
      }}
      defaultDates={[defaultDate]}
    />
  );
};

Date.displayName = "SearchFormDate";
=======
import { useSearchContext } from "@/utils/contexts";
import { useIsDesktop } from "@/utils/hooks";
import { checkSearchDate, formatDateShort } from "@/utils/search";
import { DatePicker, Select } from "@hashtag-design-system/components";
import dayjs, { Dayjs } from "dayjs";
import { useMemo } from "react";
import { SEARCH_ACTIONS } from "../index";
import styles from "./Date.module.scss";

type Props = {};

export const Date: React.FC<Props> = () => {
  const isDesktop = useIsDesktop();
  const { date, dispatch } = useSearchContext();

  const defaultDate = useMemo(() => checkSearchDate(date ?? dayjs()), [date]);

  const handleDateSelect = (newDate: Dayjs) => {
    dispatch({ type: SEARCH_ACTIONS.HANDLE_DATE_SELECT, payload: { newDate } });
  };

  return (
    <DatePicker
      allowedModes={{ calendar: true, months: true, years: false }}
      selectBtn={({ selectedDate }) => {
        const formattedDate = useMemo(() => formatDateShort(selectedDate[0]), [selectedDate]);
        return (
          <Select.Button className={styles.btn + (isDesktop ? " header-6" : "")} style={{ width: "auto" }}>
            {isDesktop ? (
              <>
                <div>Date</div>
                <div>{formattedDate}</div>
              </>
            ) : (
              formattedDate
            )}
          </Select.Button>
        );
      }}
      onChange={({ selectedDate }) => {
        const newDate = selectedDate[0];
        if (!newDate.isSame(defaultDate)) handleDateSelect(newDate);
      }}
      disabledDays={{
        days: [],
        from: { date: checkSearchDate(dayjs()).startOf("day") },
        till: { date: dayjs().month(9).date(31) },
      }}
      defaultDates={[defaultDate]}
    />
  );
};

Date.displayName = "SearchFormDate";
>>>>>>> 3c094b84c4b6a5e6c8400166ac60b7393b7ddcff
