import { scalarType } from "@nexus/schema";
import { Kind } from "graphql";

export const DateScalar = scalarType({
  name: "Date",
  asNexusMethod: "date",
  description: "Use JavaScript Date object for date-only fields.",
  serialize(value) {
    return value;
  },
  parseValue(value) {
    return new Date(value);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});
