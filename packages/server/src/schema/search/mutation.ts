import { MyContext } from "@beach_bar/common";
import { extendType, idArg, stringArg } from "@nexus/schema";
import { In } from "typeorm";
import arrEquals from "@utils/arrEquals";
import { UserSearchType } from "./types";
import { UserSearch } from "@entity/UserSearch";
import { SearchFilter } from "@entity/SearchFilter";

export const SearchUpdateMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("updateSearch", {
      type: UserSearchType,
      description: "Update a previous user's search",
      nullable: true,
      args: {
        searchId: idArg({
          required: true,
          description: "The ID value of a previous user search",
        }),
        filterIds: stringArg({
          required: false,
          list: true,
          description: "A list with the filter IDs to add in the search, found in the documentation",
        }),
      },
      resolve: async (_, { searchId, filterIds }, { payload, redis }: MyContext): Promise<UserSearch | null> => {
        if (!searchId || searchId <= 0) {
          return null;
        }

        const userSearch = await UserSearch.findOne({ where: { id: searchId }, relations: ["filters"] });
        if (!userSearch) {
          return null;
        }

        if (
          (userSearch.filters &&
            !arrEquals(
              filterIds,
              userSearch.filters.map(filter => filter.publicId)
            )) ||
          filterIds.length === 0 ||
          // @ts-ignore
          userSearch.filters?.length === 0
        ) {
          if (filterIds) {
            const filters = await SearchFilter.find({ publicId: In(filterIds) });
            userSearch.filters = filters;
          } else {
            userSearch.filters = [];
          }
          try {
            await userSearch.save();
            const idx = await userSearch.getRedisIdx(redis, payload ? payload.sub : undefined);
            await redis.lset(userSearch.getRedisKey(payload ? payload.sub : undefined), idx, JSON.stringify(userSearch));
          } catch (err) {
            return null;
          }
        }

        return userSearch;
      },
    });
  },
});
