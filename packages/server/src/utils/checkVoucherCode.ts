import { errors } from "@beach_bar/common";
import { voucherCodeLength } from "@constants/.index";
import { CouponCode } from "@entity/CouponCode";
import { OfferCampaignCode } from "@entity/OfferCampaignCode";
import { ErrorType } from "@typings/.index";
import dayjs from "dayjs";

type CheckVoucherCodeReturnType = {
  couponCode?: CouponCode;
  offerCode?: OfferCampaignCode;
  error?: ErrorType;
};

export const checkVoucherCode = async (refCode: string): Promise<CheckVoucherCodeReturnType> => {
  if (refCode.trim().length === voucherCodeLength.COUPON_CODE) {
    const couponCode = await CouponCode.findOne({ refCode });
    if (!couponCode) {
      return { error: { error: { code: errors.CONFLICT, message: errors.INVALID_REF_CODE_MESSAGE } } };
    }
    if (!couponCode.isActive || dayjs(couponCode.validUntil) < dayjs()) {
      return { error: { error: { code: errors.INVALID_PRODUCT_OFFER_CODE, message: errors.INVALID_REF_CODE_MESSAGE } } };
    }
    if (couponCode.timesLimit && couponCode.timesUsed >= couponCode.timesLimit) {
      return {
        error: { error: { code: errors.INVALID_PRODUCT_OFFER_CODE, message: "You have exceeded the times of use of a coupon code" } },
      };
    }
    return {
      couponCode,
    };
  } else if (refCode.trim().length === voucherCodeLength.OFFER_CAMPAIGN_CODE) {
    const offerCode = await OfferCampaignCode.findOne({ where: { refCode }, relations: ["campaign", "campaign.products"] });
    if (!offerCode) {
      return { error: { error: { code: errors.CONFLICT, message: errors.INVALID_REF_CODE_MESSAGE } } };
    }
    if (dayjs(offerCode.campaign.validUntil) < dayjs() || !offerCode.campaign.isActive) {
      return { error: { error: { code: errors.INVALID_PRODUCT_OFFER_CODE, message: errors.INVALID_REF_CODE_MESSAGE } } };
    }
    return {
      offerCode,
    };
  } else {
    return { error: { error: { code: errors.INVALID_PRODUCT_OFFER_CODE, message: errors.INVALID_REF_CODE_MESSAGE } } };
  }
};
