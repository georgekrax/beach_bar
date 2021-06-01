import { errors } from "@beach_bar/common";
import { ApolloError } from "apollo-server-express";
import { voucherCodeLength } from "constants/_index";
import dayjs from "dayjs";
import { CouponCode } from "entity/CouponCode";
import { OfferCampaignCode } from "entity/OfferCampaignCode";
import { PaymentVoucherCode } from "entity/PaymentVoucherCode";

type CheckVoucherCodeReturnType = {
  couponCode?: CouponCode;
  offerCode?: OfferCampaignCode;
};

export const checkVoucherCode = async (refCode: string): Promise<CheckVoucherCodeReturnType> => {
  if (refCode.trim().length === voucherCodeLength.COUPON_CODE) {
    const couponCode = await CouponCode.findOne({ refCode });
    if (!couponCode) throw new ApolloError(errors.INVALID_REF_CODE_MESSAGE, errors.CONFLICT);
    if (!couponCode.isActive || dayjs(couponCode.validUntil).isBefore(dayjs()))
      throw new ApolloError(errors.INVALID_REF_CODE_MESSAGE, errors.INVALID_PRODUCT_OFFER_CODE);
    if (couponCode.timesLimit && couponCode.timesUsed >= couponCode.timesLimit)
      throw new ApolloError("You have exceeded the times of use of a coupon code", errors.INVALID_PRODUCT_OFFER_CODE);
    return { couponCode };
  } else if (refCode.trim().length === voucherCodeLength.OFFER_CAMPAIGN_CODE) {
    const offerCode = await OfferCampaignCode.findOne({ where: { refCode }, relations: ["campaign", "campaign.products"] });
    if (!offerCode) throw new ApolloError(errors.INVALID_REF_CODE_MESSAGE, errors.CONFLICT);
    if (dayjs(offerCode.campaign.validUntil).isBefore(dayjs()) || !offerCode.campaign.isActive)
      throw new ApolloError(errors.INVALID_REF_CODE_MESSAGE, errors.INVALID_PRODUCT_OFFER_CODE);
    return { offerCode };
  } else throw new ApolloError(errors.INVALID_REF_CODE_MESSAGE, errors.INVALID_PRODUCT_OFFER_CODE);
};

export const formatMetadata = (str: string) => {
  return "[" + str.toString().replace(/[[\]]/g, "").replace(/},{/g, "}, {").replace(/[:]/g, ": ").replace(/[,]/g, ", ") + "]";
};

export const formatVoucherCodeMetadata = (voucherCode?: PaymentVoucherCode): string | null => {
  if (!voucherCode) return null;
  const { couponCode, offerCode } = voucherCode;
  return formatMetadata(
    JSON.stringify({
      id: couponCode ? couponCode.id : offerCode?.id,
      discount_percentage: couponCode ? couponCode.discountPercentage : offerCode?.campaign.discountPercentage,
      type: couponCode ? "coupon_code" : "offer_campaign_code",
    })
  );
};
