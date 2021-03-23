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
exports.BeachBarReviewCrudMutation = void 0;
const common_1 = require("@beach_bar/common");
const apollo_server_express_1 = require("apollo-server-express");
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
        t.field("addReview", {
            type: types_2.AddBeachBarReviewType,
            description: "Add a customer's review on a #beach_bar",
            args: {
                beachBarId: nexus_1.intArg({ description: "The ID value of the #beach_bar, to submit the review" }),
                paymentRefCode: nexus_1.nullable(nexus_1.stringArg({ description: "The referral code of the payment, to find" })),
                ratingValue: nexus_1.intArg({ description: "The rating value between 1 to 10, the customers rates the #beach_bar" }),
                visitTypeId: nexus_1.nullable(nexus_1.idArg({
                    description: "The ID value of the customer's visit type",
                })),
                monthTimeId: nexus_1.nullable(nexus_1.idArg({
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
                if (!payload || !payload.sub)
                    throw new apollo_server_express_1.ApolloError(common_1.errors.NOT_AUTHENTICATED_MESSAGE, common_1.errors.NOT_AUTHENTICATED_CODE);
                if (!beachBarId || beachBarId.trim().length === 0)
                    throw new apollo_server_express_1.UserInputError("Please provide a valid #beach_bar", { code: common_1.errors.INVALID_ARGUMENTS });
                if (!ratingValue || ratingValue < 1 || ratingValue > _index_1.beachBarReviewRatingMaxValue)
                    throw new apollo_server_express_1.UserInputError(`Please provide a valid rating value, between 1 and ${_index_1.beachBarReviewRatingMaxValue}`, {
                        code: common_1.errors.INVALID_ARGUMENTS,
                    });
                if (visitTypeId && visitTypeId <= 0)
                    throw new apollo_server_express_1.UserInputError("Please provide a valid visit type", { code: common_1.errors.INVALID_ARGUMENTS });
                if (monthTimeId && monthTimeId <= 0)
                    throw new apollo_server_express_1.UserInputError("Please provide a valid month", { code: common_1.errors.INVALID_ARGUMENTS });
                const { boolean: res, customer, payment } = yield verifyUserPaymentReview_1.verifyUserPaymentReview(beachBarId, paymentRefCode, payload);
                if (!res || !payment || !customer)
                    throw new apollo_server_express_1.ApolloError("You have not purchased any products from this #beach_bar, to submit a review for it", common_1.errors.UNAUTHORIZED_CODE);
                if (!customer.checkReviewsQuantity(beachBarId, payment))
                    throw new apollo_server_express_1.ApolloError("You are not allowed to submit more reviews than your purchased products / services", common_1.errors.UNAUTHORIZED_CODE);
                const beachBar = yield BeachBar_1.BeachBar.findOne({ id: beachBarId, isActive: true });
                if (!beachBar)
                    throw new apollo_server_express_1.ApolloError(common_1.errors.BEACH_BAR_DOES_NOT_EXIST, common_1.errors.NOT_FOUND);
                const visitType = yield ReviewVisitType_1.ReviewVisitType.findOne(visitTypeId);
                if (!visitType && visitTypeId)
                    throw new apollo_server_express_1.ApolloError("Invalid visit type", common_1.errors.NOT_FOUND);
                const monthTime = yield Time_1.MonthTime.findOne(monthTimeId);
                if (!monthTime && monthTimeId)
                    throw new apollo_server_express_1.ApolloError("Invalid visit month", common_1.errors.NOT_FOUND);
                else if (monthTime && monthTimeId) {
                    const paymentProductsMonth = payment.getProductsMonth(beachBarId);
                    if (!paymentProductsMonth)
                        throw new apollo_server_express_1.ApolloError(common_1.errors.SOMETHING_WENT_WRONG);
                    const isIncluded = paymentProductsMonth.includes(monthTime.id);
                    if (!isIncluded)
                        throw new apollo_server_express_1.ApolloError(common_1.errors.SOMETHING_WENT_WRONG);
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
                    throw new apollo_server_express_1.ApolloError(common_1.errors.SOMETHING_WENT_WRONG + ": " + err.message);
                }
                return {
                    review: newReview,
                    added: true,
                };
            }),
        });
        t.field("updateReview", {
            type: types_2.UpdateBeachBarReviewType,
            description: "Update a customer's review on a #beach_bar",
            args: {
                reviewId: nexus_1.idArg({ description: "The ID value of the customer's review" }),
                ratingValue: nexus_1.nullable(nexus_1.intArg({
                    description: "The rating value between 1 to 10, the customers rates the #beach_bar",
                })),
                visitTypeId: nexus_1.nullable(nexus_1.idArg({ description: "The ID value of the customer's visit type" })),
                monthTimeId: nexus_1.nullable(nexus_1.idArg({
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
            resolve: (_, { reviewId, ratingValue, visitTypeId, monthTimeId, positiveComment, negativeComment, review }, { payload }) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                if (!payload || !payload.sub)
                    throw new apollo_server_express_1.ApolloError(common_1.errors.NOT_AUTHENTICATED_MESSAGE, common_1.errors.NOT_AUTHENTICATED_CODE);
                if (!reviewId || reviewId.trim().length === 0)
                    throw new apollo_server_express_1.UserInputError("Please provide a valid review ID", { code: common_1.errors.INVALID_ARGUMENTS });
                if (ratingValue && (ratingValue < 1 || ratingValue > _index_1.beachBarReviewRatingMaxValue))
                    throw new apollo_server_express_1.UserInputError(`Please provide a valid rating value, between 1 and ${_index_1.beachBarReviewRatingMaxValue}`, {
                        code: common_1.errors.INVALID_ARGUMENTS,
                    });
                if (visitTypeId && visitTypeId.trim().length === 0)
                    throw new apollo_server_express_1.UserInputError("Please provide a valid visit type", { code: common_1.errors.INVALID_ARGUMENTS });
                if (monthTimeId && monthTimeId.trim().length === 0)
                    throw new apollo_server_express_1.UserInputError("Please provide a valid month", { code: common_1.errors.INVALID_ARGUMENTS });
                const usersReview = yield BeachBarReview_1.BeachBarReview.findOne({
                    where: { id: reviewId },
                    relations: ["beachBar", "customer", "votes", "votes.type"],
                });
                if (!usersReview)
                    throw new apollo_server_express_1.ApolloError("Specified review does not exist", common_1.errors.NOT_FOUND);
                if (((_a = usersReview.customer.userId) === null || _a === void 0 ? void 0 : _a.toString()) !== payload.sub.toString())
                    throw new apollo_server_express_1.ApolloError("You are not allow to edit another's user review", common_1.errors.UNAUTHORIZED_CODE);
                try {
                    const updatedReview = yield usersReview.update({
                        ratingValue,
                        visitTypeId,
                        monthTimeId,
                        positiveComment,
                        negativeComment,
                        review,
                    });
                    if (!updatedReview)
                        throw new apollo_server_express_1.ApolloError(common_1.errors.SOMETHING_WENT_WRONG);
                    return {
                        review: updatedReview,
                        updated: true,
                    };
                }
                catch (err) {
                    throw new apollo_server_express_1.ApolloError(common_1.errors.SOMETHING_WENT_WRONG + ": " + err.message);
                }
            }),
        });
        t.field("deleteReview", {
            type: types_1.DeleteGraphQlType,
            description: "Delete a customer's review on a #beach_bar",
            args: {
                reviewId: nexus_1.idArg({ description: "The ID value of the customer's review" }),
            },
            resolve: (_, { reviewId }) => __awaiter(this, void 0, void 0, function* () {
                if (!reviewId || reviewId.trim().length === 0)
                    throw new apollo_server_express_1.UserInputError("Please provide a valid review ID", { code: common_1.errors.INVALID_ARGUMENTS });
                const review = yield BeachBarReview_1.BeachBarReview.findOne({ where: { id: reviewId }, relations: ["beachBar"] });
                if (!review)
                    throw new apollo_server_express_1.ApolloError("Specified reviews does not exist", common_1.errors.NOT_FOUND);
                try {
                    yield review.softRemove();
                }
                catch (err) {
                    throw new apollo_server_express_1.ApolloError(common_1.errors.SOMETHING_WENT_WRONG + ": " + err.message);
                }
                return {
                    deleted: true,
                };
            }),
        });
    },
});
