import { errors, MyContext } from "@beach_bar/common";
import { ApolloError, UserInputError } from "apollo-server-express";
import { beachBarReviewRatingMaxValue } from "constants/_index";
import { BeachBar } from "entity/BeachBar";
import { BeachBarReview } from "entity/BeachBarReview";
import { ReviewVisitType } from "entity/ReviewVisitType";
import { MonthTime } from "entity/Time";
import { extendType, idArg, intArg, nullable, stringArg } from "nexus";
import { TDelete } from "typings/.index";
import { TAddBeachBarReview, TUpdateBeachBarReview } from "typings/beach_bar/review";
import { isAuth } from "utils/auth/payload";
import { verifyUserPaymentReview } from "utils/beach_bar/verifyUserPaymentReview";
import { DeleteGraphQlType } from "../../types";
import { AddBeachBarReviewType, UpdateBeachBarReviewType } from "./types";

export const BeachBarReviewCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.boolean("verifyUserPaymentForReview", {
      description: "Verify a user's payment to submit review",
      args: {
        beachBarId: idArg(),
        refCode: nullable(stringArg({ description: "The referral code of the customer payment, to find" })),
      },
      resolve: async (_, { beachBarId, refCode }, { payload }: MyContext): Promise<boolean> => {
        if (!beachBarId || beachBarId.trim().length === 0) throw new UserInputError("Please provide a valid beachBarId");
        const { boolean, customer, payment } = await verifyUserPaymentReview(beachBarId, refCode, payload);
        if (!customer || !payment) return false;
        // if (!customer.checkReviewsQuantity(beachBarId, payment)) return false;
        return boolean;
      },
    });
    t.field("addReview", {
      type: AddBeachBarReviewType,
      description: "Add a customer's review on a #beach_bar",
      args: {
        beachBarId: idArg(),
        paymentRefCode: nullable(stringArg({ description: "The referral code of the payment, to find" })),
        ratingValue: intArg({ description: "The rating value between 1 to 10, the customers rates the #beach_bar" }),
        visitTypeId: nullable(idArg()),
        monthTimeId: nullable(idArg()),
        positiveComment: nullable(stringArg({ description: "A positive comment about the #beach_bar" })),
        negativeComment: nullable(stringArg({ description: "A negative comment about the #beach_bar" })),
        review: nullable(stringArg({ description: "A summary (description) of the user's overall review" })),
      },
      resolve: async (
        _,
        { beachBarId, paymentRefCode, monthTimeId, ratingValue, visitTypeId, positiveComment, negativeComment, review },
        { payload }: MyContext
      ): Promise<TAddBeachBarReview> => {
        isAuth(payload);
        if (!beachBarId || beachBarId.trim().length === 0)
          throw new UserInputError("Please provide a valid #beach_bar", { code: errors.INVALID_ARGUMENTS });
        if (!ratingValue || ratingValue < 1 || ratingValue > beachBarReviewRatingMaxValue)
          throw new UserInputError(`Please provide a valid rating value, between 1 and ${beachBarReviewRatingMaxValue}`, {
            code: errors.INVALID_ARGUMENTS,
          });
        if (visitTypeId && visitTypeId <= 0)
          throw new UserInputError("Please provide a valid visit type", { code: errors.INVALID_ARGUMENTS });
        if (monthTimeId && monthTimeId <= 0)
          throw new UserInputError("Please provide a valid month", { code: errors.INVALID_ARGUMENTS });

        const { boolean: res, customer, payment } = await verifyUserPaymentReview(beachBarId, paymentRefCode, payload);
        if (!res || !payment || !customer)
          throw new ApolloError(
            "You have not purchased any products from this #beach_bar, to submit a review for it.",
            errors.UNAUTHORIZED_CODE
          );
        // if (!customer.checkReviewsQuantity(beachBarId, payment))
        //   throw new ApolloError(
        //     "You are not allowed to submit more reviews than your purchased products / services",
        //     errors.UNAUTHORIZED_CODE
        //   );

        const beachBar = await BeachBar.findOne({ id: beachBarId, isActive: true });
        if (!beachBar) throw new ApolloError(errors.BEACH_BAR_DOES_NOT_EXIST, errors.NOT_FOUND);

        const visitType = await ReviewVisitType.findOne(visitTypeId);
        if (!visitType && visitTypeId) throw new ApolloError("Invalid visit type", errors.NOT_FOUND);

        const month = await MonthTime.findOne(monthTimeId);
        if (!month && monthTimeId) throw new ApolloError("Invalid visit month", errors.NOT_FOUND);
        else if (month && monthTimeId) {
          const paymentProductsMonth = payment.getProductsMonth(beachBarId);
          if (!paymentProductsMonth) throw new ApolloError(errors.SOMETHING_WENT_WRONG);
          const isIncluded = paymentProductsMonth.includes(month.id);
          if (!isIncluded) throw new ApolloError(errors.SOMETHING_WENT_WRONG);
        }

        const newReview = BeachBarReview.create({
          beachBar,
          customer,
          payment,
          ratingValue,
          visitType,
          month,
          positiveComment,
          negativeComment,
          review,
        });

        try {
          await newReview.save();
          await beachBar.updateRedis();
        } catch (err) {
          throw new ApolloError(errors.SOMETHING_WENT_WRONG + ": " + err.message);
        }

        return {
          review: newReview,
          added: true,
        };
      },
    });
    t.field("updateReview", {
      type: UpdateBeachBarReviewType,
      description: "Update a customer's review on a #beach_bar",
      args: {
        reviewId: idArg(),
        ratingValue: nullable(intArg({ description: "The rating value between 1 to 10, the customers rates the #beach_bar" })),
        visitTypeId: nullable(idArg()),
        monthTimeId: nullable(idArg()),
        positiveComment: nullable(stringArg({ description: "A positive comment about the #beach_bar" })),
        negativeComment: nullable(stringArg({ description: "A negative comment about the #beach_bar" })),
        review: nullable(stringArg({ description: "A summary (description) of the user's overall review" })),
      },
      resolve: async (
        _,
        { reviewId, ratingValue, visitTypeId, monthTimeId, positiveComment, negativeComment, review },
        { payload }: MyContext
      ): Promise<TUpdateBeachBarReview> => {
        isAuth(payload);
        if (!reviewId || reviewId.trim().length === 0)
          throw new UserInputError("Please provide a valid review ID", { code: errors.INVALID_ARGUMENTS });
        if (ratingValue && (ratingValue < 1 || ratingValue > beachBarReviewRatingMaxValue))
          throw new UserInputError(`Please provide a valid rating value, between 1 and ${beachBarReviewRatingMaxValue}`, {
            code: errors.INVALID_ARGUMENTS,
          });
        if (visitTypeId && visitTypeId.trim().length === 0)
          throw new UserInputError("Please provide a valid visit type", { code: errors.INVALID_ARGUMENTS });
        if (monthTimeId && monthTimeId.trim().length === 0)
          throw new UserInputError("Please provide a valid month", { code: errors.INVALID_ARGUMENTS });

        const usersReview = await BeachBarReview.findOne({
          where: { id: reviewId },
          relations: ["beachBar", "customer", "votes", "votes.type"],
        });
        if (!usersReview) throw new ApolloError("Specified review does not exist", errors.NOT_FOUND);
        if (usersReview.customer.userId?.toString() !== payload!.sub.toString())
          throw new ApolloError("You are not allow to edit another's user review", errors.UNAUTHORIZED_CODE);

        try {
          const updatedReview = await usersReview.update({
            ratingValue,
            visitTypeId,
            monthTimeId,
            positiveComment,
            negativeComment,
            review,
          });
          if (!updatedReview) throw new ApolloError(errors.SOMETHING_WENT_WRONG);

          return {
            review: updatedReview,
            updated: true,
          };
        } catch (err) {
          throw new ApolloError(errors.SOMETHING_WENT_WRONG + ": " + err.message);
        }
      },
    });
    t.field("deleteReview", {
      type: DeleteGraphQlType,
      description: "Delete a customer's review on a #beach_bar",
      args: { reviewId: idArg() },
      resolve: async (_, { reviewId }, { payload }: MyContext): Promise<TDelete> => {
        isAuth(payload);
        if (!reviewId || reviewId.trim().length === 0)
          throw new UserInputError("Please provide a valid review ID", { code: errors.INVALID_ARGUMENTS });

        const review = await BeachBarReview.findOne({ where: { id: reviewId }, relations: ["beachBar"] });
        if (!review) throw new ApolloError("Specified reviews does not exist", errors.NOT_FOUND);

        try {
          await review.softRemove();
        } catch (err) {
          throw new ApolloError(errors.SOMETHING_WENT_WRONG + ": " + err.message);
        }

        return {
          deleted: true,
        };
      },
    });
  },
});
