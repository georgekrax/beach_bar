import { TimeScalar } from "@beach_bar/common";
import { objectType } from "@nexus/schema";

export const HourTimeType = objectType({
  name: "HourTime",
  description: "Represents each hour of the day",
  definition(t) {
    t.int("id", { nullable: false });
    t.string("value", { nullable: false });
    t.field("utcValue", {
      type: TimeScalar,
      nullable: false,
      description: "The time value in the UTC format and corresponding value",
    });
  },
});

export const QuarterTimeType = objectType({
  name: "QuarterTime",
  description: "Represents each quarter of the day",
  definition(t) {
    t.int("id", { nullable: false });
    t.string("value", { nullable: false });
    t.field("utcValue", {
      type: TimeScalar,
      nullable: false,
      description: "The time value in the UTC format and corresponding value",
    });
  },
});

export const MonthTimeType = objectType({
  name: "MonthTime",
  description: "Represents each month of the year",
  definition(t) {
    t.int("id", { nullable: false });
    t.string("value", { nullable: false });
    t.int("days", { nullable: false, description: "The days (count) of a month" });
  },
});
