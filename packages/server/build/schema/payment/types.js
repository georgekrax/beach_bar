"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddPaymentResult = exports.AddPaymentType = exports.PaymentType = void 0;
const schema_1 = require("@nexus/schema");
const types_1 = require("../cart/types");
const types_2 = require("../customer/card/types");
const types_3 = require("../details/payment/types");
const types_4 = require("./offer_code/types");
const types_5 = require("./reserved_product/types");
exports.PaymentType = schema_1.objectType({
    name: "Payment",
    description: "Represents a payment",
    definition(t) {
        t.id("id", { nullable: false });
        t.string("refCode", { nullable: false, description: "A unique identifier (referral code) of the payment" });
        t.string("stripeId", { nullable: false, description: "Stripe's ID value of the payment" });
        t.boolean("isRefunded", { nullable: false, description: "A boolean that indicates if the whole payment was refunded" });
        t.field("cart", {
            type: types_1.CartType,
            description: "The shopping cart this payment is associated to",
            nullable: false,
            resolve: o => o.cart,
        });
        t.field("card", {
            type: types_2.CardType,
            description: "The credit or debit card this payment is associated to",
            nullable: false,
            resolve: o => o.card,
        });
        t.field("status", {
            type: types_3.PaymentStatusType,
            description: "The status of the payment",
            nullable: false,
            resolve: o => o.status,
        });
        t.field("voucherCode", {
            type: types_4.PaymentOfferCodeType,
            description: "A coupon or an offer campaign code used, to apply a discount, at this payment",
            nullable: true,
            resolve: o => o.voucherCode,
        });
        t.list.field("reservedProducts", {
            type: types_5.ReservedProductType,
            description: "A list with all the reserved products of the payment",
            nullable: true,
            resolve: o => o.reservedProducts,
        });
    },
});
exports.AddPaymentType = schema_1.objectType({
    name: "AddPayment",
    description: "Info to be returned when a payment is created (made)",
    definition(t) {
        t.field("payment", {
            type: exports.PaymentType,
            description: "The payment that is created (made)",
            nullable: false,
            resolve: o => o.payment,
        });
        t.boolean("added", {
            nullable: false,
            description: "A boolean that indicates if the payments have been successfully created (made)",
        });
    },
});
exports.AddPaymentResult = schema_1.unionType({
    name: "AddPaymentResult",
    definition(t) {
        t.members("AddPayment", "Error");
        t.resolveType(item => {
            if (item.error) {
                return "Error";
            }
            else {
                return "AddPayment";
            }
        });
    },
});
//# sourceMappingURL=types.js.map