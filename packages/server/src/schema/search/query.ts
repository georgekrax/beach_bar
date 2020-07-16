import { DateScalar, filterSearch, MyContext } from "@beach_bar/common";
import { arg, extendType, intArg, stringArg } from "@nexus/schema";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { In } from "typeorm";
import { dayjsFormat } from "../../constants/dayjs";
import errors from "../../constants/errors";
import redisKeys from "../../constants/redisKeys";
import { BeachBar } from "../../entity/BeachBar";
import { BeachBarFeature } from "../../entity/BeachBarFeature";
import { Product } from "../../entity/Product";
import { SearchFilter } from "../../entity/SearchFilter";
import { SearchInputValue } from "../../entity/SearchInputValue";
import { UserSearch } from "../../entity/UserSearch";
import { checkAvailability } from "../../utils/beach_bar/checkAvailability";
import { ErrorType } from "../returnTypes";
import { SearchResultReturnType, SearchReturnType } from "./returnTypes";
import { FormattedSearchInputValueType, SearchResult, UserSearchType } from "./types";

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
      resolve: async (_, __, { payload }: MyContext): Promise<UserSearch[] | null> => {
        if (!payload) {
          return null;
        }

        const searches = await UserSearch.find({
          where: { userId: payload.sub },
          relations: ["user", "inputValue", "inputValue.country", "inputValue.city", "inputValue.region", "inputValue.beachBar"],
          order: {
            updatedAt: "DESC",
          },
        });
        const result: UserSearch[] = [];
        const map = new Map();
        for (let i = 0; i < searches.length; i++) {
          if (!map.has(searches[i].inputValueId)) {
            map.set(searches[i].inputValueId, true);
            result.push(searches[i]);
          }
        }

        return result.slice(0, 5);
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
        date: arg({
          type: DateScalar,
          required: false,
          description: "The date to search availability at #beach_bars",
        }),
        timeId: intArg({
          required: false,
          description: "The ID value of the hour time to search availability for",
        }),
        adults: intArg({
          required: false,
          description: "The number of adults to search availability at #beach_bars. Its value should be less or equal to 12 adults",
        }),
        children: intArg({
          required: false,
          description: "The number of children to search availability at #beach_bars. Its value should be less or equal to 8 children",
        }),
        filterIds: stringArg({
          required: false,
          list: true,
          description: "A list with the filter IDs to add in the search, found in the documentation",
        }),
      },
      resolve: async (
        _,
        { inputId, inputValue, date, timeId, adults, children, filterIds },
        { payload, redis }: MyContext,
      ): Promise<SearchReturnType | ErrorType> => {
        dayjs.extend(utc);

        if (!inputId && !inputValue) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "You should specify either an inputId or an inputValue" } };
        }

        if (inputId && (inputId.trim().length === 0 || inputId.length !== 5)) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Invalid inputId" } };
        }
        if (inputValue && inputValue.trim().length === 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Invalid inputValue" } };
        }
        if (date && date.add(1, "day") < dayjs()) {
          return { error: { code: errors.LATER_DATE_ERROR_CODE, message: "Please provide a date later or equal to today" } };
        }
        if (adults !== undefined && adults > 12) {
          return { error: { code: errors.MAX_ADULTS_ERROR_CODE, message: "You cannot search for more than 12 adults" } };
        }
        if (children !== undefined && children > 8) {
          return { error: { code: errors.MAX_CHILDREN_ERROR_CODE, message: "You cannot search for more than 8 children" } };
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

        const redisList = await redis.lrange(redisKeys.BEACH_BAR_CACHE_KEY, 0, -1);
        const redisResults = redisList.map(x => JSON.parse(x)).filter(bar => bar.isActive);
        redisResults.forEach(
          beachBar => (beachBar.features = beachBar.features.filter((feature: BeachBarFeature) => !feature.deletedAt)),
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
          return { beachBar: bar, hasAvailability: undefined, hasCapacity: undefined };
        });
        if (date) {
          adults = adults || 0;
          children = children || 0;
          results = [];
          const totalPeople = adults + children !== 0 ? adults + children : undefined;

          for (let i = 0; i < beachBars.length; i++) {
            const { hasAvailability, hasCapacity } = await checkAvailability(redis, beachBars[i], date, timeId, totalPeople);
            results.push({
              beachBar: beachBars[i],
              hasAvailability,
              hasCapacity,
            });
          }
        }

        let filters: SearchFilter[] = [];
        if (filterIds && filterIds.length > 0) {
          filters = await SearchFilter.find({ publicId: In(filterIds) });
          results = filterSearch(filterIds, results);
        }

        const userSearch = UserSearch.create({
          searchDate: date ? date.format(dayjsFormat.ISO_STRING) : undefined,
          searchAdults: adults,
          searchChildren: children,
          userId: payload ? payload.sub : undefined,
          inputValue: searchInput,
          filters,
        });

        try {
          await userSearch.save();
        } catch (err) {
          return { error: { code: errors.INTERNAL_SERVER_ERROR, message: `${errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
        }

        return {
          results,
          search: userSearch,
        };
      },
    });
  },
});
