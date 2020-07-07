import { scalarType } from "@nexus/schema";
import dayjs from "dayjs";
import { GraphQLError, Kind } from "graphql";

export const DateTimeScalar = scalarType({
  name: "DateTime",
  asNexusMethod: "datetime",
  description: "Use JavaScript Date object for date/time fields.",
  serialize(value) {
    let v = value;

    if (
      !(v instanceof Date) &&
      typeof v !== "string" &&
      typeof v !== "number"
    ) {
      throw new TypeError(
        `Value is not an instance of Date, Date string or number: ${JSON.stringify(
          v
        )}`
      );
    }

    if (typeof v === "string") {
      v = dayjs();

      v.setTime(Date.parse(value));
    } else if (typeof v === "number") {
      v = dayjs(v);
    }

    if (Number.isNaN(v.getTime())) {
      throw new TypeError(`Value is not a valid Date: ${JSON.stringify(v)}`);
    }

    return v.toJSON();
  },
  parseValue(value) {
    const date: any = dayjs(value);

    // eslint-disable-next-line no-restricted-globals
    if (Number.isNaN(date.getTime())) {
      throw new TypeError(`Value is not a valid Date: ${value}`);
    }

    return date;
  },
  parseLiteral(ast) {
    if (ast.kind !== Kind.STRING && ast.kind !== Kind.INT) {
      throw new GraphQLError(
        `Can only parse strings & integers to dates but got a: ${ast.kind}`
      );
    }

    const result: any = dayjs(
      ast.kind === Kind.INT ? Number(ast.value) : ast.value
    );

    // eslint-disable-next-line no-restricted-globals
    if (Number.isNaN(result.getTime())) {
      throw new GraphQLError(`Value is not a valid Date: ${ast.value}`);
    }

    return result;
  },
});
