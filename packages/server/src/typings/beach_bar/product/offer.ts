import { CouponCode } from "entity/CouponCode";
import { OfferCampaign } from "entity/OfferCampaign";
import { OfferCampaignCode } from "entity/OfferCampaignCode";
import { AddType, DeleteType, UpdateType } from "typings/.index";

type CouponCodeType = {
  couponCode: CouponCode;
};

export type TAddCouponCode = AddType & CouponCodeType;

export type TUpdateCouponCode = UpdateType & DeleteType & CouponCodeType;

type OfferCampaignType = {
  offerCampaign: OfferCampaign;
};

export type TAddOfferCampaign = AddType & OfferCampaignType;

export type TUpdateOfferCampaign = UpdateType & OfferCampaignType;

type OfferCampaignCodeType = {
  offerCode: OfferCampaignCode;
};

export type TAddOfferCampaignCode = AddType & OfferCampaignCodeType;

export type TUpdateOfferCampaignCode = UpdateType & OfferCampaignCodeType;

export type ProductOfferType = (CouponCode | OfferCampaignCode) | null;
