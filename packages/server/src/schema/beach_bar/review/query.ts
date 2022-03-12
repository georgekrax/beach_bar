import { errors } from "@beach_bar/common";
import { ApolloError, UserInputError } from "apollo-server-express";
import { extendType, idArg } from "nexus";
import { BeachBarReviewType } from "./types";

export const BeachBarReviewQuery = extendType({
  type: "Query",
  definition(t) {
    // t.nullable.list.field("getPaymentProductsMonth", {
    //   type: MonthTimeType,
    //   description: "Get a list with all the months in a review, by the product purchase",
    //   args: {
    //     beachBarId: idArg(),
    //     refCode: nullable(stringArg({ description: "The referral code of the customer payment, to find" })),
    //   },
    //   resolve: async (_, { beachBarId, refCode }, { payload }: MyContext): Promise<MonthTime[] | null> => {
    //     if (!beachBarId || beachBarId <= 0) return null;
    //     const { boolean, payment } = await verifyUserPaymentReview(beachBarId, refCode, payload);
    //     if (!boolean) return null;
    //     if (!payment || !payment.cart || !payment.cart.products) return null;
    //     const productsMonthIds = payment.getProductsMonth(beachBarId);
    //     if (!productsMonthIds) return null;
    //     const months = await MonthTime.find({ id: In(productsMonthIds) });
    //     return months;
    //   },
    // });
    t.nullable.list.field("reviews", {
      type: BeachBarReviewType,
      description: "Get a list of all the reviews of an authenticated user",
      resolve: async (_, __, { prisma, payload }) => {
        if (!payload?.sub) return null;

        const customer = await prisma.customer.findUnique({ where: { userId: payload.sub }, include: { reviews: true } });
        if (!customer) throw new ApolloError(errors.USER_NOT_FOUND_MESSAGE, errors.NOT_FOUND);

        return customer?.reviews || [];
      },
    });
    t.field("review", {
      type: BeachBarReviewType,
      description: "Get the details of a a review of an authenticated user",
      args: { reviewId: idArg() },
      resolve: async (_, { reviewId }, { prisma }) => {
        if (reviewId.toString().trim().length === 0) {
          throw new UserInputError("Please provide a valid review ID", { code: errors.INVALID_ARGUMENTS });
        }

        const review = await prisma.beachBarReview.findUnique({ where: { id: BigInt(reviewId) } });
        if (!review) throw new ApolloError("Specified review does not exist", errors.NOT_FOUND);

        return review;
      },
    });
  },
});
