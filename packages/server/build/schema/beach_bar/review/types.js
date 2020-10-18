"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBeachBarReviewResult = exports.UpdateBeachBarReviewType = exports.AddBeachBarReviewResult = exports.AddBeachBarReviewType = exports.BeachBarReviewType = void 0;
const common_1 = require("@georgekrax-hashtag/common");
const schema_1 = require("@nexus/schema");
const types_1 = require("../../customer/types");
const types_2 = require("../../details/review/types");
const types_3 = require("../../details/time/types");
const types_4 = require("../types");
exports.BeachBarReviewType = schema_1.objectType({
    name: "BeachBarReview",
    description: "Represents a #beach_bar's review, by a customer",
    definition(t) {
        t.field("id", { type: common_1.BigIntScalar, nullable: false, description: "The ID value of the review" });
        t.int("ratingValue", { nullable: false, description: "The user's rating, between 0 and 10" });
        t.int("upvotes", { nullable: true, description: "The time the particular review was voted to be helpful, by other users" });
        t.int("downvotes", {
            nullable: true,
            description: "The time the particular review was voted not to be helpful, by other users",
        });
        t.string("positiveComment", { nullable: true, description: "A positive comment for the #beach_bar" });
        t.string("negativeComment", { nullable: true, description: "A negative comment for the #beach_bar" });
        t.string("review", { nullable: true, description: "A summary (description) of the user's overall review" });
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
        t.field("beachBar", {
            type: types_4.BeachBarType,
            description: "The #beach_bar of the review",
            nullable: false,
            resolve: o => o.beachBar,
        });
        t.field("customer", {
            type: types_1.CustomerType,
            description: "The customer that submitted the particular review for the #beach_bar",
            nullable: false,
            resolve: o => o.customer,
        });
        t.field("visitType", {
            type: types_2.ReviewVisitType,
            nullable: true,
            description: "The type of visit for the user",
            resolve: o => o.visitType,
        });
        t.field("month", {
            type: types_3.MonthTimeType,
            description: "The visited month of the customer visited the #beach_bar",
            nullable: true,
            resolve: o => o.monthTime,
        });
    },
});
exports.AddBeachBarReviewType = schema_1.objectType({
    name: "AddBeachBarReview",
    description: "Info to be returned when a review is added to a #beach_bar",
    definition(t) {
        t.field("review", {
            type: exports.BeachBarReviewType,
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
exports.AddBeachBarReviewResult = schema_1.unionType({
    name: "AddBeachBarReviewResult",
    definition(t) {
        t.members("AddBeachBarReview", "Error");
        t.resolveType(item => {
            if (item.error) {
                return "Error";
            }
            else {
                return "AddBeachBarReview";
            }
        });
    },
});
exports.UpdateBeachBarReviewType = schema_1.objectType({
    name: "UpdateBeachBarReview",
    description: "Info to be returned when the details of a customer's review, are updated",
    definition(t) {
        t.field("review", {
            type: exports.BeachBarReviewType,
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
exports.UpdateBeachBarReviewResult = schema_1.unionType({
    name: "UpdateBeachBarReviewResult",
    definition(t) {
        t.members("UpdateBeachBarReview", "Error");
        t.resolveType(item => {
            if (item.error) {
                return "Error";
            }
            else {
                return "UpdateBeachBarReview";
            }
        });
    },
});
//# sourceMappingURL=types.js.map