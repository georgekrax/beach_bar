import { scalarType } from "@nexus/schema";
import dayjs from "dayjs";
import { Kind } from "graphql";

export const DateScalar = scalarType({
  name: "Date",
  asNexusMethod: "date",
  description: "Use JavaScript Date object for date-only fields.",
  serialize(value) {
    return dayjs(value).format("DD-MM-YYYY");
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
