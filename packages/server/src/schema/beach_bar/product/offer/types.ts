import { BigIntScalar, DateTimeScalar } from "@beach_bar/common";
import { objectType, unionType } from "@nexus/schema";
import { ProductType } from "../types";

export const ProductCouponCodeType = objectType({
  name: "ProductCouponCode",
  description: "Represents a coupon code for a product",
  definition(t) {
    t.field("id", { type: BigIntScalar, nullable: false });
    t.string("title", { nullable: false });
    t.string("refCode", { nullable: false });
    t.float("discountPercentage", { nullable: false });
    t.boolean("beachBarOffer", { nullable: false });
    t.boolean("isActive", { nullable: false });
    t.field("validUntil", { type: DateTimeScalar, nullable: true });
    t.int("timesLimit", { nullable: false, description: "Represents how many times this coupon code can be used" });
    t.int("timesUsed", { nullable: false, description: "Represents the times this coupon code has been used" });
  },
});

export const ProductOfferCampaignType = objectType({
  name: "ProductOfferCampaign",
  description: "Represents an offer campaign for a product",
  definition(t) {
    t.int("id", { nullable: false });
    t.string("title", { nullable: false });
    t.float("discountPercentage", { nullable: false });
    t.boolean("beachBarOffer", { nullable: false });
    t.boolean("isActive", { nullable: false });
    t.field("validUntil", { type: DateTimeScalar, nullable: true });
    t.list.field("products", {
      type: ProductType,
      description: "A list of products that are discounted via the campaign",
      nullable: false,
      resolve: o => o.products,
    });
  },
});

export const ProductOfferCodeType = objectType({
  name: "ProductOfferCode",
  description: "Represents an offer code for a campaign of a product",
  definition(t) {
    t.field("id", { type: BigIntScalar, nullable: false });
    t.float("totalAmount", {
      nullable: false,
      description: "The total amount to make a discount from",
      resolve: o => o.campaign.calculateTotalProductPrice(),
    });
    t.int("timesUsed", { nullable: false, description: "Represents how many times this offer code has been used" });
    t.boolean("isRedeemed", { nullable: false, description: "Indicates if the offer code has been fully redeemed" });
    t.field("campaign", {
      type: ProductOfferCampaignType,
      description: "The campaign the offer code is assigned to",
      nullable: false,
      resolve: o => o.campaign,
    });
    t.field("timestamp", { type: DateTimeScalar, nullable: false });
    t.field("deletedAt", { type: DateTimeScalar, nullable: true });
  },
});

export const ProductOfferQueryResult = unionType({
  name: "ProductOfferQuery",
  definition(t) {
    t.members("ProductCouponCode", "ProductOfferCode", "Error");
    t.resolveType(item => {
      if (item.error) {
        return "Error";
      } else if (item.campaign) {
        return "ProductOfferCode";
      } else {
        return "ProductCouponCode";
      }
    });
  },
});

export const AddProductCouponCodeType = objectType({
  name: "AddProductCouponCode",
  description: "Info to be returned when a coupon code is added",
  definition(t) {
    t.field("couponCode", {
      type: ProductCouponCodeType,
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

export const AddProductCouponCodeResult = unionType({
  name: "AddProductCouponCodeResult",
  definition(t) {
    t.members("AddProductCouponCode", "Error");
    t.resolveType(item => {
      if (item.error) {
        return "Error";
      } else {
        return "AddProductCouponCode";
      }
    });
  },
});

export const UpdateProductCouponCodeType = objectType({
  name: "UpdateProductCouponCode",
  description: "Info to be returned when a coupon code details are updated",
  definition(t) {
    t.field("couponCode", {
      type: ProductCouponCodeType,
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

// * Add also the DeleteType
export const UpdateProductCouponCodeResult = unionType({
  name: "UpdateProductCouponCodeResult",
  definition(t) {
    t.members("UpdateProductCouponCode", "Delete", "Error");
    t.resolveType(item => {
      if (item.error) {
        return "Error";
      } else if (item.deleted) {
        return "Delete";
      } else {
        return "UpdateProductCouponCode";
      }
    });
  },
});

export const AddProductOfferCampaignType = objectType({
  name: "AddProductOfferCampaign",
  description: "Info to be returned when an offer campaign is added to a or some #beach_bar's product(s)",
  definition(t) {
    t.field("offerCampaign", {
      type: ProductOfferCampaignType,
      description: "The offer campaign that is added to a or some product(s)",
      nullable: false,
      resolve: o => o.offerCampaign,
    });
    t.boolean("added", {
      nullable: false,
      description: "Indicates if the offer campaign has been successfully added",
    });
  },
});

export const AddProductOfferCampaignResult = unionType({
  name: "AddProductOfferCampaignResult",
  definition(t) {
    t.members("AddProductOfferCampaign", "Error");
    t.resolveType(item => {
      if (item.error) {
        return "Error";
      } else {
        return "AddProductOfferCampaign";
      }
    });
  },
});

export const UpdateProductOfferCampaignType = objectType({
  name: "UpdateProductOfferCampaign",
  description: "Info to be returned when an offer campaign details are updated",
  definition(t) {
    t.field("offerCampaign", {
      type: ProductOfferCampaignType,
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

export const UpdateProductOfferCampaignResult = unionType({
  name: "UpdateProductOfferCampaignResult",
  definition(t) {
    t.members("UpdateProductOfferCampaign", "Error");
    t.resolveType(item => {
      if (item.error) {
        return "Error";
      } else {
        return "UpdateProductOfferCampaign";
      }
    });
  },
});

export const AddProductOfferCodeType = objectType({
  name: "AddProductOfferCode",
  description: "Info to be returned when a new offer code, of an offer campaign, is added (issued)",
  definition(t) {
    t.field("offerCode", {
      type: ProductOfferCodeType,
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

export const AddProductOfferCodeResult = unionType({
  name: "AddProductOfferCodeResult",
  definition(t) {
    t.members("AddProductOfferCode", "Error");
    t.resolveType(item => {
      if (item.error) {
        return "Error";
      } else {
        return "AddProductOfferCode";
      }
    });
  },
});

export const UpdateProductOfferCodeType = objectType({
  name: "UpdateProductOfferCode",
  description: "Info to be returned when an offer code, of an offer campaign, is updated",
  definition(t) {
    t.field("offerCampaign", {
      type: ProductOfferCodeType,
      description: "The offer code that is updated",
      nullable: false,
      resolve: o => o.offerCampaign,
    });
    t.boolean("updated", {
      nullable: false,
      description: "Indicates if the offer code has been successfully updated",
    });
  },
});

export const UpdateProductOfferCodeResult = unionType({
  name: "UpdateProductOfferCodeResult",
  definition(t) {
    t.members("UpdateProductOfferCode", "Error");
    t.resolveType(item => {
      if (item.error) {
        return "Error";
      } else {
        return "UpdateProductOfferCode";
      }
    });
  },
});
