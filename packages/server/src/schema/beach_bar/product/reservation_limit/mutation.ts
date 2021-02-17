import { errors, MyContext } from "@beach_bar/common";
import { BigIntScalar, DateScalar } from "@the_hashtag/common/dist/graphql";
import { Product } from "entity/Product";
import { ProductReservationLimit } from "entity/ProductReservationLimit";
import { HourTime } from "entity/Time";
import { arg, extendType, intArg, list, nullable } from "nexus";
import { In } from "typeorm";
import { DeleteType } from "typings/.index";
import { AddProductReservationLimitType, UpdateProductReservationLimitType } from "typings/beach_bar/product/reservationLimit";
import { checkScopes } from "utils/checkScopes";
import { DeleteResult } from "../../../types";
import { AddProductReservationLimitResult, UpdateProductReservationLimitResult } from "./types";

export const ProductReservationLimitCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addProductReservationLimit", {
      type: AddProductReservationLimitResult,
      description: "Add a reservation limit to a #beach_bar product",
      args: {
        productId: intArg({ description: "The ID value of the product to add this reservation limit" }),
        limit: intArg({ description: "The number to add as a limit a #beach_bar can provide the product, for specific date(s)" }),
        dates: list(arg({ type: DateScalar, description: "A list of days this limit is applicable for" })),
        startTimeId: intArg({ description: "The ID value of the hour time from when this limit is applicable" }),
        endTimeId: intArg({
          description: "The ID value of the hour time from when this limit is terminated (is not applicable anymore)",
        }),
      },
      resolve: async (
        _,
        { productId, limit, dates, startTimeId, endTimeId },
        { payload }: MyContext
      ): Promise<AddProductReservationLimitType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (!checkScopes(payload, ["beach_bar@crud:beach_bar", "beach_bar@crud:product_reservation_limit"])) {
          return {
            error: {
              code: errors.UNAUTHORIZED_CODE,
              message: "You are not allowed to add a or some reservation limit(s) for a #beach_bar product",
            },
          };
        }

        if (!dates || dates.length === 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provided a valid limit date" } };
        }

        const product = await Product.findOne({ where: { id: productId }, relations: ["beachBar"] });
        if (!product) {
          return { error: { code: errors.CONFLICT, message: "Specified product does not exist" } };
        }

        const startTime = await HourTime.findOne(startTimeId);
        if (!startTime) {
          return { error: { code: errors.CONFLICT, message: "Invalid start time of the limit" } };
        }

        const endTime = await HourTime.findOne(endTimeId);
        if (!endTime) {
          return { error: { code: errors.CONFLICT, message: "Invalid end time of the limit" } };
        }

        const returnResults: ProductReservationLimit[] = [];

        try {
          for (let i = 0; i < dates.length; i++) {
            const newReservationLimit = ProductReservationLimit.create({
              limitNumber: limit,
              product,
              date: dates[i],
              startTime,
              endTime,
            });
            await newReservationLimit.save();
            returnResults.push(newReservationLimit);
          }
          await product.beachBar.updateRedis();
        } catch (err) {
          return { error: { message: `${errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
        }

        return {
          reservationLimit: returnResults,
          added: true,
        };
      },
    });
    t.field("updateProductReservationLimit", {
      type: UpdateProductReservationLimitResult,
      description: "Update a #beach_bar's product reservation limit",
      args: {
        reservationLimitIds: list(
          arg({
            type: BigIntScalar,
            description: "A list with all the reservation limits to update",
          })
        ),
        limit: nullable(
          intArg({
            description: "The number to add as a limit a #beach_bar can provide the product, for specific date(s)",
          })
        ),
        startTimeId: nullable(intArg({ description: "The ID value of the hour time from when this limit is applicable" })),
        endTimeId: nullable(
          intArg({
            description: "The ID value of the hour time from when this limit is terminated (is not applicable anymore)",
          })
        ),
      },
      resolve: async (
        _,
        { reservationLimitIds, limit, startTimeId, endTimeId },
        { payload }: MyContext
      ): Promise<UpdateProductReservationLimitType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (
          !checkScopes(payload, [
            "beach_bar@crud:beach_bar",
            "beach_bar@crud:product_reservation_limit",
            "beach_bar@update:product_reservation_limit",
          ])
        ) {
          return {
            error: {
              code: errors.UNAUTHORIZED_CODE,
              message: "You are not allowed to update a reservation limit for a #beach_bar product",
            },
          };
        }

        if (!reservationLimitIds || reservationLimitIds.length === 0 || reservationLimitIds.some(limit => limit <= 0)) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a or some valid reservation limit(s)" } };
        }

        const reservationLimits = await ProductReservationLimit.find({
          where: { id: In(reservationLimitIds) },
          relations: ["startTime", "endTime", "product", "product.beachBar"],
        });
        if (!reservationLimits || reservationLimits.filter(limit => !limit.product.deletedAt).length === 0) {
          return { error: { code: errors.CONFLICT, message: "Specified reservation limit(s) do not exist" } };
        }

        try {
          const updatedReservationLimits: ProductReservationLimit[] = [];
          for (let i = 0; i < reservationLimits.length; i++) {
            const updatedReservationLimit = await reservationLimits[i].update(limit, startTimeId, endTimeId);
            updatedReservationLimits.push(updatedReservationLimit);
          }
          if (updatedReservationLimits.length === 0) {
            return { error: { message: errors.SOMETHING_WENT_WRONG } };
          }
          return {
            reservationLimit: updatedReservationLimits,
            updated: true,
          };
        } catch (err) {
          return { error: { message: `${errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
        }
      },
    });
    t.field("deleteProductReservationLimit", {
      type: DeleteResult,
      description: "Delete a or some reservation limit(s) from a #beach_bar's product",
      args: {
        reservationLimitIds: list(arg({
          type: BigIntScalar,
          description: "A list with all the reservation limits to delete",
        })),
      },
      resolve: async (_, { reservationLimitIds }, { payload }: MyContext): Promise<DeleteType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (!checkScopes(payload, ["beach_bar@crud:beach_bar", "beach_bar@crud:product_reservation_limit"])) {
          return {
            error: {
              code: errors.UNAUTHORIZED_CODE,
              message: "You are not allowed to delete a or some reservation limit(s) from a #beach_bar product",
            },
          };
        }

        if (!reservationLimitIds || reservationLimitIds.length === 0 || reservationLimitIds.some(limit => limit <= 0)) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a or some valid reservation limit(s)" } };
        }

        const reservationLimits = await ProductReservationLimit.find({
          where: { id: In(reservationLimitIds) },
          relations: ["product", "product.beachBar"],
        });
        if (!reservationLimits) {
          return { error: { code: errors.CONFLICT, message: "Specified reservation limit(s) do not exist" } };
        }

        try {
          reservationLimits.forEach(async (limit: ProductReservationLimit) => await limit.softRemove());
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
