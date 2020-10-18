"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferCampaignCodeRevealResult = exports.OfferCampaignCodeRevealType = exports.CouponCodeRevealResult = exports.CouponCodeRevealType = exports.AddOfferCampaignCodeResult = exports.AddOfferCampaignCodeType = exports.UpdateOfferCampaignResult = exports.UpdateOfferCampaignType = exports.AddOfferCampaignResult = exports.AddOfferCampaignType = exports.UpdateCouponCodeResult = exports.UpdateCouponCodeType = exports.AddCouponCodeResult = exports.AddCouponCodeType = exports.VoucherCodeQueryResult = exports.OfferCampaignCodeType = exports.OfferCampaignType = exports.CouponCodeType = exports.OfferCampaignCodeInterface = exports.CouponCodeInterface = void 0;
const common_1 = require("@georgekrax-hashtag/common");
const schema_1 = require("@nexus/schema");
const types_1 = require("schema/beach_bar/types");
const types_2 = require("../types");
exports.CouponCodeInterface = schema_1.interfaceType({
    name: "CouponCodeInterface",
    description: "Represents a coupon code interface for a #beach_bar",
    definition(t) {
        t.field("id", { type: common_1.BigIntScalar, nullable: false });
        t.string("title", { nullable: false });
        t.float("discountPercentage", { nullable: false });
        t.boolean("isActive", { nullable: false });
        t.field("validUntil", { type: common_1.DateTimeScalar, nullable: true });
        t.int("timesLimit", { nullable: false, description: "Represents how many times this coupon code can be used" });
        t.int("timesUsed", { nullable: false, description: "Represents the times this coupon code has been used" });
        t.field("beachBar", {
            type: types_1.BeachBarType,
            description: "The #beach_bar this coupon code applies to",
            nullable: true,
            resolve: o => o.beachBar,
        });
        t.resolveType(() => null);
    },
});
exports.OfferCampaignCodeInterface = schema_1.interfaceType({
    name: "OfferCampaignCodeInterface",
    description: "Represents an offer code interface for an offer campaign",
    definition(t) {
        t.field("id", { type: common_1.BigIntScalar, nullable: false });
        t.float("totalAmount", {
            nullable: false,
            description: "The total amount to make a discount from",
            resolve: o => o.campaign.calculateTotalProductPrice(),
        });
        t.int("timesUsed", { nullable: false, description: "Represents how many times this offer code has been used" });
        t.field("campaign", {
            type: exports.OfferCampaignType,
            description: "The campaign the offer code is assigned to",
            nullable: false,
            resolve: o => o.campaign,
        });
        t.field("timestamp", { type: common_1.DateTimeScalar, nullable: false });
        t.field("deletedAt", { type: common_1.DateTimeScalar, nullable: true });
        t.resolveType(() => null);
    },
});
exports.CouponCodeType = schema_1.objectType({
    name: "CouponCode",
    description: "Represents a coupon code",
    definition(t) {
        t.implements(exports.CouponCodeInterface);
    },
});
exports.OfferCampaignType = schema_1.objectType({
    name: "OfferCampaign",
    description: "Represents an offer campaign of a #beach_bar",
    definition(t) {
        t.int("id", { nullable: false });
        t.string("title", { nullable: false });
        t.float("discountPercentage", { nullable: false });
        t.boolean("isActive", { nullable: false });
        t.field("validUntil", { type: common_1.DateTimeScalar, nullable: true });
        t.list.field("products", {
            type: types_2.ProductType,
            description: "A list of products that are discounted via the campaign",
            nullable: false,
            resolve: o => o.products,
        });
    },
});
exports.OfferCampaignCodeType = schema_1.objectType({
    name: "OfferCampaignCode",
    description: "Represents an offer code for a campaign of a product",
    definition(t) {
        t.implements(exports.OfferCampaignCodeInterface);
    },
});
exports.VoucherCodeQueryResult = schema_1.unionType({
    name: "VoucherCodeQueryResult",
    definition(t) {
        t.members("CouponCode", "OfferCampaignCode", "Error");
        t.resolveType(item => {
            if (item.error) {
                return "Error";
            }
            else if (item.campaign) {
                return "OfferCampaignCode";
            }
            else {
                return "CouponCode";
            }
        });
    },
});
exports.AddCouponCodeType = schema_1.objectType({
    name: "AddCouponCode",
    description: "Info to be returned when a coupon code is added (issued)",
    definition(t) {
        t.field("couponCode", {
            type: exports.CouponCodeType,
            description: "The coupon code that is added",
            nullable: false,
            resolve: o => o.couponCode,
        });
        t.boolean("added", {
            nullable: false,
            description: "Indicates if the coupon code has been successfully added",
        });
    },
});
exports.AddCouponCodeResult = schema_1.unionType({
    name: "AddCouponCodeResult",
    definition(t) {
        t.members("AddCouponCode", "Error");
        t.resolveType(item => {
            if (item.error) {
                return "Error";
            }
            else {
                return "AddCouponCode";
            }
        });
    },
});
exports.UpdateCouponCodeType = schema_1.objectType({
    name: "UpdateCouponCode",
    description: "Info to be returned when a coupon code details are updated",
    definition(t) {
        t.field("couponCode", {
            type: exports.CouponCodeType,
            description: "The coupon code that is updated",
            nullable: false,
            resolve: o => o.couponCode,
        });
        t.boolean("updated", {
            nullable: false,
            description: "Indicates if the coupon code has been successfully updated",
        });
    },
});
exports.UpdateCouponCodeResult = schema_1.unionType({
    name: "UpdateCouponCodeResult",
    definition(t) {
        t.members("UpdateCouponCode", "Delete", "Error");
        t.resolveType(item => {
            if (item.error) {
                return "Error";
            }
            else if (item.deleted) {
                return "Delete";
            }
            else {
                return "UpdateCouponCode";
            }
        });
    },
});
exports.AddOfferCampaignType = schema_1.objectType({
    name: "AddOfferCampaign",
    description: "Info to be returned when an offer campaign is added to a or some #beach_bar's product(s)",
    definition(t) {
        t.field("offerCampaign", {
            type: exports.OfferCampaignType,
            description: "The offer campaign that is added",
            nullable: false,
            resolve: o => o.offerCampaign,
        });
        t.boolean("added", {
            nullable: false,
            description: "Indicates if the offer campaign has been successfully added",
        });
    },
});
exports.AddOfferCampaignResult = schema_1.unionType({
    name: "AddOfferCampaignResult",
    definition(t) {
        t.members("AddOfferCampaign", "Error");
        t.resolveType(item => {
            if (item.error) {
                return "Error";
            }
            else {
                return "AddOfferCampaign";
            }
        });
    },
});
exports.UpdateOfferCampaignType = schema_1.objectType({
    name: "UpdateOfferCampaign",
    description: "Info to be returned when an offer campaign details are updated",
    definition(t) {
        t.field("offerCampaign", {
            type: exports.OfferCampaignType,
            description: "The offer campaign that is updated",
            nullable: false,
            resolve: o => o.offerCampaign,
        });
        t.boolean("updated", {
            nullable: false,
            description: "Indicates if the offer campaign details have been successfully updated",
        });
    },
});
exports.UpdateOfferCampaignResult = schema_1.unionType({
    name: "UpdateOfferCampaignResult",
    definition(t) {
        t.members("UpdateOfferCampaign", "Error");
        t.resolveType(item => {
            if (item.error) {
                return "Error";
            }
            else {
                return "UpdateOfferCampaign";
            }
        });
    },
});
exports.AddOfferCampaignCodeType = schema_1.objectType({
    name: "AddOfferCampaignCode",
    description: "Info to be returned when a new offer code, of an offer campaign, is added (issued)",
    definition(t) {
        t.field("offerCode", {
            type: exports.OfferCampaignCodeType,
            description: "The offer code that is added (issued)",
            nullable: false,
            resolve: o => o.offerCode,
        });
        t.boolean("added", {
            nullable: false,
            description: "Indicates if the offer code has been successfully added (issued)",
        });
    },
});
exports.AddOfferCampaignCodeResult = schema_1.unionType({
    name: "AddOfferCampaignCodeResult",
    definition(t) {
        t.members("AddOfferCampaignCode", "Error");
        t.resolveType(item => {
            if (item.error) {
                return "Error";
            }
            else {
                return "AddOfferCampaignCode";
            }
        });
    },
});
exports.CouponCodeRevealType = schema_1.objectType({
    name: "CouponCodeReveal",
    description: "Represents a coupon code, with its referral code revealed",
    definition(t) {
        t.implements(exports.CouponCodeInterface);
        t.string("refCode", { nullable: false, description: "The referral code of the coupon code, to use and get a discount" });
    },
});
exports.CouponCodeRevealResult = schema_1.unionType({
    name: "CouponCodeRevealResult",
    definition(t) {
        t.members("CouponCodeReveal", "Error");
        t.resolveType(item => {
            if (item.error) {
                return "Error";
            }
            else {
                return "CouponCodeReveal";
            }
        });
    },
});
exports.OfferCampaignCodeRevealType = schema_1.objectType({
    name: "OfferCampaignCodeReveal",
    description: "Represents an offer campaign code, with its referral code revealed",
    definition(t) {
        t.implements(exports.OfferCampaignCodeInterface);
        t.string("refCode", { nullable: false, description: "The referral code of the offer campaign code, to use and get a discount" });
    },
});
exports.OfferCampaignCodeRevealResult = schema_1.unionType({
    name: "OfferCampaignCodeRevealResult",
    definition(t) {
        t.members("OfferCampaignCodeReveal", "Error");
        t.resolveType(item => {
            if (item.error) {
                return "Error";
            }
            else {
                return "OfferCampaignCodeReveal";
            }
        });
    },
});
//# sourceMappingURL=types.js.map