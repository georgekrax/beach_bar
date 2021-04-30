import { objectType } from "nexus";
import { CouponCodeType, OfferCampaignCodeType } from "../beach_bar/product/offer/types";
import { PaymentType } from "./types";

export const PaymentOfferCodeType = objectType({
  name: "PaymentOfferCode",
  description: "Represents the offer codes added to a payment",
  definition(t) {
    t.id("id");
    t.field("payment", { type: PaymentType, description: "The payment that holds these offer codes" });
    t.nullable.field("couponCode", { type: CouponCodeType, description: "A coupon code added to the payment" });
    t.nullable.field("offerCode", { type: OfferCampaignCodeType, description: "A campaign offer code added to the payment" });
  },
});
