import { MyContext } from "@beach_bar/common";
import { SearchFilter } from "entity/SearchFilter";
import { UserSearch } from "entity/UserSearch";
import { extendType, idArg, list, nullable, stringArg } from "nexus";
import { In } from "typeorm";
import arrEquals from "utils/arrEquals";
import { UserSearchType } from "./types";

export const SearchUpdateMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nullable.field("updateSearch", {
      type: UserSearchType,
      description: "Update a previous user's search",
      args: {
        searchId: idArg({
          description: "The ID value of a previous user search",
        }),
        filterIds: nullable(
          list(
            stringArg({
              description: "A list with the filter IDs to add in the search, found in the documentation",
            })
          )
        ),
      },
      resolve: async (_, { searchId, filterIds = [] }, { payload, redis }: MyContext): Promise<UserSearch | null> => {
        if (!searchId || searchId <= 0) {
          return null;
        }

        const userSearch = await UserSearch.findOne({ where: { id: searchId }, relations: ["filters", "sort"] });
        if (!userSearch) return null;

        if (
          (userSearch.filters &&
            !arrEquals(
              filterIds,
              userSearch.filters.map(filter => filter.publicId)
            )) ||
          filterIds.length === 0 ||
          userSearch.filters?.length === 0
        ) {
          if (filterIds) {
            const filters = await SearchFilter.find({ where: { publicId: In(filterIds) } });
            userSearch.filters = filters;
          } else userSearch.filters = [];
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
