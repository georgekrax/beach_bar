import { BigIntScalar, DateTimeScalar, errors, MyContext } from "@beach_bar/common";
import { arg, booleanArg, extendType, floatArg, intArg, stringArg } from "@nexus/schema";
import dayjs from "dayjs";
import { In } from "typeorm";
import { Product } from "../../../../entity/Product";
import { ProductCouponCode } from "../../../../entity/ProductCouponCode";
import { ProductVoucherCampaign } from "../../../../entity/ProductVoucherCampaign";
import { ProductVoucherCode } from "../../../../entity/ProductVoucherCode";
import { checkScopes } from "../../../../utils/checkScopes";
import { DeleteType, ErrorType } from "../../../returnTypes";
import { DeleteResult } from "../../../types";
import {
  AddProductCouponCodeType,
  AddProductVoucherCampaignType,
  AddProductVoucherCodeType,
  UpdateProductCouponCodeType,
  UpdateProductVoucherCampaignType,
} from "./returnTypes";
import {
  AddProductCouponCodeResult,
  AddProductVoucherCampaignResult,
  AddProductVoucherCodeResult,
  UpdateProductCouponCodeResult,
  UpdateProductVoucherCampaignResult,
} from "./types";

export const ProductCouponCodeCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addProductCouponCode", {
      type: AddProductCouponCodeResult,
      description: "Add a coupon code to a #beach_bar product",
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
        { payload }: MyContext,
      ): Promise<AddProductCouponCodeType | ErrorType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (!checkScopes(payload, ["beach_bar@crud:product_coupon_code"])) {
          return {
            error: {
              code: errors.UNAUTHORIZED_CODE,
              message: "You are not allowed to add a coupon code to a #beach_bar's product",
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
          return { error: { message: "All the products should be active, in order to be applied for a coupon code" } };
        }

        const newCouponCode = ProductCouponCode.create({
          title,
          discountPercentage,
          beachBarOffer,
          isActive,
          validUntil,
          products,
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
      description: "Update a coupon code of a #beach_bar product",
      nullable: false,
      args: {
        couponCodeId: arg({
          type: BigIntScalar,
          required: true,
          description: "The ID value of the product coupon code",
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
        { couponCodeId, productIds, title, discountPercentage, beachBarOffer, validUntil, isActive },
        { payload }: MyContext,
      ): Promise<UpdateProductCouponCodeType | ErrorType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (!checkScopes(payload, ["beach_bar@crud:product_coupon_code", "beach_bar@update:product_coupon_code"])) {
          return {
            error: {
              code: errors.UNAUTHORIZED_CODE,
              message: "You are not allowed to update a coupon code of a #beach_bar's product",
            },
          };
        }

        if (!couponCodeId || couponCodeId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: errors.SOMETHING_WENT_WRONG } };
        }
        if (!discountPercentage || discountPercentage <= 0 || discountPercentage > 100) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a or some discount percentage" } };
        }

        const couponCode = await ProductCouponCode.findOne({ where: { id: couponCodeId }, relations: ["products"] });
        if (!couponCode) {
          return { error: { code: errors.CONFLICT, message: "Specified coupon code does not exist" } };
        }

        try {
          const updatedCouponCode = await couponCode.update(
            productIds,
            title,
            discountPercentage,
            beachBarOffer,
            validUntil,
            isActive,
          );

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
      description: "Delete a coupon code of a product",
      nullable: false,
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
              message: "You are not allowed to delete a coupon code of a product",
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

export const ProductVoucherCampaignCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addProductVoucherCampaign", {
      type: AddProductVoucherCampaignResult,
      description: "Add a voucher campaign to a #beach_bar's product",
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
        { payload }: MyContext,
      ): Promise<AddProductVoucherCampaignType | ErrorType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (!checkScopes(payload, ["beach_bar@crud:product_voucher_campaign"])) {
          return {
            error: {
              code: errors.UNAUTHORIZED_CODE,
              message: "You are not allowed to add a voucher campaign to a #beach_bar's product",
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
          return { error: { message: "All the products should be active, in order to be applied for a voucher campaign" } };
        }

        const newVoucherCampaign = ProductVoucherCampaign.create({
          title,
          discountPercentage,
          beachBarOffer,
          isActive,
          validUntil,
          products,
        });

        try {
          await newVoucherCampaign.save();
        } catch (err) {
          return { error: { message: `${errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
        }

        return {
          voucherCampaign: newVoucherCampaign,
          added: true,
        };
      },
    });
    t.field("updateProductVoucherCampaign", {
      type: UpdateProductVoucherCampaignResult,
      description: "Update a voucher campaign of a #beach_bar's product",
      nullable: false,
      args: {
        voucherCampaignId: arg({
          type: BigIntScalar,
          required: true,
          description: "The ID value of the product voucher campaign",
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
        { voucherCampaignId, productIds, title, discountPercentage, beachBarOffer, validUntil, isActive },
        { payload }: MyContext,
      ): Promise<UpdateProductVoucherCampaignType | ErrorType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (!checkScopes(payload, ["beach_bar@crud:product_voucher_campaign", "beach_bar@update:product_voucher_campaign"])) {
          return {
            error: {
              code: errors.UNAUTHORIZED_CODE,
              message: "You are not allowed to update a voucher campaign of a #beach_bar's product",
            },
          };
        }

        if (!voucherCampaignId || voucherCampaignId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: errors.SOMETHING_WENT_WRONG } };
        }
        if (!discountPercentage || discountPercentage <= 0 || discountPercentage > 100) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a or some discount percentage" } };
        }

        const voucherCampaign = await ProductVoucherCampaign.findOne({ where: { id: voucherCampaignId }, relations: ["products"] });
        if (!voucherCampaign) {
          return { error: { code: errors.CONFLICT, message: "Specified voucher campaign does not exist" } };
        }

        try {
          const updatedVoucherCampaign = await voucherCampaign.update(
            productIds,
            title,
            discountPercentage,
            beachBarOffer,
            validUntil,
            isActive,
          );

          return {
            voucherCampaign: updatedVoucherCampaign,
            updated: true,
          };
        } catch (err) {
          return { error: { message: `${errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
        }
      },
    });
    t.field("deleteProductVoucherCampaign", {
      type: DeleteResult,
      description: "Delete a voucher campaign from a #beach_bar product",
      nullable: false,
      args: {
        voucherCampaignId: arg({
          type: BigIntScalar,
          required: true,
          description: "The ID value of the product voucher campaign",
        }),
      },
      resolve: async (_, { voucherCampaignId }, { payload }: MyContext): Promise<DeleteType | ErrorType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (!checkScopes(payload, ["beach_bar@crud:product_voucher_campaign"])) {
          return {
            error: {
              code: errors.UNAUTHORIZED_CODE,
              message: "You are not allowed to delete a voucher campaign of a product",
            },
          };
        }

        if (!voucherCampaignId || voucherCampaignId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: errors.SOMETHING_WENT_WRONG } };
        }

        const voucherCampaign = await ProductVoucherCampaign.findOne(voucherCampaignId);
        if (!voucherCampaign) {
          return { error: { code: errors.CONFLICT, message: "Specified voucher campaign does not exist" } };
        }

        try {
          await voucherCampaign.softRemove();
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

export const ProductVoucherCodeCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addProductVoucherCode", {
      type: AddProductVoucherCodeResult,
      description: "Add (issue) a new voucher code",
      nullable: false,
      args: {
        voucherCampaignId: arg({
          type: BigIntScalar,
          required: true,
          description: "The ID value of the product voucher campaign",
        }),
      },
      resolve: async (_, { voucherCampaignId }, { payload }: MyContext): Promise<AddProductVoucherCodeType | ErrorType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (!checkScopes(payload, ["beach_bar@crud:product_voucher_campaign"])) {
          return {
            error: {
              code: errors.UNAUTHORIZED_CODE,
              message: "You are not allowed to add (issue) a new voucher code",
            },
          };
        }

        const voucherCampaign = await ProductVoucherCampaign.findOne({ where: { id: voucherCampaignId }, relations: ["product"] });
        if (!voucherCampaign) {
          return { error: { code: errors.CONFLICT, message: "Specified voucher campaign does not exist" } };
        }
        if (voucherCampaign.validUntil < dayjs()) {
          return { error: { code: errors.CONFLICT, message: "Specified voucher campaign has expired" } };
        }

        const newVoucherCode = ProductVoucherCode.create({ campaign: voucherCampaign });

        try {
          await newVoucherCode.save();
        } catch (err) {
          return { error: { message: `${errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
        }

        return {
          voucherCode: newVoucherCode,
          added: true,
        };
      },
    });
    t.field("deleteProductVoucherCode", {
      type: DeleteResult,
      description: "Delete (invalidate) a voucher code of a product voucher campaign",
      nullable: false,
      args: {
        voucherCodeId: arg({
          type: BigIntScalar,
          required: true,
          description: "The ID value of the product voucher campaign",
        }),
      },
      resolve: async (_, { voucherCodeId }, { payload }: MyContext): Promise<DeleteType | ErrorType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (!checkScopes(payload, ["beach_bar@crud:product_voucher_campaign"])) {
          return {
            error: {
              code: errors.UNAUTHORIZED_CODE,
              message: "You are not allowed to delete a voucher code of a product's voucher campaign",
            },
          };
        }

        if (!voucherCodeId || voucherCodeId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: errors.SOMETHING_WENT_WRONG } };
        }

        const voucherCode = await ProductVoucherCode.findOne(voucherCodeId);
        if (!voucherCode) {
          return { error: { code: errors.CONFLICT, message: "Specified voucher code does not exist" } };
        }

        try {
          await voucherCode.softRemove();
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
