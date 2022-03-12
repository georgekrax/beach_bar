import { isAuth } from "@/utils/auth";
import { updateRedis } from "@/utils/db";
import { errors, TABLES } from "@beach_bar/common";
import { ApolloError, UserInputError } from "apollo-server-express";
import { booleanArg, extendType, idArg, nullable } from "nexus";
import { BeachBarReviewType } from "../types";

export const BeachBarReviewVoteMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("updateReviewVote", {
      type: BeachBarReviewType,
      description: "Upvote or downvote a customer's review on a #beach_bar",
      args: {
        reviewId: idArg({ description: "The ID value of the customer's review" }),
        upvote: nullable(booleanArg({ description: "Set to true if to increment the review's votes" })),
        downvote: nullable(booleanArg({ description: "Set to true if to decrement the review's votes" })),
      },
      resolve: async (_, { reviewId, upvote, downvote }, { prisma, payload }) => {
        isAuth(payload);
        if (reviewId.toString().trim().length === 0) {
          throw new UserInputError("Please provide a valid reviewId", { code: errors.INVALID_ARGUMENTS });
        }
        if (upvote && downvote) {
          throw new UserInputError("You cannot upvote and downvote a review simultaneously", { code: errors.INVALID_ARGUMENTS });
        }

        const review = await prisma.beachBarReview.findUnique({ where: { id: BigInt(reviewId) } });
        if (!review) throw new ApolloError("Specified review does not exist", errors.NOT_FOUND);

        try {
          const userId = payload!.sub;
          const userAlreadVote = await prisma.reviewVote.findFirst({ where: { userId, reviewId: review.id } });

          const typeId = userAlreadVote?.typeId.toString();
          if (!userAlreadVote) {
            await prisma.reviewVote.create({ data: { userId, reviewId: review.id, typeId: upvote ? 1 : 2 } });
          }
          // TODO: Fix
          else if ((typeId === "1" && upvote) || (typeId === "2" && downvote)) {
            // await userVoteForThisReview.softRemove();
            await prisma.reviewVote.delete({ where: { id: userAlreadVote.id } });
          } else if (upvote || downvote) {
            const type = TABLES.REVIEW_VOTE_TYPE.find(({ value }) => value === (upvote ? "upvote" : "downvote"));
            if (type) await prisma.reviewVote.update({ where: { id: userAlreadVote.id }, data: { typeId: type.id } });
          }

          await updateRedis({ model: "BeachBar", id: review.beachBarId });
          return review;
        } catch (err) {
          throw new ApolloError(err.message);
        }
      },
    });
  },
});
