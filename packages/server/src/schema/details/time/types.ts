import dayjs, { Dayjs } from "dayjs";
import { objectType } from "nexus";
import { HourTime, MonthTime, QuarterTime } from "nexus-prisma";

export const HourTimeType = objectType({
  name: HourTime.$name,
  description: "Represents each hour of the day",
  definition(t) {
    // t.id("id");
    // t.string("value");
    // t.field("utcValue", { type: TimeScalar, resolve: o => o.value });
    t.field(HourTime.id);
    t.field(HourTime.value.name, {
      ...HourTime.value,
      type: "Int",
      resolve: o => {
        const value = (o as any).value;
        if (typeof value === "number") return value;
        return dayjs(value).hour();
      },
    });
    t.time("utcValue", {
      resolve: o => {
        const value = (o as any).value;
        let date: Dayjs;
        if (typeof value === "number") date = dayjs().hour(value);
        else date = dayjs(value);
        return date.format("HH:mm:ss");
      },
    });
  },
});

export const QuarterTimeType = objectType({
  name: QuarterTime.$name,
  description: "Represents each quarter of the day",
  definition(t) {
    // t.id("id");
    // t.string("value");
    // t.field("utcValue", { type: TimeScalar, resolve: o => o.value });
    t.field(QuarterTime.id);
    t.field(QuarterTime.value);
    t.time("utcValue", { resolve: ({ value }) => dayjs(value).format("HH:mm:ss") });
  },
});

export const MonthTimeType = objectType({
  name: MonthTime.$name,
  description: "Represents each month of the year",
  definition(t) {
    // t.id("id");
    // t.string("value");
    // t.int("days", { description: "The days (count) of a month" });
    t.field(MonthTime.id);
    t.field(MonthTime.value);
    t.field(MonthTime.days);
  },
});
