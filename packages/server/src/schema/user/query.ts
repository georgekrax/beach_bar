import { errors, MyContext } from "@beach_bar/common";
import { extendType } from "@nexus/schema";
import { User } from "entity/User";
import { ErrorType } from "typings/.index";
import { UserType } from "typings/user";
import { userInfoPayloadScope } from "utils/userInfoPayloadScope";
import { UserResult } from "./types";

export const UserQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("me", {
      type: UserResult,
      description: "Returns current authenticated user",
      resolve: async (_, __, { payload }: MyContext): Promise<UserType | ErrorType> => {
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
          relations: [
            "account",
            "account.contactDetails",
            "account.country",
            "account.country.currency",
            "account.city",
            "customer",
            "customer.reviews",
            "customer.reviews.beachBar",
            "customer.reviews.monthTime",
            "customer.reviews.visitType",
          ],
        });
        if (!user) {
          return {
            error: {
              code: errors.NOT_FOUND,
              message: errors.USER_NOT_FOUND_MESSAGE,
            },
          };
        }

        return userInfoPayloadScope(payload, user);
      },
    });
  },
});
