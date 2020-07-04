import { TimeScalar } from "@beach_bar/common";
import { objectType } from "@nexus/schema";

export const HourTimeType = objectType({
  name: "HourTime",
  description: "Represents each hour of the day",
  definition(t) {
    t.int("id", { nullable: false });
    t.string("value", { nullable: false });
    t.field("utcValue", { type: TimeScalar, nullable: false });
  },
});
