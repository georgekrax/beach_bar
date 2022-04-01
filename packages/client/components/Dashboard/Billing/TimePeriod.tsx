import Icons from "@/components/Icons";
import { DatePicker, DatePickerSelectedDateState, Select } from "@hashtag-design-system/components";
import dayjs, { Dayjs } from "dayjs";
import minMax from "dayjs/plugin/minMax";
import { useState } from "react";
import styles from "./TimePeriod.module.scss";

dayjs.extend(minMax);

const DATA_ARR = [
  { format: "1D", calcDate: (date: Dayjs) => date.subtract(1, "day") },
  { format: "1W", calcDate: (date: Dayjs) => date.subtract(1, "week") },
  { format: "2W", calcDate: (date: Dayjs) => date.subtract(2, "week") },
  { format: "1M", calcDate: (date: Dayjs) => date.subtract(1, "month") },
  { format: "3M", calcDate: (date: Dayjs) => date.subtract(3, "month") },
  { format: "1Y", calcDate: (date: Dayjs) => date.subtract(1, "year") },
] as const;

export type Props = {
  defaultDates?: { start?: Dayjs; end: typeof DATA_ARR[number]["format"] };
  onClick?: (selected: { item?: typeof DATA_ARR[number]; startDate: Dayjs; endDate: Dayjs }) => void;
};

export const TimePeriod: React.FC<Props> = ({ onClick, ...props }) => {
  const defaultDates = { start: dayjs().startOf("date"), end: "1D", ...props.defaultDates };
  const [isOpen, setIsOpen] = useState(false);
  const [{ start, end }, setRangeDates] = useState({
    ...defaultDates,
    end: DATA_ARR.find(({ format }) => format === defaultDates.end)!.calcDate(defaultDates.start),
  });
  const [selected, setSelected] = useState<number | undefined>(DATA_ARR.findIndex(({ format }) => format === defaultDates.end));

  const handleClick = (idx: number) => {
    const defaultStart = defaultDates.start;
    const item = DATA_ARR[idx];
    const endDate = item.calcDate(defaultStart);
    setSelected(idx);
    setRangeDates({ start: defaultStart, end: endDate });
    if (onClick) onClick({ ...item, startDate: defaultStart, endDate });
  };

  const handleDateChange = (dates: DatePickerSelectedDateState) => {
    const firstDate = dates[0];
    const lastDate = dates[1];
    const isEndSame = firstDate?.isSame(end, "date");
    const isStartSame = lastDate?.isSame(start, "date");
    if (isOpen && (isEndSame === false || isStartSame === false)) {
      const newData = { start: lastDate || start, end: firstDate || end };
      setRangeDates(newData);
      setSelected(undefined);
      if (onClick && isEndSame) onClick({ startDate: newData.start, endDate: newData.end });
    }
  };

  return (
    <div className={styles.container + " flex-row-center-center"}>
      {/* <div className={styles.list + " flex-inherit-inherit-inherit"}> */}
      {DATA_ARR.map(({ format }, i) => (
        <div
          key={"date_" + format}
          className={styles.date + (i === selected ? " bold itext--primary" : "") + " text--center cursor--pointer"}
          onClick={() => handleClick(i)}
        >
          {format.toUpperCase()}
        </div>
      ))}
      {/* </div> */}
      <DatePicker
        isRange
        yearsRows={2}
        yearsBeforeAfter={4}
        defaultDates={[end, start]}
        disabledDays={{ till: { date: defaultDates.start }, days: [] }}
        modal={{ align: "right" }}
        onChange={({ selectedDate }) => handleDateChange(selectedDate)}
        onToggle={({ currentTarget }) => setIsOpen(!!currentTarget.attributes.getNamedItem("open"))}
        // onClick={({ selectedDate }) => handleDateClick(selectedDate)}
        selectBtn={() => (
          <Select.Btn className={styles.pickerBtn}>
            <div>{end.format("MM/DD/YYYY")}</div>
            <Icons.Arrow.Right width={16} height={16} />
            <div>{start.format("MM/DD/YYYY")}</div>
          </Select.Btn>
        )}
      />
    </div>
  );
};

TimePeriod.displayName = "DashboardTimePeriod";
