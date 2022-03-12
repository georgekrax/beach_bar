import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import dayjs, { Dayjs } from "dayjs";

dayjs.extend(isSameOrBefore);

export const genDatesArr = (from: Dayjs, to: Dayjs): Dayjs[] => {
  const dates: typeof from[] = [];
  while (from.isSameOrBefore(to)) {
    dates.push(from);
    from = from.set("date", from.date() + 1);
  }
  return dates;
};