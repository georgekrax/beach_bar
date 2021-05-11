import { errors, MyContext } from "@beach_bar/common";
import { ApolloError } from "apollo-server-express";
import redisKeys from "constants/redisKeys";
import { User } from "entity/User";
import { extendType } from "nexus";
import { TUser } from "typings/user";
import { generateAccessToken } from "utils/auth/generateAuthTokens";
import { userInfoPayloadScope } from "utils/userInfoPayloadScope";
import { UserType } from "./types";

export const UserQuery = extendType({
  type: "Query",
  definition(t) {
    t.string("accessToken", {
      resolve: async (_, __, { redis }) => {
        const user = await User.findOne(107);
        if (!user) return "";
        const scope = await redis.smembers((redisKeys.USER + ":" + user.id + ":" + redisKeys.USER_SCOPE) as KeyType);
        return generateAccessToken(user, scope, { expiresIn: "14 days" }).token;
      },
    });
    t.nullable.field("me", {
      type: UserType,
      description: "Returns current authenticated user",
      resolve: async (_, __, { payload }: MyContext): Promise<TUser | null> => {
        if (!payload) return null;
        if (
          !payload.scope.some(scope => ["profile", "beach_bar@crud:user", "beach_bar@read:user"].includes(scope)) ||
          !payload.scope.includes("email")
        )
          throw new ApolloError("You are not allowed to access this user's info", errors.UNAUTHORIZED_CODE);

        const user = await User.findOne({
          where: { id: payload.sub },
          relations: [
            "account",
            "account.country",
            "account.country.currency",
            "customer",
            "customer.reviews",
            "customer.reviews.beachBar",
            "customer.reviews.month",
            "customer.reviews.visitType",
            "reviewVotes",
            "reviewVotes.type",
            "reviewVotes.review",
            "reviewVotes.user",
            "favoriteBars",
            "favoriteBars.beachBar",
            "favoriteBars.beachBar.location",
            "favoriteBars.beachBar.location.country",
            "favoriteBars.beachBar.location.city",
            "favoriteBars.beachBar.location.region",
          ],
        });
        if (!user) return null;

        return userInfoPayloadScope(payload, user);
      },
    });
  },
});
