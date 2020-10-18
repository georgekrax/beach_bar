"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewAnswerCrudMutation = void 0;
const common_1 = require("@beach_bar/common");
const common_2 = require("@georgekrax-hashtag/common");
const schema_1 = require("@nexus/schema");
const BeachBarReview_1 = require("entity/BeachBarReview");
const ReviewAnswer_1 = require("entity/ReviewAnswer");
const types_1 = require("../../../types");
const types_2 = require("./types");
exports.ReviewAnswerCrudMutation = schema_1.extendType({
    type: "Mutation",
    definition(t) {
        t.field("addReviewAnswer", {
            type: types_2.AddReviewAnswerResult,
            description: "Add a reply to a #beach_bar's review, by its owner",
            nullable: false,
            args: {
                reviewId: schema_1.arg({
                    type: common_2.BigIntScalar,
                    required: true,
                    description: "The ID value of the customer's review",
                }),
                body: schema_1.stringArg({
                    required: true,
                    description: "The body of the reply",
                }),
            },
            resolve: (_, { reviewId, body }, { payload }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload) {
                    return { error: { code: common_1.errors.NOT_AUTHENTICATED_CODE, message: common_1.errors.NOT_AUTHENTICATED_MESSAGE } };
                }
                if (!payload.scope.includes("beach_bar@crud:review_answer")) {
                    return {
                        error: {
                            code: common_1.errors.UNAUTHORIZED_CODE,
                            message: "You are not allowed to add a reply to a #beach_bar's review",
                        },
                    };
                }
                const review = yield BeachBarReview_1.BeachBarReview.findOne({ where: { id: reviewId }, relations: ["beachBar"] });
                if (!review) {
                    return { error: { code: common_1.errors.CONFLICT, message: "Specified review does not exist" } };
                }
                const newReviewAnswer = ReviewAnswer_1.ReviewAnswer.create({
                    review,
                    body,
                });
                try {
                    yield newReviewAnswer.save();
                    yield review.beachBar.updateRedis();
                }
                catch (err) {
                    return { error: { message: `${common_1.errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
                }
                return {
                    answer: newReviewAnswer,
                    added: true,
                };
            }),
        });
        t.field("updateReviewAnswer", {
            type: types_2.UpdateReviewAnswerResult,
            description: "Update the body of a #beach_bar's review reply",
            nullable: false,
            args: {
                answerId: schema_1.arg({
                    type: common_2.BigIntScalar,
                    required: true,
                    description: "The ID value of the review's answer",
                }),
                body: schema_1.stringArg({
                    required: false,
                    description: "The body of the reply",
                }),
            },
            resolve: (_, { answerId, body }, { payload }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload) {
                    return { error: { code: common_1.errors.NOT_AUTHENTICATED_CODE, message: common_1.errors.NOT_AUTHENTICATED_MESSAGE } };
                }
                if (!payload.scope.includes("beach_bar@crud:review_answer")) {
                    return {
                        error: {
                            code: common_1.errors.UNAUTHORIZED_CODE,
                            message: "You are not allowed to update a reply of a #beach_bar's review",
                        },
                    };
                }
                const reviewAnswer = yield ReviewAnswer_1.ReviewAnswer.findOne({ where: { id: answerId }, relations: ["review", "review.beachBar"] });
                if (!reviewAnswer) {
                    return { error: { code: common_1.errors.CONFLICT, message: "Specified review reply does not exist" } };
                }
                try {
                    const updatedReviewAnswer = yield reviewAnswer.update(body);
                    return {
                        answer: updatedReviewAnswer,
                        updated: true,
                    };
                }
                catch (err) {
                    return { error: { message: `${common_1.errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
                }
            }),
        });
        t.field("deleteReviewAnswer", {
            type: types_1.DeleteResult,
            description: "Delete (remove) a reply from a #beach_bar's review",
            nullable: false,
            args: {
                answerId: schema_1.arg({
                    type: common_2.BigIntScalar,
                    required: true,
                    description: "The ID value of the review's answer",
                }),
            },
            resolve: (_, { answerId }, { payload }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload) {
                    return { error: { code: common_1.errors.NOT_AUTHENTICATED_CODE, message: common_1.errors.NOT_AUTHENTICATED_MESSAGE } };
                }
                if (!payload.scope.includes("beach_bar@crud:review_answer")) {
                    return {
                        error: {
                            code: common_1.errors.UNAUTHORIZED_CODE,
                            message: "You are not allowed to delete (remove) a reply from a #beach_bar's review",
                        },
                    };
                }
                const reviewAnswer = yield ReviewAnswer_1.ReviewAnswer.findOne({ where: { id: answerId }, relations: ["review", "review.beachBar"] });
                if (!reviewAnswer) {
                    return { error: { code: common_1.errors.CONFLICT, message: "Specified review reply does not exist" } };
                }
                try {
                    yield reviewAnswer.softRemove();
                }
                catch (err) {
                    return { error: { code: common_1.errors.INTERNAL_SERVER_ERROR, message: `${common_1.errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
                }
                return {
                    deleted: true,
                };
            }),
        });
    },
});
//# sourceMappingURL=mutation.js.map