"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserContactDetailsResult = exports.UpdateUserContactDetailsType = exports.AddUserContactDetailsResult = exports.AddUserContactDetailsType = exports.UserContactDetailsType = void 0;
const graphql_1 = require("@the_hashtag/common/dist/graphql");
const nexus_1 = require("nexus");
const countryTypes_1 = require("../../details/countryTypes");
const types_1 = require("../account/types");
exports.UserContactDetailsType = nexus_1.objectType({
    name: "UserContactDetails",
    description: "Represents the contact details info of a user",
    definition(t) {
        t.id("id", { description: "The ID value of user's account contact details" });
        t.field("account", { type: types_1.UserAccountType, description: "The account of user", resolve: o => o.account });
        t.nullable.field("country", {
            type: countryTypes_1.CountryType,
            description: "The country origin of a user",
            resolve: o => o.country,
        });
        t.nullable.field("secondaryEmail", { type: graphql_1.EmailScalar, description: "A secondary email address to contact the user" });
        t.nullable.string("phoneNumber", { description: "User's phone number" });
    },
});
exports.AddUserContactDetailsType = nexus_1.objectType({
    name: "AddUserContactDetails",
    description: "Info to be returned when contact details are added (assigned) to a user",
    definition(t) {
        t.field("contactDetails", {
            type: exports.UserContactDetailsType,
            description: "The contact details of the user",
            resolve: o => o.contactDetails,
        });
        t.boolean("added", {
            description: "A boolean that indicates if the contact details have been successfully added (assigned) to the user",
        });
    },
});
exports.AddUserContactDetailsResult = nexus_1.unionType({
    name: "AddUserContactDetailsResult",
    definition(t) {
        t.members("AddUserContactDetails", "Error");
    },
    resolveType: item => {
        if (item.name === "Error") {
            return "Error";
        }
        else {
            return "AddUserContactDetails";
        }
    },
});
exports.UpdateUserContactDetailsType = nexus_1.objectType({
    name: "UpdateUserContactDetails",
    description: "Info to be returned when contact details of a user are updated",
    definition(t) {
        t.field("contactDetails", {
            type: exports.UserContactDetailsType,
            description: "The contact details of the user",
            resolve: o => o.contactDetails,
        });
        t.boolean("updated", {
            description: "A boolean that indicates if the contact details of the user have been successfully updated",
        });
    },
});
exports.UpdateUserContactDetailsResult = nexus_1.unionType({
    name: "UpdateUserContactDetailsResult",
    definition(t) {
        t.members("UpdateUserContactDetails", "Error");
    },
    resolveType: item => {
        if (item.name === "Error") {
            return "Error";
        }
        else {
            return "UpdateUserContactDetails";
        }
    },
});
