import { errors, MyContext } from "@beach_bar/common";
import { BigIntScalar, DateTimeScalar } from "@the_hashtag/common/dist/graphql";
import dayjs from "dayjs";
import { BeachBar } from "entity/BeachBar";
import { CouponCode } from "entity/CouponCode";
import { OfferCampaign } from "entity/OfferCampaign";
import { OfferCampaignCode } from "entity/OfferCampaignCode";
import { Product } from "entity/Product";
import { arg, booleanArg, extendType, floatArg, idArg, intArg, list, nullable, stringArg } from "nexus";
import { In } from "typeorm";
import { DeleteType } from "typings/.index";
import {
  AddCouponCodeType,
  AddOfferCampaignCodeType,
  AddOfferCampaignType,
  UpdateCouponCodeType,
  UpdateOfferCampaignType,
} from "typings/beach_bar/product/offer";
import { checkScopes } from "utils/checkScopes";
import { DeleteResult } from "../../../types";
import {
  AddCouponCodeResult,
  AddOfferCampaignCodeResult,
  AddOfferCampaignResult,
  UpdateCouponCodeResult,
  UpdateOfferCampaignResult,
} from "./types";

export const CouponCodeCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addCouponCode", {
      type: AddCouponCodeResult,
      description: "Add a coupon code",
      args: {
        title: stringArg({ description: "The name or a short description of the coupon code" }),
        discountPercentage: floatArg({ description: "The percentage of the coupon code discount" }),
        beachBarId: nullable(idArg({ description: "The ID value of the #beach_bar, to apply the coupon code for" })),
        validUntil: arg({
          type: DateTimeScalar,
          description: "A timestamp that indicates until what date and time this coupon code is applicable and valid",
        }),
        isActive: booleanArg({
          description: "Set to true if coupon code is active. Its default value is set to false",
          default: false,
        }),
        timesLimit: intArg({
          description: "Represents how many times this coupon code can be used",
        }),
      },
      resolve: async (
        _,
        { title, discountPercentage, beachBarId, validUntil, isActive, timesLimit },
        { payload }: MyContext
      ): Promise<AddCouponCodeType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (!checkScopes(payload, ["beach_bar@crud:coupon_code"])) {
          return {
            error: {
              code: errors.UNAUTHORIZED_CODE,
              message: "You are not allowed to add (issue) a coupon code",
            },
          };
        }

        if (!discountPercentage || discountPercentage <= 0 || discountPercentage > 100) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a or some discount percentage" } };
        }

        const newCouponCode = CouponCode.create({
          title,
          discountPercentage,
          isActive,
          validUntil,
          timesLimit,
        });

        if (beachBarId) {
          const beachBar = await BeachBar.findOne(beachBarId);
          if (!beachBar) {
            return { error: { code: errors.CONFLICT, message: errors.BEACH_BAR_DOES_NOT_EXIST } };
          }
          newCouponCode.beachBar = beachBar;
        }

        try {
          await newCouponCode.save();
        } catch (err) {
          return { error: { message: `${errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
        }

        return {
          couponCode: newCouponCode,
          added: true,
        };
      },
    });
    t.field("updateCouponCode", {
      type: UpdateCouponCodeResult,
      description: "Update a coupon code",
      args: {
        couponCodeId: arg({
          type: BigIntScalar,
          description: "The ID value of the coupon code",
        }),
        title: nullable(stringArg({ description: "The name or a short description of the coupon code" })),
        discountPercentage: nullable(floatArg({ description: "The percentage of the coupon code discount" })),
        validUntil: nullable(
          arg({
            type: DateTimeScalar,
            description: "A timestamp that indicates until what date and time this coupon code is applicable and valid",
          })
        ),
        isActive: nullable(
          booleanArg({
            description: "Set to true if coupon code is active. Its default value is set to false",
          })
        ),
        timesLimit: nullable(
          intArg({
            description: "Represents how many times this coupon code can be used",
          })
        ),
      },
      resolve: async (
        _,
        { couponCodeId, title, discountPercentage, validUntil, isActive, timesLimit },
        { payload }: MyContext
      ): Promise<UpdateCouponCodeType | DeleteType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (!checkScopes(payload, ["beach_bar@crud:coupon_code", "beach_bar@update:coupon_code"])) {
          return {
            error: {
              code: errors.UNAUTHORIZED_CODE,
              message: "You are not allowed to update a coupon code",
            },
          };
        }

        if (!couponCodeId || couponCodeId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: errors.SOMETHING_WENT_WRONG } };
        }
        if (!discountPercentage || discountPercentage <= 0 || discountPercentage > 100) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a or some discount percentage" } };
        }

        const couponCode = await CouponCode.findOne(couponCodeId);
        if (!couponCode) {
          return { error: { code: errors.CONFLICT, message: "Specified coupon code does not exist" } };
        }

        try {
          const updatedCouponCode = await couponCode.update({
            title,
            discountPercentage,
            validUntil,
            isActive,
            timesLimit,
          });
          if (updatedCouponCode.deleted) {
            return {
              deleted: true,
            };
          }

          return {
            couponCode: updatedCouponCode,
            updated: true,
          };
        } catch (err) {
          return { error: { message: `${errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
        }
      },
    });
    t.field("deleteCouponCode", {
      type: DeleteResult,
      args: {
        couponCodeId: arg({
          type: BigIntScalar,
          description: "The ID value of the coupon code",
        }),
      },
      resolve: async (_, { couponCodeId }, { payload }: MyContext): Promise<DeleteType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (!checkScopes(payload, ["beach_bar@crud:coupon_code"])) {
          return {
            error: {
              code: errors.UNAUTHORIZED_CODE,
              message: "You are not allowed to delete (invalidate) a coupon code",
            },
          };
        }

        if (!couponCodeId || couponCodeId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: errors.SOMETHING_WENT_WRONG } };
        }

        const couponCode = await CouponCode.findOne(couponCodeId);
        if (!couponCode) {
          return { error: { code: errors.CONFLICT, message: "Specified coupon code does not exist" } };
        }

        try {
          await couponCode.softRemove();
        } catch (err) {
          return { error: { message: `${errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
        }

        return {
          deleted: true,
        };
      },
    });
  },
});

export const OfferCampaignCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addOfferCampaign", {
      type: AddOfferCampaignResult,
      description: "Add an offer campaign to a #beach_bar",
      args: {
        productIds: list(intArg({ description: "The ID value of the product" })),
        title: stringArg({ description: "The name or a short description of the coupon code" }),
        discountPercentage: floatArg({ description: "The percentage of the coupon code discount" }),
        validUntil: arg({
          type: DateTimeScalar,
          description: "A timestamp that indicates until what date and time this coupon code is applicable and valid",
        }),
        isActive: booleanArg({
          description: "Set to true if coupon code is active. Its default value is set to false",
          default: false,
        }),
      },
      resolve: async (
        _,
        { productIds, title, discountPercentage, validUntil, isActive },
        { payload }: MyContext
      ): Promise<AddOfferCampaignType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (!checkScopes(payload, ["beach_bar@crud:offer_campaign"])) {
          return {
            error: {
              code: errors.UNAUTHORIZED_CODE,
              message: "You are not allowed to add an offer campaign to a #beach_bar",
            },
          };
        }

        if (!productIds || productIds.length === 0 || productIds.some(id => id === undefined || id === null)) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a or some valid product(s)" } };
        }
        if (!discountPercentage || discountPercentage <= 0 || discountPercentage > 100) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a or some discount percentage" } };
        }

        const products = await Product.find({ where: { id: In(productIds) } });
        if (products.some(product => !product.isActive)) {
          return { error: { message: "All the products should be active, in order to be applied for an offer campaign" } };
        }

        const newOfferCampaign = OfferCampaign.create({
          title,
          discountPercentage,
          isActive,
          validUntil,
          products,
        });

        try {
          await newOfferCampaign.save();
        } catch (err) {
          return { error: { message: `${errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
        }

        return {
          offerCampaign: newOfferCampaign,
          added: true,
        };
      },
    });
    t.field("updateOfferCampaign", {
      type: UpdateOfferCampaignResult,
      description: "Update the details of an offer campaign of a #beach_bar",
      args: {
        offerCampaignId: arg({
          type: BigIntScalar,
          description: "The ID value of the offer campaign",
        }),
        productIds: list(
          nullable(
            intArg({
              description: "The ID value of the product",
            })
          )
        ),
        title: nullable(stringArg({ description: "The name or a short description of the coupon code" })),
        discountPercentage: nullable(
          floatArg({
            description: "The percentage of the coupon code discount",
          })
        ),
        validUntil: nullable(
          arg({
            type: DateTimeScalar,
            description: "A timestamp that indicates until what date and time this coupon code is applicable and valid",
          })
        ),
        isActive: nullable(
          booleanArg({
            description: "Set to true if coupon code is active. Its default value is set to false",
          })
        ),
      },
      resolve: async (
        _,
        { offerCampaignId, productIds, title, discountPercentage, validUntil, isActive },
        { payload }: MyContext
      ): Promise<UpdateOfferCampaignType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (!checkScopes(payload, ["beach_bar@crud:offer_campaign", "beach_bar@update:offer_campaign"])) {
          return {
            error: {
              code: errors.UNAUTHORIZED_CODE,
              message: "You are not allowed to update an offer campaign of a #beach_bar",
            },
          };
        }

        if (!offerCampaignId || offerCampaignId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: errors.SOMETHING_WENT_WRONG } };
        }
        if (!discountPercentage || discountPercentage <= 0 || discountPercentage > 100) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a or some discount percentage" } };
        }

        const offerCampaign = await OfferCampaign.findOne({ where: { id: offerCampaignId }, relations: ["products"] });
        if (!offerCampaign) {
          return { error: { code: errors.CONFLICT, message: "Specified offer campaign does not exist" } };
        }
        if (!offerCampaign.validUntil || validUntil < dayjs(offerCampaign.validUntil)) {
          return {
            error: {
              message: "You should delete the offer campaign, if you want it to be valid before the datetime you had initially set",
            },
          };
        }

        try {
          const updatedOfferCampaign = await offerCampaign.update(productIds, title, discountPercentage, validUntil, isActive);

          return {
            offerCampaign: updatedOfferCampaign,
            updated: true,
          };
        } catch (err) {
          return { error: { message: `${errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
        }
      },
    });
    t.field("deleteOfferCampaign", {
      type: DeleteResult,
      description: "Delete an offer campaign of a #beach_bar",
      args: {
        offerCampaignId: arg({
          type: BigIntScalar,
          description: "The ID value of the offer campaign",
        }),
      },
      resolve: async (_, { offerCampaignId }, { payload }: MyContext): Promise<DeleteType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (!checkScopes(payload, ["beach_bar@crud:offer_campaign"])) {
          return {
            error: {
              code: errors.UNAUTHORIZED_CODE,
              message: "You are not allowed to delete an offer campaign of a #beach_bar",
            },
          };
        }

        if (!offerCampaignId || offerCampaignId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: errors.SOMETHING_WENT_WRONG } };
        }

        const offerCampaign = await OfferCampaign.findOne(offerCampaignId);
        if (!offerCampaign) {
          return { error: { code: errors.CONFLICT, message: "Specified offer campaign does not exist" } };
        }

        try {
          await offerCampaign.softRemove();
        } catch (err) {
          return { error: { message: `${errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
        }

        return {
          deleted: true,
        };
      },
    });
  },
});

export const OfferCampaignCodeCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addOfferCampaignCode", {
      type: AddOfferCampaignCodeResult,
      description: "Add (issue) a new offer code",
      args: {
        offerCampaignId: arg({
          type: BigIntScalar,
          description: "The ID value of the offer campaign",
        }),
      },
      resolve: async (_, { offerCampaignId }, { payload }: MyContext): Promise<AddOfferCampaignCodeType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (!checkScopes(payload, ["beach_bar@crud:offer_campaign"])) {
          return {
            error: {
              code: errors.UNAUTHORIZED_CODE,
              message: "You are not allowed to add (issue) a new offer code",
            },
          };
        }

        const offerCampaign = await OfferCampaign.findOne({ where: { id: offerCampaignId }, relations: ["products"] });
        if (!offerCampaign) {
          return { error: { code: errors.CONFLICT, message: "Specified offer campaign does not exist" } };
        }
        if (dayjs(offerCampaign.validUntil) < dayjs()) {
          return { error: { code: errors.CONFLICT, message: "Specified offer campaign has expired" } };
        }

        const newOfferCode = OfferCampaignCode.create({ campaign: offerCampaign });

        try {
          await newOfferCode.save();
        } catch (err) {
          return { error: { message: `${errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
        }

        return {
          offerCode: newOfferCode,
          added: true,
        };
      },
    });
    t.field("deleteOfferCode", {
      type: DeleteResult,
      description: "Delete (invalidate) an offer code of an offer campaign",
      args: {
        offerCodeId: arg({
          type: BigIntScalar,
          description: "The ID value of the offer campaign",
        }),
      },
      resolve: async (_, { offerCodeId }, { payload }: MyContext): Promise<DeleteType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (!checkScopes(payload, ["beach_bar@crud:offer_campaign"])) {
          return {
            error: {
              code: errors.UNAUTHORIZED_CODE,
              message: "You are not allowed to delete an offer code of an offer campaign",
            },
          };
        }

        if (!offerCodeId || offerCodeId <= 0) {
          return { error: { code: errors.INTERNAL_SERVER_ERROR, message: errors.SOMETHING_WENT_WRONG } };
        }

        const offerCode = await OfferCampaignCode.findOne(offerCodeId);
        if (!offerCode) {
          return { error: { code: errors.CONFLICT, message: "Specified offer code does not exist" } };
        }

        try {
          await offerCode.softRemove();
        } catch (err) {
          return { error: { message: `${errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
        }

        return {
          deleted: true,
        };
      },
    });
  },
});
