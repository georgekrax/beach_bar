import { errors, MyContext } from "@beach_bar/common";
import { ApolloError, UserInputError } from "apollo-server-express";
import { BeachBarReview } from "entity/BeachBarReview";
import { booleanArg, extendType, idArg, nullable } from "nexus";
import { TUpdateBeachBarReview } from "typings/beach_bar/review";
import { UpdateBeachBarReviewType } from "../types";

export const BeachBarReviewVoteMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("updateReviewVote", {
      type: UpdateBeachBarReviewType,
      description: "Upvote or downvote a customer's review on a #beach_bar",
      args: {
        reviewId: idArg({ description: "The ID value of the customer's review" }),
        upvote: nullable(booleanArg({ description: "Set to true if to increment the review's votes" })),
        downvote: nullable(booleanArg({ description: "Set to true if to decrement the review's votes" })),
      },
      resolve: async (_, { reviewId, upvote, downvote }, { payload }: MyContext): Promise<TUpdateBeachBarReview> => {
        if (!payload || !payload.sub) throw new ApolloError(errors.NOT_AUTHENTICATED_MESSAGE, errors.NOT_AUTHENTICATED_CODE);
        if (!reviewId || reviewId.trim().length === 0)
          throw new UserInputError("Please provide a valid review ID", { code: errors.INVALID_ARGUMENTS });
        if (upvote && downvote)
          throw new UserInputError("You cannot upvote and downvote a review simultaneously", { code: errors.INVALID_ARGUMENTS });

        const review = await BeachBarReview.findOne({
          where: { id: reviewId },
          relations: ["beachBar", "customer", "votes", "votes.type", "votes.user"],
        });
        if (!review) throw new ApolloError("Specified review does not exist", errors.NOT_FOUND);

        try {
          await review.vote(payload.sub, upvote, downvote);

          const updatedReview = await BeachBarReview.findOne({
            where: { id: reviewId },
            relations: ["beachBar", "customer", "votes", "votes.type", "votes.user"],
          });
          if (!updatedReview) throw new ApolloError("Specified review does not exist", errors.NOT_FOUND);

          return {
            review: updatedReview,
            updated: true,
          };
        } catch (err) {
          throw new ApolloError(errors.SOMETHING_WENT_WRONG + ": " + err.message);
        }
      },
    });
  },
});
