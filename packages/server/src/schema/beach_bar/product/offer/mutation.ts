import { BigIntScalar, DateTimeScalar, errors, MyContext } from "@beach_bar/common";
import { arg, booleanArg, extendType, floatArg, intArg, stringArg } from "@nexus/schema";
import dayjs from "dayjs";
import { In } from "typeorm";
import { Product } from "../../../../entity/Product";
import { ProductCouponCode } from "../../../../entity/ProductCouponCode";
import { ProductOfferCampaign } from "../../../../entity/ProductOfferCampaign";
import { ProductOfferCode } from "../../../../entity/ProductOfferCode";
import { checkScopes } from "../../../../utils/checkScopes";
import { DeleteType, ErrorType } from "../../../returnTypes";
import { DeleteResult } from "../../../types";
import {
  AddProductCouponCodeType,
  AddProductOfferCampaignType,
  AddProductOfferCodeType,
  UpdateProductCouponCodeType,
  UpdateProductOfferCampaignType,
} from "./returnTypes";
import {
  AddProductCouponCodeResult,
  AddProductOfferCampaignResult,
  AddProductOfferCodeResult,
  UpdateProductCouponCodeResult,
  UpdateProductOfferCampaignResult,
} from "./types";

export const ProductCouponCodeCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addProductCouponCode", {
      type: AddProductCouponCodeResult,
      description: "Add a coupon code",
      nullable: false,
      args: {
        title: stringArg({
          required: true,
          description: "The name or a short description of the coupon code",
        }),
        discountPercentage: floatArg({
          required: true,
          description: "The percentage of the coupon code discount",
        }),
        beachBarOffer: booleanArg({
          required: true,
          description: "Set to true if this is an offer from a #beach_bar",
        }),
        validUntil: arg({
          type: DateTimeScalar,
          required: true,
          description: "A timestamp that indicates until what date and time this coupon code is applicable and valid",
        }),
        isActive: booleanArg({
          required: true,
          description: "Set to true if coupon code is active. Its default value is set to false",
          default: false,
        }),
        timesLimit: intArg({
          required: true,
          description: "Represents how many times this coupon code can be used",
        }),
      },
      resolve: async (
        _,
        { title, discountPercentage, beachBarOffer, validUntil, isActive, timesLimit },
        { payload }: MyContext
      ): Promise<AddProductCouponCodeType | ErrorType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (!checkScopes(payload, ["beach_bar@crud:product_coupon_code"])) {
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

        const newCouponCode = ProductCouponCode.create({
          title,
          discountPercentage,
          beachBarOffer,
          isActive,
          validUntil,
          timesLimit,
        });

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
    t.field("updateProductCouponCode", {
      type: UpdateProductCouponCodeResult,
      description: "Update a coupon code",
      nullable: false,
      args: {
        couponCodeId: arg({
          type: BigIntScalar,
          required: true,
          description: "The ID value of the product coupon code",
        }),
        title: stringArg({
          required: false,
          description: "The name or a short description of the coupon code",
        }),
        discountPercentage: floatArg({
          required: false,
          description: "The percentage of the coupon code discount",
        }),
        beachBarOffer: booleanArg({
          required: false,
          description: "Set to true if this is an offer from a #beach_bar",
        }),
        validUntil: arg({
          type: DateTimeScalar,
          required: false,
          description: "A timestamp that indicates until what date and time this coupon code is applicable and valid",
        }),
        isActive: booleanArg({
          required: false,
          description: "Set to true if coupon code is active. Its default value is set to false",
        }),
        timesLimit: intArg({
          required: false,
          description: "Represents how many times this coupon code can be used",
        }),
      },
      resolve: async (
        _,
        { couponCodeId, title, discountPercentage, beachBarOffer, validUntil, isActive, timesLimit },
        { payload }: MyContext
      ): Promise<UpdateProductCouponCodeType | DeleteType | ErrorType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (!checkScopes(payload, ["beach_bar@crud:product_coupon_code", "beach_bar@update:product_coupon_code"])) {
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

        const couponCode = await ProductCouponCode.findOne(couponCodeId);
        if (!couponCode) {
          return { error: { code: errors.CONFLICT, message: "Specified coupon code does not exist" } };
        }

        try {
          const updatedCouponCode = await couponCode.update(
            title,
            discountPercentage,
            beachBarOffer,
            validUntil,
            isActive,
            timesLimit
          );
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
    t.field("deleteProductCouponCode", {
      type: DeleteResult,
      args: {
        couponCodeId: arg({
          type: BigIntScalar,
          required: true,
          description: "The ID value of the product coupon code",
        }),
      },
      resolve: async (_, { couponCodeId }, { payload }: MyContext): Promise<DeleteType | ErrorType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (!checkScopes(payload, ["beach_bar@crud:product_coupon_code"])) {
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

        const couponCode = await ProductCouponCode.findOne(couponCodeId);
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

export const ProductOfferCampaignCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addProductOfferCampaign", {
      type: AddProductOfferCampaignResult,
      description: "Add an offer campaign to a #beach_bar",
      nullable: false,
      args: {
        productIds: intArg({
          required: true,
          description: "The ID value of the product",
          list: true,
        }),
        title: stringArg({
          required: true,
          description: "The name or a short description of the coupon code",
        }),
        discountPercentage: floatArg({
          required: true,
          description: "The percentage of the coupon code discount",
        }),
        beachBarOffer: booleanArg({
          required: true,
          description: "Set to true if this is an offer from a #beach_bar",
        }),
        validUntil: arg({
          type: DateTimeScalar,
          required: true,
          description: "A timestamp that indicates until what date and time this coupon code is applicable and valid",
        }),
        isActive: booleanArg({
          required: true,
          description: "Set to true if coupon code is active. Its default value is set to false",
          default: false,
        }),
      },
      resolve: async (
        _,
        { productIds, title, discountPercentage, beachBarOffer, validUntil, isActive },
        { payload }: MyContext
      ): Promise<AddProductOfferCampaignType | ErrorType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (!checkScopes(payload, ["beach_bar@crud:product_offer_campaign"])) {
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

        const newOfferCampaign = ProductOfferCampaign.create({
          title,
          discountPercentage,
          beachBarOffer,
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
    t.field("updateProductOfferCampaign", {
      type: UpdateProductOfferCampaignResult,
      description: "Update the details of an offer campaign of a #beach_bar",
      nullable: false,
      args: {
        offerCampaignId: arg({
          type: BigIntScalar,
          required: true,
          description: "The ID value of the offer campaign",
        }),
        productIds: intArg({
          required: false,
          description: "The ID value of the product",
          list: true,
        }),
        title: stringArg({
          required: false,
          description: "The name or a short description of the coupon code",
        }),
        discountPercentage: floatArg({
          required: false,
          description: "The percentage of the coupon code discount",
        }),
        beachBarOffer: booleanArg({
          required: false,
          description: "Set to true if this is an offer from a #beach_bar",
        }),
        validUntil: arg({
          type: DateTimeScalar,
          required: false,
          description: "A timestamp that indicates until what date and time this coupon code is applicable and valid",
        }),
        isActive: booleanArg({
          required: false,
          description: "Set to true if coupon code is active. Its default value is set to false",
        }),
      },
      resolve: async (
        _,
        { offerCampaignId, productIds, title, discountPercentage, beachBarOffer, validUntil, isActive },
        { payload }: MyContext
      ): Promise<UpdateProductOfferCampaignType | ErrorType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (!checkScopes(payload, ["beach_bar@crud:product_offer_campaign", "beach_bar@update:product_offer_campaign"])) {
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

        const offerCampaign = await ProductOfferCampaign.findOne({ where: { id: offerCampaignId }, relations: ["products"] });
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
          const updatedOfferCampaign = await offerCampaign.update(
            productIds,
            title,
            discountPercentage,
            beachBarOffer,
            validUntil,
            isActive
          );

          return {
            offerCampaign: updatedOfferCampaign,
            updated: true,
          };
        } catch (err) {
          return { error: { message: `${errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
        }
      },
    });
    t.field("deleteProductOfferCampaign", {
      type: DeleteResult,
      description: "Delete an offer campaign of a #beach_bar",
      nullable: false,
      args: {
        offerCampaignId: arg({
          type: BigIntScalar,
          required: true,
          description: "The ID value of the offer campaign",
        }),
      },
      resolve: async (_, { offerCampaignId }, { payload }: MyContext): Promise<DeleteType | ErrorType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (!checkScopes(payload, ["beach_bar@crud:product_offer_campaign"])) {
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

        const offerCampaign = await ProductOfferCampaign.findOne(offerCampaignId);
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

export const ProductOfferCodeCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addProductOfferCode", {
      type: AddProductOfferCodeResult,
      description: "Add (issue) a new offer code",
      nullable: false,
      args: {
        offerCampaignId: arg({
          type: BigIntScalar,
          required: true,
          description: "The ID value of the offer campaign",
        }),
      },
      resolve: async (_, { offerCampaignId }, { payload }: MyContext): Promise<AddProductOfferCodeType | ErrorType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (!checkScopes(payload, ["beach_bar@crud:product_offer_campaign"])) {
          return {
            error: {
              code: errors.UNAUTHORIZED_CODE,
              message: "You are not allowed to add (issue) a new offer code",
            },
          };
        }

        const offerCampaign = await ProductOfferCampaign.findOne({ where: { id: offerCampaignId }, relations: ["products"] });
        if (!offerCampaign) {
          return { error: { code: errors.CONFLICT, message: "Specified offer campaign does not exist" } };
        }
        if (dayjs(offerCampaign.validUntil) < dayjs()) {
          return { error: { code: errors.CONFLICT, message: "Specified offer campaign has expired" } };
        }

        const newOfferCode = ProductOfferCode.create({ campaign: offerCampaign });

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
    t.field("deleteProductOfferCode", {
      type: DeleteResult,
      description: "Delete (invalidate) an offer code of an offer campaign",
      nullable: false,
      args: {
        offerCodeId: arg({
          type: BigIntScalar,
          required: true,
          description: "The ID value of the offer campaign",
        }),
      },
      resolve: async (_, { offerCodeId }, { payload }: MyContext): Promise<DeleteType | ErrorType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (!checkScopes(payload, ["beach_bar@crud:product_offer_campaign"])) {
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

        const offerCode = await ProductOfferCode.findOne(offerCodeId);
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
