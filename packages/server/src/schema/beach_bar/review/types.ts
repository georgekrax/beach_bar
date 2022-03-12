import { resolve } from "@/utils/data";
import { objectType } from "nexus";
import { BeachBarReview } from "nexus-prisma";

export const BeachBarReviewType = objectType({
  name: BeachBarReview.$name,
  description: "Represents a #beach_bar's review, by a customer",
  definition(t) {
    // t.id("id", { description: "The ID value of the review" });
    // t.int("ratingValue", { description: "The user's rating, between 0 and 10" });
    // t.nullable.string("positiveComment", { description: "A positive comment for the #beach_bar" });
    // t.nullable.string("negativeComment", { description: "A negative comment for the #beach_bar" });
    // t.nullable.string("body", { description: "The main body (description) of the user's review" });
    // t.nullable.string("answer", { description: "The reply provided by the #beach_bar" });
    // t.field("beachBar", { type: BeachBarType });
    // t.list.field("votes", { type: ReviewVoteType, description: "The votes of users for this review" });
    // // t.nullable.field("answer", { type: ReviewAnswerType, description: "The answer of the #beach_bar to this review" });
    // t.field("customer", { type: CustomerType, description: "The customer that submitted the particular review for the #beach_bar" });
    // t.nullable.field("visitType", { type: ReviewVisitType, description: "The type of visit for the user" });
    // t.nullable.field("month", { type: MonthTimeType, description: "The visited month of the customer visited the #beach_bar" });
    // t.field("payment", {
    //   type: PaymentType,
    //   description: "The relevant payment the user made, to be able to review a #beach_bar's products",
    // });
    // t.field("updatedAt", { type: DateTime });
    // t.field("timestamp", { type: DateTime });
    t.field(BeachBarReview.id.name, { ...BeachBarReview.id, type: "ID", resolve: ({ id }) => id.toString() });
    t.field(BeachBarReview.ratingValue);
    t.field(BeachBarReview.positiveComment);
    t.field(BeachBarReview.negativeComment);
    t.field(BeachBarReview.body);
    t.field(BeachBarReview.answer);
    t.field(BeachBarReview.beachBar);
    t.field(resolve(BeachBarReview.votes));
    t.field(resolve(BeachBarReview.customer));
    t.field(resolve(BeachBarReview.visitType));
    t.field(resolve(BeachBarReview.month));
    t.field(resolve(BeachBarReview.payment));
    t.field(BeachBarReview.updatedAt);
    t.field(BeachBarReview.timestamp);
  },
});

// export const AddBeachBarReviewType = objectType({
//   name: "AddBeachBarReview",
//   description: "Info to be returned when a review is added to a #beach_bar",
//   definition(t) {
//     t.field("review", { type: BeachBarReviewType, description: "The review that is added" });
//     t.boolean("added", { description: "A boolean that indicates if the review has been successfully being added to the #beach_bar" });
//   },
// });

// export const UpdateBeachBarReviewType = objectType({
//   name: "UpdateBeachBarReview",
//   description: "Info to be returned when the details of a customer's review, are updated",
//   definition(t) {
//     t.field("review", { type: BeachBarReviewType, description: "The review that is updated" });
//     t.boolean("updated", { description: "A boolean that indicates if the review has been successfully updated" });
//   },
// });
