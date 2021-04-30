import { DateScalar, DateTimeScalar } from "@the_hashtag/common/dist/graphql";
import { inputObjectType, objectType } from "nexus";
import { formatInputValue } from "utils/search";
import { BeachBarAvailabilityType, BeachBarType } from "../beach_bar/types";
import { CityType } from "../details/cityTypes";
import { CountryType } from "../details/countryTypes";
import { RegionType } from "../details/regionTypes";
import { UserType } from "../user/types";

export const UserSearchType = objectType({
  name: "UserSearch",
  description: "Represents a user search",
  definition(t) {
    t.id("id");
    t.field("searchDate", { type: DateScalar });
    t.int("searchAdults");
    t.nullable.int("searchChildren");
    t.nullable.field("user", { type: UserType, description: "The user that made the search" });
    t.field("inputValue", { type: SearchInputValueType, description: "The input value that the user searched for" });
    t.list.field("filters", { type: SearchFilterType, description: "A sort filter used by the user, in its search" });
    t.nullable.field("sort", { type: SearchSortType, description: "The input value that the user searched for" });
    t.field("updatedAt", { type: DateTimeScalar });
    t.field("timestamp", { type: DateTimeScalar });
  },
});

export const SearchSortType = objectType({
  name: "SearchSort",
  description: "Represents a type of user's search sort filter",
  definition(t) {
    t.id("id");
    t.string("name");
  },
});

export const SearchResultType = objectType({
  name: "SearchResultType",
  description: "Represents the info (results) to be returned on user search",
  definition(t) {
    t.field("beachBar", { type: BeachBarType, description: "The #beach_bar found in the search" });
    t.field("availability", { type: BeachBarAvailabilityType });
  },
});

export const SearchType = objectType({
  name: "Search",
  description: "Represents the info to be returned when a user searches for (availability) at #beach_bars",
  definition(t) {
    t.list.field("results", { type: SearchResultType, description: "The results of the user search" });
    t.field("search", { type: UserSearchType, description: "The details of the search, made by a user" });
  },
});

// export const SearchResult = unionType({
//   name: "SearchResult",
//   definition(t) {
//     t.members("Search", "Error");
//   },
//   resolveType: item => {
//     if (item.error) {
//       return "Error";
//     } else {
//       return "Search";
//     }
//   },
// });

export const SearchInputType = inputObjectType({
  name: "SearchInput",
  description: "The arguments (args) used at #beach_bar search or availability",
  definition(t) {
    t.field("date", { type: DateScalar, description: "The date to search availability at #beach_bars" });
    t.nullable.id("timeId", { description: "The ID value of the hour time to search availability for" });
    t.int("adults", {
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
    t.id("id");
    t.string("publicId", { description: "A unique identifier (ID) for public use" });
    t.string("formattedValue", {
      description: "The search input value formatted into a string",
      resolve: o => formatInputValue(o),
    });
    t.nullable.field("country", { type: CountryType, description: "The country of the input value" });
    t.nullable.field("city", { type: CityType, description: "The city of the input value" });
    t.nullable.field("region", { type: RegionType, description: "The region of the input value" });
    t.nullable.field("beachBar", { type: BeachBarType, description: "The #beach_bar of the input value" });
  },
});

export const SearchFilterType = objectType({
  name: "SearchFilter",
  description: "Represents a filter used by users when searching for (availability at) #beach_bars",
  definition(t) {
    t.id("id");
    t.string("publicId", { description: "A unique identifier (ID) for public use" });
    t.string("name");
    t.nullable.string("description", {
      description: "A short description about the filter, what is its value, and when to use",
    });
  },
});

// export const FormattedSearchInputValueType = objectType({
//   name: "FormattedSearchInputValue",
//   description: "Represents a formatted search input value",
//   definition(t) {
//     t.field("inputValue", {
//       type: SearchInputValueType,
//       description: "The search input value",
//       resolve: o => o,
//     });
//     t.nullable.field("beachBarThumbnailUrl", {
//       type: UrlScalar,
//       description: 'The URL value of the #beach_bar thumbnail image to show, at search "dropdown results"',
//       resolve: o => o.beachBar && o.beachBar.thumbnailUrl,
//     });
//   },
// });
