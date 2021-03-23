"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateReviewAnswerResult = exports.UpdateReviewAnswerType = exports.AddReviewAnswerResult = exports.AddReviewAnswerType = exports.ReviewAnswerType = void 0;
const graphql_1 = require("@the_hashtag/common/dist/graphql");
const nexus_1 = require("nexus");
const types_1 = require("../types");
exports.ReviewAnswerType = nexus_1.objectType({
    name: "ReviewAnswer",
    description: "Represents an answer for a review of a #beach_bar, by the owner",
    definition(t) {
        t.id("id", { description: "The ID value of the particular review answer" });
        t.string("body", { description: "The body (content) of the review answer, written by the reviewed #beach_bar's owner" });
        t.field("review", {
            type: types_1.BeachBarReviewType,
            description: "The review this answer is assigned to",
            resolve: o => o.review,
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
exports.AddReviewAnswerType = nexus_1.objectType({
    name: "AddReviewAnswer",
    description: "Info to be returned when an answer is added to a customer's review",
    definition(t) {
        t.field("answer", {
            type: exports.ReviewAnswerType,
            description: "The answer that is added to the review",
            resolve: o => o.answer,
        });
        t.boolean("added", {
            description: "A boolean that indicates if the answer has been successfully being added to the customer's review",
        });
    },
});
exports.AddReviewAnswerResult = nexus_1.unionType({
    name: "AddReviewAnswerResult",
    definition(t) {
        t.members("AddReviewAnswer", "Error");
    },
    resolveType: item => {
        if (item.error) {
            return "Error";
        }
        else {
            return "AddReviewAnswer";
        }
    },
});
exports.UpdateReviewAnswerType = nexus_1.objectType({
    name: "UpdateReviewAnswer",
    description: "Info to be returned when the answer of a customer's review is updated",
    definition(t) {
        t.field("answer", {
            type: exports.ReviewAnswerType,
            description: "The review answer that is updated",
            resolve: o => o.answer,
        });
        t.boolean("updated", {
            description: "A boolean that indicates if the review answer has been successfully updated",
        });
    },
});
exports.UpdateReviewAnswerResult = nexus_1.unionType({
    name: "UpdateReviewAnswerResult",
    definition(t) {
        t.members("UpdateReviewAnswer", "Error");
    },
    resolveType: item => {
        if (item.error) {
            return "Error";
        }
        else {
            return "UpdateReviewAnswer";
        }
    },
});
