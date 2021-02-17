import { objectType, unionType } from "nexus";
import { UserType } from "../user/types";

export const OAuthAuthorizationType = objectType({
  name: "OAuthAuthorization",
  description: "User info to be returned on Google OAuth authorization",
  definition(t) {
    t.string("accessToken", { description: "The JWT access token to be returned upon successful login" });
    t.boolean("signedUp", { description: "A boolean that indicates if the user has successfully signed up" });
    t.boolean("logined", { description: "A boolean that indicates if the user has successfully logined" });
    t.field("user", {
      type: UserType,
      description: "The user being authorized",
      resolve: o => o.user,
    });
  },
});

export const OAuthAuthorizationResult = unionType({
  name: "OAuthAuthorizationResult",
  definition(t) {
    t.members("OAuthAuthorization", "Error");
  },
  resolveType: item => {
    if (item.name === "Error") {
      return "Error";
    } else {
      return "OAuthAuthorization";
    }
  },
});
