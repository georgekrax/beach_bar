"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserHistoryExtendedType = exports.UserHistoryType = exports.UserHistoryActivityType = exports.UserAccountType = void 0;
const graphql_1 = require("@the_hashtag/common/dist/graphql");
const nexus_1 = require("nexus");
const types_1 = require("schema/beach_bar/types");
const index_1 = require("schema/index");
const types_2 = require("schema/search/types");
const countryTypes_1 = require("../../details/countryTypes");
const types_3 = require("../types");
exports.UserAccountType = nexus_1.objectType({
    name: "UserAccount",
    description: "Represents a user's account",
    definition(t) {
        t.id("id", { description: "The ID value of the user's account" });
        t.nullable.string("honorificTitle", {
            description: "The user's honorific title. Its value can be null or 'Mr', 'Mrs', 'Ms', 'Miss', 'Sr', 'Dr', 'Lady'",
        });
        t.nullable.string("imgUrl", { description: "The URL value of user's account profile picture" });
        t.nullable.field("birthday", { type: graphql_1.DateScalar, description: "User's birthday date" });
        t.nullable.int("age", { description: "User's age" });
        t.nullable.string("address", { description: "The house of office street address of the user" });
        t.nullable.string("zipCode", { description: "The zip code of the house or office street address of the user" });
        t.nullable.string("city", { description: "The city of the user" });
        t.nullable.string("phoneNumber", { description: "The phone number of the user" });
        t.field("user", { type: types_3.UserType, description: "The user info of the particular account" });
        t.nullable.field("country", { type: countryTypes_1.CountryType, description: "The country of the user" });
        t.nullable.field("telCountry", { type: countryTypes_1.CountryType, description: "The country of the user's phone number" });
        t.boolean("trackHistory", { description: "Indicates if to track some of user's actions" });
    },
});
exports.UserHistoryActivityType = nexus_1.objectType({
    name: "UserHistoryActivity",
    description: "Represents the type of action a user made",
    definition(t) {
        t.id("id");
        t.string("name");
    },
});
exports.UserHistoryType = nexus_1.objectType({
    name: "UserHistory",
    description: "Represents a user's recorded / saved action",
    definition(t) {
        t.id("id");
        t.field("activity", { type: exports.UserHistoryActivityType, description: "The action type of the user" });
        t.id("objectId", { description: "The ID of what the user accessed" });
        t.field("user", { type: types_3.UserType, description: "The user that made the recorded / saved action" });
        t.implements(index_1.TimestampGraphQLType);
    },
});
exports.UserHistoryExtendedType = nexus_1.objectType({
    name: "UserHistoryExtended",
    description: "Represents a user's action, with details about the objectId",
    definition(t) {
        t.field("userHistory", { type: exports.UserHistoryType, description: "The info of the recorded / saved action of the user" });
        t.nullable.field("beachBar", { type: types_1.BeachBarType, description: "Details about the #beach_bar the user may have visited" });
        t.nullable.field("search", { type: types_2.UserSearchType, description: "Details about what the user searched" });
    },
});
