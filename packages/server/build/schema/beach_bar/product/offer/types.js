"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferCampaignCodeRevealResult = exports.OfferCampaignCodeRevealType = exports.CouponCodeRevealResult = exports.CouponCodeRevealType = exports.AddOfferCampaignCodeResult = exports.AddOfferCampaignCodeType = exports.UpdateOfferCampaignResult = exports.UpdateOfferCampaignType = exports.AddOfferCampaignResult = exports.AddOfferCampaignType = exports.UpdateCouponCodeResult = exports.UpdateCouponCodeType = exports.AddCouponCodeResult = exports.AddCouponCodeType = exports.VoucherCodeQueryResult = exports.OfferCampaignCodeType = exports.OfferCampaignType = exports.CouponCodeType = exports.OfferCampaignCodeInterface = exports.CouponCodeInterface = void 0;
const graphql_1 = require("@the_hashtag/common/dist/graphql");
const nexus_1 = require("nexus");
const types_1 = require("schema/beach_bar/types");
const types_2 = require("../types");
exports.CouponCodeInterface = nexus_1.interfaceType({
    name: "CouponCodeInterface",
    description: "Represents a coupon code interface for a #beach_bar",
    definition(t) {
        t.field("id", { type: graphql_1.BigIntScalar });
        t.string("title");
        t.float("discountPercentage");
        t.boolean("isActive");
        t.nullable.field("validUntil", { type: graphql_1.DateTimeScalar });
        t.int("timesLimit", { description: "Represents how many times this coupon code can be used" });
        t.int("timesUsed", { description: "Represents the times this coupon code has been used" });
        t.nullable.field("beachBar", {
            type: types_1.BeachBarType,
            description: "The #beach_bar this coupon code applies to",
            resolve: o => o.beachBar,
        });
    },
    resolveType: () => null,
});
exports.OfferCampaignCodeInterface = nexus_1.interfaceType({
    name: "OfferCampaignCodeInterface",
    description: "Represents an offer code interface for an offer campaign",
    definition(t) {
        t.field("id", { type: graphql_1.BigIntScalar });
        t.float("totalAmount", {
            description: "The total amount to make a discount from",
            resolve: o => o.campaign.calculateTotalProductPrice(),
        });
        t.int("timesUsed", { description: "Represents how many times this offer code has been used" });
        t.field("campaign", {
            type: exports.OfferCampaignType,
            description: "The campaign the offer code is assigned to",
            resolve: o => o.campaign,
        });
        t.field("timestamp", { type: graphql_1.DateTimeScalar });
        t.nullable.field("deletedAt", { type: graphql_1.DateTimeScalar });
    },
    resolveType: () => null,
});
exports.CouponCodeType = nexus_1.objectType({
    name: "CouponCode",
    description: "Represents a coupon code",
    definition(t) {
        t.implements(exports.CouponCodeInterface);
    },
});
exports.OfferCampaignType = nexus_1.objectType({
    name: "OfferCampaign",
    description: "Represents an offer campaign of a #beach_bar",
    definition(t) {
        t.id("id");
        t.string("title");
        t.float("discountPercentage");
        t.boolean("isActive");
        t.nullable.field("validUntil", { type: graphql_1.DateTimeScalar });
        t.list.field("products", {
            type: types_2.ProductType,
            description: "A list of products that are discounted via the campaign",
            resolve: o => o.products,
        });
    },
});
exports.OfferCampaignCodeType = nexus_1.objectType({
    name: "OfferCampaignCode",
    description: "Represents an offer code for a campaign of a product",
    definition(t) {
        t.implements(exports.OfferCampaignCodeInterface);
    },
});
exports.VoucherCodeQueryResult = nexus_1.unionType({
    name: "VoucherCodeQueryResult",
    definition(t) {
        t.members("CouponCode", "OfferCampaignCode", "Error");
    },
    resolveType: item => {
        if (item.name === "Error") {
            return "Error";
        }
        else if (item.name === "OfferCampaignCode") {
            return "OfferCampaignCode";
        }
        else {
            return "CouponCode";
        }
    },
});
exports.AddCouponCodeType = nexus_1.objectType({
    name: "AddCouponCode",
    description: "Info to be returned when a coupon code is added (issued)",
    definition(t) {
        t.field("couponCode", {
            type: exports.CouponCodeType,
            description: "The coupon code that is added",
            resolve: o => o.couponCode,
        });
        t.boolean("added", { description: "Indicates if the coupon code has been successfully added" });
    },
});
exports.AddCouponCodeResult = nexus_1.unionType({
    name: "AddCouponCodeResult",
    definition(t) {
        t.members("AddCouponCode", "Error");
    },
    resolveType: item => {
        if (item.name === "Error") {
            return "Error";
        }
        else {
            return "AddCouponCode";
        }
    },
});
exports.UpdateCouponCodeType = nexus_1.objectType({
    name: "UpdateCouponCode",
    description: "Info to be returned when a coupon code details are updated",
    definition(t) {
        t.field("couponCode", {
            type: exports.CouponCodeType,
            description: "The coupon code that is updated",
            resolve: o => o.couponCode,
        });
        t.boolean("updated", { description: "Indicates if the coupon code has been successfully updated" });
    },
});
exports.UpdateCouponCodeResult = nexus_1.unionType({
    name: "UpdateCouponCodeResult",
    definition(t) {
        t.members("UpdateCouponCode", "Delete", "Error");
    },
    resolveType: item => {
        if (item.name === "Error") {
            return "Error";
        }
        else if (item.name === "Delete") {
            return "Delete";
        }
        else {
            return "UpdateCouponCode";
        }
    },
});
exports.AddOfferCampaignType = nexus_1.objectType({
    name: "AddOfferCampaign",
    description: "Info to be returned when an offer campaign is added to a or some #beach_bar's product(s)",
    definition(t) {
        t.field("offerCampaign", {
            type: exports.OfferCampaignType,
            description: "The offer campaign that is added",
            resolve: o => o.offerCampaign,
        });
        t.boolean("added", { description: "Indicates if the offer campaign has been successfully added" });
    },
});
exports.AddOfferCampaignResult = nexus_1.unionType({
    name: "AddOfferCampaignResult",
    definition(t) {
        t.members("AddOfferCampaign", "Error");
    },
    resolveType: item => {
        if (item.name === "Error") {
            return "Error";
        }
        else {
            return "AddOfferCampaign";
        }
    },
});
exports.UpdateOfferCampaignType = nexus_1.objectType({
    name: "UpdateOfferCampaign",
    description: "Info to be returned when an offer campaign details are updated",
    definition(t) {
        t.field("offerCampaign", {
            type: exports.OfferCampaignType,
            description: "The offer campaign that is updated",
            resolve: o => o.offerCampaign,
        });
        t.boolean("updated", { description: "Indicates if the offer campaign details have been successfully updated" });
    },
});
exports.UpdateOfferCampaignResult = nexus_1.unionType({
    name: "UpdateOfferCampaignResult",
    definition(t) {
        t.members("UpdateOfferCampaign", "Error");
    },
    resolveType: item => {
        if (item.name === "Error") {
            return "Error";
        }
        else {
            return "UpdateOfferCampaign";
        }
    },
});
exports.AddOfferCampaignCodeType = nexus_1.objectType({
    name: "AddOfferCampaignCode",
    description: "Info to be returned when a new offer code, of an offer campaign, is added (issued)",
    definition(t) {
        t.field("offerCode", {
            type: exports.OfferCampaignCodeType,
            description: "The offer code that is added (issued)",
            resolve: o => o.offerCode,
        });
        t.boolean("added", { description: "Indicates if the offer code has been successfully added (issued)" });
    },
});
exports.AddOfferCampaignCodeResult = nexus_1.unionType({
    name: "AddOfferCampaignCodeResult",
    definition(t) {
        t.members("AddOfferCampaignCode", "Error");
    },
    resolveType: item => {
        if (item.name === "Error") {
            return "Error";
        }
        else {
            return "AddOfferCampaignCode";
        }
    },
});
exports.CouponCodeRevealType = nexus_1.objectType({
    name: "CouponCodeReveal",
    description: "Represents a coupon code, with its referral code revealed",
    definition(t) {
        t.implements(exports.CouponCodeInterface);
        t.string("refCode", { description: "The referral code of the coupon code, to use and get a discount" });
    },
});
exports.CouponCodeRevealResult = nexus_1.unionType({
    name: "CouponCodeRevealResult",
    definition(t) {
        t.members("CouponCodeReveal", "Error");
    },
    resolveType: item => {
        if (item.name === "Error") {
            return "Error";
        }
        else {
            return "CouponCodeReveal";
        }
    },
});
exports.OfferCampaignCodeRevealType = nexus_1.objectType({
    name: "OfferCampaignCodeReveal",
    description: "Represents an offer campaign code, with its referral code revealed",
    definition(t) {
        t.implements(exports.OfferCampaignCodeInterface);
        t.string("refCode", { description: "The referral code of the offer campaign code, to use and get a discount" });
    },
});
exports.OfferCampaignCodeRevealResult = nexus_1.unionType({
    name: "OfferCampaignCodeRevealResult",
    definition(t) {
        t.members("OfferCampaignCodeReveal", "Error");
    },
    resolveType: item => {
        if (item.name === "Error") {
            return "Error";
        }
        else {
            return "OfferCampaignCodeReveal";
        }
    },
});
