import { ProductCouponCode } from "../../../../entity/ProductCouponCode";
import { ProductVoucherCampaign } from "../../../../entity/ProductVoucherCampaign";
import { AddType, UpdateType } from "../../../returnTypes";
import { ProductVoucherCode } from "../../../../entity/ProductVoucherCode";

type ProductCouponCodeType = {
  couponCode: ProductCouponCode;
};

export type AddProductCouponCodeType = AddType & ProductCouponCodeType;

export type UpdateProductCouponCodeType = UpdateType & ProductCouponCodeType;

type ProductVoucherCampaignType = {
  voucherCampaign: ProductVoucherCampaign;
};

export type AddProductVoucherCampaignType = AddType & ProductVoucherCampaignType;

export type UpdateProductVoucherCampaignType = UpdateType & ProductVoucherCampaignType;

type ProductVoucherCodeType = {
  voucherCode: ProductVoucherCode;
};

export type AddProductVoucherCodeType = AddType & ProductVoucherCodeType;

export type UpdateProductVoucherCodeType = UpdateType & ProductVoucherCodeType;
