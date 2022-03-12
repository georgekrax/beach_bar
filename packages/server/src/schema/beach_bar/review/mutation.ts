import { beachBarReviewRatingMaxValue } from "@/constants/_index";
import { isAuth } from "@/utils/auth";
import { updateRedis } from "@/utils/db";
import { getProductsMonths, verifyUserReview } from "@/utils/payment";
import { errors, TABLES } from "@beach_bar/common";
import { ApolloError, UserInputError } from "apollo-server-express";
import { extendType, idArg, intArg, nullable, stringArg } from "nexus";
import { BeachBarReviewType } from "./types";

export const BeachBarReviewCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.boolean("verifyUserPaymentForReview", {
      description: "Verify a user's payment to submit review",
      args: {
        beachBarId: idArg(),
        refCode: nullable(stringArg({ description: "The referral code of the customer payment, to find" })),
      },
      resolve: async (_, { beachBarId, refCode }, { payload }) => {
        if (beachBarId.toString().trim().length === 0) throw new UserInputError("Please provide a valid beachBarId.");
        const { bool, customer, payment } = await verifyUserReview({ beachBarId, refCode, payload });
        // if (!customer.checkReviewsQuantity(beachBarId, payment)) return false;
        return !payment || !customer ? false : bool;
      },
    });
    t.field("addReview", {
      type: BeachBarReviewType,
      description: "Add a customer's review on a #beach_bar",
      args: {
        beachBarId: idArg(),
        paymentRefCode: nullable(stringArg({ description: "The referral code of the payment, to find" })),
        ratingValue: intArg({ description: "The rating value between 1 to 10, the customers rates the #beach_bar" }),
        visitTypeId: nullable(idArg()),
        monthId: nullable(idArg()),
        positiveComment: nullable(stringArg({ description: "A positive comment about the #beach_bar" })),
        negativeComment: nullable(stringArg({ description: "A negative comment about the #beach_bar" })),
        body: nullable(stringArg({ description: "The main body (description) of the user's review" })),
      },
      resolve: async (_, { beachBarId, paymentRefCode, monthId, ratingValue, visitTypeId, ...args }, { prisma, payload }) => {
        isAuth(payload);
        if (beachBarId.toString().trim().length === 0) {
          throw new UserInputError("Please provide a valid beachBarId", { code: errors.INVALID_ARGUMENTS });
        }
        if (ratingValue < 1 || ratingValue > beachBarReviewRatingMaxValue) {
          throw new UserInputError(`Please provide a valid rating value, between 1 and ${beachBarReviewRatingMaxValue}`, {
            code: errors.INVALID_ARGUMENTS,
          });
        }
        if (visitTypeId && visitTypeId <= 0) {
          throw new UserInputError("Please provide a valid visit type", { code: errors.INVALID_ARGUMENTS });
        }
        if (monthId && monthId <= 0) {
          throw new UserInputError("Please provide a valid month", { code: errors.INVALID_ARGUMENTS });
        }

        const { bool, customer, payment } = await verifyUserReview({ beachBarId, payload, refCode: paymentRefCode });
        if (!bool || !payment || !customer) {
          throw new ApolloError(
            "You have not purchased any products from this #beach_bar, to submit a review for it",
            errors.UNAUTHORIZED_CODE
          );
        }
        // if (!customer.checkReviewsQuantity(beachBarId, payment))
        //   throw new ApolloError(
        //     "You are not allowed to submit more reviews than your purchased products / services",
        //     errors.UNAUTHORIZED_CODE
        //   );

        // const beachBar = await BeachBar.findOne({ id: beachBarId, isActive: true });
        // if (!beachBar) throw new ApolloError(errors.BEACH_BAR_DOES_NOT_EXIST, errors.NOT_FOUND);

        const visitType = TABLES.REVIEW_VISIT_TYPE.find(({ id }) => id.toString() === visitTypeId?.toString());
        if (!visitType && visitTypeId) throw new ApolloError("Invalid visit type", errors.NOT_FOUND);

        if (monthId) {
          const productsMonths = getProductsMonths(payment, { beachBarId });
          if (!productsMonths) throw new ApolloError(errors.SOMETHING_WENT_WRONG);
          const isIncluded = productsMonths.includes(+monthId);
          if (!isIncluded) throw new ApolloError("Please set the correct month, you visited and used the products of the #beach_bar");
        }

        try {
          const newReview = await prisma.beachBarReview.create({
            data: {
              ...args,
              ratingValue,
              paymentId: payment.id,
              customerId: customer.id,
              beachBarId: +beachBarId,
              monthId: monthId ? +monthId : undefined,
              visitTypeId: visitTypeId ? +visitTypeId : undefined,
            },
          });

          await updateRedis({ model: "BeachBar", id: newReview.beachBarId });
          return newReview;
        } catch (err) {
          throw new ApolloError(errors.SOMETHING_WENT_WRONG + ": " + err.message);
        }
      },
    });
    t.field("updateReview", {
      type: BeachBarReviewType,
      description: "Update a customer's review on a #beach_bar",
      args: {
        id: idArg(),
        ratingValue: nullable(intArg({ description: "The rating value between 1 to 10, the customers rates the #beach_bar" })),
        visitTypeId: nullable(idArg()),
        monthId: nullable(idArg()),
        positiveComment: nullable(stringArg({ description: "A positive comment about the #beach_bar" })),
        negativeComment: nullable(stringArg({ description: "A negative comment about the #beach_bar" })),
        body: nullable(stringArg({ description: "The main body (description) of the user's review" })),
        answer: nullable(stringArg()),
      },
      resolve: async (_, { id, ratingValue, visitTypeId, monthId, answer, ...args }, { prisma, payload }) => {
        isAuth(payload);
        if (id.toString().trim().length === 0) {
          throw new UserInputError("Please provide a valid review ID", { code: errors.INVALID_ARGUMENTS });
        }
        if (ratingValue && (ratingValue < 1 || ratingValue > beachBarReviewRatingMaxValue)) {
          throw new UserInputError(`Please provide a valid rating value, between 1 and ${beachBarReviewRatingMaxValue}`, {
            code: errors.INVALID_ARGUMENTS,
          });
        }
        if (visitTypeId && visitTypeId.toString().trim().length === 0) {
          throw new UserInputError("Please provide a valid visit type.", { code: errors.INVALID_ARGUMENTS });
        }
        if (monthId && monthId.toString().trim().length === 0) {
          throw new UserInputError("Please provide a valid month.", { code: errors.INVALID_ARGUMENTS });
        }

        const review = await prisma.beachBarReview.findUnique({ where: { id: BigInt(id) }, include: { customer: true } });
        if (!review) throw new ApolloError("Specified review does not exist", errors.NOT_FOUND);
        if (review.customer.userId?.toString() !== payload!.sub.toString()) {
          throw new ApolloError("You are not allow to edit another's user review", errors.UNAUTHORIZED_CODE);
        }

        try {
          const updatedReview = await prisma.beachBarReview.update({
            where: { id: review.id },
            data: {
              ...args,
              ratingValue: ratingValue || undefined,
              answer: answer?.trim().length === 0 ? undefined : answer,
              visitTypeId: typeof visitTypeId === "string" ? +visitTypeId : visitTypeId,
              monthId: typeof monthId === "string" ? +monthId : monthId,
            },
          });

          await updateRedis({ model: "BeachBar", id: updatedReview.beachBarId });
          return updatedReview;
        } catch (err) {
          throw new ApolloError(errors.SOMETHING_WENT_WRONG + ": " + err.message);
        }
      },
    });
    t.boolean("deleteReview", {
      description: "Delete a customer's review on a #beach_bar",
      args: { id: idArg() },
      resolve: async (_, { id }, { payload }) => {
        isAuth(payload);
        if (id.toString().trim().length === 0) {
          throw new UserInputError("Please provide a valid review ID", { code: errors.INVALID_ARGUMENTS });
        }

        // const review = await BeachBarReview.findOne({ where: { id }, relations: ["beachBar"] });
        // if (!review) throw new ApolloError("Specified reviews does not exist", errors.NOT_FOUND);

        try {
          // TODO: Fix
          // await review.softRemove();
        } catch (err) {
          throw new ApolloError(errors.SOMETHING_WENT_WRONG + ": " + err.message);
        }

        return true;
      },
    });
  },
});
