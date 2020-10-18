"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentOfferCodeType = void 0;
const schema_1 = require("@nexus/schema");
const types_1 = require("../../beach_bar/product/offer/types");
const types_2 = require("../types");
exports.PaymentOfferCodeType = schema_1.objectType({
    name: "PaymentOfferCode",
    description: "Represents the offer codes added to a payment",
    definition(t) {
        t.id("id", { nullable: false });
        t.field("payment", {
            type: types_2.PaymentType,
            description: "The payment that holds these offer codes",
            nullable: false,
            resolve: o => o.payment,
        });
        t.field("couponCode", {
            type: types_1.CouponCodeType,
            description: "A coupon code added to the payment",
            nullable: true,
            resolve: o => o.couponCode,
        });
        t.field("offerCode", {
            type: types_1.OfferCampaignCodeType,
            description: "A campaign offer code added to the payment",
            nullable: true,
            resolve: o => o.offerCode,
        });
    },
});
//# sourceMappingURL=types.js.map