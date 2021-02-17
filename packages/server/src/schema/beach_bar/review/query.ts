import { MyContext } from "@beach_bar/common";
import { MonthTime } from "entity/Time";
import { extendType, intArg, nullable, stringArg } from "nexus";
import { In } from "typeorm";
import { verifyUserPaymentReview } from "utils/beach_bar/verifyUserPaymentReview";
import { MonthTimeType } from "../../details/time/types";

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
        if (!beachBarId || beachBarId <= 0) {
          return null;
        }
        const { boolean, payment } = await verifyUserPaymentReview(beachBarId, refCode, payload);
        if (!boolean) {
          return null;
        }
        if (!payment || !payment.cart || !payment.cart.products) {
          return null;
        }
        const productsMonthIds = payment.getProductsMonth(beachBarId);
        if (!productsMonthIds) {
          return null;
        }
        const months = await MonthTime.find({ id: In(productsMonthIds) });
        return months;
      },
    });
  },
});
