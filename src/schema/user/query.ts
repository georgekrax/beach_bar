import { extendType } from "@nexus/schema";
import { MyContext } from "../../common/myContext";
import errors from "../../constants/errors";
import { ErrorType } from "../returnTypes";
import { User } from "./../../entity/User";
import { UserTypeResult } from "./types";

export const UsersQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("me", {
      type: UserTypeResult,
      description: "Returns current authenticated user",
      resolve: async (_, __, { payload }: MyContext): Promise<User | ErrorType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (
          !payload.scope.some(scope => ["profile", "beach_bar@crud:user", "beach_bar@read:user"].includes(scope)) ||
          !payload.scope.includes("email")
        ) {
          return {
            error: {
              code: errors.UNAUTHORIZED_CODE,
              message: "You are not allowed to access 'this' user's info",
            },
          };
        }

        const user = await User.findOne({
          where: { id: payload.sub },
          relations: ["account", "owner", "owner.user", "owner.beachBars", "reviews", "reviews.visitType"],
        });
        if (!user) {
          return {
            error: {
              code: errors.NOT_FOUND,
              message: "User does not exist",
            },
          };
        }

        // @ts-ignore
        user.account = payload.scope.some(scope => ["beach_bar@crud:user", "beach_bar@read:user_account"].includes(scope))
          ? user.account
          : null;
        // @ts-ignore
        user.account.birthday = payload.scope.some(scope =>
          ["beach_bar@crud:user", "beach_bar@read:user_account:birthday_and_age"].includes(scope),
        )
          ? user.account.birthday
          : null;
        // @ts-ignore
        user.account.age = payload.scope.some(scope =>
          ["beach_bar@crud:user", "beach_bar@read:user_account:birthday_and_age"].includes(scope),
        )
          ? user.account.age
          : null;
        // @ts-ignore
        user.account.personTitle = payload.scope.some(scope =>
          ["beach_bar@crud:user", "beach_bar@read:user_account:person_title"].includes(scope),
        )
          ? user.account.personTitle
          : null;
        // @ts-ignore
        user.account.contactDetails = payload.scope.some(scope =>
          ["beach_bar@crud:user", "beach_bar@read:user_contact_details"].includes(scope),
        )
          ? user.account.contactDetails
          : null;

        return user;
      },
    });
  },
});
