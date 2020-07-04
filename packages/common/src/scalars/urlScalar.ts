import { scalarType } from "@nexus/schema";
import { Kind, GraphQLError } from "graphql";
import { URL } from "url";

export const UrlScalar = scalarType({
  name: "URL",
  asNexusMethod: "url",
  description:
    "A field whose value conforms to the standard URL format as specified in RFC3986: https://www.ietf.org/rfc/rfc3986.txt.",
  serialize(value) {
    return new URL(value.toString()).toString();
  },
  parseValue(value) {
    return new URL(value.toString());
  },
  parseLiteral(ast) {
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError(`Can only validate strings as URLs but got a: ${ast.kind}`);
    }

    return new URL(ast.value.toString());
  },
});
