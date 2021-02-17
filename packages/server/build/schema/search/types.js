"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormattedSearchInputValueType = exports.SearchFilterType = exports.SearchInputValueType = exports.SearchInputType = exports.SearchResult = exports.SearchType = exports.SearchResultType = exports.UserSearchType = void 0;
const graphql_1 = require("@the_hashtag/common/dist/graphql");
const nexus_1 = require("nexus");
const types_1 = require("../beach_bar/types");
const cityTypes_1 = require("../details/cityTypes");
const countryTypes_1 = require("../details/countryTypes");
const regionTypes_1 = require("../details/regionTypes");
const types_2 = require("../user/types");
exports.UserSearchType = nexus_1.objectType({
    name: "UserSearch",
    description: "Represents a user search",
    definition(t) {
        t.field("id", { type: graphql_1.BigIntScalar });
        t.nullable.field("searchDate", { type: graphql_1.DateScalar });
        t.nullable.int("searchAdults");
        t.nullable.int("searchChildren");
        t.nullable.field("user", {
            type: types_2.UserType,
            description: "The user that made the search",
            resolve: o => o.user,
        });
        t.nullable.field("inputValue", {
            type: exports.SearchInputValueType,
            description: "The input value that the user searched for",
            resolve: o => o.inputValue,
        });
        t.nullable.list.field("filters", {
            type: exports.SearchFilterType,
            description: "A list with the filters being added to the user's search",
            resolve: o => o.filters,
        });
        t.field("updatedAt", { type: graphql_1.DateTimeScalar });
        t.field("timestamp", { type: graphql_1.DateTimeScalar });
    },
});
exports.SearchResultType = nexus_1.objectType({
    name: "SearchResultType",
    description: "Represents the info (results) to be returned on user search",
    definition(t) {
        t.field("beachBar", {
            type: types_1.BeachBarType,
            description: "The #beach_bar found in the search",
            resolve: o => o.beachBar,
        });
        t.field("availability", {
            type: types_1.BeachBarAvailabilityType,
            resolve: o => o.availability,
        });
    },
});
exports.SearchType = nexus_1.objectType({
    name: "Search",
    description: "Represents the info to be returned when a user searches for (availability) at #beach_bars",
    definition(t) {
        t.list.field("results", {
            type: exports.SearchResultType,
            description: "The results of the user search",
            resolve: o => o.results,
        });
        t.field("search", { type: exports.UserSearchType, description: "The details of the search, made by a user" });
    },
});
exports.SearchResult = nexus_1.unionType({
    name: "SearchResult",
    definition(t) {
        t.members("Search", "Error");
    },
    resolveType: item => {
        if (item.name === "Error") {
            return "Error";
        }
        else {
            return "Search";
        }
    },
});
exports.SearchInputType = nexus_1.inputObjectType({
    name: "SearchInput",
    description: "The arguments (args) used at #beach_bar search or availability",
    definition(t) {
        t.nullable.field("date", { type: graphql_1.DateScalar, description: "The date to search availability at #beach_bars" });
        t.nullable.int("timeId", { description: "The ID value of the hour time to search availability for" });
        t.nullable.int("adults", {
            description: "The number of adults to search availability at #beach_bars. Its value should be less or equal to 12 adults",
        });
        t.nullable.int("children", {
            description: "The number of children to search availability at #beach_bars. Its value should be less or equal to 8 children",
        });
    },
});
exports.SearchInputValueType = nexus_1.objectType({
    name: "SearchInputValue",
    description: "Represents a potential input value of a user's search",
    definition(t) {
        t.field("id", { type: graphql_1.BigIntScalar, });
        t.string("publicId", { description: "A unique identifier (ID) for public use" });
        t.string("formattedValue", {
            description: "The search input value formatted into a string",
            resolve: o => o.format(),
        });
        t.nullable.field("country", {
            type: countryTypes_1.CountryType,
            description: "The country of the input value",
            resolve: o => o.country,
        });
        t.nullable.field("city", {
            type: cityTypes_1.CityType,
            description: "The city of the input value",
            resolve: o => o.city,
        });
        t.nullable.field("region", {
            type: regionTypes_1.RegionType,
            description: "The region of the input value",
            resolve: o => o.region,
        });
        t.nullable.field("beachBar", {
            type: types_1.BeachBarType,
            description: "The #beach_bar of the input value",
            resolve: o => o.beachBar,
        });
    },
});
exports.SearchFilterType = nexus_1.objectType({
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
exports.FormattedSearchInputValueType = nexus_1.objectType({
    name: "FormattedSearchInputValue",
    description: "Represents a formatted search input value",
    definition(t) {
        t.field("inputValue", {
            type: exports.SearchInputValueType,
            description: "The search input value",
            resolve: o => o,
        });
        t.nullable.field("beachBarThumbnailUrl", {
            type: graphql_1.UrlScalar,
            description: 'The URL value of the #beach_bar thumbnail image to show, at search "dropdown results"',
            resolve: o => o.beachBar && o.beachBar.thumbnailUrl,
        });
    },
});
