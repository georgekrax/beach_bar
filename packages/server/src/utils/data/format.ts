import { NexusGenInputs } from "@/graphql/generated/nexusTypes";
import { dayjsFormat } from "@beach_bar/common";
import dayjs, { OpUnitType } from "dayjs";
import { genDatesArr } from "./other";

export const numberTypeToNum = (num: number) => +num.toString();

export const toFixed2 = (num: number) => +num.toFixed(2);

// parseDates();
export type ParseDatesOptions = { dates?: NexusGenInputs["DashboardDatesArg"] | null };

export const parseDates = (dates?: ParseDatesOptions["dates"], startOf: OpUnitType = "hour") => {
  const startDate = (dates?.start ? dayjs(dates.start) : dayjs()).startOf(startOf);
  const endDate = dates?.end ? dayjs(dates.end) : startDate.subtract(1, "week");

  const formattedDates = { start: startDate.format(dayjsFormat.ISO_STRING), end: endDate.format(dayjsFormat.ISO_STRING) };
  const hours = { start: startDate.hour(), end: endDate.hour() };
  const datesArr = genDatesArr(endDate, startDate);

  return { startDate, endDate, formattedDates, hours, datesArr };
};
