import { resolve } from "@/utils/data";
import { formatInputValue } from "@/utils/search";
import { inputObjectType, objectType } from "nexus";
import { SearchFilter, SearchInputValue, SearchSort, UserSearch } from "nexus-prisma";
import { ProductRecommendedType } from "../beach_bar/product/types";
import { BeachBarType } from "../beach_bar/types";

export const UserSearchType = objectType({
  name: UserSearch.$name,
  description: "Represents a user search",
  definition(t) {
    // t.id("id");
    // t.field("date", { type: DateScalar });
    // t.int("adults");
    // t.nullable.int("children");
    // t.nullable.field("user", { type: UserType, description: "The user that made the search" });
    // t.list.field("filters", { type: SearchFilterType, description: "A sort filter used by the user, in its search" });
    // t.nullable.field("sort", { type: SearchSortType, description: "The input value that the user searched for" });
    // t.dateTime("updatedAt");
    // t.dateTime("timestamp");
    // t.field("inputValue", { type: SearchInputValueType, description: "The input value that the user searched for" });
    t.field(UserSearch.id);
    t.field(UserSearch.date);
    t.field(UserSearch.adults);
    t.field(UserSearch.children);
    t.field(resolve(UserSearch.user));
    t.field(resolve(UserSearch.inputValue));
    t.field(resolve(UserSearch.filters));
    t.field(resolve(UserSearch.sort));
    t.field(UserSearch.timestamp);
    t.field(UserSearch.updatedAt);
  },
});

export const SearchSortType = objectType({
  name: SearchSort.$name,
  description: "Represents a type of user's search sort filter",
  definition(t) {
    t.field(SearchSort.id);
    t.field(SearchSort.name);
  },
});

export const SearchResultType = objectType({
  name: "SearchResultType",
  description: "Represents the info (results) to be returned on user search",
  definition(t) {
    t.field("beachBar", { type: BeachBarType, description: "The #beach_bar (object) found in the search" });
    // t.boolean("isOpen", {
    //   description:
    //     "A boolean that indicates if the #beach_bar is open and active, even if it does not have capacity for the selected date, time and people",
    // });
    t.boolean("hasCapacity", {
      description: "A boolean that indicates if the #beach_bar has availability for the people selected",
    });
    t.float("totalPrice", { description: "The total price of the recommended products" });
    t.list.field("recommendedProducts", {
      type: ProductRecommendedType,
      description:
        "A list with all the recommended products for a user's search, depending on #beach_bar's availability and products prices",
    });
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
    t.date("date", { description: "The date to search availability at #beach_bars" });
    t.id("startTimeId", { description: "The ID value of the hour time the user will arrive at the #beach_bar" });
    t.id("endTimeId", { description: "The ID value of the hour time the user will leave the #beach_bar" });
    t.int("adults", {
      description: "The number of adults to search availability at #beach_bars. Its value should be less or equal to 12 adults",
    });
    t.nullable.int("children", {
      description: "The number of children to search availability at #beach_bars. Its value should be less or equal to 8 children",
    });
  },
});

export const SearchInputValueType = objectType({
  name: SearchInputValue.$name,
  description: "Represents a potential input value of a user's search",
  definition(t) {
    // t.id("id");
    // t.string("publicId", { description: "A unique identifier (ID) for public use" });
    // t.nullable.field("country", { type: CountryType, description: "The country of the input value" });
    // t.nullable.field("city", { type: CityType, description: "The city of the input value" });
    // t.nullable.field("region", { type: RegionType, description: "The region of the input value" });
    // t.nullable.field("beachBar", { type: BeachBarType, description: "The #beach_bar of the input value" });
    t.field(SearchInputValue.id);
    t.field(SearchInputValue.publicId);
    t.field(resolve(SearchInputValue.country));
    t.field(resolve(SearchInputValue.city));
    t.field(resolve(SearchInputValue.region));
    t.field(resolve(SearchInputValue.beachBar));
    t.string("formattedValue", {
      description: "The search input value formatted into a string",
      resolve: o => {
        // @ts-expect-error
        return formatInputValue(o);
      },
    });
  },
});

export const SearchFilterType = objectType({
  name: SearchFilter.$name,
  description: "Represents a filter used by users when searching for (availability at) #beach_bars",
  definition(t) {
    // t.id("id");
    // t.string("publicId", { description: "A unique identifier (ID) for public use" });
    // t.string("name");
    // t.nullable.string("description", {
    //   description: "A short description about the filter, what is its value, and when to use",
    // });
    t.field(SearchFilter.id);
    t.field(SearchFilter.publicId);
    t.field(SearchFilter.name);
    t.field(SearchFilter.description);
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
