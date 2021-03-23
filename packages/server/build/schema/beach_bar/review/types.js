"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBeachBarReviewType = exports.AddBeachBarReviewType = exports.BeachBarReviewType = void 0;
const graphql_1 = require("@the_hashtag/common/dist/graphql");
const nexus_1 = require("nexus");
const types_1 = require("../../customer/types");
const types_2 = require("../../details/review/types");
const types_3 = require("../../details/time/types");
const types_4 = require("../types");
const types_5 = require("./answer/types");
const types_6 = require("./votes/types");
exports.BeachBarReviewType = nexus_1.objectType({
    name: "BeachBarReview",
    description: "Represents a #beach_bar's review, by a customer",
    definition(t) {
        t.id("id", { description: "The ID value of the review" });
        t.int("ratingValue", { description: "The user's rating, between 0 and 10" });
        t.nullable.string("positiveComment", { description: "A positive comment for the #beach_bar" });
        t.nullable.string("negativeComment", { description: "A negative comment for the #beach_bar" });
        t.nullable.string("review", { description: "A summary (description) of the user's overall review" });
        t.field("beachBar", {
            type: types_4.BeachBarType,
            description: "The #beach_bar of the review",
            resolve: o => o.beachBar,
        });
        t.list.field("votes", {
            type: types_6.ReviewVoteType,
            description: "The votes os users for this review",
            resolve: o => o.votes,
        });
        t.nullable.field("answer", {
            type: types_5.ReviewAnswerType,
            description: "The answer of the #beach_bar to this review",
            resolve: o => o.answer,
        });
        t.field("customer", {
            type: types_1.CustomerType,
            description: "The customer that submitted the particular review for the #beach_bar",
            resolve: o => o.customer,
        });
        t.nullable.field("visitType", {
            type: types_2.ReviewVisitType,
            description: "The type of visit for the user",
            resolve: o => o.visitType,
        });
        t.nullable.field("month", {
            type: types_3.MonthTimeType,
            description: "The visited month of the customer visited the #beach_bar",
            resolve: o => o.monthTime,
        });
        t.field("updatedAt", {
            type: graphql_1.DateTimeScalar,
            description: "The last time user's account was updated, in the format of a timestamp",
        });
        t.field("timestamp", {
            type: graphql_1.DateTimeScalar,
            description: "The timestamp recorded, when the user's account was created",
        });
    },
});
exports.AddBeachBarReviewType = nexus_1.objectType({
    name: "AddBeachBarReview",
    description: "Info to be returned when a review is added to a #beach_bar",
    definition(t) {
        t.field("review", {
            type: exports.BeachBarReviewType,
            description: "The review that is added",
            resolve: o => o.review,
        });
        t.boolean("added", {
            description: "A boolean that indicates if the review has been successfully being added to the #beach_bar",
        });
    },
});
exports.UpdateBeachBarReviewType = nexus_1.objectType({
    name: "UpdateBeachBarReview",
    description: "Info to be returned when the details of a customer's review, are updated",
    definition(t) {
        t.field("review", {
            type: exports.BeachBarReviewType,
            description: "The review that is updated",
            resolve: o => o.review,
        });
        t.boolean("updated", {
            description: "A boolean that indicates if the review has been successfully updated",
        });
    },
});
