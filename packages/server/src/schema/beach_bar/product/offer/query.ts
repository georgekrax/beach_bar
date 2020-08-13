import { BigIntScalar, errors, MyContext } from "@beach_bar/common";
import { BeachBar } from "@entity/BeachBar";
import { CouponCode } from "@entity/CouponCode";
import { OfferCampaign } from "@entity/OfferCampaign";
import { OfferCampaignCode } from "@entity/OfferCampaignCode";
import { arg, extendType, intArg, stringArg } from "@nexus/schema";
import { ErrorType } from "@typings/.index";
import { ProductOfferType } from "@typings/beach_bar/product/offer";
import { checkScopes } from "@utils/checkScopes";
import { checkVoucherCode } from "@utils/checkVoucherCode";
import { CouponCodeRevealResult, OfferCampaignCodeRevealResult, OfferCampaignType, VoucherCodeQueryResult } from "./types";

export const VoucherCoderQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("getVoucherCode", {
      type: VoucherCodeQueryResult,
      description: "Get the product offer or coupon, based on its referral code",
      nullable: true,
      args: {
        refCode: stringArg({
          required: true,
          description: "The referral code of the product offer or coupon",
        }),
      },
      resolve: async (_, { refCode }): Promise<ProductOfferType> => {
        if (!refCode || refCode.trim().length === 0) {
          return { error: { code: errors.INTERNAL_SERVER_ERROR, message: "Invalid coupon code" } };
        }

        const res = await checkVoucherCode(refCode);
        if (res.couponCode) {
          return res.couponCode;
        } else if (res.offerCode) {
          return res.offerCode;
        }
        return res.error as any;
      },
    });
    t.list.field("getBeachBarOfferCampaigns", {
      type: OfferCampaignType,
      description: "Get a list with all the offer campaigns of a #beach_bar",
      nullable: true,
      args: {
        beachBarId: intArg({
          required: true,
          description: "The ID value of the #beach_bar",
        }),
      },
      resolve: async (_, { beachBarId }): Promise<OfferCampaign[] | null> => {
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

        const result: OfferCampaign[] = [];
        beachBar.products.map(product => product.offerCampaigns?.forEach(campaign => result.push(campaign)));

        return result;
      },
    });
    t.field("revealCouponCode", {
      type: CouponCodeRevealResult,
      description: "Get a coupon's code details & its referral code",
      nullable: false,
      args: {
        couponCodeId: arg({
          type: BigIntScalar,
          required: true,
          description: "The ID value of the coupon code",
        }),
      },
      resolve: async (_, { couponCodeId }, { payload }: MyContext): Promise<CouponCode | ErrorType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (!checkScopes(payload, ["beach_bar@crud:coupon_code"])) {
          return {
            error: {
              code: errors.UNAUTHORIZED_CODE,
              message: "You are not allowed to retrieve the referral code of a coupon",
            },
          };
        }

        const couponCode = await CouponCode.findOne(couponCodeId);
        if (!couponCode) {
          return { error: { code: errors.CONFLICT, message: "Specified coupon code does not exist" } };
        }

        return couponCode;
      },
    });
    t.field("revealOfferCampaignCode", {
      type: OfferCampaignCodeRevealResult,
      description: "Get an offer's campaign code details + its referral code",
      nullable: false,
      args: {
        offerCampaignCodeId: arg({
          type: BigIntScalar,
          required: true,
          description: "The ID value of the offer campaign code",
        }),
      },
      resolve: async (_, { offerCampaignCodeId }, { payload }: MyContext): Promise<OfferCampaignCode | ErrorType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (!checkScopes(payload, ["beach_bar@crud:offer_campaign"])) {
          return {
            error: {
              code: errors.UNAUTHORIZED_CODE,
              message: "You are not allowed to retrieve the referral code of an offer campaign code",
            },
          };
        }

        const offerCampaignCode = await OfferCampaignCode.findOne(offerCampaignCodeId);
        if (!offerCampaignCode) {
          return { error: { code: errors.CONFLICT, message: "Specified offer campaign code does not exist" } };
        }

        return offerCampaignCode;
      },
    });
  },
});
