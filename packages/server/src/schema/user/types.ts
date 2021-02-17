import { EmailScalar } from "@the_hashtag/common/dist/graphql";
import { inputObjectType, objectType, unionType } from "nexus";
import { BeachBarReviewType } from "../beach_bar/review/types";
import { UserAccountType } from "./account/types";
import { UserFavoriteBarType } from "./favorite_bar/types";

export const UserType = objectType({
  name: "User",
  description: "Represents a user",
  definition(t) {
    t.id("id", { description: "User's ID value" });
    t.field("email", { type: EmailScalar, description: "User's email address" });
    t.nullable.string("firstName", { description: "User's first (given) name" });
    t.nullable.string("lastName", { description: "User's last (family) name" });
    t.nullable.field("account", {
      type: UserAccountType,
      description: "User's account info",
      resolve: o => o.account,
    });
    t.nullable.list.field("reviews", {
      type: BeachBarReviewType,
      description: "A user's review on a #beach_bar",
      resolve: o => o.reviews,
    });
    t.nullable.list.field("favoriteBars", {
      type: UserFavoriteBarType,
      description: "A list with all the user's favorite #beach_bars",
      resolve: o => o.favoriteBars,
    });
  },
});

export const UserResult = unionType({
  name: "UserTypeResult",
  definition(t) {
    t.members("User", "Error");
  },
  resolveType: item => {
    if (item.name === "Error") {
      return "Error";
    } else {
      return "User";
    }
  },
});

export const UserSignUpResult = unionType({
  name: "UserSignUpResult",
  definition(t) {
    t.members("User", "Error");
  },
  resolveType: item => {
    if (item.name === "Error") {
      return "Error";
    } else {
      return "User";
    }
  },
});

export const UserLoginType = objectType({
  name: "UserLogin",
  description: "User info to be returned on login",
  definition(t) {
    t.field("user", {
      type: UserType,
      description: "The user (object) that logins",
      resolve: o => o.user,
    });
    t.string("accessToken", { description: "The access token to authenticate & authorize the user" });
  },
});

export const UserLoginResult = unionType({
  name: "UserLoginResult",
  definition(t) {
    t.members("UserLogin", "Error");
  },
  resolveType: item => {
    if (item.name === "Error") {
      return "Error";
    } else {
      return "UserLogin";
    }
  },
});

export const UserCredentialsInput = inputObjectType({
  name: "UserCredentialsInput",
  description: "Credentials of user to sign up / login",
  definition(t) {
    t.field("email", { type: EmailScalar, description: "Email of user to sign up" });
    t.string("password", { description: "Password of user" });
  },
});

export const UserLoginDetailsInput = inputObjectType({
  name: "UserLoginDetailsInput",
  description: "User details in login. The user's IP address is passed via the context",
  definition(t) {
    t.int("countryId", { description: "The ID of the country, user logins from" });
    t.int("cityId", { description: "The ID of the city, user logins from" });
  },
});

export const UserUpdateResult = unionType({
  name: "UserUpdateResult",
  definition(t) {
    t.members("User", "Error");
  },
  resolveType: item => {
    if (item.name === "Error") {
      return "Error";
    } else {
      return "User";
    }
  },
});
