import { EmailScalar } from "@georgekrax-hashtag/common";
import { inputObjectType, objectType, unionType } from "@nexus/schema";
import { BeachBarReviewType } from "../beach_bar/review/types";
import { UserAccountType } from "./account/types";
import { UserFavoriteBarType } from "./favorite_bar/types";

export const UserType = objectType({
  name: "User",
  description: "Represents a user",
  definition(t) {
    t.int("id", { nullable: false, description: "User's ID value" });
    t.field("email", { type: EmailScalar, nullable: false, description: "User's email address" });
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
    t.list.field("favoriteBars", {
      type: UserFavoriteBarType,
      description: "A list with all the user's favorite #beach_bars",
      nullable: true,
      resolve: o => o.favoriteBars,
    });
  },
});

export const UserResult = unionType({
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

export const UserSignUpResult = unionType({
  name: "UserSignUpResult",
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
    t.field("email", { type: EmailScalar, required: true, description: "Email of user to sign up" });
    t.string("password", { required: true, description: "Password of user" });
  },
});

export const UserLoginDetailsInput = inputObjectType({
  name: "UserLoginDetailsInput",
  description: "User details in login. The user's IP address is passed via the context",
  definition(t) {
    t.int("countryId", { required: false, description: "The ID of the country, user logins from" });
    t.int("cityId", { required: false, description: "The ID of the city, user logins from" });
  },
});

export const UserUpdateResult = unionType({
  name: "UserUpdateResult",
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
