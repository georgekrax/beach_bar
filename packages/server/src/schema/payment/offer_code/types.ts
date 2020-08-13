import { objectType } from "@nexus/schema";
import { CouponCodeType, OfferCampaignCodeType } from "../../beach_bar/product/offer/types";
import { PaymentType } from "../types";

export const PaymentOfferCodeType = objectType({
  name: "PaymentOfferCode",
  description: "Represents the offer codes added to a payment",
  definition(t) {
    t.id("id", { nullable: false });
    t.field("payment", {
      type: PaymentType,
      description: "The payment that holds these offer codes",
      nullable: false,
      resolve: o => o.payment,
    });
    t.field("couponCode", {
      type: CouponCodeType,
      description: "A coupon code added to the payment",
      nullable: true,
      resolve: o => o.couponCode,
    });
    t.field("offerCode", {
      type: OfferCampaignCodeType,
      description: "A campaign offer code added to the payment",
      nullable: true,
      resolve: o => o.offerCode,
    });
  },
});
