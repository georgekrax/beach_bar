import { scalarType } from "@nexus/schema";
import { Kind, ObjectValueNode, ValueNode } from "graphql";

function identity<T>(value: T): T {
  return value;
}

function parseObject(ast: ObjectValueNode, variables: any): any {
  const value = Object.create(null);
  ast.fields.forEach(field => {
    // eslint-disable-next-line no-use-before-define
    value[field.name.value] = parseLiteral(field.value, variables);
  });

  return value;
}

function parseLiteral(ast: ValueNode, variables: any): any {
  switch (ast.kind) {
    case Kind.STRING:
    case Kind.BOOLEAN:
      return ast.value;
    case Kind.INT:
    case Kind.FLOAT:
      return parseFloat(ast.value);
    case Kind.OBJECT:
      return parseObject(ast, variables);
    case Kind.LIST:
      return ast.values.map(n => parseLiteral(n, variables));
    case Kind.NULL:
      return null;
    case Kind.VARIABLE: {
      const name = ast.name.value;
      return variables ? variables[name] : undefined;
    }
  }
}

export const JSONScalar = scalarType({
  name: "JSON",
  description: "The `JSON` scalar type represents JSON values as specified by ECMA-404",
  asNexusMethod: "json",
  serialize: identity,
  parseValue: identity,
  parseLiteral,
});
