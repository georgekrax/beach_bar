"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAccountType = void 0;
const graphql_1 = require("@the_hashtag/common/dist/graphql");
const nexus_1 = require("nexus");
const cityTypes_1 = require("../../details/cityTypes");
const countryTypes_1 = require("../../details/countryTypes");
const types_1 = require("../contact_details.ts/types");
const types_2 = require("../types");
exports.UserAccountType = nexus_1.objectType({
    name: "UserAccount",
    description: "Represents a user's account",
    definition(t) {
        t.id("id", { description: "The ID value of the user's account" });
        t.nullable.string("personTitle", {
            description: "The user's honorific title. Its value can be null or 'Mr', 'Mrs', 'Ms', 'Miss', 'Sr', 'Dr', 'Lady'",
        });
        t.nullable.string("imgUrl", { description: "The URL value of user's account profile picture" });
        t.nullable.field("birthday", { type: graphql_1.DateScalar, description: "User's birthday date" });
        t.nullable.int("age", { description: "User's age" });
        t.nullable.string("address", { description: "The house of office street address of the user" });
        t.nullable.string("zipCode", { description: "The zip code of the house or office street address of the user" });
        t.field("user", {
            type: types_2.UserType,
            description: "The user info of the particular account",
            resolve: o => o.user,
        });
        t.nullable.field("country", {
            type: countryTypes_1.CountryType,
            description: "The country of the user",
            resolve: o => o.country,
        });
        t.nullable.field("city", {
            type: cityTypes_1.CityType,
            description: "The city or hometown of the user",
            resolve: o => o.city,
        });
        t.boolean("trackHistory", { description: "Indicates if to track user's history " });
        t.nullable.list.field("contactDetails", {
            type: types_1.UserContactDetailsType,
            description: "User contact details",
            resolve: o => o.contactDetails,
        });
    },
});
