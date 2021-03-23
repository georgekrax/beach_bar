"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCustomerType = exports.AddCustomerType = exports.CustomerType = void 0;
const graphql_1 = require("@the_hashtag/common/dist/graphql");
const nexus_1 = require("nexus");
const countryTypes_1 = require("../details/countryTypes");
const types_1 = require("../user/types");
const types_2 = require("./card/types");
exports.CustomerType = nexus_1.objectType({
    name: "Customer",
    description: "Represents a customer",
    definition(t) {
        t.id("id");
        t.field("email", { type: graphql_1.EmailScalar });
        t.nullable.string("phoneNumber");
        t.nullable.field("user", {
            type: types_1.UserType,
            description: "The user that is a customer too",
            resolve: o => o.user,
        });
        t.nullable.list.field("cards", {
            type: types_2.CardType,
            description: "A list of all the customers cards",
            resolve: o => o.cards,
        });
        t.nullable.field("country", {
            type: countryTypes_1.CountryType,
            description: "The country of the customer",
            resolve: o => o.country,
        });
    },
});
exports.AddCustomerType = nexus_1.objectType({
    name: "AddCustomer",
    description: "Info to be returned when a customer is added (registered)",
    definition(t) {
        t.field("customer", {
            type: exports.CustomerType,
            description: "The customer that is added (registered)",
            resolve: o => o.customer,
        });
        t.boolean("added", {
            description: "A boolean that indicates if the customer has been successfully added (registered)",
        });
    },
});
exports.UpdateCustomerType = nexus_1.objectType({
    name: "UpdateCustomer",
    description: "Info to be returned when a customer details are updated",
    definition(t) {
        t.field("customer", {
            type: exports.CustomerType,
            description: "The customer that is updated",
            resolve: o => o.customer,
        });
        t.boolean("updated", {
            description: "A boolean that indicates if the customer details have been successfully updated",
        });
    },
});
