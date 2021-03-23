"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentVisitsDatesTypes = exports.PaymentVisitsType = exports.VisitType = exports.AddPaymentResult = exports.AddPaymentType = exports.PaymentType = void 0;
const graphql_1 = require("@the_hashtag/common/dist/graphql");
const nexus_1 = require("nexus");
const types_1 = require("schema/beach_bar/types");
const types_2 = require("schema/details/time/types");
const types_3 = require("../cart/types");
const types_4 = require("../customer/card/types");
const types_5 = require("../details/payment/types");
const types_6 = require("./offer_code/types");
const types_7 = require("./reserved_product/types");
exports.PaymentType = nexus_1.objectType({
    name: "Payment",
    description: "Represents a payment",
    definition(t) {
        t.id("id");
        t.string("refCode", { description: "A unique identifier (referral code) of the payment" });
        t.string("stripeId", { description: "Stripe's ID value of the payment" });
        t.boolean("isRefunded", { description: "A boolean that indicates if the whole payment was refunded" });
        t.field("cart", {
            type: types_3.CartType,
            description: "The shopping cart this payment is associated to",
            resolve: o => o.cart,
        });
        t.field("card", {
            type: types_4.CardType,
            description: "The credit or debit card this payment is associated to",
            resolve: o => o.card,
        });
        t.field("status", {
            type: types_5.PaymentStatusType,
            description: "The status of the payment",
            resolve: o => o.status,
        });
        t.nullable.field("voucherCode", {
            type: types_6.PaymentOfferCodeType,
            description: "A coupon or an offer campaign code used, to apply a discount, at this payment",
            resolve: o => o.voucherCode,
        });
        t.nullable.list.field("reservedProducts", {
            type: types_7.ReservedProductType,
            description: "A list with all the reserved products of the payment",
            resolve: o => o.reservedProducts,
        });
        t.field("timestamp", {
            type: graphql_1.DateTimeScalar,
            description: "The timestamp recorded, when the payment was created / paid",
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
        if (item.error) {
            return "Error";
        }
        else {
            return "AddPayment";
        }
    },
});
exports.VisitType = nexus_1.objectType({
    name: "Visit",
    definition(t) {
        t.boolean("isUpcoming");
        t.boolean("isRefunded");
        t.field("time", { type: types_2.HourTimeType });
        t.field("date", { type: graphql_1.DateScalar });
        t.field("payment", { type: exports.PaymentType });
    },
});
exports.PaymentVisitsType = nexus_1.objectType({
    name: "PaymentVisits",
    description: "Represents a payment as a user's visit",
    definition(t) {
        t.field("beachBar", { type: types_1.BeachBarType });
        t.list.field("visits", { type: exports.VisitType });
    },
});
exports.PaymentVisitsDatesTypes = nexus_1.objectType({
    name: "PaymentVisitsDates",
    description: "Represents a user's payment visit month and years list",
    definition(t) {
        t.field("month", { type: types_2.MonthTimeType });
        t.int("year");
    },
});
