"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonthTimeType = exports.QuarterTimeType = exports.HourTimeType = void 0;
const graphql_1 = require("@the_hashtag/common/dist/graphql");
const nexus_1 = require("nexus");
exports.HourTimeType = nexus_1.objectType({
    name: "HourTime",
    description: "Represents each hour of the day",
    definition(t) {
        t.id("id");
        t.string("value");
        t.field("utcValue", { type: graphql_1.TimeScalar, resolve: o => o.value });
    },
});
exports.QuarterTimeType = nexus_1.objectType({
    name: "QuarterTime",
    description: "Represents each quarter of the day",
    definition(t) {
        t.id("id");
        t.string("value");
        t.field("utcValue", { type: graphql_1.TimeScalar, resolve: o => o.value });
    },
});
exports.MonthTimeType = nexus_1.objectType({
    name: "MonthTime",
    description: "Represents each month of the year",
    definition(t) {
        t.id("id");
        t.string("value");
        t.int("days", { description: "The days (count) of a month" });
    },
});
