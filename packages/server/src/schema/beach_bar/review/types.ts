import { BigIntScalar, DateTimeScalar } from "@beach_bar/common";
import { objectType, unionType } from "@nexus/schema";
import { BeachBarType } from "../types";
import { CustomerType } from "../../customer/types";
import { MonthTimeType } from "../../details/time/types";
import { ReviewVisitType } from "../../details/review/types";

export const BeachBarReviewType = objectType({
  name: "BeachBarReview",
  description: "Represents a #beach_bar's review, by a customer",
  definition(t) {
    t.field("id", { type: BigIntScalar, nullable: false, description: "The ID value of the review" });
    t.int("ratingValue", { nullable: false, description: "The user's rating, between 0 and 10" });
    t.int("upvotes", { nullable: true, description: "The time the particular review was voted to be helpful, by other users" });
    t.int("downvotes", {
      nullable: true,
      description: "The time the particular review was voted not to be helpful, by other users",
    });
    t.string("niceComment", { nullable: true, description: "A nice comment by the user for the reviewed #beach_bar" });
    t.string("badComment", { nullable: true, description: "A bad comment by the user for the reviewed #beach_bar" });
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
    t.field("visitTime", {
      type: DateTimeScalar,
      nullable: false,
      description: "The date when the user visited the reviewed #beach_bar",
    });
    t.field("beachBar", {
      type: BeachBarType,
      description: "The #beach_bar of the review",
      nullable: false,
      resolve: o => o.beachBar,
    });
    t.field("customer", {
      type: CustomerType,
      description: "The customer submitted the particular review for the #beach_bar",
      nullable: false,
      resolve: o => o.customer,
    });
    t.field("visitType", {
      type: ReviewVisitType,
      nullable: true,
      description: "The type of visit for the user",
      resolve: o => o.visitType,
    });
    t.field("month", {
      type: MonthTimeType,
      description: "The visited month of the customer visited the #beach_bar",
      nullable: false,
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
      nullable: false,
      resolve: o => o.review,
    });
    t.boolean("added", {
      nullable: false,
      description: "A boolean that indicates if the review has been successfully being added to the #beach_bar",
    });
  },
});

export const AddBeachBarReviewResult = unionType({
  name: "AddBeachBarReviewResult",
  definition(t) {
    t.members("AddBeachBarReview", "Error");
    t.resolveType(item => {
      if (item.error) {
        return "Error";
      } else {
        return "AddBeachBarReview";
      }
    });
  },
});

export const UpdateBeachBarReviewType = objectType({
  name: "UpdateBeachBarReview",
  description: "Info to be returned when the details of a customer's review, are updated",
  definition(t) {
    t.field("review", {
      type: BeachBarReviewType,
      description: "The review that is updated",
      nullable: false,
      resolve: o => o.review,
    });
    t.boolean("updated", {
      nullable: false,
      description: "A boolean that indicates if the review has been successfully updated",
    });
  },
});

export const UpdateBeachBarReviewResult = unionType({
  name: "UpdateBeachBarReviewResult",
  definition(t) {
    t.members("UpdateBeachBarReview", "Error");
    t.resolveType(item => {
      if (item.error) {
        return "Error";
      } else {
        return "UpdateBeachBarReview";
      }
    });
  },
});