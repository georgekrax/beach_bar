import { scalarType } from "@nexus/schema";
import dayjs from "dayjs";
import { Kind } from "graphql";

export const validateJSDate = (date: Date): boolean => {
  const time = date.getTime();
  return time === time; // eslint-disable-line
};

export const validateTime = (time: string): boolean => {
  const TIME_REGEX = /^([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])(\.\d{1,})?(([Z])|([+|-]([01][0-9]|2[0-3]):[0-5][0-9]))$/;
  return TIME_REGEX.test(time);
};

export const parseTime = (time: string): Date => {
  const currentDateString = dayjs().toISOString();
  return dayjs(
    currentDateString.substr(0, currentDateString.indexOf("T") + 1) + time
  ).toDate();
};

export const serializeTime = (date: Date): string => {
  const dateTimeString = date.toISOString();
  return dateTimeString.substr(dateTimeString.indexOf("T") + 1);
};

export const serializeTimeString = (time: string): string => {
  if (time.indexOf("Z") !== -1) {
    return time;
  } else {
    const date = parseTime(time);
    let timeUTC = serializeTime(date);

    const regexFracSec = /\.\d{1,}/;

    const fractionalPart = time.match(regexFracSec);
    if (fractionalPart == null) {
      timeUTC = timeUTC.replace(regexFracSec, "");
      return timeUTC;
    } else {
      timeUTC = timeUTC.replace(regexFracSec, fractionalPart[0]);
      return timeUTC;
    }
  }
};

export const TimeScalar = scalarType({
  name: "Time",
  description: "A time string at UTC, such as 10:15:30Z",
  asNexusMethod: "time",
  serialize(value) {
    if (value instanceof Date) {
      if (validateJSDate(value)) {
        return serializeTime(value);
      }
      throw new TypeError("Time cannot represent an invalid Date instance");
    } else if (typeof value === "string") {
      if (validateTime(`${value}Z`)) {
        return serializeTimeString(`${value}Z`);
      }
      throw new TypeError(
        `Time cannot represent an invalid time-string ${value}.`
      );
    } else {
      throw new TypeError(
        "Time cannot be serialized from a non string, " +
          "or non Date type " +
          JSON.stringify(value)
      );
    }
  },
  parseValue(value) {
    if (!(typeof value === "string")) {
      throw new TypeError(
        `Time cannot represent non string type ${JSON.stringify(value)}`
      );
    }

    if (validateTime(value)) {
      return parseTime(value);
    }
    throw new TypeError(
      `Time cannot represent an invalid time-string ${value}.`
    );
  },
  parseLiteral(ast) {
    if (ast.kind !== Kind.STRING) {
      throw new TypeError(
        `Time cannot represent non string type ${"value" in ast && ast.value}`
      );
    }
    const value = ast.value;
    if (validateTime(value)) {
      return parseTime(value);
    }
    throw new TypeError(
      `Time cannot represent an invalid time-string ${String(value)}.`
    );
  },
});
