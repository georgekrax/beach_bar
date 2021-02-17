import { BigIntScalar, DateTimeScalar } from "@the_hashtag/common/dist/graphql";
import { objectType, unionType } from "nexus";
import { CustomerType } from "../../customer/types";
import { ReviewVisitType } from "../../details/review/types";
import { MonthTimeType } from "../../details/time/types";
import { BeachBarType } from "../types";

export const BeachBarReviewType = objectType({
  name: "BeachBarReview",
  description: "Represents a #beach_bar's review, by a customer",
  definition(t) {
    t.field("id", { type: BigIntScalar, description: "The ID value of the review" });
    t.int("ratingValue", { description: "The user's rating, between 0 and 10" });
    t.nullable.int("upvotes", { description: "The time the particular review was voted to be helpful, by other users" });
    t.nullable.int("downvotes", { description: "The time the particular review was voted not to be helpful, by other users" });
    t.nullable.string("positiveComment", { description: "A positive comment for the #beach_bar" });
    t.nullable.string("negativeComment", { description: "A negative comment for the #beach_bar" });
    t.nullable.string("review", { description: "A summary (description) of the user's overall review" });
    t.field("updatedAt", {
      type: DateTimeScalar,
      description: "The last time user's account was updated, in the format of a timestamp",
    });
    t.field("timestamp", {
      type: DateTimeScalar,
      description: "The timestamp recorded, when the user's account was created",
    });
    t.field("beachBar", {
      type: BeachBarType,
      description: "The #beach_bar of the review",
      resolve: o => o.beachBar,
    });
    t.field("customer", {
      type: CustomerType,
      description: "The customer that submitted the particular review for the #beach_bar",
      resolve: o => o.customer,
    });
    t.nullable.field("visitType", {
      type: ReviewVisitType,
      description: "The type of visit for the user",
      resolve: o => o.visitType,
    });
    t.nullable.field("month", {
      type: MonthTimeType,
      description: "The visited month of the customer visited the #beach_bar",
      resolve: o => o.monthTime,
    });
  },
});

export const AddBeachBarReviewType = objectType({
  name: "AddBeachBarReview",
  description: "Info to be returned when a review is added to a #beach_bar",
  definition(t) {
    t.field("review", {
      type: BeachBarReviewType,
      description: "The review that is added",
      resolve: o => o.review,
    });
    t.boolean("added", {
      description: "A boolean that indicates if the review has been successfully being added to the #beach_bar",
    });
  },
});

export const AddBeachBarReviewResult = unionType({
  name: "AddBeachBarReviewResult",
  definition(t) {
    t.members("AddBeachBarReview", "Error");
  },
  resolveType: item => {
    if (item.name === "Error") {
      return "Error";
    } else {
      return "AddBeachBarReview";
    }
  },
});

export const UpdateBeachBarReviewType = objectType({
  name: "UpdateBeachBarReview",
  description: "Info to be returned when the details of a customer's review, are updated",
  definition(t) {
    t.field("review", {
      type: BeachBarReviewType,
      description: "The review that is updated",
      resolve: o => o.review,
    });
    t.boolean("updated", {
      description: "A boolean that indicates if the review has been successfully updated",
    });
  },
});

export const UpdateBeachBarReviewResult = unionType({
  name: "UpdateBeachBarReviewResult",
  definition(t) {
    t.members("UpdateBeachBarReview", "Error");
  },
  resolveType: item => {
    if (item.name === "Error") {
      return "Error";
    } else {
      return "UpdateBeachBarReview";
    }
  },
});
