import { errors } from "@beach_bar/common";
import { extendType, intArg, stringArg } from "@nexus/schema";
import dayjs from "dayjs";
import { BeachBar } from "../../../../entity/BeachBar";
import { ProductCouponCode } from "../../../../entity/ProductCouponCode";
import { ProductOfferCampaign } from "../../../../entity/ProductOfferCampaign";
import { ProductOfferCode } from "../../../../entity/ProductOfferCode";
import { ErrorType } from "../../../returnTypes";
import { ProductOfferType } from "./returnTypes";
import { ProductOfferCampaignType, ProductOfferQueryResult } from "./types";

export const ProductOfferQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("getProductOffer", {
      type: ProductOfferQueryResult,
      description: "Get the product offer or coupon, based on its referral code",
      nullable: true,
      args: {
        refCode: stringArg({
          required: true,
          description: "The referral code of the product offer or coupon",
        }),
      },
      resolve: async (_, { refCode }): Promise<ProductOfferType | ErrorType | null> => {
        if (!refCode || refCode.trim().length === 0) {
          return { error: { code: errors.INTERNAL_SERVER_ERROR, message: errors.SOMETHING_WENT_WRONG } };
        }

        if (refCode.trim().length === 18) {
          const couponCode = await ProductCouponCode.findOne({ where: { refCode } });
          if (!couponCode) {
            return { error: { code: errors.CONFLICT, message: errors.INVALID_REF_CODE_MESSAGE } };
          }
          if (!couponCode.isActive || dayjs(couponCode.validUntil) < dayjs() || couponCode.timesUsed >= couponCode.timesLimit) {
            return { error: { code: errors.INVALID_PRODUCT_OFFER_CODE, message: errors.INVALID_REF_CODE_MESSAGE } };
          }
          couponCode.refCode = "";
          return couponCode;
        } else if (refCode.trim().length === 23) {
          const offerCode = await ProductOfferCode.findOne({ where: { refCode }, relations: ["campaign", "campaign.products"] });
          if (!offerCode) {
            return { error: { code: errors.CONFLICT, message: errors.INVALID_REF_CODE_MESSAGE } };
          }
          if (offerCode.isRedeemed || dayjs(offerCode.campaign.validUntil) < dayjs() || !offerCode.campaign.isActive) {
            return { error: { code: errors.INVALID_PRODUCT_OFFER_CODE, message: errors.INVALID_REF_CODE_MESSAGE } };
          }
          return offerCode;
        } else {
          return { error: { code: errors.INVALID_PRODUCT_OFFER_CODE, message: errors.INVALID_REF_CODE_MESSAGE } };
        }
      },
    });
    t.list.field("getBeachBarOfferCampaigns", {
      type: ProductOfferCampaignType,
      description: "Get a list with all the offer campaigns of a #beach_bar",
      nullable: true,
      args: {
        beachBarId: intArg({
          required: true,
          description: "The ID value of the #beach_bar",
        }),
      },
      resolve: async (_, { beachBarId }): Promise<ProductOfferCampaign[] | null> => {
        if (!beachBarId || beachBarId <= 0) {
          return null;
        }

        const beachBar = await BeachBar.findOne({
          where: { id: beachBarId },
          relations: ["products", "products.offerCampaigns", "products.offerCampaigns.products"],
        });
        if (!beachBar) {
          return null;
        }

        const result: ProductOfferCampaign[] = [];
        beachBar.products.map(product => product.offerCampaigns?.forEach(campaign => result.push(campaign)));
        console.log(result);
        return result;
      },
    });
  },
});
