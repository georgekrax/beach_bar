import { dayjsFormat, errors, MyContext } from "@beach_bar/common";
import { BeachBar, BeachBarRepository } from "@entity/BeachBar";
import { BeachBarFeature } from "@entity/BeachBarFeature";
import { Product } from "@entity/Product";
import { SearchFilter } from "@entity/SearchFilter";
import { SearchInputValue } from "@entity/SearchInputValue";
import { UserSearch } from "@entity/UserSearch";
import { arg, extendType, idArg, stringArg } from "@nexus/schema";
import { RedisSearchReturnType, SearchResultReturnType, SearchReturnType } from "@typings/search";
import { checkAvailability } from "@utils/beach_bar/checkAvailability";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Types } from "mongoose";
import { getCustomRepository, In } from "typeorm";
import historyActivity from "@constants/historyActivity";
import redisKeys from "@constants/redisKeys";
import userHistory from "../../models/userHistory";
import { FormattedSearchInputValueType, SearchInputType, SearchResult, UserSearchType } from "./types";

export const SearchQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("getSearchInputValues", {
      type: FormattedSearchInputValueType,
      description: "Returns a list of formatted search input values",
      nullable: false,
      resolve: async (): Promise<SearchInputValue[]> => {
        const inputValues = await SearchInputValue.find({ relations: ["country", "city", "region", "beachBar"] });
        return inputValues;
      },
    });
    t.list.field("getLatestUserSearches", {
      type: UserSearchType,
      description: "Get a list with a user's latest searches",
      nullable: true,
      resolve: async (_, __, { payload, redis }: MyContext): Promise<UserSearch[] | null> => {
        if (!payload) {
          return null;
        }

        const searches: UserSearch[] = (
          await redis.lrange(`${redisKeys.USER}:${payload.sub}:${redisKeys.USER_SEARCH}`, 0, -1)
        ).map((x: string) => JSON.parse(x));
        const userSearches = searches.filter(search => parseInt(search.userId.toString()) === payload.sub);

        const result: UserSearch[] = [];
        const map = new Map();
        for (let i = 0; i < userSearches.length; i++) {
          if (!map.has(userSearches[i].inputValueId)) {
            map.set(userSearches[i].inputValueId, true);
            result.push(userSearches[i]);
          }
        }

        return result;
      },
    });
    t.field("search", {
      type: SearchResult,
      description: "Search for available #beach_bars",
      nullable: true,
      args: {
        inputId: stringArg({
          required: false,
          description: "The ID value of the search input value, found in the documentation",
        }),
        inputValue: stringArg({
          required: false,
          description: "The search input value, found in the documentation",
        }),
        availability: arg({
          type: SearchInputType,
          required: false,
        }),
        filterIds: stringArg({
          required: false,
          list: true,
          description: "A list with the filter IDs to add in the search, found in the documentation",
        }),
        searchId: idArg({
          required: false,
          description: "The ID value of a previous user search",
        }),
      },
      resolve: async (
        _,
        { inputId, inputValue, availability, filterIds, searchId },
        { payload, redis, ipAddr }: MyContext
      ): Promise<SearchReturnType> => {
        dayjs.extend(utc);

        if (searchId && !payload) {
          const searches: RedisSearchReturnType[] = (await redis.lrange(redisKeys.USER_SEARCH, 0, -1)).map((x: string) =>
            JSON.parse(x)
          );
          const userSearch = searches.find(search => BigInt(search.search.id) === BigInt(searchId));
          if (!userSearch) {
            return { error: { code: errors.CONFLICT, message: errors.SOMETHING_WENT_WRONG } };
          }
          await userHistory.create({
            activityId: new Types.ObjectId(historyActivity.BEACH_BAR_SEARCH_ID),
            objectId: String(userSearch.search.id),
            userId: undefined,
            ipAddr,
          });
          return userSearch;
        } else if (searchId && payload) {
          const searches: RedisSearchReturnType[] = (
            await redis.lrange(`${redisKeys.USER}:${payload.sub}:${redisKeys.USER_SEARCH}`, 0, -1)
          ).map((x: string) => JSON.parse(x));
          const userSearch = searches.find(search => BigInt(search.search.id) === BigInt(searchId));

          if (!userSearch) {
            return { error: { code: errors.CONFLICT, message: errors.SOMETHING_WENT_WRONG } };
          }
          await userHistory.create({
            activityId: new Types.ObjectId(historyActivity.BEACH_BAR_SEARCH_ID),
            objectId: String(userSearch.search.id),
            userId: payload.sub,
            ipAddr,
          });
          return userSearch;
        } else {
          if (!inputId && !inputValue) {
            return { error: { code: errors.INVALID_ARGUMENTS, message: "You should specify either an inputId or an inputValue" } };
          }

          if (inputId && (inputId.trim().length === 0 || inputId.length !== 5)) {
            return { error: { code: errors.INVALID_ARGUMENTS, message: "Invalid inputId" } };
          }
          if (inputValue && inputValue.trim().length === 0) {
            return { error: { code: errors.INVALID_ARGUMENTS, message: "Invalid inputValue" } };
          }

          if (availability) {
            if (availability.date && availability.date.add(1, "day") < dayjs()) {
              return { error: { code: errors.LATER_DATE_ERROR_CODE, message: "Please provide a date later or equal to today" } };
            }
            if (availability.adults !== undefined && availability.adults > 12) {
              return { error: { code: errors.MAX_ADULTS_ERROR_CODE, message: "You cannot search for more than 12 adults" } };
            }
            if (availability.children !== undefined && availability.children > 8) {
              return { error: { code: errors.MAX_CHILDREN_ERROR_CODE, message: "You cannot search for more than 8 children" } };
            }
          }

          let searchInput: SearchInputValue | undefined;
          if (inputId) {
            searchInput = await SearchInputValue.findOne({ publicId: inputId.trim() });
          } else if (inputValue) {
            const allSearchInputs = await SearchInputValue.find({ relations: ["country", "city", "region", "beachBar"] });
            searchInput = allSearchInputs.find(input => input.format().toLowerCase() === inputValue.toLowerCase());
          }
          if (!searchInput) {
            return { error: { code: errors.CONFLICT, message: "Invalid search input" } };
          }

          const redisResults: BeachBar[] = (await getCustomRepository(BeachBarRepository).findInRedis()).filter(bar => bar.isActive);
          redisResults.forEach(
            beachBar => (beachBar.features = beachBar.features.filter((feature: BeachBarFeature) => !feature.deletedAt))
          );
          redisResults.forEach(beachBar => (beachBar.products = beachBar.products.filter((product: Product) => !product.deletedAt)));
          let beachBars: BeachBar[] = [];
          if (searchInput.beachBarId) {
            beachBars = redisResults.filter(beachBar => beachBar.id === searchInput!.beachBarId);
            beachBars = beachBars.slice(0, beachBars.length);
          } else {
            if (searchInput.countryId) {
              beachBars = redisResults.filter(beachBar => beachBar.location.countryId === searchInput!.countryId);
            }
            if (searchInput.cityId) {
              beachBars = redisResults.filter(beachBar => beachBar.location.cityId === searchInput!.cityId);
            }
            if (searchInput.regionId) {
              beachBars = redisResults.filter(beachBar => beachBar.location.regionId === searchInput!.regionId);
            }
          }

          let results: SearchResultReturnType[] = beachBars.map(bar => {
            return { beachBar: bar, availability: { hasAvailability: undefined, hasCapacity: undefined } };
          });
          if (availability && availability.date) {
            const { date } = availability;
            const timeId = availability.timeId ? availability.timeId : undefined;
            const adults = availability.adults || 0;
            const children = availability.children || 0;
            results = [];
            const totalPeople = adults + children !== 0 ? adults + children : undefined;

            for (let i = 0; i < beachBars.length; i++) {
              const { hasAvailability, hasCapacity } = await checkAvailability(redis, beachBars[i], date, timeId, totalPeople);
              results.push({
                beachBar: beachBars[i],
                availability: {
                  hasAvailability,
                  hasCapacity,
                },
              });
            }
          }

          let filters: SearchFilter[] = [];
          if (filterIds && filterIds.length > 0) {
            filters = await SearchFilter.find({ publicId: In(filterIds) });
          }

          const userSearch = UserSearch.create({
            searchDate: availability && availability.date ? availability.date.format(dayjsFormat.ISO_STRING) : undefined,
            searchAdults: availability && availability.adults,
            searchChildren: availability && availability.children,
            userId: payload ? payload.sub : undefined,
            inputValue: searchInput,
            filters,
          });

          try {
            await userSearch.save();

            const returnResult = { results, search: userSearch };

            // cache in Redis
            // * store in general user searches, even if the user is not authenticated
            if (payload && payload.sub) {
              await redis.lpush(`${redisKeys.USER}:${payload.sub}:${redisKeys.USER_SEARCH}`, JSON.stringify(returnResult));
            }
            await redis.lpush(redisKeys.USER_SEARCH, JSON.stringify(returnResult));

            await userHistory.create({
              activityId: new Types.ObjectId(historyActivity.BEACH_BAR_SEARCH_ID),
              objectId: String(userSearch.id),
              userId: payload ? payload.sub : undefined,
              ipAddr,
            });
          } catch (err) {
            return { error: { code: errors.INTERNAL_SERVER_ERROR, message: `${errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
          }

          return {
            results,
            search: userSearch,
          };
        }
      },
    });
  },
});
