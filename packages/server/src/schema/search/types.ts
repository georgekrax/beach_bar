import { BigIntScalar, DateScalar, DateTimeScalar, UrlScalar } from "@the_hashtag/common/dist/graphql";
import { inputObjectType, objectType, unionType } from "nexus";
import { BeachBarAvailabilityType, BeachBarType } from "../beach_bar/types";
import { CityType } from "../details/cityTypes";
import { CountryType } from "../details/countryTypes";
import { RegionType } from "../details/regionTypes";
import { UserType } from "../user/types";

export const UserSearchType = objectType({
  name: "UserSearch",
  description: "Represents a user search",
  definition(t) {
    t.field("id", { type: BigIntScalar });
    t.nullable.field("searchDate", { type: DateScalar });
    t.nullable.int("searchAdults");
    t.nullable.int("searchChildren");
    t.nullable.field("user", {
      type: UserType,
      description: "The user that made the search",
      resolve: o => o.user,
    });
    t.nullable.field("inputValue", {
      type: SearchInputValueType,
      description: "The input value that the user searched for",
      resolve: o => o.inputValue,
    });
    t.nullable.list.field("filters", {
      type: SearchFilterType,
      description: "A list with the filters being added to the user's search",
      resolve: o => o.filters,
    });
    t.field("updatedAt", { type: DateTimeScalar });
    t.field("timestamp", { type: DateTimeScalar });
  },
});

export const SearchResultType = objectType({
  name: "SearchResultType",
  description: "Represents the info (results) to be returned on user search",
  definition(t) {
    t.field("beachBar", {
      type: BeachBarType,
      description: "The #beach_bar found in the search",
      resolve: o => o.beachBar,
    });
    t.field("availability", {
      type: BeachBarAvailabilityType,
      resolve: o => o.availability,
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
      resolve: o => o.results,
    });
    t.field("search", { type: UserSearchType, description: "The details of the search, made by a user" });
  },
});

export const SearchResult = unionType({
  name: "SearchResult",
  definition(t) {
    t.members("Search", "Error");
  },
  resolveType: item => {
    if (item.name === "Error") {
      return "Error";
    } else {
      return "Search";
    }
  },
});

export const SearchInputType = inputObjectType({
  name: "SearchInput",
  description: "The arguments (args) used at #beach_bar search or availability",
  definition(t) {
    t.nullable.field("date", { type: DateScalar, description: "The date to search availability at #beach_bars" });
    t.nullable.int("timeId", { description: "The ID value of the hour time to search availability for" });
    t.nullable.int("adults", {
      description: "The number of adults to search availability at #beach_bars. Its value should be less or equal to 12 adults",
    });
    t.nullable.int("children", {
      description: "The number of children to search availability at #beach_bars. Its value should be less or equal to 8 children",
    });
  },
});

export const SearchInputValueType = objectType({
  name: "SearchInputValue",
  description: "Represents a potential input value of a user's search",
  definition(t) {
    t.field("id", { type: BigIntScalar,  });
    t.string("publicId", { description: "A unique identifier (ID) for public use" });
    t.string("formattedValue", {
      description: "The search input value formatted into a string",
      resolve: o => o.format(),
    });
    t.nullable.field("country", {
      type: CountryType,
      description: "The country of the input value",
      resolve: o => o.country,
    });
    t.nullable.field("city", {
      type: CityType,
      description: "The city of the input value",
      resolve: o => o.city,
    });
    t.nullable.field("region", {
      type: RegionType,
      description: "The region of the input value",
      resolve: o => o.region,
    });
    t.nullable.field("beachBar", {
      type: BeachBarType,
      description: "The #beach_bar of the input value",
      resolve: o => o.beachBar,
    });
  },
});

export const SearchFilterType = objectType({
  name: "SearchFilter",
  description: "Represents a filter used by users when searching for (availability at) #beach_bars",
  definition(t) {
    t.id("id");
    t.string("publicId", {  description: "A unique identifier (ID) for public use" });
    t.string("name");
    t.nullable.string("description", {
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
      resolve: o => o,
    });
    t.nullable.field("beachBarThumbnailUrl", {
      type: UrlScalar,
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
