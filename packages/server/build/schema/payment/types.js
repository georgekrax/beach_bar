"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddPaymentResult = exports.AddPaymentType = exports.PaymentType = void 0;
const nexus_1 = require("nexus");
const types_1 = require("../cart/types");
const types_2 = require("../customer/card/types");
const types_3 = require("../details/payment/types");
const types_4 = require("./offer_code/types");
const types_5 = require("./reserved_product/types");
exports.PaymentType = nexus_1.objectType({
    name: "Payment",
    description: "Represents a payment",
    definition(t) {
        t.id("id");
        t.string("refCode", { description: "A unique identifier (referral code) of the payment" });
        t.string("stripeId", { description: "Stripe's ID value of the payment" });
        t.boolean("isRefunded", { description: "A boolean that indicates if the whole payment was refunded" });
        t.field("cart", {
            type: types_1.CartType,
            description: "The shopping cart this payment is associated to",
            resolve: o => o.cart,
        });
        t.field("card", {
            type: types_2.CardType,
            description: "The credit or debit card this payment is associated to",
            resolve: o => o.card,
        });
        t.field("status", {
            type: types_3.PaymentStatusType,
            description: "The status of the payment",
            resolve: o => o.status,
        });
        t.nullable.field("voucherCode", {
            type: types_4.PaymentOfferCodeType,
            description: "A coupon or an offer campaign code used, to apply a discount, at this payment",
            resolve: o => o.voucherCode,
        });
        t.nullable.list.field("reservedProducts", {
            type: types_5.ReservedProductType,
            description: "A list with all the reserved products of the payment",
            resolve: o => o.reservedProducts,
        });
    },
});
exports.AddPaymentType = nexus_1.objectType({
    name: "AddPayment",
    description: "Info to be returned when a payment is created (made)",
    definition(t) {
        t.field("payment", {
            type: exports.PaymentType,
            description: "The payment that is created (made)",
            resolve: o => o.payment,
        });
        t.boolean("added", {
            description: "A boolean that indicates if the payments have been successfully created (made)",
        });
    },
});
exports.AddPaymentResult = nexus_1.unionType({
    name: "AddPaymentResult",
    definition(t) {
        t.members("AddPayment", "Error");
    },
    resolveType: item => {
        if (item.name === "Error") {
            return "Error";
        }
        else {
            return "AddPayment";
        }
    },
});
