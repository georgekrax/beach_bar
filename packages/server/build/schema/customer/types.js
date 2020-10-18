"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCustomerResult = exports.UpdateCustomerType = exports.AddCustomerResult = exports.AddCustomerType = exports.CustomerType = void 0;
const common_1 = require("@georgekrax-hashtag/common");
const schema_1 = require("@nexus/schema");
const countryTypes_1 = require("../details/countryTypes");
const types_1 = require("../user/types");
const types_2 = require("./card/types");
exports.CustomerType = schema_1.objectType({
    name: "Customer",
    description: "Represents a customer",
    definition(t) {
        t.field("id", { type: common_1.BigIntScalar, nullable: false });
        t.field("email", { type: common_1.EmailScalar, nullable: false });
        t.string("phoneNumber", { nullable: false });
        t.field("user", {
            type: types_1.UserType,
            description: "The user that is a customer too",
            nullable: true,
            resolve: o => o.user,
        });
        t.list.field("cards", {
            type: types_2.CardType,
            description: "A list of all the customers cards",
            nullable: true,
            resolve: o => o.cards,
        });
        t.field("country", {
            type: countryTypes_1.CountryType,
            description: "The country of the customer",
            nullable: true,
            resolve: o => o.country,
        });
    },
});
exports.AddCustomerType = schema_1.objectType({
    name: "AddCustomer",
    description: "Info to be returned when a customer is added (registered)",
    definition(t) {
        t.field("customer", {
            type: exports.CustomerType,
            description: "The customer that is added (registered)",
            nullable: false,
            resolve: o => o.customer,
        });
        t.boolean("added", {
            nullable: false,
            description: "A boolean that indicates if the customer has been successfully added (registered)",
        });
    },
});
exports.AddCustomerResult = schema_1.unionType({
    name: "AddCustomerResult",
    definition(t) {
        t.members("AddCustomer", "Error");
        t.resolveType(item => {
            if (item.error) {
                return "Error";
            }
            else {
                return "AddCustomer";
            }
        });
    },
});
exports.UpdateCustomerType = schema_1.objectType({
    name: "UpdateCustomer",
    description: "Info to be returned when a customer details are updated",
    definition(t) {
        t.field("customer", {
            type: exports.CustomerType,
            description: "The customer that is updated",
            nullable: false,
            resolve: o => o.customer,
        });
        t.boolean("updated", {
            nullable: false,
            description: "A boolean that indicates if the customer details have been successfully updated",
        });
    },
});
exports.UpdateCustomerResult = schema_1.unionType({
    name: "UpdateCustomerResult",
    definition(t) {
        t.members("UpdateCustomer", "Error");
        t.resolveType(item => {
            if (item.error) {
                return "Error";
            }
            else {
                return "UpdateCustomer";
            }
        });
    },
});
//# sourceMappingURL=types.js.map