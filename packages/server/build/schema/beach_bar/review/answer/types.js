"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateReviewAnswerResult = exports.UpdateReviewAnswerType = exports.AddReviewAnswerResult = exports.AddReviewAnswerType = exports.ReviewAnswerType = void 0;
const common_1 = require("@georgekrax-hashtag/common");
const schema_1 = require("@nexus/schema");
const types_1 = require("../types");
exports.ReviewAnswerType = schema_1.objectType({
    name: "ReviewAnswer",
    description: "Represents an answer for a review of a #beach_bar, by the owner",
    definition(t) {
        t.field("id", { type: common_1.BigIntScalar, nullable: false, description: "The ID value of the particular review answer" });
        t.string("body", {
            nullable: false,
            description: "The body (content) of the review answer, written by the reviewed #beach_bar's owner",
        });
        t.field("review", {
            type: types_1.BeachBarReviewType,
            description: "The review this answer is assigned to",
            nullable: false,
            resolve: o => o.review,
        });
        t.field("updatedAt", {
            type: common_1.DateTimeScalar,
            nullable: false,
            description: "The last time user's account was updated, in the format of a timestamp",
        });
        t.field("timestamp", {
            type: common_1.DateTimeScalar,
            nullable: false,
            description: "The timestamp recorded, when the user's account was created",
        });
    },
});
exports.AddReviewAnswerType = schema_1.objectType({
    name: "AddReviewAnswer",
    description: "Info to be returned when an answer is added to a customer's review",
    definition(t) {
        t.field("answer", {
            type: exports.ReviewAnswerType,
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
exports.AddReviewAnswerResult = schema_1.unionType({
    name: "AddReviewAnswerResult",
    definition(t) {
        t.members("AddReviewAnswer", "Error");
        t.resolveType(item => {
            if (item.error) {
                return "Error";
            }
            else {
                return "AddReviewAnswer";
            }
        });
    },
});
exports.UpdateReviewAnswerType = schema_1.objectType({
    name: "UpdateReviewAnswer",
    description: "Info to be returned when the answer of a customer's review is updated",
    definition(t) {
        t.field("answer", {
            type: exports.ReviewAnswerType,
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
exports.UpdateReviewAnswerResult = schema_1.unionType({
    name: "UpdateReviewAnswerResult",
    definition(t) {
        t.members("UpdateReviewAnswer", "Error");
        t.resolveType(item => {
            if (item.error) {
                return "Error";
            }
            else {
                return "UpdateReviewAnswer";
            }
        });
    },
});
//# sourceMappingURL=types.js.map