import { BigIntScalar, errors, MyContext } from "@beach_bar/common";
import { arg, extendType, stringArg } from "@nexus/schema";
import { BeachBarReview } from "../../../../entity/BeachBarReview";
import { ReviewAnswer } from "../../../../entity/ReviewAnswer";
import { ErrorType, DeleteType } from "../../../returnTypes";
import { DeleteResult } from "../../../types";
import { AddReviewAnswerType, UpdateReviewAnswerType } from "./returnTypes";
import { AddReviewAnswerResult, UpdateReviewAnswerResult } from "./types";

export const ReviewAnswerCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addReviewAnswer", {
      type: AddReviewAnswerResult,
      description: "Add a reply to a #beach_bar's review, by its owner",
      nullable: false,
      args: {
        reviewId: arg({
          type: BigIntScalar,
          required: true,
          description: "The ID value of the customer's review",
        }),
        body: stringArg({
          required: true,
          description: "The body of the reply",
        }),
      },
      resolve: async (_, { reviewId, body }, { payload }: MyContext): Promise<AddReviewAnswerType | ErrorType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (!payload.scope.includes("beach_bar@crud:review_answer")) {
          return {
            error: {
              code: errors.UNAUTHORIZED_CODE,
              message: "You are not allowed to add a reply to a #beach_bar's review",
            },
          };
        }

        const review = await BeachBarReview.findOne({ where: { id: reviewId }, relations: ["beachBar"] });
        if (!review) {
          return { error: { code: errors.CONFLICT, message: "Specified review does not exist" } };
        }

        const newReviewAnswer = ReviewAnswer.create({
          review,
          body,
        });

        try {
          await newReviewAnswer.save();
          await review.beachBar.updateRedis();
        } catch (err) {
          return { error: { message: `${errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
        }

        return {
          answer: newReviewAnswer,
          added: true,
        };
      },
    });
    t.field("updateReviewAnswer", {
      type: UpdateReviewAnswerResult,
      description: "Update the body of a #beach_bar's review reply",
      nullable: false,
      args: {
        answerId: arg({
          type: BigIntScalar,
          required: true,
          description: "The ID value of the review's answer",
        }),
        body: stringArg({
          required: false,
          description: "The body of the reply",
        }),
      },
      resolve: async (_, { answerId, body }, { payload }: MyContext): Promise<UpdateReviewAnswerType | ErrorType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (!payload.scope.includes("beach_bar@crud:review_answer")) {
          return {
            error: {
              code: errors.UNAUTHORIZED_CODE,
              message: "You are not allowed to update a reply of a #beach_bar's review",
            },
          };
        }

        const reviewAnswer = await ReviewAnswer.findOne({ where: { id: answerId }, relations: ["review", "review.beachBar"] });
        if (!reviewAnswer) {
          return { error: { code: errors.CONFLICT, message: "Specified review reply does not exist" } };
        }

        try {
          const updatedReviewAnswer = await reviewAnswer.update(body);

          return {
            answer: updatedReviewAnswer,
            updated: true,
          };
        } catch (err) {
          return { error: { message: `${errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
        }
      },
    });
    t.field("deleteReviewAnswer", {
      type: DeleteResult,
      description: "Delete (remove) a reply from a #beach_bar's review",
      nullable: false,
      args: {
        answerId: arg({
          type: BigIntScalar,
          required: true,
          description: "The ID value of the review's answer",
        }),
      },
      resolve: async (_, { answerId }, { payload }: MyContext): Promise<DeleteType | ErrorType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (!payload.scope.includes("beach_bar@crud:review_answer")) {
          return {
            error: {
              code: errors.UNAUTHORIZED_CODE,
              message: "You are not allowed to delete (remove) a reply from a #beach_bar's review",
            },
          };
        }

        const reviewAnswer = await ReviewAnswer.findOne({ where: { id: answerId }, relations: ["review", "review.beachBar"] });
        if (!reviewAnswer) {
          return { error: { code: errors.CONFLICT, message: "Specified review reply does not exist" } };
        }

        try {
          await reviewAnswer.softRemove();
        } catch (err) {
          return { error: { code: errors.INTERNAL_SERVER_ERROR, message: `${errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
        }

        return {
          deleted: true,
        };
      },
    });
  },
});
