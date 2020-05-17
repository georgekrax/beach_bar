import { objectType, interfaceType, inputObjectType, scalarType } from "@nexus/schema";
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

export const BigInt = scalarType({
  name: "BigInt",
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

export const UserInterface = interfaceType({
  name: "UserInterface",
  description: "Represents the basic info about a user",
  definition(t) {
    t.field("id", { type: BigInt, nullable: true }),
      t.string("username", { nullable: false }),
      t.string("email", { nullable: false }),
      t.field("accountId", { type: BigInt, nullable: true });
    t.resolveType(() => null);
  },
});

export const UserType = objectType({
  name: "UserType",
  description: "Represents a user",
  definition(t) {
    t.implements(UserInterface);
    t.string("firstName", { nullable: true });
    t.string("lastName", { nullable: true });
  },
});

export const UserSignUpType = objectType({
  name: "UserSignUpType",
  description: "User info to be returned on sign up",
  definition(t) {
    t.implements(UserInterface);
    t.boolean("signedUp", { nullable: false });
  },
});

export const UserSignUpCredentialsInput = inputObjectType({
  name: "UserSignUpCredentialsInput",
  description: "Credential for signing up a user",
  definition(t) {
    t.string("email", { required: true, description: "Email of user to sign up" });
    t.string("username", { required: true, description: "Username of user to sign up" });
    t.string("password", { required: true, description: "Password of user" });
  },
});

export const UserLoginCredentialsInput = inputObjectType({
  name: "UserLoginCredentialsInput",
  description: "Credential for logging in a user",
  definition(t) {
    t.string("email", { required: false, description: "Email of user to login" });
    t.string("username", { required: false, description: "Username of user to login" });
    t.string("password", { required: true, description: "Password of user" });
  },
});

export const UserLoginType = objectType({
  name: "UserLoginType",
  description: "User info to be returned on login",
  definition(t) {
    t.implements(UserInterface);
    t.boolean("logined", { nullable: false, description: "A boolean that indicates if the user succefully logined" });
  },
});
