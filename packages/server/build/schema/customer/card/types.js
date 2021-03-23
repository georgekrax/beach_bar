"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCardType = exports.AddCardType = exports.CardType = void 0;
const nexus_1 = require("nexus");
const cardBrandTypes_1 = require("../../details/cardBrandTypes");
const countryTypes_1 = require("../../details/countryTypes");
const types_1 = require("../types");
exports.CardType = nexus_1.objectType({
    name: "Card",
    description: "Represents a customer's credit or debit card",
    definition(t) {
        t.id("id");
        t.string("type");
        t.int("expMonth");
        t.int("expYear");
        t.string("last4");
        t.string("cardholderName");
        t.boolean("isDefault");
        t.string("stripeId");
        t.field("customer", {
            type: types_1.CustomerType,
            description: "The customer that owns this credit or debit card",
            resolve: o => o.customer,
        });
        t.nullable.field("brand", {
            type: cardBrandTypes_1.CardBrandType,
            description: "The brand of the credit or debit card",
            resolve: o => o.brand,
        });
        t.nullable.field("country", {
            type: countryTypes_1.CountryType,
            description: "The country of the customer's card",
            resolve: o => o.country,
        });
    },
});
exports.AddCardType = nexus_1.objectType({
    name: "AddCard",
    description: "Info to be returned when a card is added to a customer",
    definition(t) {
        t.field("card", {
            type: exports.CardType,
            description: "The card that is added to a customer",
            resolve: o => o.card,
        });
        t.boolean("added", {
            description: "A boolean that indicates if the card has been successfully added",
        });
    },
});
exports.UpdateCardType = nexus_1.objectType({
    name: "UpdateCard",
    description: "Info to be returned when a customer card details are updated",
    definition(t) {
        t.field("card", {
            type: exports.CardType,
            description: "The card that is updated",
            resolve: o => o.card,
        });
        t.boolean("updated", {
            description: "A boolean that indicates if the card details have been successfully updated",
        });
    },
});
