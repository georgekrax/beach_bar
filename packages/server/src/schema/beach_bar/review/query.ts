import { errors, MyContext } from "@beach_bar/common";
import { ApolloError, UserInputError } from "apollo-server-express";
import { BeachBarReview } from "entity/BeachBarReview";
import { Customer } from "entity/Customer";
import { MonthTime } from "entity/Time";
import { extendType, idArg, intArg, nullable, stringArg } from "nexus";
import { In } from "typeorm";
import { verifyUserPaymentReview } from "utils/beach_bar/verifyUserPaymentReview";
import { MonthTimeType } from "../../details/time/types";
import { BeachBarReviewType } from "./types";

export const BeachBarReviewQuery = extendType({
  type: "Query",
  definition(t) {
    t.boolean("verifyUserPaymentReview", {
      description: "Verify a user's payment to submit review",
      args: {
        beachBarId: intArg({ description: "The ID value of the #beach_bar to submit the review" }),
        refCode: nullable(stringArg({ description: "The referral code of the customer payment, to find" })),
      },
      resolve: async (_, { beachBarId, refCode }, { payload }: MyContext): Promise<boolean> => {
        if (!beachBarId || beachBarId <= 0) {
          return false;
        }
        const { boolean, customer, payment } = await verifyUserPaymentReview(beachBarId, refCode, payload);
        if (!customer || !payment) {
          return false;
        }
        if (!customer.checkReviewsQuantity(beachBarId, payment)) {
          return false;
        }
        return boolean;
      },
    });
    t.nullable.list.field("getPaymentProductsMonth", {
      type: MonthTimeType,
      description: "Get a list with all the months in a review, by the product purchase",
      args: {
        beachBarId: intArg({ description: "The ID value of the #beach_bar to submit the review" }),
        refCode: nullable(stringArg({ description: "The referral code of the customer payment, to find" })),
      },
      resolve: async (_, { beachBarId, refCode }, { payload }: MyContext): Promise<MonthTime[] | null> => {
        if (!beachBarId || beachBarId <= 0) return null;
        const { boolean, payment } = await verifyUserPaymentReview(beachBarId, refCode, payload);
        if (!boolean) return null;
        if (!payment || !payment.cart || !payment.cart.products) return null;
        const productsMonthIds = payment.getProductsMonth(beachBarId);
        if (!productsMonthIds) return null;
        const months = await MonthTime.find({ id: In(productsMonthIds) });
        return months;
      },
    });
    t.list.field("userReviews", {
      type: BeachBarReviewType,
      description: "Get a list of all the reviews of an authenticated user",
      resolve: async (_, __, { payload }: MyContext): Promise<BeachBarReview[] | null> => {
        if (!payload || !payload.sub) return null;

        const customer = await Customer.findOne({
          where: { userId: payload.sub },
          relations: [
            "reviews",
            "reviews.beachBar",
            "reviews.visitType",
            "reviews.monthTime",
            "reviews.payment",
            "reviews.answer",
            "reviews.customer",
            "reviews.customer.user",
            "reviews.votes",
            "reviews.votes.type",
            "reviews.votes.user",
          ],
        });
        if (!customer) throw new ApolloError(errors.USER_NOT_FOUND_MESSAGE, errors.NOT_FOUND);

        return customer?.reviews || [];
      },
    });
    t.field("review", {
      type: BeachBarReviewType,
      description: "Get the details of a a review of an authenticated user",
      args: {
        reviewId: idArg({ description: "The ID value of the review to fetch" }),
      },
      resolve: async (_, { reviewId }, { payload }: MyContext): Promise<BeachBarReview | null> => {
        if (!payload || !payload.sub) return null;
        if (!reviewId || reviewId.trim().length === 0)
          throw new UserInputError("Please provide a valid review ID", {
            code: errors.INVALID_ARGUMENTS,
          });

        const review = await BeachBarReview.findOne({
          where: { id: reviewId },
          relations: [
            "visitType",
            "monthTime",
            "payment",
            "answer",
            "customer",
            "customer.user",
            "votes",
            "votes.type",
            "votes.user",
            "beachBar",
            "beachBar.location",
            "beachBar.location.city",
            "beachBar.location.region",
            "beachBar.location.country",
          ],
        });
        if (!review) throw new ApolloError("Specified review does not exist", errors.NOT_FOUND);

        return review;
      },
    });
  },
});
