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
const schema_1 = require("@nexus/schema");
const Time_1 = require("entity/Time");
const typeorm_1 = require("typeorm");
const verifyUserPaymentReview_1 = require("utils/beach_bar/verifyUserPaymentReview");
const types_1 = require("../../details/time/types");
exports.BeachBarReviewQuery = schema_1.extendType({
    type: "Query",
    definition(t) {
        t.boolean("verifyUserPaymentReview", {
            description: "Verify a user's payment to submit review",
            nullable: false,
            args: {
                beachBarId: schema_1.intArg({
                    required: true,
                    description: "The ID value of the #beach_bar to submit the review",
                }),
                refCode: schema_1.stringArg({
                    required: false,
                    description: "The referral code of the customer payment, to find",
                }),
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
        t.list.field("getPaymentProductsMonth", {
            type: types_1.MonthTimeType,
            description: "Get a list with all the months in a review, by the product purchase",
            nullable: true,
            args: {
                beachBarId: schema_1.intArg({
                    required: true,
                    description: "The ID value of the #beach_bar to submit the review",
                }),
                refCode: schema_1.stringArg({
                    required: false,
                    description: "The referral code of the customer payment, to find",
                }),
            },
            resolve: (_, { beachBarId, refCode }, { payload }) => __awaiter(this, void 0, void 0, function* () {
                if (!beachBarId || beachBarId <= 0) {
                    return null;
                }
                const { boolean, payment } = yield verifyUserPaymentReview_1.verifyUserPaymentReview(beachBarId, refCode, payload);
                if (!boolean) {
                    return null;
                }
                if (!payment || !payment.cart || !payment.cart.products) {
                    return null;
                }
                const productsMonthIds = payment.getProductsMonth(beachBarId);
                if (!productsMonthIds) {
                    return null;
                }
                const months = yield Time_1.MonthTime.find({ id: typeorm_1.In(productsMonthIds) });
                return months;
            }),
        });
    },
});
//# sourceMappingURL=query.js.map