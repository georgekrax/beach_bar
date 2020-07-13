import { BigIntScalar, DateScalar, MyContext } from "@beach_bar/common";
import { arg, extendType, intArg } from "@nexus/schema";
import { In } from "typeorm";
import errors from "../../../../constants/errors";
import { HourTime } from "../../../../entity/Time";
import { Product } from "../../../../entity/Product";
import { ProductReservationLimit } from "../../../../entity/ProductReservationLimit";
import { checkScopes } from "../../../../utils/checkScopes";
import { DeleteType, ErrorType } from "../../../returnTypes";
import { DeleteResult } from "../../../types";
import { AddProductReservationLimitType, UpdateProductReservationLimitType } from "./returnTypes";
import { AddProductReservationLimitResult, UpdateProductReservationLimitResult } from "./types";

export const ProductReservationLimitCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addProductReservationLimit", {
      type: AddProductReservationLimitResult,
      description: "Add a reservation limit to a #beach_bar product",
      nullable: false,
      args: {
        productId: intArg({ required: true, description: "The ID value of the product to add this reservation limit" }),
        limit: intArg({
          required: true,
          description: "The number to add as a limit a #beach_bar can provide the product, for specific date(s)",
        }),
        dates: arg({ type: DateScalar, required: true, list: true, description: "A list of days this limit is applicable for" }),
        startTimeId: intArg({ required: true, description: "The ID value of the hour time from when this limit is applicable" }),
        endTimeId: intArg({
          required: true,
          description: "The ID value of the hour time from when this limit is terminated (is not applicable anymore)",
        }),
      },
      resolve: async (
        _,
        { productId, limit, dates, startTimeId, endTimeId },
        { payload }: MyContext,
      ): Promise<AddProductReservationLimitType | ErrorType> => {
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

        const product = await Product.findOne(productId);
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
      nullable: false,
      args: {
        reservationLimitIds: arg({
          type: BigIntScalar,
          required: true,
          list: true,
          description: "A list with all the reservation limits to update",
        }),
        limit: intArg({
          required: false,
          description: "The number to add as a limit a #beach_bar can provide the product, for specific date(s)",
        }),
        startTimeId: intArg({ required: false, description: "The ID value of the hour time from when this limit is applicable" }),
        endTimeId: intArg({
          required: false,
          description: "The ID value of the hour time from when this limit is terminated (is not applicable anymore)",
        }),
      },
      resolve: async (
        _,
        { reservationLimitIds, limit, startTimeId, endTimeId },
        { payload }: MyContext,
      ): Promise<UpdateProductReservationLimitType | ErrorType> => {
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

        let reservationLimits = await ProductReservationLimit.find({
          where: { id: In(reservationLimitIds) },
          relations: ["startTime", "endTime", "product"],
        });
        if (!reservationLimits || reservationLimits.filter(limit => !limit.product.deletedAt).length === 0) {
          return { error: { code: errors.CONFLICT, message: "Specified reservation limit(s) do not exist" } };
        }
        reservationLimits = reservationLimits.filter(limit => !limit.product.deletedAt);

        try {
          const updatedReservationLimits: ProductReservationLimit[] = [];
          for (let i = 0; i < reservationLimits.length; i++) {
            console.log(i);
            console.log(reservationLimits);
            console.log(reservationLimits.length);
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
      nullable: false,
      args: {
        reservationLimitIds: arg({
          type: BigIntScalar,
          required: true,
          list: true,
          description: "A list with all the reservation limits to delete",
        }),
      },
      resolve: async (_, { reservationLimitIds }, { payload }: MyContext): Promise<DeleteType | ErrorType> => {
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

        const reservationLimits = await ProductReservationLimit.find({ id: In(reservationLimitIds) });
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
