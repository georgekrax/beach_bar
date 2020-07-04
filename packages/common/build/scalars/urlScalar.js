"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlScalar = void 0;
const schema_1 = require("@nexus/schema");
const graphql_1 = require("graphql");
const url_1 = require("url");
exports.UrlScalar = schema_1.scalarType({
    name: "URL",
    asNexusMethod: "url",
    description: "A field whose value conforms to the standard URL format as specified in RFC3986: https://www.ietf.org/rfc/rfc3986.txt.",
    serialize(value) {
        return new url_1.URL(value.toString()).toString();
    },
    parseValue(value) {
        return new url_1.URL(value.toString());
    },
    parseLiteral(ast) {
        if (ast.kind !== graphql_1.Kind.STRING) {
            throw new graphql_1.GraphQLError(`Can only validate strings as URLs but got a: ${ast.kind}`);
        }
        return new url_1.URL(ast.value.toString());
    },
});
//# sourceMappingURL=urlScalar.js.map