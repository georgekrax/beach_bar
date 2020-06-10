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
        if (!payload.scope.some(scope => ["profile", "crud:user"].includes(scope)) || !payload.scope.includes("email")) {
          return {
            error: {
              code: errors.UNAUTHORIZED_CODE,
              message: "You are not allowed to access 'this' user's info",
            },
          };
        }

        const user = await User.findOne({
          where: { id: payload.sub },
          relations: ["owner", "owner.user", "owner.beachBars", "reviews", "reviews.visitType"],
        });
        if (!user) {
          return {
            error: {
              code: errors.NOT_FOUND,
              message: "User does not exist",
            },
          };
        }

        console.log(user);

        return user;
      },
    });
  },
});
