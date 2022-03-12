import { isAuth, throwScopesUnauthorized } from "@/utils/auth";
import { getRedisKey } from "@/utils/db";
import { errors } from "@beach_bar/common";
import { BeachBar } from "@prisma/client";
import { ApolloError } from "apollo-server-express";
import { extendType, idArg } from "nexus";
import { UserFavoriteBarType } from "./types";

export const UserFavoriteBarCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("updateFavouriteBeachBar", {
      type: UserFavoriteBarType,
      description: "Update a user's #beach_bar favourites list",
      args: { slug: idArg({ description: "The slug of the #beach_bar, to add / remove from the user's favourites list" }) },
      resolve: async (_, { slug }, { prisma, redis, payload }) => {
        isAuth(payload);
        throwScopesUnauthorized(payload, errors.NOT_AUTHENTICATED_MESSAGE, ["beach_bar@crud:user"]);

        const userId = payload!.sub;
        const user = await prisma.user.findUnique({
          where: { id: userId },
          include: { favoriteBars: { include: { beachBar: true } } },
        });
        if (!user) throw new ApolloError(errors.USER_NOT_FOUND_MESSAGE, errors.NOT_FOUND);

        const beachBars: BeachBar[] = (await redis.lrange(getRedisKey({ model: "BeachBar" }), 0, -1)).map((x: string) =>
          JSON.parse(x)
        );
        const beachBar = beachBars.find(bar => bar.slug.toString() === slug);
        if (!beachBar) throw new ApolloError(errors.BEACH_BAR_DOES_NOT_EXIST, errors.NOT_FOUND);

        try {
          let favouriteBar = user.favoriteBars?.find(({ beachBar }) => beachBar.slug.toString() === slug.toString());
          if (favouriteBar) await prisma.userFavoriteBar.delete({ where: { id: favouriteBar.id } });
          else {
            favouriteBar = await prisma.userFavoriteBar.create({
              data: { userId, beachBarId: beachBar.id },
              include: { beachBar: true },
            });
          }
          if (!favouriteBar) throw new ApolloError(errors.SOMETHING_WENT_WRONG);
          return favouriteBar;
        } catch (err) {
          throw new ApolloError(err.message);
        }
      },
    });
    t.boolean("deleteUserFavoriteBar", {
      description: "Remove a #beach_bar from a user's favorites list",
      args: { beachBarId: idArg({ description: "The ID value of the #beach_bar, to add to the user's favorites list" }) },
      deprecation:
        "You should use the `updateUserFavoriteBar` mutation operation, which handles automatically the creation and removement of a user's #beach_bar",
      resolve: async (_, __, { payload }) => {
        isAuth(payload);
        throwScopesUnauthorized(payload, errors.NOT_AUTHENTICATED_MESSAGE, ["beach_bar@crud:user"]);

        // const favoriteBar = await prisma.userFavoriteBar.findFirst({ where: { beachBarId: +beachBarId, userId: payload!.sub } });

        // const favoriteBar = await UserFavoriteBar.findOne({ beachBarId: beachBarId, userId: payload!.sub });
        // if (!favoriteBar) throw new ApolloError("Favorite #beach_bar not found", errors.NOT_FOUND);

        try {
          // TODO: Fix
          // await favoriteBar.softRemove();
        } catch (err) {
          throw new ApolloError(errors.SOMETHING_WENT_WRONG + " " + err.message, errors.SOMETHING_WENT_WRONG);
        }

        return true;
      },
    });
  },
});
