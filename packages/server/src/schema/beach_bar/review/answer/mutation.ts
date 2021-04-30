import { errors, MyContext } from "@beach_bar/common";
import { ApolloError } from "apollo-server-errors";
import { BeachBarReview } from "entity/BeachBarReview";
import { ReviewAnswer } from "entity/ReviewAnswer";
import { extendType, idArg, nullable, stringArg } from "nexus";
import { TDelete } from "typings/.index";
import { TAddReviewAnswer, TUpdateReviewAnswer } from "typings/beach_bar/review/answer";
import { isAuth, throwScopesUnauthorized } from "utils/auth/payload";
import { DeleteGraphQlType } from "../../../types";
import { AddReviewAnswerType, UpdateReviewAnswerType } from "./types";

export const ReviewAnswerCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addReviewAnswer", {
      type: AddReviewAnswerType,
      description: "Add a reply to a #beach_bar's review, by its owner",
      args: {
        reviewId: idArg({ description: "The ID value of the customer's review" }),
        body: stringArg({ description: "The body of the reply" }),
      },
      resolve: async (_, { reviewId, body }, { payload }: MyContext): Promise<TAddReviewAnswer> => {
        isAuth(payload);
        throwScopesUnauthorized(payload, "You are not allowed to add a reply to a #beach_bar's review", [
          "beach_bar@crud:review_answer",
        ]);

        const review = await BeachBarReview.findOne({ where: { id: reviewId }, relations: ["beachBar"] });
        if (!review) throw new ApolloError("Review was not found", errors.NOT_FOUND);

        const newReviewAnswer = ReviewAnswer.create({ review, body });

        try {
          await newReviewAnswer.save();
          await review.beachBar.updateRedis();
        } catch (err) {
          throw new ApolloError(err.message);
        }

        return { answer: newReviewAnswer, added: true };
      },
    });
    t.field("updateReviewAnswer", {
      type: UpdateReviewAnswerType,
      description: "Update the body of a #beach_bar's review reply",
      args: {
        answerId: idArg({ description: "The ID value of the review's answer" }),
        body: nullable(stringArg({ description: "The body of the reply" })),
      },
      resolve: async (_, { answerId, body }, { payload }: MyContext): Promise<TUpdateReviewAnswer> => {
        isAuth(payload);
        throwScopesUnauthorized(payload, "You are not allowed to update a reply of a #beach_bar's review", [
          "beach_bar@crud:review_answer",
        ]);

        const reviewAnswer = await ReviewAnswer.findOne({ where: { id: answerId }, relations: ["review", "review.beachBar"] });
        if (!reviewAnswer) throw new ApolloError("Review was not found", errors.NOT_FOUND);

        try {
          const updatedReviewAnswer = await reviewAnswer.update(body);

          return { answer: updatedReviewAnswer, updated: true };
        } catch (err) {
          throw new ApolloError(err.message);
        }
      },
    });
    t.field("deleteReviewAnswer", {
      type: DeleteGraphQlType,
      description: "Delete (remove) a reply from a #beach_bar's review",
      args: { answerId: idArg({ description: "The ID value of the review's answer" }) },
      resolve: async (_, { answerId }, { payload }: MyContext): Promise<TDelete> => {
        isAuth(payload);
        throwScopesUnauthorized(payload, "You are not allowed to delete (remove) a reply from a #beach_bar's review", [
          "beach_bar@crud:review_answer",
        ]);

        const reviewAnswer = await ReviewAnswer.findOne({ where: { id: answerId }, relations: ["review", "review.beachBar"] });
        if (!reviewAnswer) throw new ApolloError("Reply was not found", errors.NOT_FOUND);

        try {
          await reviewAnswer.softRemove();
        } catch (err) {
          throw new ApolloError(err.message, errors.INTERNAL_SERVER_ERROR);
        }

        return { deleted: true };
      },
    });
  },
});
