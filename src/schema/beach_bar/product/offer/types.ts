import { objectType } from "@nexus/schema";
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
    t.datetime("validUntil", { nullable: true });
    t.field("product", {
      type: ProductType,
      description: "The product that is discounted via the coupon code",
      nullable: false,
      resolve: o => o.product,
    });
  },
});

export const ProductVoucherCampaign = objectType({
  name: "ProductVoucherCampaign",
  description: "Represents a voucher campaign for a product",
  definition(t) {
    t.int("id", { nullable: false });
    t.string("title", { nullable: false });
    t.float("discountAmount", { nullable: false });
    t.float("discountPercentage", { nullable: false });
    t.boolean("beachBarOffer", { nullable: false });
    t.boolean("isActive", { nullable: false });
    t.datetime("validUntil", { nullable: true });
    t.field("product", {
      type: ProductType,
      description: "The product that is discounted via the campaign",
      nullable: false,
      resolve: o => o.product,
    });
  },
});

export const ProductVoucherCode = objectType({
  name: "ProductVoucherCode",
  description: "Represents a voucher code for a campaign of a product",
  definition(t) {
    t.bigint("id", { nullable: false });
    t.string("refCode", { nullable: false });
    t.datetime("timestamp", { nullable: false });
    t.datetime("deletedAt", { nullable: true });
    t.field("campaign", {
      type: ProductVoucherCampaign,
      description: "The campaign the voucher code is assigned to",
      nullable: false,
      resolve: o => o.campaign,
    });
  },
});
