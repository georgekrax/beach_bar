import { BigIntScalar, MyContext } from "@beach_bar/common";
import { arg, booleanArg, extendType, intArg, stringArg } from "@nexus/schema";
import errors from "../../../constants/errors";
import { BeachBar } from "../../../entity/BeachBar";
import { BeachBarReview } from "../../../entity/BeachBarReview";
import { ReviewVisitType } from "../../../entity/ReviewVisitType";
import { MonthTime } from "../../../entity/Time";
import { verifyUserPaymentReview } from "../../../utils/beach_bar/verifyUserPaymentReview";
import { DeleteType, ErrorType } from "../../returnTypes";
import { DeleteResult } from "../../types";
import { AddBeachBarReviewType, UpdateBeachBarReviewType } from "./returnTypes";
import { AddBeachBarReviewResult, UpdateBeachBarReviewResult } from "./types";

export const BeachBarReviewCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addBeachBarReview", {
      type: AddBeachBarReviewResult,
      description: "Add a customer's review on a #beach_bar",
      nullable: false,
      args: {
        beachBarId: intArg({
          required: true,
          description: "The ID value of the #beach_bar, to submit the review",
        }),
        paymentRefCode: stringArg({
          required: false,
          description: "The referral code of the customer payment, to find",
        }),
        ratingValue: intArg({
          required: true,
          description: "The rating value between 1 to 10, the customers rates the #beach_bar",
        }),
        visitTypeId: intArg({
          required: false,
          description: "The ID value of the customer's visit type",
        }),
        monthTimeId: intArg({
          required: false,
          description: "The ID value of the month time",
        }),
        niceComment: stringArg({
          required: false,
          description: "A nice comment about the #beach_bar",
        }),
        badComment: stringArg({
          required: false,
          description: "A negative comment about the #beach_bar",
        }),
      },
      resolve: async (
        _,
        { beachBarId, paymentRefCode, monthTimeId, ratingValue, visitTypeId, niceComment, badComment },
        { payload }: MyContext,
      ): Promise<AddBeachBarReviewType | ErrorType> => {
        if (!beachBarId || beachBarId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid #beach_bar" } };
        }
        if (!ratingValue || ratingValue < 1 || ratingValue > 10) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid rating value, between 1 and 10" } };
        }
        if (visitTypeId && visitTypeId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid visit type" } };
        }
        if (monthTimeId && monthTimeId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid month" } };
        }

        const { boolean: res, customer, payment } = await verifyUserPaymentReview(beachBarId, paymentRefCode, payload);
        if (!res || !payment || !customer) {
          return {
            error: {
              code: errors.UNAUTHORIZED_CODE,
              message: "You have not purchased any products from this #beach_bar, to submit a review for it",
            },
          };
        }
        if (!customer.checkReviewsQuantity(beachBarId, payment)) {
          return {
            error: {
              code: errors.UNAUTHORIZED_CODE,
              message: "You are not allowed to submit more reviews than your purchased products / services",
            },
          };
        }

        const beachBar = await BeachBar.findOne({ id: beachBarId, isActive: true });
        if (!beachBar) {
          return { error: { code: errors.CONFLICT, message: errors.BEACH_BAR_DOES_NOT_EXIST } };
        }

        const visitType = await ReviewVisitType.findOne(visitTypeId);
        if (!visitType && visitTypeId) {
          return { error: { code: errors.CONFLICT, message: "Invalid visit type" } };
        }

        const monthTime = await MonthTime.findOne(monthTimeId);
        if (!monthTime && monthTimeId) {
          return { error: { code: errors.CONFLICT, message: "Invalid month" } };
        } else if (monthTime && monthTimeId) {
          const paymentProductsMonth = payment.getProductsMonth(beachBarId);
          if (!paymentProductsMonth) {
            return { error: { message: errors.SOMETHING_WENT_WRONG } };
          }
          const isIncluded = paymentProductsMonth.includes(monthTime.id);
          if (!isIncluded) {
            return { error: { message: errors.SOMETHING_WENT_WRONG } };
          }
        }

        const newReview = BeachBarReview.create({
          beachBar,
          customer,
          payment,
          ratingValue,
          visitType,
          monthTime,
          niceComment,
          badComment,
        });

        try {
          await newReview.save();
        } catch (err) {
          return { error: { message: `${errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
        }

        return {
          review: newReview,
          added: true,
        };
      },
    });
    t.field("updateBeachBarReview", {
      type: UpdateBeachBarReviewResult,
      description: "Update a customer's review on a #beach_bar",
      nullable: false,
      args: {
        reviewId: arg({
          type: BigIntScalar,
          required: true,
          description: "The ID value of the customer's review",
        }),
        ratingValue: intArg({
          required: false,
          description: "The rating value between 1 to 10, the customers rates the #beach_bar",
        }),
        visitTypeId: intArg({
          required: false,
          description: "The ID value of the customer's visit type",
        }),
        monthTimeId: intArg({
          required: false,
          description: "The ID value of the month time",
        }),
        niceComment: stringArg({
          required: false,
          description: "A nice comment about the #beach_bar",
        }),
        badComment: stringArg({
          required: false,
          description: "A negative comment about the #beach_bar",
        }),
      },
      resolve: async (
        _,
        { reviewId, ratingValue, visitTypeId, monthTimeId, niceComment, badComment },
      ): Promise<UpdateBeachBarReviewType | ErrorType> => {
        if (!reviewId || reviewId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid customer's review" } };
        }
        if (ratingValue && ratingValue < 1 && ratingValue > 10) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid rating value, between 1 and 10" } };
        }
        if (visitTypeId && visitTypeId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid visit type" } };
        }
        if (monthTimeId && monthTimeId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid month" } };
        }

        const review = await BeachBarReview.findOne({ where: { id: reviewId }, relations: ["beachBar", "customer"] });
        if (!review) {
          return { error: { code: errors.CONFLICT, message: "Specified review does not exist" } };
        }

        try {
          const updatedReview = await review.update(ratingValue, visitTypeId, monthTimeId, niceComment, badComment);
          if (!updatedReview) {
            return { error: { message: errors.SOMETHING_WENT_WRONG } };
          }

          return {
            review: updatedReview,
            updated: true,
          };
        } catch (err) {
          return { error: { message: `${errors.SOMETHING_WENT_WRONG}${err.message.trim().length > 0 ? `: ${err.message}` : ""} ` } };
        }
      },
    });
    t.field("deleteBeachBarReview", {
      type: DeleteResult,
      description: "Delete a customer's review on a #beach_bar",
      nullable: false,
      args: {
        reviewId: arg({
          type: BigIntScalar,
          required: true,
          description: "The ID value of the customer's review",
        }),
      },
      resolve: async (_, { reviewId }): Promise<DeleteType | ErrorType> => {
        if (!reviewId || reviewId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid customer's review" } };
        }

        const review = await BeachBarReview.findOne(reviewId);
        if (!review) {
          return { error: { code: errors.CONFLICT, message: "Specified review does not exist" } };
        }

        try {
          await review.softRemove();
        } catch (err) {
          return { error: { message: `${errors.SOMETHING_WENT_WRONG}${err.message.trim().length > 0 ? `: ${err.message}` : ""}` } };
        }

        return {
          deleted: true,
        };
      },
    });
  },
});

export const BeachBarReviewVoteMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("voteBeachBarReview", {
      type: UpdateBeachBarReviewResult,
      description: "Upvote or downvote a customer's review on a #beach_bar",
      nullable: false,
      args: {
        reviewId: arg({
          type: BigIntScalar,
          required: true,
          description: "The ID value of the customer's review",
        }),
        upvote: booleanArg({
          required: false,
          description: "Set to true if to increment the review's votes",
        }),
        downvote: booleanArg({
          required: false,
          description: "Set to true if to decrement the review's votes",
        }),
      },
      resolve: async (_, { reviewId, upvote, downvote }): Promise<UpdateBeachBarReviewType | ErrorType> => {
        if (!reviewId || reviewId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid customer's review" } };
        }
        if (upvote !== undefined && downvote !== undefined) {
          return {
            error: { code: errors.INVALID_ARGUMENTS, message: "You cannot upvote and downvote a customer's review simultaneously" },
          };
        }
        if (upvote === false || downvote === false) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: errors.SOMETHING_WENT_WRONG } };
        }

        const review = await BeachBarReview.findOne({ where: { id: reviewId }, relations: ["beachBar", "customer"] });
        if (!review) {
          return { error: { code: errors.CONFLICT, message: "Specified review does not exist" } };
        }

        try {
          const updatedReview = await review.vote(upvote, downvote);
          if (!updatedReview) {
            return { error: { message: errors.SOMETHING_WENT_WRONG } };
          }

          return {
            review: updatedReview,
            updated: true,
          };
        } catch (err) {
          return { error: { message: `${errors.SOMETHING_WENT_WRONG}${err.message.trim().length > 0 ? `: ${err.message}` : ""} ` } };
        }
      },
    });
  },
});
