import { errors, MyContext } from "@beach_bar/common";
import redisKeys from "constants/redisKeys";
import { BeachBar } from "entity/BeachBar";
import { User } from "entity/User";
import { UserFavoriteBar } from "entity/UserFavoriteBar";
import { extendType, intArg } from "nexus";
import { DeleteResult } from "schema/types";
import { DeleteType } from "typings/.index";
import { AddUserFavoriteBarType } from "typings/user/favoriteBars";
import { checkScopes } from "utils/checkScopes";
import { AddUserFavoriteBarResult } from "./types";

export const UserFavoriteBarCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addUserFavoriteBar", {
      type: AddUserFavoriteBarResult,
      description: "Add a #beach_bar to user's favorites list",
      args: {
        beachBarId: intArg({ description: "The ID value of the #beach_bar, to add to the user's favorites list" }),
      },
      resolve: async (_, { beachBarId }, { payload, redis }: MyContext): Promise<AddUserFavoriteBarType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (!checkScopes(payload, ["beach_bar@crud:user"])) {
          return {
            error: { code: errors.UNAUTHORIZED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE },
          };
        }

        const user = await User.findOne(payload.sub);
        if (!user) {
          return { error: { code: errors.CONFLICT, message: errors.SOMETHING_WENT_WRONG } };
        }

        const beachBars: BeachBar[] = (await redis.lrange(redisKeys.BEACH_BAR_CACHE_KEY, 0, -1)).map((x: string) => JSON.parse(x));
        const beachBar = beachBars.find(bar => String(bar.id) === String(beachBarId));
        if (!beachBar) {
          return { error: { code: errors.CONFLICT, message: errors.SOMETHING_WENT_WRONG } };
        }

        const newFavoriteBar = UserFavoriteBar.create({
          beachBar,
          user,
        });

        try {
          await newFavoriteBar.save();
        } catch (err) {
          return { error: { message: `${errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
        }

        return {
          favoriteBar: newFavoriteBar,
          added: true,
        };
      },
    });
    t.field("deleteUserFavoriteBar", {
      type: DeleteResult,
      description: "Remove a #beach_bar from a user's favorites list",
      args: {
        beachBarId: intArg({ description: "The ID value of the #beach_bar, to add to the user's favorites list" }),
      },
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
