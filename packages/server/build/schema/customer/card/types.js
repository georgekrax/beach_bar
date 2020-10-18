"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCardResult = exports.UpdateCardType = exports.AddCardResult = exports.AddCardType = exports.CardType = void 0;
const common_1 = require("@georgekrax-hashtag/common");
const schema_1 = require("@nexus/schema");
const cardBrandTypes_1 = require("../../details/cardBrandTypes");
const countryTypes_1 = require("../../details/countryTypes");
const types_1 = require("../types");
exports.CardType = schema_1.objectType({
    name: "Card",
    description: "Represents a customer's credit or debit card",
    definition(t) {
        t.field("id", { type: common_1.BigIntScalar, nullable: false });
        t.string("type", { nullable: false });
        t.int("expMonth", { nullable: true });
        t.int("expYear", { nullable: true });
        t.string("last4", { nullable: false });
        t.string("cardholderName", { nullable: true });
        t.boolean("isDefault", { nullable: false });
        t.string("stripeId", { nullable: false });
        t.field("customer", {
            type: types_1.CustomerType,
            description: "The customer that owns this credit or debit card",
            nullable: false,
            resolve: o => o.customer,
        });
        t.field("brand", {
            type: cardBrandTypes_1.CardBrandType,
            description: "The brand of the credit or debit card",
            nullable: true,
            resolve: o => o.brand,
        });
        t.field("country", {
            type: countryTypes_1.CountryType,
            description: "The country of the customer's card",
            nullable: true,
            resolve: o => o.country,
        });
    },
});
exports.AddCardType = schema_1.objectType({
    name: "AddCard",
    description: "Info to be returned when a card is added to a customer",
    definition(t) {
        t.field("card", {
            type: exports.CardType,
            description: "The card that is added to a customer",
            nullable: false,
            resolve: o => o.card,
        });
        t.boolean("added", {
            nullable: false,
            description: "A boolean that indicates if the card has been successfully added",
        });
    },
});
exports.AddCardResult = schema_1.unionType({
    name: "AddCardResult",
    definition(t) {
        t.members("AddCard", "Error");
        t.resolveType(item => {
            if (item.error) {
                return "Error";
            }
            else {
                return "AddCard";
            }
        });
    },
});
exports.UpdateCardType = schema_1.objectType({
    name: "UpdateCard",
    description: "Info to be returned when a customer card details are updated",
    definition(t) {
        t.field("card", {
            type: exports.CardType,
            description: "The card that is updated",
            nullable: false,
            resolve: o => o.card,
        });
        t.boolean("updated", {
            nullable: false,
            description: "A boolean that indicates if the card details have been successfully updated",
        });
    },
});
exports.UpdateCardResult = schema_1.unionType({
    name: "UpdateCardResult",
    definition(t) {
        t.members("UpdateCard", "Error");
        t.resolveType(item => {
            if (item.error) {
                return "Error";
            }
            else {
                return "UpdateCard";
            }
        });
    },
});
//# sourceMappingURL=types.js.map