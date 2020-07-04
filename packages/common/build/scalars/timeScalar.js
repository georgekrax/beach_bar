"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeScalar = exports.serializeTimeString = exports.serializeTime = exports.parseTime = exports.validateTime = exports.validateJSDate = void 0;
const schema_1 = require("@nexus/schema");
const graphql_1 = require("graphql");
exports.validateJSDate = (date) => {
    const time = date.getTime();
    return time === time;
};
exports.validateTime = (time) => {
    const TIME_REGEX = /^([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])(\.\d{1,})?(([Z])|([+|-]([01][0-9]|2[0-3]):[0-5][0-9]))$/;
    return TIME_REGEX.test(time);
};
exports.parseTime = (time) => {
    const currentDateString = new Date().toISOString();
    return new Date(currentDateString.substr(0, currentDateString.indexOf("T") + 1) + time);
};
exports.serializeTime = (date) => {
    const dateTimeString = date.toISOString();
    return dateTimeString.substr(dateTimeString.indexOf("T") + 1);
};
exports.serializeTimeString = (time) => {
    if (time.indexOf("Z") !== -1) {
        return time;
    }
    else {
        const date = exports.parseTime(time);
        let timeUTC = exports.serializeTime(date);
        const regexFracSec = /\.\d{1,}/;
        const fractionalPart = time.match(regexFracSec);
        if (fractionalPart == null) {
            timeUTC = timeUTC.replace(regexFracSec, "");
            return timeUTC;
        }
        else {
            timeUTC = timeUTC.replace(regexFracSec, fractionalPart[0]);
            return timeUTC;
        }
    }
};
exports.TimeScalar = schema_1.scalarType({
    name: "Time",
    description: "A time string at UTC, such as 10:15:30Z",
    asNexusMethod: "time",
    serialize(value) {
        if (value instanceof Date) {
            if (exports.validateJSDate(value)) {
                return exports.serializeTime(value);
            }
            throw new TypeError("Time cannot represent an invalid Date instance");
        }
        else if (typeof value === "string") {
            if (exports.validateTime(`${value}Z`)) {
                return exports.serializeTimeString(`${value}Z`);
            }
            throw new TypeError(`Time cannot represent an invalid time-string ${value}.`);
        }
        else {
            throw new TypeError("Time cannot be serialized from a non string, " +
                "or non Date type " +
                JSON.stringify(value));
        }
    },
    parseValue(value) {
        if (!(typeof value === "string")) {
            throw new TypeError(`Time cannot represent non string type ${JSON.stringify(value)}`);
        }
        if (exports.validateTime(value)) {
            return exports.parseTime(value);
        }
        throw new TypeError(`Time cannot represent an invalid time-string ${value}.`);
    },
    parseLiteral(ast) {
        if (ast.kind !== graphql_1.Kind.STRING) {
            throw new TypeError(`Time cannot represent non string type ${"value" in ast && ast.value}`);
        }
        const value = ast.value;
        if (exports.validateTime(value)) {
            return exports.parseTime(value);
        }
        throw new TypeError(`Time cannot represent an invalid time-string ${String(value)}.`);
    },
});
//# sourceMappingURL=timeScalar.js.map