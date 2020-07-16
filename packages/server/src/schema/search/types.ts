import { BigIntScalar, DateScalar, DateTimeScalar, UrlScalar } from "@beach_bar/common";
import { objectType, unionType } from "@nexus/schema";
import { BeachBarType } from "../beach_bar/types";
import { CityType } from "../details/cityTypes";
import { CountryType } from "../details/countryTypes";
import { RegionType } from "../details/regionTypes";
import { UserType } from "../user/types";

export const UserSearchType = objectType({
  name: "UserSearch",
  description: "Represents a user search",
  definition(t) {
    t.field("id", { type: BigIntScalar, nullable: false });
    t.field("searchDate", { type: DateScalar, nullable: true });
    t.int("searchAdults", { nullable: true });
    t.int("searchChildren", { nullable: true });
    t.field("user", {
      type: UserType,
      description: "The user that made the search",
      nullable: true,
      resolve: o => o.user,
    });
    t.field("inputValue", {
      type: SearchInputValueType,
      description: "The input value that the user searched for",
      nullable: true,
      resolve: o => o.inputValue,
    });
    t.list.field("filters", {
      type: SearchFilter,
      description: "A list with the filters being added to the user's search",
      nullable: true,
      resolve: o => o.filters,
    });
    t.field("updatedAt", { type: DateTimeScalar, nullable: false });
    t.field("timestamp", { type: DateTimeScalar, nullable: false });
  },
});

export const SearchResultType = objectType({
  name: "SearchResultType",
  description: "Represents the info (results) to be returned on user search",
  definition(t) {
    t.field("beachBar", {
      type: BeachBarType,
      description: "The #beach_bar found in the search",
      nullable: false,
      resolve: o => o.beachBar,
    });
    t.boolean("hasAvailability", {
      nullable: true,
      description: "A boolean that indicates if the #beach_bar has availability for the dates selected",
    });
    t.boolean("hasCapacity", {
      nullable: true,
      description: "A boolean that indicates if the #beach_bar has availability for the people selected",
    });
  },
});

export const SearchType = objectType({
  name: "Search",
  description: "Represents the info to be returned when a user searches for (availability) at #beach_bars",
  definition(t) {
    t.list.field("results", {
      type: SearchResultType,
      description: "The results of the user search",
      nullable: false,
      resolve: o => o.results,
    });
    t.field("search", { type: UserSearchType, nullable: false, description: "The details of the search, made by a user" });
  },
});

export const SearchResult = unionType({
  name: "SearchResult",
  definition(t) {
    t.members("Search", "Error");
    t.resolveType(item => {
      if (item.error) {
        return "Error";
      } else {
        return "Search";
      }
    });
  },
});

export const SearchInputValueType = objectType({
  name: "SearchInputValue",
  description: "Represents a potential input value of a user's search",
  definition(t) {
    t.field("id", { type: BigIntScalar, nullable: false });
    t.string("publicId", { nullable: false, description: "A unique identifier (ID) for public use" });
    t.string("formattedValue", {
      nullable: false,
      description: "The search input value formatted into a string",
      resolve: o => o.format(),
    });
    t.field("country", {
      type: CountryType,
      description: "The country of the input value",
      nullable: true,
      resolve: o => o.country,
    });
    t.field("city", {
      type: CityType,
      description: "The city of the input value",
      nullable: true,
      resolve: o => o.city,
    });
    t.field("region", {
      type: RegionType,
      description: "The region of the input value",
      nullable: true,
      resolve: o => o.region,
    });
    t.field("beachBar", {
      type: BeachBarType,
      description: "The #beach_bar of the input value",
      nullable: true,
      resolve: o => o.beachBar,
    });
  },
});

export const SearchFilter = objectType({
  name: "SearchFilter",
  description: "Represents a filter used by users when searching for (availability at) #beach_bars",
  definition(t) {
    t.int("id", { nullable: false });
    t.string("publicId", { nullable: false, description: "A unique identifier (ID) for public use" });
    t.string("name", { nullable: false });
    t.string("description", {
      nullable: true,
      description: "A short description about the filter, what is its value, and when to use",
    });
  },
});

export const FormattedSearchInputValueType = objectType({
  name: "FormattedSearchInputValue",
  description: "Represents a formatted search input value",
  definition(t) {
    t.field("inputValue", {
      type: SearchInputValueType,
      description: "The search input value",
      nullable: false,
      resolve: o => o,
    });
    t.string("formattedValue", {
      nullable: false,
      description: "The search input value formatted into a string",
      resolve: o => o.format(),
    });
    t.field("beachBarThumbnailUrl", {
      type: UrlScalar,
      nullable: true,
      description: 'The URL value of the #beach_bar thumbnail image to show, at search "dropdown results"',
      resolve: o => o.beachBar && o.beachBar.thumbnailUrl,
    });
  },
});

// export const FormattedSearchInputValueResult = unionType({
//   name: "FormattedSearchInputValue",
//   definition(t) {
//     t.members("FormattedSearchInputValueType", "Error");
//     t.resolveType(item => {
//       if (item.error) {
//         return "Error";
//       } else {
//         return "FormattedSearchInputValueType";
//       }
//     });
//   },
// });
