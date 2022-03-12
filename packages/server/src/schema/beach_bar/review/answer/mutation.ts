// import { errors, MyContext } from "@beach_bar/common";
// import { ApolloError } from "apollo-server-errors";
// import { BeachBarReview } from "@/entity/BeachBarReview";
// import { ReviewAnswer } from "@/entity/ReviewAnswer";
// import { extendType, idArg, nullable, stringArg } from "nexus";
// import { isAuth, throwScopesUnauthorized } from "@/utils/auth";
// import { ReviewAnswerType } from "./types";

// export const ReviewAnswerCrudMutation = extendType({
//   type: "Mutation",
//   definition(t) {
//     t.field("addReviewAnswer", {
//       type: ReviewAnswerType,
//       deprecation: 'Deprecated in favour of the "updateReviewAnswer"',
//       description: "Add a reply to a #beach_bar's review, by its owner",
//       args: {
//         reviewId: idArg({ description: "The ID value of the customer's review" }),
//         body: stringArg({ description: "The body of the reply" }),
//       },
//       resolve: async (_, { reviewId, body }, { payload }: MyContext): Promise<ReviewAnswer> => {
//         isAuth(payload);
//         throwScopesUnauthorized(payload, "You are not allowed to add a reply to a #beach_bar's review", [
//           "beach_bar@crud:review_answer",
//         ]);

//         const review = await BeachBarReview.findOne({ where: { id: reviewId }, relations: ["beachBar"] });
//         if (!review) throw new ApolloError("Review was not found.", errors.NOT_FOUND);

//         const newReviewAnswer = ReviewAnswer.create({ review, body });

//         try {
//           await newReviewAnswer.save();
//           await review.beachBar.updateRedis();
//         } catch (err) {
//           throw new ApolloError(err.message);
//         }

//         return newReviewAnswer;
//       },
//     });
//     t.field("updateReviewAnswer", {
//       type: ReviewAnswerType,
//       description: "Update or add an answer to user's review",
//       args: { answerId: idArg(), body: nullable(stringArg()) },
//       resolve: async (_, { answerId, body }, { payload }: MyContext): Promise<ReviewAnswer> => {
//         isAuth(payload);
//         throwScopesUnauthorized(payload, "You are not allowed to update a reply of a #beach_bar's review", [
//           "beach_bar@crud:review_answer",
//         ]);

//         const reviewAnswer = await ReviewAnswer.findOne({ where: { id: answerId }, relations: ["review", "review.beachBar"] });
//         if (!reviewAnswer) throw new ApolloError("Review was not found.", errors.NOT_FOUND);

//         try {
//           const updatedReviewAnswer = await reviewAnswer.update(body);

//           return updatedReviewAnswer;
//         } catch (err) {
//           throw new ApolloError(err.message);
//         }
//       },
//     });
//     t.boolean("deleteReviewAnswer", {
//       description: "Delete (remove) a reply from a #beach_bar's review",
//       deprecation: 'Deprecated in favour of the "updateReviewAnswer"',
//       args: { answerId: idArg() },
//       resolve: async (_, { answerId }, { payload }: MyContext): Promise<boolean> => {
//         isAuth(payload);
//         throwScopesUnauthorized(payload, "You are not allowed to delete (remove) a reply from a #beach_bar's review", [
//           "beach_bar@crud:review_answer",
//         ]);

//         const reviewAnswer = await ReviewAnswer.findOne({ where: { id: answerId }, relations: ["review", "review.beachBar"] });
//         if (!reviewAnswer) throw new ApolloError("Reply was not found.", errors.NOT_FOUND);

//         try {
//           await reviewAnswer.softRemove();
//         } catch (err) {
//           throw new ApolloError(err.message, errors.INTERNAL_SERVER_ERROR);
//         }

//         return true;
//       },
//     });
//   },
// });
