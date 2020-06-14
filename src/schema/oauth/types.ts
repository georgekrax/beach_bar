import { objectType, unionType } from "@nexus/schema";
import { UserType } from "../user/types";

export const GoogleOAuthUserType = objectType({
  name: "GoogleOAuthUser",
  description: "User info to be returned on Google OAuth authorization",
  definition(t) {
    t.string("accessToken", { nullable: false, description: "The JWT access token to be returned upon successfull login" });
    t.boolean("signedUp", { nullable: false, description: "A boolean that indicates if the user has succefully signed up" });
    t.boolean("logined", { nullable: false, description: "A boolean that indicates if the user has succefully logined" });
    t.field("user", {
      type: UserType,
      description: "The user being authorized",
      nullable: false,
      resolve: o => o.user,
    });
  },
});

export const GoogleOAuthUserResult = unionType({
  name: "GoogleOAuthUserResult",
  definition(t) {
    t.members("GoogleOAuthUser", "Error");
    t.resolveType(item => {
      if (item.error) {
        return "Error";
      } else {
        return "GoogleOAuthUser";
      }
    });
  },
});
