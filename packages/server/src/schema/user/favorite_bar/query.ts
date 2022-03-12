import { extendType, intArg, nullable } from "nexus";
import { UserFavoriteBarType } from "./types";

export const UserFavoriteBarQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("favouriteBeachBars", {
      type: UserFavoriteBarType,
      description: "Get a user's favourite #beach_bars list",
      args: { limit: nullable(intArg({ description: "How many data to fetch?" })) },
      resolve: async (_, { limit }, { prisma, payload }) => {
        if (!payload?.sub) return [];

        return await prisma.userFavoriteBar.findMany({ where: { userId: payload.sub }, take: limit ?? undefined });
      },
    });
  },
});
