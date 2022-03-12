import { arrEquals } from "@/utils/arr";
import { getRedisIdx, getRedisKey } from "@/utils/db";
import { ApolloError, UserInputError } from "apollo-server-express";
import { extendType, idArg, list, nullable, stringArg } from "nexus";
import { UserSearchType } from "./types";

export const SearchUpdateMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("updateSearch", {
      type: UserSearchType,
      description: "Update a previous user's search",
      args: {
        searchId: idArg({ description: "The ID value of a previous user search" }),
        filterIds: nullable(
          list(stringArg({ description: "A list with the filter IDs to add in the search, found in the documentation" }))
        ),
      },
      resolve: async (_, { searchId, filterIds }, { prisma, redis, payload }) => {
        filterIds = filterIds || [];
        if (!searchId) throw new UserInputError("Please provide a valid searchId");

        let userSearch = await prisma.userSearch.findUnique({
          where: { id: BigInt(searchId) },
          include: { filters: true },
        });
        if (!userSearch) throw new ApolloError("User search was not found");

        const isNotSameArr = !arrEquals(
          filterIds,
          userSearch.filters.map(({ publicId }) => publicId)
        );

        if ((filterIds && isNotSameArr) || filterIds.length === 0 || userSearch.filters?.length === 0) {
          const filters = filterIds.length === 0 ? [] : await prisma.searchFilter.findMany({ where: { publicId: { in: filterIds } } });
          try {
            userSearch = await prisma.userSearch.update({
              where: { id: userSearch.id },
              include: { filters: true },
              data: { filters: { set: filters.map(({ id }) => ({ id })) } },
            });
            const idx = await getRedisIdx({ model: "UserSearch", id: userSearch.id, userId: payload?.sub || null });
            await redis.lset(getRedisKey({ model: "UserSearch", userId: payload?.sub || null }), idx, JSON.stringify(userSearch));
          } catch (err) {
            throw new ApolloError(err.message);
          }
        }
        return userSearch;
      },
    });
  },
});
