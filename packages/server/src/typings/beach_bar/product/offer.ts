import { ErrorType, AddType, UpdateType } from "@typings/.index";
import { CouponCode } from "@entity/CouponCode";
import { OfferCampaign } from "@entity/OfferCampaign";
import { OfferCampaignCode } from "@entity/OfferCampaignCode";


type CouponCodeType = {
  couponCode: CouponCode;
};

export type AddCouponCodeType = (AddType & CouponCodeType) | ErrorType;

export type UpdateCouponCodeType = (UpdateType & CouponCodeType) | ErrorType;

type OfferCampaignType = {
  offerCampaign: OfferCampaign;
};

export type AddOfferCampaignType = (AddType & OfferCampaignType) | ErrorType;

export type UpdateOfferCampaignType = (UpdateType & OfferCampaignType) | ErrorType;

type OfferCampaignCodeType = {
  offerCode: OfferCampaignCode;
};

export type AddOfferCampaignCodeType = (AddType & OfferCampaignCodeType) | ErrorType;

export type UpdateOfferCampaignCodeType = (UpdateType & OfferCampaignCodeType) | ErrorType;

export type ProductOfferType = (CouponCode | OfferCampaignCode) | ErrorType | null;