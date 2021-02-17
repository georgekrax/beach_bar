import { errors, MyContext } from "@beach_bar/common";
import { BigIntScalar } from "@the_hashtag/common/dist/graphql";
import { beachBarReviewRatingMaxValue } from "constants/_index";
import { BeachBar } from "entity/BeachBar";
import { BeachBarReview } from "entity/BeachBarReview";
import { ReviewVisitType } from "entity/ReviewVisitType";
import { MonthTime } from "entity/Time";
import { arg, booleanArg, extendType, intArg, nullable, stringArg } from "nexus";
import { DeleteType } from "typings/.index";
import { AddBeachBarReviewType, UpdateBeachBarReviewType } from "typings/beach_bar/review";
import { verifyUserPaymentReview } from "utils/beach_bar/verifyUserPaymentReview";
import { DeleteResult } from "../../types";
import { AddBeachBarReviewResult, UpdateBeachBarReviewResult } from "./types";

export const BeachBarReviewCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addBeachBarReview", {
      type: AddBeachBarReviewResult,
      description: "Add a customer's review on a #beach_bar",
      args: {
        beachBarId: intArg({ description: "The ID value of the #beach_bar, to submit the review" }),
        paymentRefCode: nullable(stringArg({ description: "The referral code of the customer payment, to find" })),
        ratingValue: intArg({ description: "The rating value between 1 to 10, the customers rates the #beach_bar" }),
        visitTypeId: nullable(
          intArg({
            description: "The ID value of the customer's visit type",
          })
        ),
        monthTimeId: nullable(
          intArg({
            description: "The ID value of the month time",
          })
        ),
        positiveComment: nullable(
          stringArg({
            description: "A positive comment about the #beach_bar",
          })
        ),
        negativeComment: nullable(
          stringArg({
            description: "A negative comment about the #beach_bar",
          })
        ),
        review: nullable(
          stringArg({
            description: "A summary (description) of the user's overall review",
          })
        ),
      },
      resolve: async (
        _,
        { beachBarId, paymentRefCode, monthTimeId, ratingValue, visitTypeId, positiveComment, negativeComment, review },
        { payload }: MyContext
      ): Promise<AddBeachBarReviewType> => {
        if (!beachBarId || beachBarId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid #beach_bar" } };
        }
        if (!ratingValue || ratingValue < 1 || ratingValue > beachBarReviewRatingMaxValue) {
          return {
            error: {
              code: errors.INVALID_ARGUMENTS,
              message: `Please provide a valid rating value, between 1 and ${beachBarReviewRatingMaxValue}`,
            },
          };
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
          return { error: { code: errors.CONFLICT, message: "Invalid visit month" } };
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
          positiveComment,
          negativeComment,
          review,
        });

        try {
          await newReview.save();
          await beachBar.updateRedis();
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
      args: {
        reviewId: arg({
          type: BigIntScalar,
          description: "The ID value of the customer's review",
        }),
        ratingValue: nullable(
          intArg({
            description: "The rating value between 1 to 10, the customers rates the #beach_bar",
          })
        ),
        visitTypeId: nullable(intArg({ description: "The ID value of the customer's visit type" })),
        monthTimeId: nullable(
          intArg({
            description: "The ID value of the month time",
          })
        ),
        positiveComment: nullable(
          stringArg({
            description: "A positive comment about the #beach_bar",
          })
        ),
        negativeComment: nullable(
          stringArg({
            description: "A negative comment about the #beach_bar",
          })
        ),
        review: nullable(
          stringArg({
            description: "A summary (description) of the user's overall review",
          })
        ),
      },
      resolve: async (
        _,
        { reviewId, ratingValue, visitTypeId, monthTimeId, positiveComment, negativeComment, review }
      ): Promise<UpdateBeachBarReviewType> => {
        if (!reviewId || reviewId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid customer's review" } };
        }
        if (ratingValue && (ratingValue < 1 || ratingValue > beachBarReviewRatingMaxValue)) {
          return {
            error: {
              code: errors.INVALID_ARGUMENTS,
              message: `Please provide a valid rating value, between 1 and ${beachBarReviewRatingMaxValue}`,
            },
          };
        }
        if (visitTypeId && visitTypeId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid visit type" } };
        }
        if (monthTimeId && monthTimeId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid month" } };
        }

        const usersReview = await BeachBarReview.findOne({ where: { id: reviewId }, relations: ["beachBar", "customer"] });
        if (!usersReview) {
          return { error: { code: errors.CONFLICT, message: "Specified review does not exist" } };
        }

        try {
          const updatedReview = await usersReview.update({
            ratingValue,
            visitTypeId,
            monthTimeId,
            positiveComment,
            negativeComment,
            review,
          });
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
      args: {
        reviewId: arg({
          type: BigIntScalar,
          description: "The ID value of the customer's review",
        }),
      },
      resolve: async (_, { reviewId }): Promise<DeleteType> => {
        if (!reviewId || reviewId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid customer's review" } };
        }

        const review = await BeachBarReview.findOne({ where: { id: reviewId }, relations: ["beachBar"] });
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
      args: {
        reviewId: arg({
          type: BigIntScalar,
          description: "The ID value of the customer's review",
        }),
        upvote: nullable(booleanArg({ description: "Set to true if to increment the review's votes" })),
        downvote: nullable(booleanArg({ description: "Set to true if to decrement the review's votes" })),
      },
      resolve: async (_, { reviewId, upvote, downvote }): Promise<UpdateBeachBarReviewType> => {
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
