import { inputObjectType, objectType, unionType } from "@nexus/schema";
import { BeachBarReviewType } from "../beach_bar/reviewTypes";
import { UserAccountType } from "./accountTypes";

export const UserType = objectType({
  name: "User",
  description: "Represents a user",
  definition(t) {
    t.int("id", { nullable: false, description: "User's ID value" });
    // @ts-ignore
    t.email("email", { nullable: false, description: "User's email address" });
    t.string("username", { nullable: true, description: "Username of the user. It can be null" });
    t.string("firstName", { nullable: true, description: "User's first (given) name" });
    t.string("lastName", { nullable: true, description: "User's last (family) name" });
    t.field("account", {
      type: UserAccountType,
      description: "User's account info",
      nullable: true,
      resolve: o => o.account,
    });
    t.list.field("reviews", {
      type: BeachBarReviewType,
      description: "A user's review on a #beach_bar",
      nullable: true,
      resolve: o => o.reviews,
    });
  },
});

export const UserTypeResult = unionType({
  name: "UserTypeResult",
  definition(t) {
    t.members("User", "Error");
    t.resolveType(item => {
      if (item.error) {
        return "Error";
      } else {
        return "User";
      }
    });
  },
});

export const UserSignUpType = objectType({
  name: "UserSignUp",
  description: "User info to be returned on user sign up",
  definition(t) {
    t.field("user", {
      type: UserType,
      description: "The user that signs up",
      nullable: false,
      resolve: o => o.user,
    });
    t.boolean("added", { nullable: false, description: "A boolean that indicates if the user has succefully signed up" });
  },
});

export const UserSignUpResult = unionType({
  name: "UserSignUpResult",
  definition(t) {
    t.members("UserSignUp", "Error");
    t.resolveType(item => {
      if (item.error) {
        return "Error";
      } else {
        return "UserSignUp";
      }
    });
  },
});

export const UserLoginType = objectType({
  name: "UserLogin",
  description: "User info to be returned on login",
  definition(t) {
    t.field("user", {
      type: UserType,
      description: "The user (object) that logins",
      nullable: false,
      resolve: o => o.user,
    });
    t.string("accessToken", { nullable: false, description: "The access token to authenticate & authorize the user" });
    t.boolean("success", { nullable: false, description: "A boolean that indicates if the user has succefully logined" });
  },
});

export const UserLoginResult = unionType({
  name: "UserLoginResult",
  definition(t) {
    t.members("UserLogin", "Error");
    t.resolveType(item => {
      if (item.error) {
        return "Error";
      } else {
        return "UserLogin";
      }
    });
  },
});

export const UserCredentialsInput = inputObjectType({
  name: "UserCredentialsInput",
  description: "Credentials of user to sign up / login",
  definition(t) {
    // @ts-ignore
    t.email("email", { required: true, description: "Email of user to sign up" });
    t.string("password", { required: true, description: "Password of user" });
  },
});

export const UserLoginDetailsInput = inputObjectType({
  name: "UserLoginDetailsInput",
  description: "User details in login",
  definition(t) {
    t.string("country", { required: false, description: "Country from where user logins" });
    t.string("city", { required: false, description: "City from where user logins" });
    // @ts-ignore
    t.ipV4("ipAddr", { required: false, description: "Internet Protocol (IP) address of user to login" });
  },
});

export const UserUpdateType = objectType({
  name: "UserUpdate",
  description: "User info to be returned when user is updated",
  definition(t) {
    t.field("user", {
      type: UserType,
      description: "The user (object) that is updated",
      nullable: false,
      resolve: o => o.user,
    });
    t.boolean("updated", { nullable: false, description: "A boolean that indicates if the user has been succefully updated" });
  },
});

export const UserUpdateResult = unionType({
  name: "UserUpdateResult",
  definition(t) {
    t.members("UserUpdate", "Error");
    t.resolveType(item => {
      if (item.error) {
        return "Error";
      } else {
        return "UserUpdate";
      }
    });
  },
});

export const UserForgotPasswordType = objectType({
  name: "UserForgotPassword",
  description: "User info to be returned when the user resets his / her password",
  definition(t) {
    t.field("user", {
      type: UserType,
      description: "The user that resets his / her password",
      nullable: false,
      resolve: o => o.user,
    });
    t.boolean("success", {
      nullable: false,
      description: "A boolean that indicates if the user has successfully reseted his / her password",
    });
  },
});

export const UserForgotPasswordResult = unionType({
  name: "UserUpdatePasswordResult",
  definition(t) {
    t.members("UserForgotPassword", "Error");
    t.resolveType(item => {
      if (item.error) {
        return "Error";
      } else {
        return "UserForgotPassword";
      }
    });
  },
});
