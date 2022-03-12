// import { objectType } from "nexus";
// import { PaymentVoucherCode } from "nexus-prisma";

// export const PaymentVoucherCodeType = objectType({
//   name: PaymentVoucherCode.$name,
//   description: "Represents the offer codes added to a payment",
//   definition(t) {
//     // t.id("id");
//     // t.field("payment", { type: PaymentType, description: "The payment that holds these offer codes" });
//     // t.nullable.field("couponCode", { type: CouponCodeType, description: "A coupon code added to the payment" });
//     // t.nullable.field("offerCode", { type: OfferCampaignCodeType, description: "A campaign offer code added to the payment" });
//     t.field(PaymentVoucherCode.id);
//     t.field(PaymentVoucherCode.payment);
//     t.field(PaymentVoucherCode.couponCode);
//     t.field(PaymentVoucherCode.offerCode);
//   },
// });
