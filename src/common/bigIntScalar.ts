import { scalarType } from "@nexus/schema";
import { Kind } from "graphql/language/kinds";

const MAX_INT = Number.MAX_SAFE_INTEGER;
const MIN_INT = Number.MIN_SAFE_INTEGER;

function coerceBigInt(value: any): any {
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

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

export const BigIntScalar = scalarType({
  name: "BigInt",
  asNexusMethod: "bigint",
  serialize(value) {
    return coerceBigInt(value);
  },
  parseValue(value) {
    return coerceBigInt(value);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      const num = parseInt(ast.value, 10);
      if (num <= MAX_INT && num >= MIN_INT) {
        return num;
      }
    }
    return null;
  },
});
