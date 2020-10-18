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
exports.verifyUserPaymentReview = void 0;
const Payment_1 = require("entity/Payment");
const User_1 = require("entity/User");
exports.verifyUserPaymentReview = (beachBarId, refCode, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (refCode) {
        const payment = yield Payment_1.Payment.findOne({
            where: { refCode },
            relations: ["card", "card.customer", "card.customer.reviews", "cart", "cart.products", "cart.products.product"],
        });
        if (!payment || !payment.cart.products) {
            return {
                boolean: false,
            };
        }
        return {
            boolean: payment.hasBeachBarProduct(beachBarId),
            customer: payment.card.customer,
            payment,
        };
    }
    else if (payload && payload.sub) {
        const user = yield User_1.User.findOne({
            where: { id: payload.sub },
            relations: [
                "customer",
                "customer.reviews",
                "carts",
                "carts.payment",
                "carts.payment.cart",
                "carts.payment.cart.products",
                "carts.payment.cart.products.product",
            ],
        });
        if (!user || !user.carts || !user.customer) {
            return {
                boolean: false,
            };
        }
        const beachBarPayment = user.carts
            .map(cart => cart.payment)
            .find(payment => {
            if (payment) {
                return { boolean: payment.hasBeachBarProduct(beachBarId), payment };
            }
            else {
                return { boolean: false, payment: undefined };
            }
        });
        return {
            boolean: beachBarPayment.boolean,
            customer: user.customer,
            payment: beachBarPayment.payment,
        };
    }
    else {
        return {
            boolean: false,
        };
    }
});
//# sourceMappingURL=verifyUserPaymentReview.js.map