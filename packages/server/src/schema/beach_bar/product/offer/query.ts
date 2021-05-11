import { errors, MyContext } from "@beach_bar/common";
import { ApolloError, UserInputError } from "apollo-server-express";
import { BeachBar } from "entity/BeachBar";
import { CouponCode } from "entity/CouponCode";
import { OfferCampaign } from "entity/OfferCampaign";
import { OfferCampaignCode } from "entity/OfferCampaignCode";
import { extendType, idArg, intArg, stringArg } from "nexus";
import { ProductOfferType } from "typings/beach_bar/product/offer";
import { isAuth, throwScopesUnauthorized } from "utils/auth/payload";
import { checkVoucherCode } from "utils/payment";
import { CouponCodeRevealType, OfferCampaignCodeRevealType, OfferCampaignType, VoucherCodeQueryResult } from "./types";

export const VoucherCoderQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("getVoucherCode", {
      type: VoucherCodeQueryResult,
      description: "Get the product offer or coupon, based on its referral code",
      args: { refCode: stringArg({ description: "The referral code of the product offer or coupon" }) },
      resolve: async (_, { refCode }): Promise<ProductOfferType> => {
        if (!refCode || refCode.trim().length === 0) throw new UserInputError("Please provide a valid refCode");

        const res = await checkVoucherCode(refCode);
        if (res.couponCode) return res.couponCode;
        else if (res.offerCode)return res.offerCode;
        else throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.INTERNAL_SERVER_ERROR);
      },
    });
    t.list.field("getBeachBarOfferCampaigns", {
      type: OfferCampaignType,
      description: "Get a list with all the offer campaigns of a #beach_bar",
      args: { beachBarId: intArg() },
      resolve: async (_, { beachBarId }): Promise<OfferCampaign[]> => {
        if (!beachBarId || beachBarId.trim().length === 0) throw new UserInputError("Please provide a valid beachBarId");

        const beachBar = await BeachBar.findOne({
          where: { id: beachBarId },
          relations: ["products", "products.offerCampaigns", "products.offerCampaigns.products"],
        });
        if (!beachBar) throw new ApolloError(errors.BEACH_BAR_DOES_NOT_EXIST, errors.NOT_FOUND);

        const result: OfferCampaign[] = [];
        beachBar.products.map(product => product.offerCampaigns?.forEach(campaign => result.push(campaign)));

        return result;
      },
    });
    t.field("revealCouponCode", {
      type: CouponCodeRevealType,
      description: "Get a coupon's code details & its referral code",
      args: { couponCodeId: idArg() },
      resolve: async (_, { couponCodeId }, { payload }: MyContext): Promise<CouponCode> => {
        isAuth(payload);
        throwScopesUnauthorized(payload, "You are not allowed to retrieve the referral code of a coupon", [
          "beach_bar@crud:coupon_code",
        ]);

        const couponCode = await CouponCode.findOne(couponCodeId);
        if (!couponCode) throw new ApolloError("Specified coupon code does not exist", errors.NOT_FOUND);

        return couponCode;
      },
    });
    t.field("revealOfferCampaignCode", {
      type: OfferCampaignCodeRevealType,
      description: "Get an offer's campaign code details + its referral code",
      args: { offerCampaignCodeId: idArg() },
      resolve: async (_, { offerCampaignCodeId }, { payload }: MyContext): Promise<OfferCampaignCode> => {
        isAuth(payload);
        throwScopesUnauthorized(payload, "You are not allowed to retrieve the referral code of an offer campaign code", [
          "beach_bar@crud:offer_campaign",
        ]);

        const offerCampaignCode = await OfferCampaignCode.findOne(offerCampaignCodeId);
        if (!offerCampaignCode) throw new ApolloError("Specified offer campaign code does not exist", errors.NOT_FOUND);

        return offerCampaignCode;
      },
    });
  },
});
