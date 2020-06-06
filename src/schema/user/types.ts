import { objectType, interfaceType, inputObjectType } from "@nexus/schema";

import { ErrorInterface } from "../../common/errorInterface";

export const UserAccountType = objectType({
  name: "UserAccountType",
  description: "Represents a user's account",
  definition(t) {
    // @ts-ignore
    t.bigint("id", { nullable: false }),
      // @ts-ignore
      t.bigint("userId", { nullable: false }),
      t.string("personTitle", { nullable: true }),
      t.string("imgUrl", { nullable: true }),
      t.string("birthday", { nullable: true }),
      t.int("age", { nullable: true }),
      t.boolean("isActive", { nullable: false });
  },
});

export const UserInterface = interfaceType({
  name: "UserInterface",
  description: "Represents the basic info about a user",
  definition(t) {
    // @ts-ignore
    t.bigint("id", { nullable: true }),
      // @ts-ignore
      t.email("email", { nullable: true }),
      t.field("account", {
        type: UserAccountType,
        nullable: true,
        resolve: o => {
          return o.account;
        },
      });
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
    t.boolean("signedUp", { nullable: false, description: "A boolean that indicates if the user has succefully signed up" });
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
    // @ts-ignore
    t.email("email", { required: true, description: "Email of user to sign up" });
    t.string("password", { required: true, description: "Password of user" });
  },
});

export const UserLoginCredentialsInput = inputObjectType({
  name: "UserLoginCredentialsInput",
  description: "Credential for logging in a user",
  definition(t) {
    // @ts-ignore
    t.email("email", { required: false, description: "Email of user to login" });
    t.string("password", { required: true, description: "Password of user" });
  },
});
