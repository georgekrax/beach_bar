import { RedisSearchReturn, SearchResultReturn } from "@/typings/search";
import { calcRecommendedProducts, CalcRecommendedProductsInclude, fetchBarPayments, hasCapacity } from "@/utils/beachBar";
import { fetchFromRedis, getRedisKey } from "@/utils/db";
import { formatInputValue, FormatInputValueInclude } from "@/utils/search";
import { errors, TABLES } from "@beach_bar/common";
import { Prisma, SearchFilter } from "@prisma/client";
import { ApolloError, UserInputError } from "apollo-server-express";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import uniqBy from "lodash/uniqBy";
import { arg, extendType, idArg, intArg, list, nullable, stringArg } from "nexus";
import { SearchInputType, SearchInputValueType, SearchType, UserSearchType } from "./types";

BigInt.prototype.toJSON = function () {
  return this.toString();
};

const SEARCH_ACTIVITY_ID = TABLES.HISTORY_ACTIVITY.find(({ name }) => name === "search")!.id;

export const SearchQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("searchInputValues", {
      type: SearchInputValueType,
      description: "Returns a list of formatted search input values",
      resolve: async (_, __, { prisma }) => {
        const inputValues = await prisma.searchInputValue.findMany({
          include: { beachBar: { include: { location: true } } },
        });
        const barsWithPayments = await Promise.all(
          inputValues
            .filter(({ beachBar }) => beachBar)
            .map(async ({ beachBar }) => {
              const payments = await fetchBarPayments({ beachBarId: beachBar!.id });
              return { ...beachBar!, payments };
            })
        );
        const sortedBarsLocations = barsWithPayments
          .sort((a, b) => b.payments.length - a.payments.length)
          .map(({ location }) => location || [])
          .flat();
        const sortedResults = inputValues.sort((a, b) => {
          if ((a.countryId && !a.cityId) || (b.countryId && !b.cityId)) return 0;
          if (a.beachBarId || b.beachBarId) return 1;

          // ! Although descending order (b - a), and not ascending (a - b),
          // ! the previous array (`sortedBeachBarsLocations`) is sorted in a descending order,
          // ! so the smaller the idx, the most popular the location
          const aCountryIdx = sortedBarsLocations.findIndex(({ countryId }) => countryId.toString() === a.countryId?.toString());
          const bCountryIdx = sortedBarsLocations.findIndex(({ countryId }) => countryId.toString() === b.countryId?.toString());
          let res = bCountryIdx - aCountryIdx;
          const aCityIdx = sortedBarsLocations.findIndex(({ cityId }) => cityId.toString() === a.cityId?.toString());
          const bCityIdx = sortedBarsLocations.findIndex(({ cityId }) => cityId.toString() === b.cityId?.toString());
          res = bCityIdx - aCityIdx;
          return res;
        });
        return sortedResults;
      },
    });
    t.list.field("userSearches", {
      type: UserSearchType,
      description: "Get a list with a user's latest searches",
      args: { limit: nullable(intArg({ description: "How many data to fetch?" })) },
      resolve: async (_, { limit }, { redis, payload }) => {
        if (!payload?.sub) return [];
        // TODO: Create a list with all redis keys

        // TODO: Improve type
        let searches: RedisSearchReturn[] = (
          await redis.lrange(getRedisKey({ model: "UserSearch", userId: payload!.sub }), 0, -1)
        ).map((x: string) => JSON.parse(x));
        if (limit) searches = searches.slice(0, limit);
        // const userSearches = searches.filter(({ search }) => search.userId === payload!.sub); // unnecessary

        return uniqBy(
          searches.map(({ search }) => ({ ...search, id: BigInt(search.id) })),
          "id"
        ).sort((a, b) => (dayjs(a.updatedAt) > dayjs(b.updatedAt) ? -1 : 1));
      },
    });
    t.field("search", {
      type: SearchType,
      description: "Search for available #beach_bars",
      args: {
        inputId: nullable(idArg({ description: "The ID value of the search input value, found in the documentation" })),
        searchValue: nullable(stringArg({ description: "The search input value, found in the documentation" })),
        availability: nullable(arg({ type: SearchInputType })),
        searchId: nullable(idArg({ description: "The ID value of a previous user search" })),
        filterIds: nullable(
          list(stringArg({ description: "A list with the filter IDs to add in the search, found in the documentation" }))
        ),
        sortId: nullable(idArg({ description: "A ID of the sort filter the user has selected, found in the documentation" })),
      },
      resolve: async (_, { inputId, searchValue, availability, searchId, filterIds, sortId }, { prisma, redis, payload, ipAddr }) => {
        dayjs.extend(utc);

        if (searchId) {
          const userSearch = await fetchFromRedis({ model: "UserSearch", id: searchId.toString(), userId: payload?.sub });
          if (!userSearch) throw new ApolloError(`Search with ID ${searchId} was not found`, errors.NOT_FOUND);
          await prisma.userHistory.create({
            data: { ipAddr,  userId: payload?.sub, objectId: userSearch.search.id, activityId: SEARCH_ACTIVITY_ID },
          });
          return userSearch;
        }

        if (!inputId && !searchValue) throw new UserInputError("You should specify either an inputId or a searchValue");

        if (inputId && inputId.toString().trim().length !== 5) throw new UserInputError("Invalid inputId");
        if (searchValue && searchValue.trim().length === 0) throw new UserInputError("Invalid searchValue");

        if (availability) {
          if (availability.date && dayjs(availability.date).add(1, "day") < dayjs()) {
            throw new ApolloError("Please provide a date later or equal to today", errors.LATER_DATE_ERROR_CODE);
          }
          if (availability.adults != null && availability.adults > 12) {
            throw new ApolloError("You cannot search for more than 12 adults", errors.MAX_ADULTS_ERROR_CODE);
          }
          if (availability.children != null && availability.children > 8) {
            throw new ApolloError("You cannot search for more than 8 children", errors.MAX_CHILDREN_ERROR_CODE);
          }
        }

        let searchInput: Prisma.SearchInputValueGetPayload<{ include: typeof FormatInputValueInclude }> | null = null;
        if (inputId) {
          searchInput = await prisma.searchInputValue.findUnique({
            where: { publicId: inputId.toString().trim() },
            include: FormatInputValueInclude,
          });
        } else if (searchValue) {
          const allSearchInputs = await prisma.searchInputValue.findMany({ include: FormatInputValueInclude });
          searchInput =
            allSearchInputs.find(input => formatInputValue(input).toLowerCase().includes(searchValue.toLowerCase())) || null;
        }

        if (!searchInput) throw new ApolloError("Invalid search input", errors.NOT_FOUND);

        // const redisResults: BeachBar[] = (await getCustomRepository(BeachBarRepository).findInRedis()).filter(bar => bar.isActive);
        const redisResults = await prisma.beachBar.findMany({
          where: { isActive: true, displayRegardlessCapacity: true, location: { isNot: null } },
          include: { ...CalcRecommendedProductsInclude, location: true },
        });
        let beachBars: typeof redisResults = [];
        if (searchInput.beachBarId) {
          beachBars = redisResults.filter(beachBar => beachBar.id.toString() === searchInput!.beachBarId?.toString());
          beachBars = beachBars.slice(0, beachBars.length);
        } else {
          if (searchInput.countryId) {
            beachBars = redisResults.filter(({ location }) => location!.countryId === searchInput!.countryId);
          }
          if (searchInput.cityId) {
            beachBars = redisResults.filter(({ location }) => location!.cityId.toString() === searchInput!.cityId?.toString());
          }
          if (searchInput.regionId) {
            beachBars = redisResults.filter(({ location }) => location!.regionId === searchInput!.regionId);
          }
        }

        let results: SearchResultReturn[] = beachBars.map(beachBar => ({
          beachBar,
          // isOpen: false,
          hasCapacity: false,
          totalPrice: 0,
          recommendedProducts: [],
        }));
        if (availability && availability.date) {
          const startTimeId = availability.startTimeId ? +availability.startTimeId : undefined;
          const endTimeId = availability.endTimeId ? +availability.endTimeId : undefined;
          const adults = availability.adults || 0;
          const children = availability.children || 0;
          const totalPeople = adults + children;

          results = results.filter(({ beachBar }) => {
            return (
              beachBar.isActive &&
              (!startTimeId || !endTimeId ? true : endTimeId <= beachBar.closingTimeId && startTimeId >= beachBar.openingTimeId)
            );
          });

          results = await Promise.all(
            results.map(async ({ beachBar }) => {
              const params = { ...availability, totalPeople };
              const recommendedProducts = await calcRecommendedProducts(beachBar, params);
              return {
                beachBar,
                recommendedProducts,
                // isOpen:
                //   beachBar.isActive &&
                //   (!startTimeId || !endTimeId ? true : endTimeId <= beachBar.closingTimeId && startTimeId >= beachBar.openingTimeId),
                hasCapacity: await hasCapacity(beachBar, { capacity: params, recommendedArr: recommendedProducts }),
                totalPrice: recommendedProducts.reduce(
                  (prev, { product: { price: curPrice }, quantity }) => prev + curPrice * quantity,
                  0
                ),
              };
            })
          );
        }

        let filters: SearchFilter[] = [];
        if (filterIds && filterIds.length > 0) {
          filters = await prisma.searchFilter.findMany({ where: { publicId: { in: filterIds } } });
        }

        try {
          const userSearch = await prisma.userSearch.create({
            data: {
              date: availability?.date ? dayjs(availability.date).toDate() : null,
              adults: availability?.adults,
              children: availability?.children,
              userId: payload?.sub,
              inputValueId: searchInput.id,
              sortId: sortId ? +sortId : null,
              // filters: { connect: filters } as any,
            },
          });

          const res = { results, search: userSearch };

          // cache in Redis
          // * store in general user searches, even if the user is not authenticated
          if (payload?.sub) {
            await redis.lpush(getRedisKey({ model: "UserSearch", userId: payload.sub }), JSON.stringify(res));
          }
          await redis.lpush(getRedisKey({ model: "UserSearch" }), JSON.stringify(res));

          await prisma.userHistory.create({
            data: {
              ipAddr: undefined,
              userId: payload?.sub,
              objectId: userSearch.id,
              activityId: SEARCH_ACTIVITY_ID,
            },
          });

          return res;
        } catch (err) {
          throw new ApolloError(err.message, errors.INTERNAL_SERVER_ERROR);
        }
      },
    });
  },
});
