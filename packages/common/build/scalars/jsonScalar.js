"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonScalar = void 0;
const schema_1 = require("@nexus/schema");
const graphql_1 = require("graphql");
function identity(value) {
    return value;
}
function parseObject(ast, variables) {
    const value = Object.create(null);
    ast.fields.forEach(field => {
        value[field.name.value] = parseLiteral(field.value, variables);
    });
    return value;
}
function parseLiteral(ast, variables) {
    switch (ast.kind) {
        case graphql_1.Kind.STRING:
        case graphql_1.Kind.BOOLEAN:
            return ast.value;
        case graphql_1.Kind.INT:
        case graphql_1.Kind.FLOAT:
            return parseFloat(ast.value);
        case graphql_1.Kind.OBJECT:
            return parseObject(ast, variables);
        case graphql_1.Kind.LIST:
            return ast.values.map(n => parseLiteral(n, variables));
        case graphql_1.Kind.NULL:
            return null;
        case graphql_1.Kind.VARIABLE: {
            const name = ast.name.value;
            return variables ? variables[name] : undefined;
        }
    }
}
exports.JsonScalar = schema_1.scalarType({
    name: "JSON",
    description: "The `JSON` scalar type represents JSON values as specified by ECMA-404",
    asNexusMethod: "json",
    serialize: identity,
    parseValue: identity,
    parseLiteral,
});
//# sourceMappingURL=jsonScalar.js.map