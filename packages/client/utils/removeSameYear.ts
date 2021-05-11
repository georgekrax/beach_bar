import dayjs, { Dayjs } from "dayjs";

export const removeSaveYear = (day: Dayjs) => day.format(`MM/DD${day.year() === dayjs().year() ? "" : "/YYYY"}`);
