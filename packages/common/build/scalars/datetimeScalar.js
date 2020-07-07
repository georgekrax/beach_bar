"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateTimeScalar = void 0;
const schema_1 = require("@nexus/schema");
const dayjs_1 = __importDefault(require("dayjs"));
const graphql_1 = require("graphql");
exports.DateTimeScalar = schema_1.scalarType({
    name: "DateTime",
    asNexusMethod: "datetime",
    description: "Use JavaScript Date object for date/time fields.",
    serialize(value) {
        let v = value;
        if (!(v instanceof Date) &&
            typeof v !== "string" &&
            typeof v !== "number") {
            throw new TypeError(`Value is not an instance of Date, Date string or number: ${JSON.stringify(v)}`);
        }
        if (typeof v === "string") {
            v = dayjs_1.default();
            v.setTime(Date.parse(value));
        }
        else if (typeof v === "number") {
            v = dayjs_1.default(v);
        }
        if (Number.isNaN(v.getTime())) {
            throw new TypeError(`Value is not a valid Date: ${JSON.stringify(v)}`);
        }
        return v.toJSON();
    },
    parseValue(value) {
        const date = dayjs_1.default(value);
        if (Number.isNaN(date.getTime())) {
            throw new TypeError(`Value is not a valid Date: ${value}`);
        }
        return date;
    },
    parseLiteral(ast) {
        if (ast.kind !== graphql_1.Kind.STRING && ast.kind !== graphql_1.Kind.INT) {
            throw new graphql_1.GraphQLError(`Can only parse strings & integers to dates but got a: ${ast.kind}`);
        }
        const result = dayjs_1.default(ast.kind === graphql_1.Kind.INT ? Number(ast.value) : ast.value);
        if (Number.isNaN(result.getTime())) {
            throw new graphql_1.GraphQLError(`Value is not a valid Date: ${ast.value}`);
        }
        return result;
    },
});
//# sourceMappingURL=datetimeScalar.js.map