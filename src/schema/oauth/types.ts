import { objectType } from "@nexus/schema";

import { UserInterface } from "../user/types";
import { ErrorInterface } from "../../common/errorInterface";

export const GoogleOAuthUserType = objectType({
  name: "GoogleOAuthUserType",
  description: "User info to be returned on Google OAuth authorization",
  definition(t) {
    t.implements(UserInterface);
    t.string("accessToken", { nullable: true, description: "The JWT access token to be returned upon successfull login" });
    t.boolean("signedUp", { nullable: false, description: "A boolean that indicates if the user has succefully signed up" });
    t.boolean("logined", { nullable: false, description: "A boolean that indicates if the user has succefully logined" });
    t.implements(ErrorInterface);
  },
});
