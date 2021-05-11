import { errors, MyContext } from "@beach_bar/common";
import { DateScalar } from "@the_hashtag/common/dist/graphql";
import { ApolloError, UserInputError } from "apollo-server-errors";
import { Product } from "entity/Product";
import { ProductReservationLimit } from "entity/ProductReservationLimit";
import { HourTime } from "entity/Time";
import { arg, extendType, idArg, intArg, list, nullable } from "nexus";
import { In } from "typeorm";
import { DeleteType } from "typings/.index";
import { TAddProductReservationLimit, TUpdateProductReservationLimit } from "typings/beach_bar/product/reservationLimit";
import { isAuth, throwScopesUnauthorized } from "utils/auth/payload";
import { DeleteGraphQlType } from "../../../types";
import { AddProductReservationLimitType, UpdateProductReservationLimitType } from "./types";

export const ProductReservationLimitCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addProductReservationLimit", {
      type: AddProductReservationLimitType,
      description: "Add a reservation limit to a #beach_bar product",
      args: {
        productId: idArg({ description: "The ID value of the product to add this reservation limit" }),
        limit: intArg({ description: "The number to add as a limit a #beach_bar can provide the product, for specific date(s)" }),
        dates: list(arg({ type: DateScalar, description: "A list of days this limit is applicable for" })),
        startTimeId: idArg({ description: "The ID value of the hour time from when this limit is applicable" }),
        endTimeId: idArg({
          description: "The ID value of the hour time from when this limit is terminated (is not applicable anymore)",
        }),
      },
      resolve: async (
        _,
        { productId, limit, dates, startTimeId, endTimeId },
        { payload }: MyContext
      ): Promise<TAddProductReservationLimit> => {
        isAuth(payload);
        throwScopesUnauthorized(payload, "You are not allowed to add a or some reservation limit(s) to a #beach_bar product", [
          "beach_bar@crud:beach_bar",
          "beach_bar@crud:product_reservation_limit",
        ]);

        if (!dates || dates.length === 0) throw new UserInputError("Please provided a valid limit date");

        const product = await Product.findOne({ where: { id: productId }, relations: ["beachBar"] });
        if (!product) throw new ApolloError("Product was not found", errors.NOT_FOUND);

        const startTime = await HourTime.findOne(startTimeId);
        if (!startTime) throw new ApolloError("Start time was not found", errors.NOT_FOUND);

        const endTime = await HourTime.findOne(endTimeId);
        if (!endTime) throw new ApolloError("End time was not found", errors.NOT_FOUND);

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
          throw new ApolloError(err.message);
        }

        return { reservationLimit: returnResults, added: true };
      },
    });
    t.field("updateProductReservationLimit", {
      type: UpdateProductReservationLimitType,
      description: "Update a #beach_bar's product reservation limit",
      args: {
        reservationLimitIds: list(idArg()),
        limit: nullable(intArg()),
        startTimeId: nullable(idArg()),
        endTimeId: nullable(idArg()),
      },
      resolve: async (
        _,
        { reservationLimitIds, limit, startTimeId, endTimeId },
        { payload }: MyContext
      ): Promise<TUpdateProductReservationLimit> => {
        isAuth(payload);
        throwScopesUnauthorized(payload, "You are not allowed to update a reservation limit of a #beach_bar's product", [
          "beach_bar@crud:beach_bar",
          "beach_bar@crud:product_reservation_limit",
          "beach_bar@update:product_reservation_limit",
        ]);

        if (!reservationLimitIds || reservationLimitIds.length === 0 || reservationLimitIds.some(limit => limit.trim().length === 0))
          throw new UserInputError("Please provide valid reservationLimitIds");

        const reservationLimits = await ProductReservationLimit.find({
          where: { id: In(reservationLimitIds) },
          relations: ["startTime", "endTime", "product", "product.beachBar"],
        });
        if (!reservationLimits || reservationLimits.filter(limit => !limit.product.deletedAt).length === 0)
          throw new ApolloError("Reservation limits were not found", errors.NOT_FOUND);

        try {
          const updatedReservationLimits: ProductReservationLimit[] = [];
          for (let i = 0; i < reservationLimits.length; i++) {
            const updatedReservationLimit = await reservationLimits[i].update(limit, startTimeId, endTimeId);
            updatedReservationLimits.push(updatedReservationLimit);
          }
          if (updatedReservationLimits.length === 0) throw new ApolloError(errors.SOMETHING_WENT_WRONG);
          return { reservationLimit: updatedReservationLimits, updated: true };
        } catch (err) {
          throw new ApolloError(err.message);
        }
      },
    });
    t.field("deleteProductReservationLimit", {
      type: DeleteGraphQlType,
      description: "Delete a or some reservation limit(s) from a #beach_bar's product",
      args: { reservationLimitIds: list(idArg()) },
      resolve: async (_, { reservationLimitIds }, { payload }: MyContext): Promise<DeleteType> => {
        isAuth(payload);
        throwScopesUnauthorized(payload, "You are not allowed to delete a or some reservation limit(s) from a #beach_bar's product", [
          "beach_bar@crud:beach_bar",
          "beach_bar@crud:product_reservation_limit",
        ]);

        if (!reservationLimitIds || reservationLimitIds.length === 0 || reservationLimitIds.some(limit => limit.trim().length === 0)) throw new UserInputError("Please provide valid reservationLimitIds");

        const reservationLimits = await ProductReservationLimit.find({
          where: { id: In(reservationLimitIds) },
          relations: ["product", "product.beachBar"],
        });
        if (!reservationLimits) throw new ApolloError("Reservation limits were not found", errors.NOT_FOUND);

        try {
          reservationLimits.forEach(async (limit: ProductReservationLimit) => await limit.softRemove());
        } catch (err) {
          throw new ApolloError(err.message);
        }

        return { deleted: true };
      },
    });
  },
});
