"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateScalar = void 0;
const schema_1 = require("@nexus/schema");
const graphql_1 = require("graphql");
exports.DateScalar = schema_1.scalarType({
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
        if (ast.kind === graphql_1.Kind.STRING) {
            return new Date(ast.value);
        }
        return null;
    },
});
//# sourceMappingURL=dateScalar.js.map