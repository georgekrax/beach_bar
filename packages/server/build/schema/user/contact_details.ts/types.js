"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserContactDetailsResult = exports.UpdateUserContactDetailsType = exports.AddUserContactDetailsResult = exports.AddUserContactDetailsType = exports.UserContactDetailsType = void 0;
const common_1 = require("@georgekrax-hashtag/common");
const schema_1 = require("@nexus/schema");
const countryTypes_1 = require("../../details/countryTypes");
const types_1 = require("../account/types");
exports.UserContactDetailsType = schema_1.objectType({
    name: "UserContactDetails",
    description: "Represents the contact details info of a user",
    definition(t) {
        t.int("id", { nullable: false, description: "The ID value of user's account contact details" });
        t.field("account", { type: types_1.UserAccountType, nullable: false, description: "The account of user", resolve: o => o.account });
        t.field("country", {
            type: countryTypes_1.CountryType,
            nullable: true,
            description: "The country origin of a user",
            resolve: o => o.country,
        });
        t.field("secondaryEmail", { type: common_1.EmailScalar, nullable: true, description: "A secondary email address to contact the user" });
        t.string("phoneNumber", { nullable: true, description: "User's phone number" });
    },
});
exports.AddUserContactDetailsType = schema_1.objectType({
    name: "AddUserContactDetails",
    description: "Info to be returned when contact details are added (assigned) to a user",
    definition(t) {
        t.field("contactDetails", {
            type: exports.UserContactDetailsType,
            description: "The contact details of the user",
            nullable: false,
            resolve: o => o.contactDetails,
        });
        t.boolean("added", {
            nullable: false,
            description: "A boolean that indicates if the contact details have been successfully added (assigned) to the user",
        });
    },
});
exports.AddUserContactDetailsResult = schema_1.unionType({
    name: "AddUserContactDetailsResult",
    definition(t) {
        t.members("AddUserContactDetails", "Error");
        t.resolveType(item => {
            if (item.error) {
                return "Error";
            }
            else {
                return "AddUserContactDetails";
            }
        });
    },
});
exports.UpdateUserContactDetailsType = schema_1.objectType({
    name: "UpdateUserContactDetails",
    description: "Info to be returned when contact details of a user are updated",
    definition(t) {
        t.field("contactDetails", {
            type: exports.UserContactDetailsType,
            description: "The contact details of the user",
            nullable: false,
            resolve: o => o.contactDetails,
        });
        t.boolean("updated", {
            nullable: false,
            description: "A boolean that indicates if the contact details of the user have been successfully updated",
        });
    },
});
exports.UpdateUserContactDetailsResult = schema_1.unionType({
    name: "UpdateUserContactDetailsResult",
    definition(t) {
        t.members("UpdateUserContactDetails", "Error");
        t.resolveType(item => {
            if (item.error) {
                return "Error";
            }
            else {
                return "UpdateUserContactDetails";
            }
        });
    },
});
//# sourceMappingURL=types.js.map