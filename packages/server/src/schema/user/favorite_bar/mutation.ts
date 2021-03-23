import { errors, MyContext } from "@beach_bar/common";
import { ApolloError } from "apollo-server-express";
import redisKeys from "constants/redisKeys";
import { BeachBar } from "entity/BeachBar";
import { User } from "entity/User";
import { UserFavoriteBar } from "entity/UserFavoriteBar";
import { extendType, idArg, intArg } from "nexus";
import { DeleteResult } from "schema/types";
import { DeleteType } from "typings/.index";
import { TUpdateUserFavoriteBarType } from "typings/user/favoriteBars";
import { checkScopes } from "utils/checkScopes";
import { UpdateUserFavoriteBarType } from "./types";

export const UserFavoriteBarCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("updateFavouriteBeachBar", {
      type: UpdateUserFavoriteBarType,
      description: "Update a user's #beach_bar favourites list",
      args: { beachBarId: idArg({ description: "The ID value of the #beach_bar, to add / remove from the user's favourites list" }) },
      resolve: async (_, { beachBarId }, { payload, redis }: MyContext): Promise<TUpdateUserFavoriteBarType> => {
        if (!payload || !payload.sub) throw new ApolloError(errors.NOT_AUTHENTICATED_MESSAGE, errors.NOT_AUTHENTICATED_CODE);
        if (!checkScopes(payload, ["beach_bar@crud:user"]))
          throw new ApolloError(errors.NOT_AUTHENTICATED_MESSAGE, errors.UNAUTHORIZED_CODE);

        const user = await User.findOne({
          where: { id: payload.sub },
          withDeleted: true,
          relations: ["favoriteBars", "favoriteBars.user", "favoriteBars.beachBar"],
        });
        if (!user) throw new ApolloError(errors.USER_NOT_FOUND_MESSAGE, errors.NOT_FOUND);

        const beachBars: BeachBar[] = (await redis.lrange(redisKeys.BEACH_BAR_CACHE_KEY, 0, -1)).map((x: string) => JSON.parse(x));
        const beachBar = beachBars.find(bar => String(bar.id) === String(beachBarId));
        if (!beachBar) throw new ApolloError(errors.BEACH_BAR_DOES_NOT_EXIST, errors.NOT_FOUND);

        try {
          let favouriteBar = user.favoriteBars?.find(bar => bar.beachBarId.toString() === beachBarId.toString());
          if (!favouriteBar) {
            favouriteBar = UserFavoriteBar.create({
              beachBar,
              user,
            });
            await favouriteBar.save();
          } else await favouriteBar.softRemove();
          if (!favouriteBar) throw new ApolloError(errors.SOMETHING_WENT_WRONG);
          return {
            favouriteBar,
            updated: true,
          };
        } catch (err) {
          throw new ApolloError(errors.SOMETHING_WENT_WRONG + ": " + err.message);
        }
      },
    });
    t.field("deleteUserFavoriteBar", {
      type: DeleteResult,
      description: "Remove a #beach_bar from a user's favorites list",
      args: {
        beachBarId: intArg({ description: "The ID value of the #beach_bar, to add to the user's favorites list" }),
      },
      deprecation:
        "You should use the `updateUserFavoriteBar` mutation operation, which handles automatically the creation and removement of a user's #beach_bar",
      resolve: async (_, { beachBarId }, { payload }: MyContext): Promise<DeleteType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (!checkScopes(payload, ["beach_bar@crud:user"])) {
          return {
            error: { code: errors.UNAUTHORIZED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE },
          };
        }

        const favoriteBar = await UserFavoriteBar.findOne({ beachBarId: beachBarId, userId: payload.sub });
        if (!favoriteBar) {
          return { error: { code: errors.CONFLICT, message: errors.SOMETHING_WENT_WRONG } };
        }

        try {
          await favoriteBar.softRemove();
        } catch (err) {
          return { error: { message: `${errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
        }

        return {
          deleted: true,
        };
      },
    });
  },
});
