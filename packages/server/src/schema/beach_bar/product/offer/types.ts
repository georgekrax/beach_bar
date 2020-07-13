import { BigIntScalar, DateTimeScalar } from "@beach_bar/common";
import { objectType, unionType } from "@nexus/schema";
import { ProductType } from "../types";

export const ProductCouponCodeType = objectType({
  name: "ProductCouponCode",
  description: "Represents a coupon code for a product",
  definition(t) {
    t.int("id", { nullable: false });
    t.string("title", { nullable: false });
    t.string("refCode", { nullable: false });
    t.float("discountAmount", { nullable: false });
    t.float("discountPercentage", { nullable: false });
    t.boolean("beachBarOffer", { nullable: false });
    t.boolean("isActive", { nullable: false });
    t.field("validUntil", { type: DateTimeScalar, nullable: true });
    t.field("product", {
      type: ProductType,
      description: "The product that is discounted via the coupon code",
      nullable: false,
      resolve: o => o.product,
    });
  },
});

export const ProductVoucherCampaignType = objectType({
  name: "ProductVoucherCampaign",
  description: "Represents a voucher campaign for a product",
  definition(t) {
    t.int("id", { nullable: false });
    t.string("title", { nullable: false });
    t.float("discountAmount", { nullable: false });
    t.float("discountPercentage", { nullable: false });
    t.boolean("beachBarOffer", { nullable: false });
    t.boolean("isActive", { nullable: false });
    t.field("validUntil", { type: DateTimeScalar, nullable: true });
    t.field("product", {
      type: ProductType,
      description: "The product that is discounted via the campaign",
      nullable: false,
      resolve: o => o.product,
    });
  },
});

export const ProductVoucherCodeType = objectType({
  name: "ProductVoucherCode",
  description: "Represents a voucher code for a campaign of a product",
  definition(t) {
    t.field("id", { type: BigIntScalar, nullable: false });
    t.field("timestamp", { type: DateTimeScalar, nullable: false });
    t.field("deletedAt", { type: DateTimeScalar, nullable: true });
    t.field("campaign", {
      type: ProductVoucherCampaignType,
      description: "The campaign the voucher code is assigned to",
      nullable: false,
      resolve: o => o.campaign,
    });
  },
});

export const AddProductCouponCodeType = objectType({
  name: "AddProductCouponCode",
  description: "Info to be returned when a coupon code is added to a #beach_bar's product",
  definition(t) {
    t.field("couponCode", {
      type: ProductCouponCodeType,
      description: "The coupon code of the product that is added",
      nullable: false,
      resolve: o => o.couponCode,
    });
    t.boolean("added", {
      nullable: false,
      description: "A boolean that indicates if the coupon code has been successfully added to the #beach_bar's product",
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
  description: "Info to be returned when a coupon code of a #beach_bar's product is updated",
  definition(t) {
    t.field("couponCode", {
      type: ProductCouponCodeType,
      description: "The coupon code of the product that is updated",
      nullable: false,
      resolve: o => o.couponCode,
    });
    t.boolean("updated", {
      nullable: false,
      description: "A boolean that indicates if the coupon code has been successfully updated",
    });
  },
});

export const UpdateProductCouponCodeResult = unionType({
  name: "UpdateProductCouponCodeResult",
  definition(t) {
    t.members("UpdateProductCouponCode", "Error");
    t.resolveType(item => {
      if (item.error) {
        return "Error";
      } else {
        return "UpdateProductCouponCode";
      }
    });
  },
});

export const AddProductVoucherCampaignType = objectType({
  name: "AddProductVoucherCampaign",
  description: "Info to be returned when a voucher campaign is added to a #beach_bar's product",
  definition(t) {
    t.field("voucherCampaign", {
      type: ProductVoucherCampaignType,
      description: "The voucher campaign of the product that is added",
      nullable: false,
      resolve: o => o.voucherCampaign,
    });
    t.boolean("added", {
      nullable: false,
      description: "A boolean that indicates if the voucher campaign has been successfully added to the #beach_bar's product",
    });
  },
});

export const AddProductVoucherCampaignResult = unionType({
  name: "AddProductVoucherCampaignResult",
  definition(t) {
    t.members("AddProductVoucherCampaign", "Error");
    t.resolveType(item => {
      if (item.error) {
        return "Error";
      } else {
        return "AddProductVoucherCampaign";
      }
    });
  },
});

export const UpdateProductVoucherCampaignType = objectType({
  name: "UpdateProductVoucherCampaign",
  description: "Info to be returned when a voucher campaign of a #beach_bar's product is updated",
  definition(t) {
    t.field("voucherCampaign", {
      type: ProductVoucherCampaignType,
      description: "The voucher campaign of the product that is updated",
      nullable: false,
      resolve: o => o.voucherCampaign,
    });
    t.boolean("updated", {
      nullable: false,
      description: "A boolean that indicates if the voucher campaign has been successfully updated",
    });
  },
});

export const UpdateProductVoucherCampaignResult = unionType({
  name: "UpdateProductVoucherCampaignResult",
  definition(t) {
    t.members("UpdateProductVoucherCampaign", "Error");
    t.resolveType(item => {
      if (item.error) {
        return "Error";
      } else {
        return "UpdateProductVoucherCampaign";
      }
    });
  },
});

export const AddProductVoucherCodeType = objectType({
  name: "AddProductVoucherCode",
  description: "Info to be returned when a new voucher code, of a product voucher campaign, is added (issued)",
  definition(t) {
    t.field("voucherCode", {
      type: ProductVoucherCodeType,
      description: "The voucher code that is added (issued)",
      nullable: false,
      resolve: o => o.voucherCode,
    });
    t.boolean("added", {
      nullable: false,
      description: "A boolean that indicates if the voucher code has been successfully added (issued)",
    });
  },
});

export const AddProductVoucherCodeResult = unionType({
  name: "AddProductVoucherCodeResult",
  definition(t) {
    t.members("AddProductVoucherCode", "Error");
    t.resolveType(item => {
      if (item.error) {
        return "Error";
      } else {
        return "AddProductVoucherCode";
      }
    });
  },
});

export const UpdateProductVoucherCodeType = objectType({
  name: "UpdateProductVoucherCode",
  description: "Info to be returned when a voucher code, of a product voucher campaign, is updated",
  definition(t) {
    t.field("voucherCampaign", {
      type: ProductVoucherCampaignType,
      description: "The voucher code that is updated",
      nullable: false,
      resolve: o => o.voucherCampaign,
    });
    t.boolean("updated", {
      nullable: false,
      description: "A boolean that indicates if the voucher code has been successfully updated",
    });
  },
});

export const UpdateProductVoucherCodeResult = unionType({
  name: "UpdateProductVoucherCodeResult",
  definition(t) {
    t.members("UpdateProductVoucherCode", "Error");
    t.resolveType(item => {
      if (item.error) {
        return "Error";
      } else {
        return "UpdateProductVoucherCode";
      }
    });
  },
});
