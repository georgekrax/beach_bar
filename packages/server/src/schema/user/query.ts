import { getRedisKey } from "@/utils/db";
import { userInfoPayloadScope, UserInfoPayloadScopeInclude } from "@/utils/userInfoPayloadScope";
import { errors } from "@beach_bar/common";
import { ApolloError } from "apollo-server-express";
import { extendType } from "nexus";
import { UserType } from "./types";

export const UserQuery = extendType({
  type: "Query",
  definition(t) {
    t.string("accessToken", {
      resolve: async (_, __, { prisma, redis }) => {
        const user = await prisma.user.findUnique({ where: { id: 107 } });
        if (!user) return "";
        const scope = await redis.smembers(getRedisKey({ model: "User", id: user.id, scope: true }));
        return scope[0];
        // return generateAccessToken(user, scope, { expiresIn: "14 days" }).token;
      },
    });
    // testing Prisma
    t.nullable.field("account", {
      type: "Account",
      // authorize: () => {
      // return false;
      // },
      resolve: async (_, __, { prisma }) => {
        const users = await prisma.account.findFirst({
          where: { userId: 107 },
          include: { user: true },
        });
        return users;
      },
    });
    t.nullable.field("me", {
      type: UserType,
      description: "Returns current authenticated user",
      resolve: async (_, __, { prisma, payload }) => {
        if (!payload) return null;
        if (
          !payload.scope.some(scope => ["profile", "beach_bar@crud:user", "beach_bar@read:user"].includes(scope)) ||
          !payload.scope.includes("email")
        ) {
          throw new ApolloError("You are not allowed to access this user's info", errors.UNAUTHORIZED_CODE);
        }

        const user = await prisma.user.findUnique({ where: { id: payload.sub }, include: UserInfoPayloadScopeInclude });
        if (!user) return null;

        return userInfoPayloadScope(payload, user);
      },
    });
  },
});
