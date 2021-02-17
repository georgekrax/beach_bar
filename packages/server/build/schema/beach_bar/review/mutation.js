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
exports.BeachBarReviewVoteMutation = exports.BeachBarReviewCrudMutation = void 0;
const common_1 = require("@beach_bar/common");
const graphql_1 = require("@the_hashtag/common/dist/graphql");
const _index_1 = require("constants/_index");
const BeachBar_1 = require("entity/BeachBar");
const BeachBarReview_1 = require("entity/BeachBarReview");
const ReviewVisitType_1 = require("entity/ReviewVisitType");
const Time_1 = require("entity/Time");
const nexus_1 = require("nexus");
const verifyUserPaymentReview_1 = require("utils/beach_bar/verifyUserPaymentReview");
const types_1 = require("../../types");
const types_2 = require("./types");
exports.BeachBarReviewCrudMutation = nexus_1.extendType({
    type: "Mutation",
    definition(t) {
        t.field("addBeachBarReview", {
            type: types_2.AddBeachBarReviewResult,
            description: "Add a customer's review on a #beach_bar",
            args: {
                beachBarId: nexus_1.intArg({ description: "The ID value of the #beach_bar, to submit the review" }),
                paymentRefCode: nexus_1.nullable(nexus_1.stringArg({ description: "The referral code of the customer payment, to find" })),
                ratingValue: nexus_1.intArg({ description: "The rating value between 1 to 10, the customers rates the #beach_bar" }),
                visitTypeId: nexus_1.nullable(nexus_1.intArg({
                    description: "The ID value of the customer's visit type",
                })),
                monthTimeId: nexus_1.nullable(nexus_1.intArg({
                    description: "The ID value of the month time",
                })),
                positiveComment: nexus_1.nullable(nexus_1.stringArg({
                    description: "A positive comment about the #beach_bar",
                })),
                negativeComment: nexus_1.nullable(nexus_1.stringArg({
                    description: "A negative comment about the #beach_bar",
                })),
                review: nexus_1.nullable(nexus_1.stringArg({
                    description: "A summary (description) of the user's overall review",
                })),
            },
            resolve: (_, { beachBarId, paymentRefCode, monthTimeId, ratingValue, visitTypeId, positiveComment, negativeComment, review }, { payload }) => __awaiter(this, void 0, void 0, function* () {
                if (!beachBarId || beachBarId <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid #beach_bar" } };
                }
                if (!ratingValue || ratingValue < 1 || ratingValue > _index_1.beachBarReviewRatingMaxValue) {
                    return {
                        error: {
                            code: common_1.errors.INVALID_ARGUMENTS,
                            message: `Please provide a valid rating value, between 1 and ${_index_1.beachBarReviewRatingMaxValue}`,
                        },
                    };
                }
                if (visitTypeId && visitTypeId <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid visit type" } };
                }
                if (monthTimeId && monthTimeId <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid month" } };
                }
                const { boolean: res, customer, payment } = yield verifyUserPaymentReview_1.verifyUserPaymentReview(beachBarId, paymentRefCode, payload);
                if (!res || !payment || !customer) {
                    return {
                        error: {
                            code: common_1.errors.UNAUTHORIZED_CODE,
                            message: "You have not purchased any products from this #beach_bar, to submit a review for it",
                        },
                    };
                }
                if (!customer.checkReviewsQuantity(beachBarId, payment)) {
                    return {
                        error: {
                            code: common_1.errors.UNAUTHORIZED_CODE,
                            message: "You are not allowed to submit more reviews than your purchased products / services",
                        },
                    };
                }
                const beachBar = yield BeachBar_1.BeachBar.findOne({ id: beachBarId, isActive: true });
                if (!beachBar) {
                    return { error: { code: common_1.errors.CONFLICT, message: common_1.errors.BEACH_BAR_DOES_NOT_EXIST } };
                }
                const visitType = yield ReviewVisitType_1.ReviewVisitType.findOne(visitTypeId);
                if (!visitType && visitTypeId) {
                    return { error: { code: common_1.errors.CONFLICT, message: "Invalid visit type" } };
                }
                const monthTime = yield Time_1.MonthTime.findOne(monthTimeId);
                if (!monthTime && monthTimeId) {
                    return { error: { code: common_1.errors.CONFLICT, message: "Invalid visit month" } };
                }
                else if (monthTime && monthTimeId) {
                    const paymentProductsMonth = payment.getProductsMonth(beachBarId);
                    if (!paymentProductsMonth) {
                        return { error: { message: common_1.errors.SOMETHING_WENT_WRONG } };
                    }
                    const isIncluded = paymentProductsMonth.includes(monthTime.id);
                    if (!isIncluded) {
                        return { error: { message: common_1.errors.SOMETHING_WENT_WRONG } };
                    }
                }
                const newReview = BeachBarReview_1.BeachBarReview.create({
                    beachBar,
                    customer,
                    payment,
                    ratingValue,
                    visitType,
                    monthTime,
                    positiveComment,
                    negativeComment,
                    review,
                });
                try {
                    yield newReview.save();
                    yield beachBar.updateRedis();
                }
                catch (err) {
                    return { error: { message: `${common_1.errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
                }
                return {
                    review: newReview,
                    added: true,
                };
            }),
        });
        t.field("updateBeachBarReview", {
            type: types_2.UpdateBeachBarReviewResult,
            description: "Update a customer's review on a #beach_bar",
            args: {
                reviewId: nexus_1.arg({
                    type: graphql_1.BigIntScalar,
                    description: "The ID value of the customer's review",
                }),
                ratingValue: nexus_1.nullable(nexus_1.intArg({
                    description: "The rating value between 1 to 10, the customers rates the #beach_bar",
                })),
                visitTypeId: nexus_1.nullable(nexus_1.intArg({ description: "The ID value of the customer's visit type" })),
                monthTimeId: nexus_1.nullable(nexus_1.intArg({
                    description: "The ID value of the month time",
                })),
                positiveComment: nexus_1.nullable(nexus_1.stringArg({
                    description: "A positive comment about the #beach_bar",
                })),
                negativeComment: nexus_1.nullable(nexus_1.stringArg({
                    description: "A negative comment about the #beach_bar",
                })),
                review: nexus_1.nullable(nexus_1.stringArg({
                    description: "A summary (description) of the user's overall review",
                })),
            },
            resolve: (_, { reviewId, ratingValue, visitTypeId, monthTimeId, positiveComment, negativeComment, review }) => __awaiter(this, void 0, void 0, function* () {
                if (!reviewId || reviewId <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid customer's review" } };
                }
                if (ratingValue && (ratingValue < 1 || ratingValue > _index_1.beachBarReviewRatingMaxValue)) {
                    return {
                        error: {
                            code: common_1.errors.INVALID_ARGUMENTS,
                            message: `Please provide a valid rating value, between 1 and ${_index_1.beachBarReviewRatingMaxValue}`,
                        },
                    };
                }
                if (visitTypeId && visitTypeId <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid visit type" } };
                }
                if (monthTimeId && monthTimeId <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid month" } };
                }
                const usersReview = yield BeachBarReview_1.BeachBarReview.findOne({ where: { id: reviewId }, relations: ["beachBar", "customer"] });
                if (!usersReview) {
                    return { error: { code: common_1.errors.CONFLICT, message: "Specified review does not exist" } };
                }
                try {
                    const updatedReview = yield usersReview.update({
                        ratingValue,
                        visitTypeId,
                        monthTimeId,
                        positiveComment,
                        negativeComment,
                        review,
                    });
                    if (!updatedReview) {
                        return { error: { message: common_1.errors.SOMETHING_WENT_WRONG } };
                    }
                    return {
                        review: updatedReview,
                        updated: true,
                    };
                }
                catch (err) {
                    return { error: { message: `${common_1.errors.SOMETHING_WENT_WRONG}${err.message.trim().length > 0 ? `: ${err.message}` : ""} ` } };
                }
            }),
        });
        t.field("deleteBeachBarReview", {
            type: types_1.DeleteResult,
            description: "Delete a customer's review on a #beach_bar",
            args: {
                reviewId: nexus_1.arg({
                    type: graphql_1.BigIntScalar,
                    description: "The ID value of the customer's review",
                }),
            },
            resolve: (_, { reviewId }) => __awaiter(this, void 0, void 0, function* () {
                if (!reviewId || reviewId <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid customer's review" } };
                }
                const review = yield BeachBarReview_1.BeachBarReview.findOne({ where: { id: reviewId }, relations: ["beachBar"] });
                if (!review) {
                    return { error: { code: common_1.errors.CONFLICT, message: "Specified review does not exist" } };
                }
                try {
                    yield review.softRemove();
                }
                catch (err) {
                    return { error: { message: `${common_1.errors.SOMETHING_WENT_WRONG}${err.message.trim().length > 0 ? `: ${err.message}` : ""}` } };
                }
                return {
                    deleted: true,
                };
            }),
        });
    },
});
exports.BeachBarReviewVoteMutation = nexus_1.extendType({
    type: "Mutation",
    definition(t) {
        t.field("voteBeachBarReview", {
            type: types_2.UpdateBeachBarReviewResult,
            description: "Upvote or downvote a customer's review on a #beach_bar",
            args: {
                reviewId: nexus_1.arg({
                    type: graphql_1.BigIntScalar,
                    description: "The ID value of the customer's review",
                }),
                upvote: nexus_1.nullable(nexus_1.booleanArg({ description: "Set to true if to increment the review's votes" })),
                downvote: nexus_1.nullable(nexus_1.booleanArg({ description: "Set to true if to decrement the review's votes" })),
            },
            resolve: (_, { reviewId, upvote, downvote }) => __awaiter(this, void 0, void 0, function* () {
                if (!reviewId || reviewId <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid customer's review" } };
                }
                if (upvote !== undefined && downvote !== undefined) {
                    return {
                        error: { code: common_1.errors.INVALID_ARGUMENTS, message: "You cannot upvote and downvote a customer's review simultaneously" },
                    };
                }
                if (upvote === false || downvote === false) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: common_1.errors.SOMETHING_WENT_WRONG } };
                }
                const review = yield BeachBarReview_1.BeachBarReview.findOne({ where: { id: reviewId }, relations: ["beachBar", "customer"] });
                if (!review) {
                    return { error: { code: common_1.errors.CONFLICT, message: "Specified review does not exist" } };
                }
                try {
                    const updatedReview = yield review.vote(upvote, downvote);
                    if (!updatedReview) {
                        return { error: { message: common_1.errors.SOMETHING_WENT_WRONG } };
                    }
                    return {
                        review: updatedReview,
                        updated: true,
                    };
                }
                catch (err) {
                    return { error: { message: `${common_1.errors.SOMETHING_WENT_WRONG}${err.message.trim().length > 0 ? `: ${err.message}` : ""} ` } };
                }
            }),
        });
    },
});
