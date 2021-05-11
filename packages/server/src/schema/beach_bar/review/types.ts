import { DateTimeScalar } from "@the_hashtag/common/dist/graphql";
import { objectType } from "nexus";
import { PaymentType } from "schema/payment/types";
import { CustomerType } from "../../customer/types";
import { ReviewVisitType } from "../../details/review/types";
import { MonthTimeType } from "../../details/time/types";
import { BeachBarType } from "../types";
import { ReviewAnswerType } from "./answer/types";
import { ReviewVoteType } from "./votes/types";

export const BeachBarReviewType = objectType({
  name: "BeachBarReview",
  description: "Represents a #beach_bar's review, by a customer",
  definition(t) {
    t.id("id", { description: "The ID value of the review" });
    t.int("ratingValue", { description: "The user's rating, between 0 and 10" });
    t.nullable.string("positiveComment", { description: "A positive comment for the #beach_bar" });
    t.nullable.string("negativeComment", { description: "A negative comment for the #beach_bar" });
    t.nullable.string("review", { description: "A summary (description) of the user's overall review" });
    t.field("beachBar", { type: BeachBarType });
    t.list.field("votes", { type: ReviewVoteType, description: "The votes of users for this review" });
    t.nullable.field("answer", { type: ReviewAnswerType, description: "The answer of the #beach_bar to this review" });
    t.field("customer", { type: CustomerType, description: "The customer that submitted the particular review for the #beach_bar" });
    t.nullable.field("visitType", { type: ReviewVisitType, description: "The type of visit for the user" });
    t.nullable.field("month", { type: MonthTimeType, description: "The visited month of the customer visited the #beach_bar" });
    t.field("payment", {
      type: PaymentType,
      description: "The relevant payment the user made, to be able to review a #beach_bar's products",
    });
    t.field("updatedAt", { type: DateTimeScalar });
    t.field("timestamp", { type: DateTimeScalar });
  },
});

export const AddBeachBarReviewType = objectType({
  name: "AddBeachBarReview",
  description: "Info to be returned when a review is added to a #beach_bar",
  definition(t) {
    t.field("review", { type: BeachBarReviewType, description: "The review that is added" });
    t.boolean("added", { description: "A boolean that indicates if the review has been successfully being added to the #beach_bar" });
  },
});

// export const AddBeachBarReviewResult = unionType({
//   name: "AddBeachBarReviewResult",
//   definition(t) {
//     t.members("AddBeachBarReview", "Error");
//   },
//   resolveType: item => {
//     if (item.error) {
//       return "Error";
//     } else {
//       return "AddBeachBarReview";
//     }
//   },
// });

export const UpdateBeachBarReviewType = objectType({
  name: "UpdateBeachBarReview",
  description: "Info to be returned when the details of a customer's review, are updated",
  definition(t) {
    t.field("review", { type: BeachBarReviewType, description: "The review that is updated" });
    t.boolean("updated", { description: "A boolean that indicates if the review has been successfully updated" });
  },
});

// export const UpdateBeachBarReviewResult = unionType({
//   name: "UpdateBeachBarReviewResult",
//   definition(t) {
//     t.members("UpdateBeachBarReview", "Error");
//   },
//   resolveType: item => {
//     if (item.error) {
//       return "Error";
//     } else {
//       return "UpdateBeachBarReview";
//     }
//   },
// });
