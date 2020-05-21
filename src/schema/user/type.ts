import { objectType, interfaceType, inputObjectType } from "@nexus/schema";

import { BigInt } from "../../common/bigIntScalar";

export const ErrorInterface = interfaceType({
  name: "ErrorInterface",
  description: "Adds error functionality ",
  definition(t) {
    t.string("error", { nullable: true });
    t.resolveType(() => null);
  },
});

export const UserInterface = interfaceType({
  name: "UserInterface",
  description: "Represents the basic info about a user",
  definition(t) {
    t.field("id", { type: BigInt, nullable: true }),
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
    t.implements(ErrorInterface);
  },
});

export const UserSignUpType = objectType({
  name: "UserSignUpType",
  description: "User info to be returned on sign up",
  definition(t) {
    t.implements(UserInterface);
    t.boolean("signedUp", { nullable: false });
    t.implements(ErrorInterface);
  },
});

export const UserLoginType = objectType({
  name: "UserLoginType",
  description: "User info to be returned on login",
  definition(t) {
    t.implements(UserInterface);
    t.boolean("logined", { nullable: false, description: "A boolean that indicates if the user has succefully logined" });
    t.string("accessToken", { nullable: true, description: "The JWT access token to be returned upon successfull login" });
    t.implements(ErrorInterface);
  },
});

export const UserLogoutType = objectType({
  name: "UserLogoutType",
  description: "Info to be returned on successfull user logout",
  definition(t) {
    t.boolean("loggedOut", { nullable: false, description: "A boolean that indicates if the user has succefully logged out" });
    t.implements(ErrorInterface);
  },
});

export const UserSignUpCredentialsInput = inputObjectType({
  name: "UserSignUpCredentialsInput",
  description: "Credential for signing up a user",
  definition(t) {
    t.string("email", { required: true, description: "Email of user to sign up" });
    t.string("password", { required: true, description: "Password of user" });
  },
});

export const UserLoginCredentialsInput = inputObjectType({
  name: "UserLoginCredentialsInput",
  description: "Credential for logging in a user",
  definition(t) {
    t.string("email", { required: false, description: "Email of user to login" });
    t.string("password", { required: true, description: "Password of user" });
  },
});
