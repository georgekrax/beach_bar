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
exports.BeachBarReviewQuery = void 0;
const common_1 = require("@beach_bar/common");
const apollo_server_express_1 = require("apollo-server-express");
const BeachBarReview_1 = require("entity/BeachBarReview");
const Customer_1 = require("entity/Customer");
const Time_1 = require("entity/Time");
const nexus_1 = require("nexus");
const typeorm_1 = require("typeorm");
const verifyUserPaymentReview_1 = require("utils/beach_bar/verifyUserPaymentReview");
const types_1 = require("../../details/time/types");
const types_2 = require("./types");
exports.BeachBarReviewQuery = nexus_1.extendType({
    type: "Query",
    definition(t) {
        t.boolean("verifyUserPaymentReview", {
            description: "Verify a user's payment to submit review",
            args: {
                beachBarId: nexus_1.intArg({ description: "The ID value of the #beach_bar to submit the review" }),
                refCode: nexus_1.nullable(nexus_1.stringArg({ description: "The referral code of the customer payment, to find" })),
            },
            resolve: (_, { beachBarId, refCode }, { payload }) => __awaiter(this, void 0, void 0, function* () {
                if (!beachBarId || beachBarId <= 0) {
                    return false;
                }
                const { boolean, customer, payment } = yield verifyUserPaymentReview_1.verifyUserPaymentReview(beachBarId, refCode, payload);
                if (!customer || !payment) {
                    return false;
                }
                if (!customer.checkReviewsQuantity(beachBarId, payment)) {
                    return false;
                }
                return boolean;
            }),
        });
        t.nullable.list.field("getPaymentProductsMonth", {
            type: types_1.MonthTimeType,
            description: "Get a list with all the months in a review, by the product purchase",
            args: {
                beachBarId: nexus_1.intArg({ description: "The ID value of the #beach_bar to submit the review" }),
                refCode: nexus_1.nullable(nexus_1.stringArg({ description: "The referral code of the customer payment, to find" })),
            },
            resolve: (_, { beachBarId, refCode }, { payload }) => __awaiter(this, void 0, void 0, function* () {
                if (!beachBarId || beachBarId <= 0)
                    return null;
                const { boolean, payment } = yield verifyUserPaymentReview_1.verifyUserPaymentReview(beachBarId, refCode, payload);
                if (!boolean)
                    return null;
                if (!payment || !payment.cart || !payment.cart.products)
                    return null;
                const productsMonthIds = payment.getProductsMonth(beachBarId);
                if (!productsMonthIds)
                    return null;
                const months = yield Time_1.MonthTime.find({ id: typeorm_1.In(productsMonthIds) });
                return months;
            }),
        });
        t.list.field("userReviews", {
            type: types_2.BeachBarReviewType,
            description: "Get a list of all the reviews of an authenticated user",
            resolve: (_, __, { payload }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload || !payload.sub)
                    return null;
                const customer = yield Customer_1.Customer.findOne({
                    where: { userId: payload.sub },
                    relations: [
                        "reviews",
                        "reviews.beachBar",
                        "reviews.visitType",
                        "reviews.monthTime",
                        "reviews.payment",
                        "reviews.answer",
                        "reviews.customer",
                        "reviews.customer.user",
                        "reviews.votes",
                        "reviews.votes.type",
                        "reviews.votes.user",
                    ],
                });
                if (!customer)
                    throw new apollo_server_express_1.ApolloError(common_1.errors.USER_NOT_FOUND_MESSAGE, common_1.errors.NOT_FOUND);
                return (customer === null || customer === void 0 ? void 0 : customer.reviews) || [];
            }),
        });
        t.field("review", {
            type: types_2.BeachBarReviewType,
            description: "Get the details of a a review of an authenticated user",
            args: {
                reviewId: nexus_1.idArg({ description: "The ID value of the review to fetch" }),
            },
            resolve: (_, { reviewId }, { payload }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload || !payload.sub)
                    return null;
                if (!reviewId || reviewId.trim().length === 0)
                    throw new apollo_server_express_1.UserInputError("Please provide a valid review ID", {
                        code: common_1.errors.INVALID_ARGUMENTS,
                    });
                const review = yield BeachBarReview_1.BeachBarReview.findOne({
                    where: { id: reviewId },
                    relations: [
                        "visitType",
                        "monthTime",
                        "payment",
                        "answer",
                        "customer",
                        "customer.user",
                        "votes",
                        "votes.type",
                        "votes.user",
                        "beachBar",
                        "beachBar.location",
                        "beachBar.location.city",
                        "beachBar.location.region",
                        "beachBar.location.country",
                    ],
                });
                if (!review)
                    throw new apollo_server_express_1.ApolloError("Specified review does not exist", common_1.errors.NOT_FOUND);
                return review;
            }),
        });
    },
});
