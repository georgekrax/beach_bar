import { extendType } from "@nexus/schema";
import { MyContext } from "../../common/myContext";
import errors from "../../constants/errors";
import { ErrorType } from "../returnTypes";
import { User } from "./../../entity/User";
import { UserTypeResult } from "./userTypes";

export const UsersQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("me", {
      type: UserTypeResult,
      description: "Returns current authenticated user",
      resolve: async (_, __, { payload }: MyContext): Promise<User | ErrorType> => {
        if (!payload || !payload.sub) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }

        const user = await User.findOne({
          where: { id: payload.sub },
          relations: ["owner", "accounts", "accounts.contactDetails", "accounts.user", "owner.user", "owner.beachBars"],
        });

        if (!user) {
          return {
            error: {
              code: errors.NOT_FOUND,
              message: "User does not exist",
            },
          };
        }
        if (payload.sub !== user.id) {
          return {
            error: {
              code: errors.UNAUTHORIZED_CODE,
              message: "You are not allowed to access 'this' user's info",
            },
          };
        }

        return user;
      },
    });
  },
});
