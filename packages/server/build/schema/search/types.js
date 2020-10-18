"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormattedSearchInputValueType = exports.SearchFilterType = exports.SearchInputValueType = exports.SearchInputType = exports.SearchResult = exports.SearchType = exports.SearchResultType = exports.UserSearchType = void 0;
const common_1 = require("@georgekrax-hashtag/common");
const schema_1 = require("@nexus/schema");
const types_1 = require("../beach_bar/types");
const cityTypes_1 = require("../details/cityTypes");
const countryTypes_1 = require("../details/countryTypes");
const regionTypes_1 = require("../details/regionTypes");
const types_2 = require("../user/types");
exports.UserSearchType = schema_1.objectType({
    name: "UserSearch",
    description: "Represents a user search",
    definition(t) {
        t.field("id", { type: common_1.BigIntScalar, nullable: false });
        t.field("searchDate", { type: common_1.DateScalar, nullable: true });
        t.int("searchAdults", { nullable: true });
        t.int("searchChildren", { nullable: true });
        t.field("user", {
            type: types_2.UserType,
            description: "The user that made the search",
            nullable: true,
            resolve: o => o.user,
        });
        t.field("inputValue", {
            type: exports.SearchInputValueType,
            description: "The input value that the user searched for",
            nullable: true,
            resolve: o => o.inputValue,
        });
        t.list.field("filters", {
            type: exports.SearchFilterType,
            description: "A list with the filters being added to the user's search",
            nullable: true,
            resolve: o => o.filters,
        });
        t.field("updatedAt", { type: common_1.DateTimeScalar, nullable: false });
        t.field("timestamp", { type: common_1.DateTimeScalar, nullable: false });
    },
});
exports.SearchResultType = schema_1.objectType({
    name: "SearchResultType",
    description: "Represents the info (results) to be returned on user search",
    definition(t) {
        t.field("beachBar", {
            type: types_1.BeachBarType,
            description: "The #beach_bar found in the search",
            nullable: false,
            resolve: o => o.beachBar,
        });
        t.field("availability", {
            type: types_1.BeachBarAvailabilityType,
            nullable: false,
            resolve: o => o.availability,
        });
    },
});
exports.SearchType = schema_1.objectType({
    name: "Search",
    description: "Represents the info to be returned when a user searches for (availability) at #beach_bars",
    definition(t) {
        t.list.field("results", {
            type: exports.SearchResultType,
            description: "The results of the user search",
            nullable: false,
            resolve: o => o.results,
        });
        t.field("search", { type: exports.UserSearchType, nullable: false, description: "The details of the search, made by a user" });
    },
});
exports.SearchResult = schema_1.unionType({
    name: "SearchResult",
    definition(t) {
        t.members("Search", "Error");
        t.resolveType(item => {
            if (item.error) {
                return "Error";
            }
            else {
                return "Search";
            }
        });
    },
});
exports.SearchInputType = schema_1.inputObjectType({
    name: "SearchInput",
    description: "The arguments (args) used at #beach_bar search or availability",
    definition(t) {
        t.field("date", { type: common_1.DateScalar, required: false, description: "The date to search availability at #beach_bars" });
        t.int("timeId", { required: false, description: "The ID value of the hour time to search availability for" });
        t.int("adults", {
            required: false,
            description: "The number of adults to search availability at #beach_bars. Its value should be less or equal to 12 adults",
        });
        t.int("children", {
            required: false,
            description: "The number of children to search availability at #beach_bars. Its value should be less or equal to 8 children",
        });
    },
});
exports.SearchInputValueType = schema_1.objectType({
    name: "SearchInputValue",
    description: "Represents a potential input value of a user's search",
    definition(t) {
        t.field("id", { type: common_1.BigIntScalar, nullable: false });
        t.string("publicId", { nullable: false, description: "A unique identifier (ID) for public use" });
        t.string("formattedValue", {
            nullable: false,
            description: "The search input value formatted into a string",
            resolve: o => o.format(),
        });
        t.field("country", {
            type: countryTypes_1.CountryType,
            description: "The country of the input value",
            nullable: true,
            resolve: o => o.country,
        });
        t.field("city", {
            type: cityTypes_1.CityType,
            description: "The city of the input value",
            nullable: true,
            resolve: o => o.city,
        });
        t.field("region", {
            type: regionTypes_1.RegionType,
            description: "The region of the input value",
            nullable: true,
            resolve: o => o.region,
        });
        t.field("beachBar", {
            type: types_1.BeachBarType,
            description: "The #beach_bar of the input value",
            nullable: true,
            resolve: o => o.beachBar,
        });
    },
});
exports.SearchFilterType = schema_1.objectType({
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
exports.FormattedSearchInputValueType = schema_1.objectType({
    name: "FormattedSearchInputValue",
    description: "Represents a formatted search input value",
    definition(t) {
        t.field("inputValue", {
            type: exports.SearchInputValueType,
            description: "The search input value",
            nullable: false,
            resolve: o => o,
        });
        t.field("beachBarThumbnailUrl", {
            type: common_1.UrlScalar,
            nullable: true,
            description: 'The URL value of the #beach_bar thumbnail image to show, at search "dropdown results"',
            resolve: o => o.beachBar && o.beachBar.thumbnailUrl,
        });
    },
});
//# sourceMappingURL=types.js.map