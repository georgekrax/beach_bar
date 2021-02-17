"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentOfferCodeType = void 0;
const nexus_1 = require("nexus");
const types_1 = require("../../beach_bar/product/offer/types");
const types_2 = require("../types");
exports.PaymentOfferCodeType = nexus_1.objectType({
    name: "PaymentOfferCode",
    description: "Represents the offer codes added to a payment",
    definition(t) {
        t.id("id");
        t.field("payment", {
            type: types_2.PaymentType,
            description: "The payment that holds these offer codes",
            resolve: o => o.payment,
        });
        t.nullable.field("couponCode", {
            type: types_1.CouponCodeType,
            description: "A coupon code added to the payment",
            resolve: o => o.couponCode,
        });
        t.nullable.field("offerCode", {
            type: types_1.OfferCampaignCodeType,
            description: "A campaign offer code added to the payment",
            resolve: o => o.offerCode,
        });
    },
});
