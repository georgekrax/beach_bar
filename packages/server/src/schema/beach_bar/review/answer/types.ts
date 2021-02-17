import { BigIntScalar, DateTimeScalar } from "@the_hashtag/common/dist/graphql";
import { objectType, unionType } from "nexus";
import { BeachBarReviewType } from "../types";

export const ReviewAnswerType = objectType({
  name: "ReviewAnswer",
  description: "Represents an answer for a review of a #beach_bar, by the owner",
  definition(t) {
    t.field("id", { type: BigIntScalar, description: "The ID value of the particular review answer" });
    t.string("body", { description: "The body (content) of the review answer, written by the reviewed #beach_bar's owner" });
    t.field("review", {
      type: BeachBarReviewType,
      description: "The review this answer is assigned to",
      resolve: o => o.review,
    });
    t.field("updatedAt", {
      type: DateTimeScalar,
      description: "The last time user's account was updated, in the format of a timestamp",
    });
    t.field("timestamp", {
      type: DateTimeScalar,
      description: "The timestamp recorded, when the user's account was created",
    });
  },
});

export const AddReviewAnswerType = objectType({
  name: "AddReviewAnswer",
  description: "Info to be returned when an answer is added to a customer's review",
  definition(t) {
    t.field("answer", {
      type: ReviewAnswerType,
      description: "The answer that is added to the review",
      resolve: o => o.answer,
    });
    t.boolean("added", {
      description: "A boolean that indicates if the answer has been successfully being added to the customer's review",
    });
  },
});

export const AddReviewAnswerResult = unionType({
  name: "AddReviewAnswerResult",
  definition(t) {
    t.members("AddReviewAnswer", "Error");
  },
  resolveType: item => {
    if (item.name === "Error") {
      return "Error";
    } else {
      return "AddReviewAnswer";
    }
  },
});

export const UpdateReviewAnswerType = objectType({
  name: "UpdateReviewAnswer",
  description: "Info to be returned when the answer of a customer's review is updated",
  definition(t) {
    t.field("answer", {
      type: ReviewAnswerType,
      description: "The review answer that is updated",
      resolve: o => o.answer,
    });
    t.boolean("updated", {
      description: "A boolean that indicates if the review answer has been successfully updated",
    });
  },
});

export const UpdateReviewAnswerResult = unionType({
  name: "UpdateReviewAnswerResult",
  definition(t) {
    t.members("UpdateReviewAnswer", "Error");
  },
  resolveType: item => {
    if (item.name === "Error") {
      return "Error";
    } else {
      return "UpdateReviewAnswer";
    }
  },
});
