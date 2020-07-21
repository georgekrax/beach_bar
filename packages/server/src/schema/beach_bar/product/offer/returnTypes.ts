import { ProductCouponCode } from "../../../../entity/ProductCouponCode";
import { ProductOfferCampaign } from "../../../../entity/ProductOfferCampaign";
import { ProductOfferCode } from "../../../../entity/ProductOfferCode";
import { AddType, UpdateType } from "../../../returnTypes";

type ProductCouponCodeType = {
  couponCode: ProductCouponCode;
};

export type AddProductCouponCodeType = AddType & ProductCouponCodeType;

export type UpdateProductCouponCodeType = UpdateType & ProductCouponCodeType;

type ProductOfferCampaignType = {
  offerCampaign: ProductOfferCampaign;
};

export type AddProductOfferCampaignType = AddType & ProductOfferCampaignType;

export type UpdateProductOfferCampaignType = UpdateType & ProductOfferCampaignType;

type ProductOfferCodeType = {
  offerCode: ProductOfferCode;
};

export type AddProductOfferCodeType = AddType & ProductOfferCodeType;

export type UpdateProductOfferCodeType = UpdateType & ProductOfferCodeType;

export type ProductOfferType = ProductCouponCode | ProductOfferCode;
