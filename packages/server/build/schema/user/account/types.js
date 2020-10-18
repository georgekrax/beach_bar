"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAccountType = void 0;
const common_1 = require("@georgekrax-hashtag/common");
const schema_1 = require("@nexus/schema");
const cityTypes_1 = require("../../details/cityTypes");
const countryTypes_1 = require("../../details/countryTypes");
const types_1 = require("../contact_details.ts/types");
const types_2 = require("../types");
exports.UserAccountType = schema_1.objectType({
    name: "UserAccount",
    description: "Represents a user's account",
    definition(t) {
        t.int("id", { nullable: false, description: "The ID value of the user's account" });
        t.string("personTitle", {
            nullable: true,
            description: "The user's honorific title. Its value can be null or 'Mr', 'Mrs', 'Ms', 'Miss', 'Sr', 'Dr', 'Lady'",
        });
        t.string("imgUrl", { nullable: true, description: "The URL value of user's account profile picture" });
        t.field("birthday", { type: common_1.DateScalar, nullable: true, description: "User's birthday date" });
        t.int("age", { nullable: true, description: "User's age" });
        t.string("address", { nullable: true, description: "The house of office street address of the user" });
        t.string("zipCode", { nullable: true, description: "The zip code of the house or office street address of the user" });
        t.field("user", {
            type: types_2.UserType,
            description: "The user info of the particular account",
            nullable: false,
            resolve: o => o.user,
        });
        t.field("country", {
            type: countryTypes_1.CountryType,
            description: "The country of the user",
            nullable: true,
            resolve: o => o.country,
        });
        t.field("city", {
            type: cityTypes_1.CityType,
            description: "The city or hometown of the user",
            nullable: true,
            resolve: o => o.city,
        });
        t.boolean("trackHistory", { nullable: false, description: "Indicates if to track user's history " });
        t.list.field("contactDetails", {
            type: types_1.UserContactDetailsType,
            description: "User contact details",
            nullable: true,
            resolve: o => o.contactDetails,
        });
    },
});
//# sourceMappingURL=types.js.map