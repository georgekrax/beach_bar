import { TimeScalar } from "@the_hashtag/common/dist/graphql";
import { objectType } from "nexus";

export const HourTimeType = objectType({
  name: "HourTime",
  description: "Represents each hour of the day",
  definition(t) {
    t.id("id");
    t.string("value");
    t.field("utcValue", {
      type: TimeScalar,
      description: "The time value in the UTC format and corresponding value",
    });
  },
});

export const QuarterTimeType = objectType({
  name: "QuarterTime",
  description: "Represents each quarter of the day",
  definition(t) {
    t.id("id");
    t.string("value");
    t.field("utcValue", {
      type: TimeScalar,
      description: "The time value in the UTC format and corresponding value",
    });
  },
});

export const MonthTimeType = objectType({
  name: "MonthTime",
  description: "Represents each month of the year",
  definition(t) {
    t.id("id");
    t.string("value");
    t.int("days", { description: "The days (count) of a month" });
  },
});
