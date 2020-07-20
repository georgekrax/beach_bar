import { BigIntScalar, DateTimeScalar } from "@beach_bar/common";
import { objectType, unionType } from "@nexus/schema";
import { BeachBarReviewType } from "../types";

export const ReviewAnswerType = objectType({
  name: "ReviewAnswer",
  description: "Represents an answer for a review of a #beach_bar, by the owner",
  definition(t) {
    t.field("id", { type: BigIntScalar, nullable: false, description: "The ID value of the particular review answer" });
    t.string("body", {
      nullable: false,
      description: "The body (content) of the review answer, written by the reviewed #beach_bar's owner",
    });
    t.field("review", {
      type: BeachBarReviewType,
      description: "The review this answer is assigned to",
      nullable: false,
      resolve: o => o.review,
    });
    t.field("updatedAt", {
      type: DateTimeScalar,
      nullable: false,
      description: "The last time user's account was updated, in the format of a timestamp",
    });
    t.field("timestamp", {
      type: DateTimeScalar,
      nullable: false,
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
      nullable: false,
      resolve: o => o.answer,
    });
    t.boolean("added", {
      nullable: false,
      description: "A boolean that indicates if the answer has been successfully being added to the customer's review",
    });
  },
});

export const AddReviewAnswerResult = unionType({
  name: "AddReviewAnswerResult",
  definition(t) {
    t.members("AddReviewAnswer", "Error");
    t.resolveType(item => {
      if (item.error) {
        return "Error";
      } else {
        return "AddReviewAnswer";
      }
    });
  },
});

export const UpdateReviewAnswerType = objectType({
  name: "UpdateReviewAnswer",
  description: "Info to be returned when the answer of a customer's review is updated",
  definition(t) {
    t.field("answer", {
      type: ReviewAnswerType,
      description: "The review answer that is updated",
      nullable: false,
      resolve: o => o.answer,
    });
    t.boolean("updated", {
      nullable: false,
      description: "A boolean that indicates if the review answer has been successfully updated",
    });
  },
});

export const UpdateReviewAnswerResult = unionType({
  name: "UpdateReviewAnswerResult",
  definition(t) {
    t.members("UpdateReviewAnswer", "Error");
    t.resolveType(item => {
      if (item.error) {
        return "Error";
      } else {
        return "UpdateReviewAnswer";
      }
    });
  },
});