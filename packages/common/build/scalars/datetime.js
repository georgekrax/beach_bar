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
        return dayjs_1.default(value);
    },
    parseValue(value) {
        return dayjs_1.default(value);
    },
    parseLiteral(ast) {
        if (ast.kind === graphql_1.Kind.STRING) {
            return dayjs_1.default(ast.value);
        }
        return null;
    },
});
//# sourceMappingURL=datetime.js.map