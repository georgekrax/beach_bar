import { COMMON_CONFIG, dayjsFormat, errors, MyContext } from "@beach_bar/common";
import { ApolloError, UserInputError } from "apollo-server-express";
import redisKeys from "constants/redisKeys";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { BeachBar } from "entity/BeachBar";
import { BeachBarFeature } from "entity/BeachBarFeature";
import { Product } from "entity/Product";
import { SearchFilter } from "entity/SearchFilter";
import { SearchInputValue } from "entity/SearchInputValue";
import { UserHistory } from "entity/UserHistory";
import { UserSearch } from "entity/UserSearch";
import { uniqBy } from "lodash";
import { arg, extendType, idArg, intArg, list, nullable, stringArg } from "nexus";
import { In } from "typeorm";
import { RedisSearchReturnType, SearchResultReturnType, TSearch } from "typings/search";
import { checkAvailability } from "utils/beach_bar/availability";
import { fetchBeachBarPayments } from "utils/beach_bar/payment";
import { formatInputValue } from "utils/search";
import { SearchInputType, SearchInputValueType, SearchType, UserSearchType } from "./types";

export const SearchQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("searchInputValues", {
      type: SearchInputValueType,
      description: "Returns a list of formatted search input values",
      resolve: async (): Promise<SearchInputValue[]> => {
        const inputValues = await SearchInputValue.find({
          relations: [
            "country",
            "city",
            "city.country",
            "region",
            "region.country",
            "beachBar",
            "beachBar.location",
            "beachBar.location.country",
            "beachBar.location.city",
            "beachBar.location.city.country",
            "beachBar.location.region",
            "beachBar.location.region.country",
          ],
        });
        const beachBarsWithPayments = await Promise.all(
          inputValues
            .filter(({ beachBar }) => beachBar)
            .map(async ({ beachBar }) => {
              const payments = await fetchBeachBarPayments(beachBar!.id);
              return { ...beachBar!, payments };
            })
        );
        const sortedBeachBarsLocations = beachBarsWithPayments
          .sort((a, b) => b.payments.length - a.payments.length)
          .map(({ location }) => location);
        const sortedResults = inputValues.sort((a, b) => {
          if ((a.countryId && !a.cityId) || (b.countryId && !b.cityId)) return 0;
          if (a.beachBarId || b.beachBarId) return 1;

          // ! Although descending order (b - a), and not ascending (a - b),
          // ! the previous array (`sortedBeachBarsLocations`) is sorted in a descending order,
          // ! so the smaller the idx, the most popular the location
          const aCountryIdx = sortedBeachBarsLocations.findIndex(({ countryId }) => countryId.toString() === a.countryId?.toString());
          const bCountryIdx = sortedBeachBarsLocations.findIndex(({ countryId }) => countryId.toString() === b.countryId?.toString());
          let res = bCountryIdx - aCountryIdx;
          const aCityIdx = sortedBeachBarsLocations.findIndex(({ cityId }) => cityId.toString() === a.cityId?.toString());
          const bCityIdx = sortedBeachBarsLocations.findIndex(({ cityId }) => cityId.toString() === b.cityId?.toString());
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
      resolve: async (_, {limit}, { payload, redis }: MyContext): Promise<UserSearch[]> => {
        if (!payload || !payload.sub) return [];

        let searches: RedisSearchReturnType[] = (
          await redis.lrange(redisKeys.USER + ":" + payload!.sub + ":" + redisKeys.USER_SEARCH, 0, -1)
        ).map((x: string) => JSON.parse(x));
        if (limit !== undefined) searches = searches.slice(0, limit);
        const userSearches = searches.filter(
          search => search.search.userId && parseInt(search.search.userId.toString()) === payload!.sub
        );

        return uniqBy(
          userSearches.map(({ search }) => search),
          "id"
        ).sort((a, b) => (dayjs(a.updatedAt) > dayjs(b.updatedAt) ? -1 : 1));
      },
    });
    t.field("search", {
      type: SearchType,
      description: "Search for available #beach_bars",
      args: {
        inputId: nullable(idArg({ description: "The ID value of the search input value, found in the documentation" })),
        inputValue: nullable(stringArg({ description: "The search input value, found in the documentation" })),
        availability: nullable(arg({ type: SearchInputType })),
        searchId: nullable(idArg({ description: "The ID value of a previous user search" })),
        filterIds: nullable(
          list(stringArg({ description: "A list with the filter IDs to add in the search, found in the documentation" }))
        ),
        sortId: nullable(idArg({ description: "A ID of the sort filter the user has selected, found in the documentation" })),
      },
      resolve: async (
        _,
        { inputId, inputValue, availability, searchId, filterIds, sortId },
        { payload, redis, ipAddr }: MyContext
      ): Promise<TSearch> => {
        dayjs.extend(utc);

        if (searchId && !payload) {
          const searches: RedisSearchReturnType[] = (await redis.lrange(redisKeys.USER_SEARCH, 0, -1)).map((x: string) =>
            JSON.parse(x)
          );
          const userSearch = searches.find(search => BigInt(search.search.id) === BigInt(searchId));
          if (!userSearch) throw new ApolloError(`User search with ID ${searchId} was not found`, errors.NOT_FOUND);
          await UserHistory.create({
            activityId: COMMON_CONFIG.HISTORY_ACTIVITY.SEARCH_ID,
            objectId: userSearch.search.id,
            userId: undefined,
            ipAddr,
          }).save();
          return userSearch;
        } else if (searchId && payload) {
          const searches: RedisSearchReturnType[] = (
            await redis.lrange(redisKeys.USER + ":" + payload.sub + ":" + redisKeys.USER_SEARCH, 0, -1)
          ).map((x: string) => JSON.parse(x));
          const userSearch = searches.find(({ search }) => search.id.toString() === searchId.toString());

          if (!userSearch) throw new ApolloError(`Search with ID ${searchId} was not found`, errors.NOT_FOUND);
          await UserHistory.create({
            activityId: COMMON_CONFIG.HISTORY_ACTIVITY.SEARCH_ID,
            objectId: userSearch.search.id,
            userId: payload.sub,
            ipAddr,
          }).save();
          return userSearch;
        } else {
          if (!inputId && !inputValue) throw new UserInputError("You should specify either an inputId or an inputValue");

          if (inputId && inputId.trim().length !== 5) throw new UserInputError("Invalid inputId");
          if (inputValue && inputValue.trim().length === 0) throw new UserInputError("Invalid inputValue");

          if (availability) {
            if (availability.date && dayjs(availability.date).add(1, "day") < dayjs())
              throw new ApolloError("Please provide a date later or equal to today", errors.LATER_DATE_ERROR_CODE);
            if (availability.adults !== undefined && availability.adults > 12)
              throw new ApolloError("You cannot search for more than 12 adults", errors.MAX_ADULTS_ERROR_CODE);
            if (availability.children !== undefined && availability.children > 8)
              throw new ApolloError("You cannot search for more than 8 children", errors.MAX_CHILDREN_ERROR_CODE);
          }

          let searchInput: SearchInputValue | undefined;
          if (inputId)
            searchInput = await SearchInputValue.findOne({
              where: { publicId: inputId.trim() },
              relations: ["beachBar", "country", "city", "region"],
            });
          else if (inputValue) {
            const allSearchInputs = await SearchInputValue.find({ relations: ["country", "city", "region", "beachBar"] });
            searchInput = allSearchInputs.find(input => formatInputValue(input).toLowerCase().includes(inputValue.toLowerCase()));
          }

          if (!searchInput) throw new ApolloError("Invalid search input", errors.NOT_FOUND);

          // const redisResults: BeachBar[] = (await getCustomRepository(BeachBarRepository).findInRedis()).filter(bar => bar.isActive);
          const redisResults = await BeachBar.find({
            where: { isActive: true },
            relations: [
              "features",
              "features.service",
              "features.service.icon",
              "products",
              "products.reservedProducts",
              "products.reservationLimits",
              "products.reservedProducts.product",
              "products.reservationLimits.product",
              "styles",
              "styles.style",
              "location",
              "location.country",
              "location.city",
              "location.region",
              "reviews",
            ],
          });
          redisResults.forEach(
            beachBar => (beachBar.features = beachBar.features.filter((feature: BeachBarFeature) => !feature.deletedAt))
          );
          redisResults.forEach(beachBar => (beachBar.products = beachBar.products.filter((product: Product) => !product.deletedAt)));
          let beachBars: BeachBar[] = [];
          if (searchInput.beachBarId) {
            beachBars = redisResults.filter(beachBar => beachBar.id === searchInput!.beachBarId);
            beachBars = beachBars.slice(0, beachBars.length);
          } else {
            if (searchInput.countryId)
              beachBars = redisResults.filter(beachBar => beachBar.location.countryId === searchInput!.countryId);
            if (searchInput.cityId) beachBars = redisResults.filter(beachBar => beachBar.location.cityId === searchInput!.cityId);
            if (searchInput.regionId)
              beachBars = redisResults.filter(beachBar => beachBar.location.regionId === searchInput!.regionId);
          }

          let results: SearchResultReturnType[] = beachBars.map(bar => ({
            beachBar: bar,
            availability: { hasAvailability: undefined, hasCapacity: undefined },
          }));
          if (availability && availability.date) {
            const { date } = availability;
            const timeId = availability.timeId ? availability.timeId : undefined;
            const adults = availability.adults || 0;
            const children = availability.children || 0;
            results = [];
            const totalPeople = adults + children !== 0 ? adults + children : undefined;

            for (let i = 0; i < beachBars.length; i++) {
              const { hasAvailability, hasCapacity } = checkAvailability(beachBars[i], date, timeId, totalPeople);
              results.push({ beachBar: beachBars[i], availability: { hasAvailability, hasCapacity } });
            }
          }

          let filters: SearchFilter[] = [];
          if (filterIds && filterIds.length > 0) filters = await SearchFilter.find({ where: { publicId: In(filterIds) } });

          const userSearch = UserSearch.create({
            searchDate: availability && availability.date ? dayjs(availability.date).format(dayjsFormat.ISO_STRING) : undefined,
            searchAdults: availability && availability.adults,
            searchChildren: availability && availability.children,
            userId: payload ? payload.sub : undefined,
            inputValue: searchInput,
            inputValueId: searchInput.id,
            filters,
            sortId,
          });

          try {
            await userSearch.save();

            const res = { results, search: userSearch };

            // cache in Redis
            // * store in general user searches, even if the user is not authenticated
            if (payload && payload.sub)
              await redis.lpush(redisKeys.USER + ":" + payload.sub + ":" + redisKeys.USER_SEARCH, JSON.stringify(res));
            await redis.lpush(redisKeys.USER_SEARCH, JSON.stringify(res));

            await UserHistory.create({
              activityId: COMMON_CONFIG.HISTORY_ACTIVITY.SEARCH_ID,
              objectId: userSearch.id,
              userId: payload ? payload.sub : undefined,
              ipAddr,
            }).save();

            return res;
          } catch (err) {
            throw new ApolloError(err.message, errors.INTERNAL_SERVER_ERROR);
          }
        }
      },
    });
  },
});
