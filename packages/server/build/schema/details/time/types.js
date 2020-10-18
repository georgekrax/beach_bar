"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonthTimeType = exports.QuarterTimeType = exports.HourTimeType = void 0;
const common_1 = require("@georgekrax-hashtag/common");
const schema_1 = require("@nexus/schema");
exports.HourTimeType = schema_1.objectType({
    name: "HourTime",
    description: "Represents each hour of the day",
    definition(t) {
        t.int("id", { nullable: false });
        t.string("value", { nullable: false });
        t.field("utcValue", {
            type: common_1.TimeScalar,
            nullable: false,
            description: "The time value in the UTC format and corresponding value",
        });
    },
});
exports.QuarterTimeType = schema_1.objectType({
    name: "QuarterTime",
    description: "Represents each quarter of the day",
    definition(t) {
        t.int("id", { nullable: false });
        t.string("value", { nullable: false });
        t.field("utcValue", {
            type: common_1.TimeScalar,
            nullable: false,
            description: "The time value in the UTC format and corresponding value",
        });
    },
});
exports.MonthTimeType = schema_1.objectType({
    name: "MonthTime",
    description: "Represents each month of the year",
    definition(t) {
        t.int("id", { nullable: false });
        t.string("value", { nullable: false });
        t.int("days", { nullable: false, description: "The days (count) of a month" });
    },
});
//# sourceMappingURL=types.js.map