import { BigIntScalar, DateTimeScalar } from "@the_hashtag/common/dist/graphql";
import { interfaceType, objectType, unionType } from "nexus";
import { BeachBarType } from "schema/beach_bar/types";
import { ProductType } from "../types";

export const CouponCodeInterface = interfaceType({
  name: "CouponCodeInterface",
  description: "Represents a coupon code interface for a #beach_bar",
  definition(t) {
    t.field("id", { type: BigIntScalar });
    t.string("title");
    t.float("discountPercentage");
    t.boolean("isActive");
    t.nullable.field("validUntil", { type: DateTimeScalar });
    t.int("timesLimit", { description: "Represents how many times this coupon code can be used" });
    t.int("timesUsed", { description: "Represents the times this coupon code has been used" });
    t.nullable.field("beachBar", {
      type: BeachBarType,
      description: "The #beach_bar this coupon code applies to",
      resolve: o => o.beachBar,
    });
  },
  resolveType: () => null,
});

export const OfferCampaignCodeInterface = interfaceType({
  name: "OfferCampaignCodeInterface",
  description: "Represents an offer code interface for an offer campaign",
  definition(t) {
    t.field("id", { type: BigIntScalar });
    t.float("totalAmount", {
      description: "The total amount to make a discount from",
      resolve: o => o.campaign.calculateTotalProductPrice(),
    });
    t.int("timesUsed", { description: "Represents how many times this offer code has been used" });
    t.field("campaign", {
      type: OfferCampaignType,
      description: "The campaign the offer code is assigned to",
      resolve: o => o.campaign,
    });
    t.field("timestamp", { type: DateTimeScalar });
    t.nullable.field("deletedAt", { type: DateTimeScalar });
  },
  resolveType: () => null,
});

export const CouponCodeType = objectType({
  name: "CouponCode",
  description: "Represents a coupon code",
  definition(t) {
    t.implements(CouponCodeInterface);
  },
});

export const OfferCampaignType = objectType({
  name: "OfferCampaign",
  description: "Represents an offer campaign of a #beach_bar",
  definition(t) {
    t.id("id");
    t.string("title");
    t.float("discountPercentage");
    t.boolean("isActive");
    t.nullable.field("validUntil", { type: DateTimeScalar });
    t.list.field("products", {
      type: ProductType,
      description: "A list of products that are discounted via the campaign",
      resolve: o => o.products,
    });
  },
});

export const OfferCampaignCodeType = objectType({
  name: "OfferCampaignCode",
  description: "Represents an offer code for a campaign of a product",
  definition(t) {
    t.implements(OfferCampaignCodeInterface);
  },
});

export const VoucherCodeQueryResult = unionType({
  name: "VoucherCodeQueryResult",
  definition(t) {
    t.members("CouponCode", "OfferCampaignCode", "Error");
  },
  resolveType: item => {
    if (item.name === "Error") {
      return "Error";
    } else if (item.name === "OfferCampaignCode") {
      return "OfferCampaignCode";
    } else {
      return "CouponCode";
    }
  },
});

export const AddCouponCodeType = objectType({
  name: "AddCouponCode",
  description: "Info to be returned when a coupon code is added (issued)",
  definition(t) {
    t.field("couponCode", {
      type: CouponCodeType,
      description: "The coupon code that is added",
      resolve: o => o.couponCode,
    });
    t.boolean("added", { description: "Indicates if the coupon code has been successfully added" });
  },
});

export const AddCouponCodeResult = unionType({
  name: "AddCouponCodeResult",
  definition(t) {
    t.members("AddCouponCode", "Error");
  },
  resolveType: item => {
    if (item.name === "Error") {
      return "Error";
    } else {
      return "AddCouponCode";
    }
  },
});

export const UpdateCouponCodeType = objectType({
  name: "UpdateCouponCode",
  description: "Info to be returned when a coupon code details are updated",
  definition(t) {
    t.field("couponCode", {
      type: CouponCodeType,
      description: "The coupon code that is updated",
      resolve: o => o.couponCode,
    });
    t.boolean("updated", { description: "Indicates if the coupon code has been successfully updated" });
  },
});

// * Add also the DeleteType
export const UpdateCouponCodeResult = unionType({
  name: "UpdateCouponCodeResult",
  definition(t) {
    t.members("UpdateCouponCode", "Delete", "Error");
  },
  resolveType: item => {
    if (item.name === "Error") {
      return "Error";
    } else if (item.name === "Delete") {
      return "Delete";
    } else {
      return "UpdateCouponCode";
    }
  },
});

export const AddOfferCampaignType = objectType({
  name: "AddOfferCampaign",
  description: "Info to be returned when an offer campaign is added to a or some #beach_bar's product(s)",
  definition(t) {
    t.field("offerCampaign", {
      type: OfferCampaignType,
      description: "The offer campaign that is added",
      resolve: o => o.offerCampaign,
    });
    t.boolean("added", { description: "Indicates if the offer campaign has been successfully added" });
  },
});

export const AddOfferCampaignResult = unionType({
  name: "AddOfferCampaignResult",
  definition(t) {
    t.members("AddOfferCampaign", "Error");
  },
  resolveType: item => {
    if (item.name === "Error") {
      return "Error";
    } else {
      return "AddOfferCampaign";
    }
  },
});

export const UpdateOfferCampaignType = objectType({
  name: "UpdateOfferCampaign",
  description: "Info to be returned when an offer campaign details are updated",
  definition(t) {
    t.field("offerCampaign", {
      type: OfferCampaignType,
      description: "The offer campaign that is updated",
      resolve: o => o.offerCampaign,
    });
    t.boolean("updated", { description: "Indicates if the offer campaign details have been successfully updated" });
  },
});

export const UpdateOfferCampaignResult = unionType({
  name: "UpdateOfferCampaignResult",
  definition(t) {
    t.members("UpdateOfferCampaign", "Error");
  },
  resolveType: item => {
    if (item.name === "Error") {
      return "Error";
    } else {
      return "UpdateOfferCampaign";
    }
  },
});

export const AddOfferCampaignCodeType = objectType({
  name: "AddOfferCampaignCode",
  description: "Info to be returned when a new offer code, of an offer campaign, is added (issued)",
  definition(t) {
    t.field("offerCode", {
      type: OfferCampaignCodeType,
      description: "The offer code that is added (issued)",
      resolve: o => o.offerCode,
    });
    t.boolean("added", { description: "Indicates if the offer code has been successfully added (issued)" });
  },
});

export const AddOfferCampaignCodeResult = unionType({
  name: "AddOfferCampaignCodeResult",
  definition(t) {
    t.members("AddOfferCampaignCode", "Error");
  },
  resolveType: item => {
    if (item.name === "Error") {
      return "Error";
    } else {
      return "AddOfferCampaignCode";
    }
  },
});

export const CouponCodeRevealType = objectType({
  name: "CouponCodeReveal",
  description: "Represents a coupon code, with its referral code revealed",
  definition(t) {
    t.implements(CouponCodeInterface);
    t.string("refCode", { description: "The referral code of the coupon code, to use and get a discount" });
  },
});

export const CouponCodeRevealResult = unionType({
  name: "CouponCodeRevealResult",
  definition(t) {
    t.members("CouponCodeReveal", "Error");
  },
  resolveType: item => {
    if (item.name === "Error") {
      return "Error";
    } else {
      return "CouponCodeReveal";
    }
  },
});

export const OfferCampaignCodeRevealType = objectType({
  name: "OfferCampaignCodeReveal",
  description: "Represents an offer campaign code, with its referral code revealed",
  definition(t) {
    t.implements(OfferCampaignCodeInterface);
    t.string("refCode", { description: "The referral code of the offer campaign code, to use and get a discount" });
  },
});

export const OfferCampaignCodeRevealResult = unionType({
  name: "OfferCampaignCodeRevealResult",
  definition(t) {
    t.members("OfferCampaignCodeReveal", "Error");
  },
  resolveType: item => {
    if (item.name === "Error") {
      return "Error";
    } else {
      return "OfferCampaignCodeReveal";
    }
  },
});
