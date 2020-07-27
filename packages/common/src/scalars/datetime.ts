import { scalarType } from "@nexus/schema";
import dayjs from "dayjs";
import { Kind } from "graphql";

export const DateTimeScalar = scalarType({
  name: "DateTime",
  asNexusMethod: "datetime",
  description: "Use JavaScript Date object for date/time fields.",
  serialize(value) {
    return dayjs(value);
  },
  parseValue(value) {
    return dayjs(value);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return dayjs(ast.value);
    }
    return null;
  },
});
