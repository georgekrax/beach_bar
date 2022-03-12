import { isAuth, throwScopesUnauthorized } from "@/utils/auth";
import { updateRedis } from "@/utils/db";
import { errors } from "@beach_bar/common";
import { DateScalar } from "@the_hashtag/common/dist/graphql";
import { ApolloError, UserInputError } from "apollo-server-errors";
import { arg, extendType, idArg, intArg, nullable } from "nexus";
import { ProductReservationLimitType } from "./types";

export const ProductReservationLimitCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addProductReservationLimit", {
      type: ProductReservationLimitType,
      description: "Add a reservation limit to a #beach_bar product",
      args: {
        productId: idArg({ description: "The ID value of the product to add this reservation limit" }),
        limit: intArg({ description: "The number to add as a limit a #beach_bar can provide the product, for specific date(s)" }),
        from: arg({ type: DateScalar.name, description: "The starting date this limit is applicable for" }),
        to: arg({ type: DateScalar.name, description: "The ending date this limit is applicable for" }),
        startTimeId: nullable(idArg({ description: "The ID value of the hour time from when this limit is applicable" })),
        endTimeId: nullable(
          idArg({ description: "The ID value of the hour time from when this limit is terminated (is not applicable anymore)" })
        ),
      },
      resolve: async (_, { productId, limit, startTimeId, endTimeId, from, to }, { prisma, payload }) => {
        isAuth(payload);
        throwScopesUnauthorized(payload, "You are not allowed to add a or some reservation limit(s) to a #beach_bar product", [
          "beach_bar@crud:beach_bar",
          "beach_bar@crud:product_reservation_limit",
        ]);

        const product = await prisma.product.findUnique({ where: { id: +productId }, include: { beachBar: true } });
        if (!product) throw new ApolloError("Product was not found", errors.NOT_FOUND);

        // let startTime: typeof HOUR_TIME[number] | undefined;
        // let endTime: typeof HOUR_TIME[number] | undefined;
        // if (startTimeId && endTimeId) {
        //   startTime = TABLES.HOUR_TIME.find(({ id }) => id.toString() === startTimeId.toString());
        //   if (!startTime) throw new ApolloError("Start time was not found", errors.NOT_FOUND);

        //   endTime = TABLES.HOUR_TIME.find(({ id }) => id.toString() === endTimeId.toString());
        //   if (!endTime) throw new ApolloError("End time was not found", errors.NOT_FOUND);
        // } else {
        //   const { openingTime, closingTime } = product.beachBar;
        //   startTime = openingTime as any;
        //   endTime = closingTime as any;
        // }
        const hasBoth = startTimeId && endTimeId;
        const { openingTimeId, closingTimeId } = product.beachBar;

        try {
          const newLimit = await prisma.productReservationLimit.create({
            data: {
              from: new Date(from.toString()),
              to: new Date(to.toString()),
              limitNumber: limit,
              productId: product.id,
              startTimeId: hasBoth ? +startTimeId : openingTimeId,
              endTimeId: hasBoth ? +endTimeId : closingTimeId,
            },
          });
          await updateRedis({ model: "BeachBar", id: product.beachBarId });
          return newLimit;
        } catch (err) {
          throw new ApolloError(err.message);
        }
      },
    });
    t.field("updateProductReservationLimit", {
      type: ProductReservationLimitType,
      description: "Update a #beach_bar's product reservation limit",
      args: {
        id: idArg(),
        limit: nullable(intArg()),
        // startTimeId: nullable(idArg()),
        // endTimeId: nullable(idArg()),
      },
      resolve: async (_, { id, limit }, { prisma, payload }) => {
        isAuth(payload);
        throwScopesUnauthorized(payload, "You are not allowed to update a reservation limit of a #beach_bar's product", [
          "beach_bar@crud:beach_bar",
          "beach_bar@crud:product_reservation_limit",
          "beach_bar@update:product_reservation_limit",
        ]);

        if (id.toString().trim().length === 0) throw new UserInputError("Please provide valid ID");

        try {
          const updatedLimit = await prisma.productReservationLimit.update({
            where: { id: BigInt(id) },
            include: { product: true },
            data: { limitNumber: limit || undefined },
          });

          await updateRedis({ model: "BeachBar", id: updatedLimit.product.beachBarId });
          return updatedLimit;
        } catch (err) {
          throw new ApolloError(err.message);
        }
      },
    });
    t.boolean("deleteProductReservationLimit", {
      description: "Delete a or some reservation limit(s) from a #beach_bar's product",
      args: { id: idArg() },
      resolve: async (_, { id }, { payload }) => {
        isAuth(payload);
        throwScopesUnauthorized(payload, "You are not allowed to delete a or some reservation limit(s) from a #beach_bar's product", [
          "beach_bar@crud:beach_bar",
          "beach_bar@crud:product_reservation_limit",
        ]);

        if (id.toString().trim().length === 0) throw new UserInputError("Please provide valid ID");

        // const reservationLimit = await ProductReservationLimit.findOne({
        //   where: { id: id },
        //   relations: ["product", "product.beachBar"],
        // });
        // if (!reservationLimit) throw new ApolloError("Reservation limit was not found", errors.NOT_FOUND);

        try {
          // TODO: Fix
          // await reservationLimit.softRemove();
        } catch (err) {
          throw new ApolloError(err.message);
        }

        return true;
      },
    });
  },
});
