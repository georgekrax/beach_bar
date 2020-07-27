"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BigIntScalar = void 0;
const schema_1 = require("@nexus/schema");
const kinds_1 = require("graphql/language/kinds");
const MAX_INT = Number.MAX_SAFE_INTEGER;
const MIN_INT = Number.MIN_SAFE_INTEGER;
function coerceBigInt(value) {
    if (value === "") {
        throw new TypeError("BigInt cannot represent non 53-bit signed integer value: (empty string)");
    }
    const num = Number(value);
    if (num !== num || num > MAX_INT || num < MIN_INT) {
        throw new TypeError("BigInt cannot represent non 53-bit signed integer value: " + String(value));
    }
    const int = Math.floor(num);
    if (int !== num) {
        throw new TypeError("BigInt cannot represent non-integer value: " + String(value));
    }
    return int;
}
exports.BigIntScalar = schema_1.scalarType({
    name: "BigInt",
    asNexusMethod: "bigint",
    serialize(value) {
        return coerceBigInt(value);
    },
    parseValue(value) {
        return coerceBigInt(value);
    },
    parseLiteral(ast) {
        if (ast.kind === kinds_1.Kind.INT) {
            const num = parseInt(ast.value, 10);
            if (num <= MAX_INT && num >= MIN_INT) {
                return num;
            }
        }
        return null;
    },
});
//# sourceMappingURL=bigInt.js.map