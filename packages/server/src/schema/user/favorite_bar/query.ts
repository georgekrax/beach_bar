import { MyContext } from "@beach_bar/common";
import { UserFavoriteBar } from "entity/UserFavoriteBar";
import { extendType, intArg, nullable } from "nexus";
import { UserFavoriteBarType } from "./types";

export const UserFavoriteBarQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("favouriteBeachBars", {
      type: UserFavoriteBarType,
      description: "Get a user's favourite #beach_bars list",
      args: { limit: nullable(intArg({ description: "How many data to fetch?" })) },
      resolve: async (_, { limit }, { payload }: MyContext): Promise<UserFavoriteBar[]> => {
        if (!payload || !payload.sub) return [];

        const favouriteBeachBars = await UserFavoriteBar.find({
          where: { userId: payload!.sub },
          relations: [
            "user",
            "beachBar",
            "beachBar.location",
            "beachBar.location.country",
            "beachBar.location.city",
            "beachBar.location.region",
          ],
          take: limit ?? undefined,
        });
        return favouriteBeachBars;
      },
    });
  },
});
