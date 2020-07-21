import { CouponCode } from "../../../../entity/CouponCode";
import { OfferCampaign } from "../../../../entity/OfferCampaign";
import { OfferCampaignCode } from "../../../../entity/OfferCampaignCode";
import { AddType, UpdateType } from "../../../returnTypes";

type CouponCodeType = {
  couponCode: CouponCode;
};

export type AddCouponCodeType = AddType & CouponCodeType;

export type UpdateCouponCodeType = UpdateType & CouponCodeType;

type OfferCampaignType = {
  offerCampaign: OfferCampaign;
};

export type AddOfferCampaignType = AddType & OfferCampaignType;

export type UpdateOfferCampaignType = UpdateType & OfferCampaignType;

type OfferCampaignCodeType = {
  offerCode: OfferCampaignCode;
};

export type AddOfferCampaignCodeType = AddType & OfferCampaignCodeType;

export type UpdateOfferCampaignCodeType = UpdateType & OfferCampaignCodeType;

export type ProductOfferType = CouponCode | OfferCampaignCode;
