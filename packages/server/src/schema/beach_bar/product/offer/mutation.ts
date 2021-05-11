import { errors, MyContext } from "@beach_bar/common";
import { DateTimeScalar } from "@the_hashtag/common/dist/graphql";
import { ApolloError, UserInputError } from "apollo-server-errors";
import dayjs from "dayjs";
import { BeachBar } from "entity/BeachBar";
import { CouponCode } from "entity/CouponCode";
import { OfferCampaign } from "entity/OfferCampaign";
import { OfferCampaignCode } from "entity/OfferCampaignCode";
import { Product } from "entity/Product";
import { arg, booleanArg, extendType, floatArg, idArg, intArg, list, nullable, stringArg } from "nexus";
import { In } from "typeorm";
import { TDelete } from "typings/.index";
import {
  TAddCouponCode,
  TAddOfferCampaign,
  TUpdateCouponCode,
  TUpdateOfferCampaign,
  TAddOfferCampaignCode,
} from "typings/beach_bar/product/offer";
import { isAuth, throwScopesUnauthorized } from "utils/auth/payload";
import { DeleteGraphQlType } from "../../../types";
import {
  AddCouponCodeType,
  AddOfferCampaignType,
  AddOfferCampaignCodeType,
  UpdateCouponCodeType,
  UpdateOfferCampaignType,
} from "./types";

export const CouponCodeCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addCouponCode", {
      type: AddCouponCodeType,
      description: "Add a coupon code",
      args: {
        title: stringArg({ description: "The name or a short description of the coupon code" }),
        discountPercentage: floatArg({ description: "The percentage of the coupon code discount" }),
        beachBarId: nullable(idArg()),
        validUntil: arg({
          type: DateTimeScalar,
          description: "A timestamp that indicates until what date and time this coupon code is applicable and valid",
        }),
        isActive: booleanArg({
          description: "Set to true if coupon code is active. Its default value is set to false",
          default: false,
        }),
        timesLimit: intArg({ description: "Represents how many times this coupon code can be used" }),
      },
      resolve: async (
        _,
        { title, discountPercentage, beachBarId, validUntil, isActive, timesLimit },
        { payload }: MyContext
      ): Promise<TAddCouponCode> => {
        isAuth(payload);
        throwScopesUnauthorized(payload, "You are not allowed to add (issue) a coupon code", ["beach_bar@crud:coupon_code"]);

        if (!discountPercentage || discountPercentage <= 0 || discountPercentage > 100)
          throw new UserInputError("Please provide a valid discount percentage");

        const newCouponCode = CouponCode.create({
          title,
          discountPercentage,
          isActive,
          validUntil,
          timesLimit,
        });

        if (beachBarId) {
          const beachBar = await BeachBar.findOne(beachBarId);
          if (!beachBar) throw new ApolloError(errors.BEACH_BAR_DOES_NOT_EXIST, errors.NOT_FOUND);
          newCouponCode.beachBar = beachBar;
        }

        try {
          await newCouponCode.save();
        } catch (err) {
          throw new ApolloError(errors.SOMETHING_WENT_WRONG + ": " + err.message);
        }

        return {
          couponCode: newCouponCode,
          added: true,
        };
      },
    });
    t.field("updateCouponCode", {
      type: UpdateCouponCodeType,
      description: "Update a coupon code",
      args: {
        couponCodeId: idArg(),
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
      ): Promise<TUpdateCouponCode> => {
        isAuth(payload);
        throwScopesUnauthorized(payload, "You are not allowed to update a coupon code", [
          "beach_bar@crud:coupon_code",
          "beach_bar@update:coupon_code",
        ]);

        if (!discountPercentage || discountPercentage <= 0 || discountPercentage > 100)
          throw new UserInputError("Please provide a valid discount percentage");

        const couponCode = await CouponCode.findOne(couponCodeId);
        if (!couponCode) throw new ApolloError("Specified coupon code does not exist", errors.NOT_FOUND);

        try {
          const updatedCouponCode = await couponCode.update({
            title,
            discountPercentage,
            validUntil,
            isActive,
            timesLimit,
          });

          return { couponCode: updatedCouponCode, updated: true, deleted: updatedCouponCode.deleted ? true : false };
        } catch (err) {
          throw new ApolloError(errors.SOMETHING_WENT_WRONG + ": " + err.message);
        }
      },
    });
    t.field("deleteCouponCode", {
      type: DeleteGraphQlType,
      args: { couponCodeId: idArg() },
      resolve: async (_, { couponCodeId }, { payload }: MyContext): Promise<TDelete> => {
        isAuth(payload);
        throwScopesUnauthorized(payload, "You are not allowed to delete (invalidate) a coupon code", ["beach_bar@crud:coupon_code"]);

        if (!couponCodeId || couponCodeId.trim().length === 0) throw new UserInputError("Please provide a valid couponCodeId");

        const couponCode = await CouponCode.findOne(couponCodeId);
        if (!couponCode) throw new ApolloError("Specified coupon code does not exist", errors.NOT_FOUND);

        try {
          await couponCode.softRemove();
        } catch (err) {
          throw new ApolloError(errors.SOMETHING_WENT_WRONG + ": " + err.message);
        }

        return { deleted: true };
      },
    });
  },
});

export const OfferCampaignCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addOfferCampaign", {
      type: AddOfferCampaignType,
      description: "Add an offer campaign to a #beach_bar",
      args: {
        productIds: list(idArg()),
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
      ): Promise<TAddOfferCampaign> => {
        isAuth(payload);
        throwScopesUnauthorized(payload, "You are not allowed to add an offer campaign to a #beach_bar", [
          "beach_bar@crud:offer_campaign",
        ]);

        if (!productIds || productIds.length === 0) throw new UserInputError("Please provide a or some valid product(s)");
        if (!discountPercentage || discountPercentage <= 0 || discountPercentage > 100)
          throw new UserInputError("Please provide a valid discount percentage");

        const products = await Product.find({ where: { id: In(productIds) } });
        if (products.some(product => !product.isActive))
          throw new ApolloError("All the products should be active, in order to be applied for an offer campaign");

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
          throw new ApolloError(errors.SOMETHING_WENT_WRONG + ": " + err.message);
        }

        return { offerCampaign: newOfferCampaign, added: true };
      },
    });
    t.field("updateOfferCampaign", {
      type: UpdateOfferCampaignType,
      description: "Update the details of an offer campaign of a #beach_bar",
      args: {
        offerCampaignId: idArg(),
        productIds: list(
          nullable(
            idArg({
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
      ): Promise<TUpdateOfferCampaign> => {
        isAuth(payload);
        throwScopesUnauthorized(payload, "You are not allowed to update an offer campaign of a #beach_bar", [
          "beach_bar@crud:offer_campaign",
          "beach_bar@update:offer_campaign",
        ]);

        if (!offerCampaignId || offerCampaignId <= 0) throw new UserInputError("Please provide a valid offerCampaignId");
        if (!discountPercentage || discountPercentage <= 0 || discountPercentage > 100)
          throw new UserInputError("Please provide a valid discount percentage");

        const offerCampaign = await OfferCampaign.findOne({ where: { id: offerCampaignId }, relations: ["products"] });
        if (!offerCampaign) throw new ApolloError("Specified offer campaign does not exist", errors.NOT_FOUND);
        if (!offerCampaign.validUntil || validUntil < dayjs(offerCampaign.validUntil))
          throw new ApolloError(
            "You should delete the offer campaign, if you want it to be valid before the datetime you had initially set"
          );

        try {
          const updatedOfferCampaign = await offerCampaign.update(productIds, title, discountPercentage, validUntil, isActive);

          return { offerCampaign: updatedOfferCampaign, updated: true };
        } catch (err) {
          throw new ApolloError(errors.SOMETHING_WENT_WRONG + ": " + err.message);
        }
      },
    });
    t.field("deleteOfferCampaign", {
      type: DeleteGraphQlType,
      description: "Delete an offer campaign of a #beach_bar",
      args: { offerCampaignId: idArg() },
      resolve: async (_, { offerCampaignId }, { payload }: MyContext): Promise<TDelete> => {
        isAuth(payload);
        throwScopesUnauthorized(payload, "You are not allowed to delete an offer campaign of a #beach_bar", [
          "beach_bar@crud:offer_campaign",
        ]);

        if (!offerCampaignId || offerCampaignId.trim().length === 0)
          throw new UserInputError("Please provide a valid offerCampaignId");

        const offerCampaign = await OfferCampaign.findOne(offerCampaignId);
        if (!offerCampaign) throw new ApolloError("Specified offer campaign does not exist", errors.NOT_FOUND);

        try {
          await offerCampaign.softRemove();
        } catch (err) {
          throw new ApolloError(errors.SOMETHING_WENT_WRONG + ": " + err.message);
        }

        return { deleted: true };
      },
    });
  },
});

export const OfferCampaignCodeCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addOfferCampaignCode", {
      type: AddOfferCampaignCodeType,
      description: "Add (issue) a new offer code",
      args: { offerCampaignId: idArg() },
      resolve: async (_, { offerCampaignId }, { payload }: MyContext): Promise<TAddOfferCampaignCode> => {
        isAuth(payload);
        throwScopesUnauthorized(payload, "You are not allowed to add (issue) a new offer code", ["beach_bar@crud:offer_campaign"]);

        const offerCampaign = await OfferCampaign.findOne({ where: { id: offerCampaignId }, relations: ["products"] });
        if (!offerCampaign) throw new ApolloError("Specified offer campaign does not exist", errors.NOT_FOUND);
        if (dayjs(offerCampaign.validUntil) < dayjs()) throw new ApolloError("Specified offer campaign has expired", errors.CONFLICT);

        const newOfferCode = OfferCampaignCode.create({ campaign: offerCampaign });

        try {
          await newOfferCode.save();
        } catch (err) {
          throw new ApolloError(errors.SOMETHING_WENT_WRONG + ": " + err.message);
        }

        return { offerCode: newOfferCode, added: true };
      },
    });
    t.field("deleteOfferCode", {
      type: DeleteGraphQlType,
      description: "Delete (invalidate) an offer code of an offer campaign",
      args: { offerCodeId: idArg() },
      resolve: async (_, { offerCodeId }, { payload }: MyContext): Promise<TDelete> => {
        isAuth(payload);
        throwScopesUnauthorized(payload, "You are not allowed to delete an offer code of an offer campaign", [
          "beach_bar@crud:offer_campaign",
        ]);

        if (!offerCodeId || offerCodeId.trim().length === 0) throw new UserInputError("Please provide a vaid offerCodeId");

        const offerCode = await OfferCampaignCode.findOne(offerCodeId);
        if (!offerCode) throw new ApolloError("Specified offer code does not exist", errors.NOT_FOUND);

        try {
          await offerCode.softRemove();
        } catch (err) {
          throw new ApolloError(errors.SOMETHING_WENT_WRONG + ": " + err.message);
        }

        return { deleted: true };
      },
    });
  },
});
