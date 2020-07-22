import { inputObjectType, objectType } from "@nexus/schema";
import { CouponCodeType, OfferCampaignCodeType } from "../../beach_bar/product/offer/types";
import { PaymentType } from "../types";

export const PaymentOfferCodeType = objectType({
  name: "PaymentOfferCode",
  description: "Represents the offer codes added to a payment",
  definition(t) {
    t.float("discountPercentage", { nullable: false, description: "The total discount percentage" });
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

export const PaymentOfferCodeInput = inputObjectType({
  name: "PaymentOfferCodeInput",
  description: 'The input used at the "checkout" resolver, for adding multiple coupon or offer campaign codes',
  definition(t) {
    t.string("refCode", {
      nullable: false,
      description: "The referral code of either a coupon or an offer campaign code, to use and get a discount",
    });
    t.float("discountPercentage", {
      nullable: false,
      description: "The percentage to discount from this code to the final payment total",
    });
  },
});
