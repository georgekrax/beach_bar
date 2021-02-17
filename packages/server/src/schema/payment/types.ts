import { objectType, unionType } from "nexus";
import { CartType } from "../cart/types";
import { CardType } from "../customer/card/types";
import { PaymentStatusType } from "../details/payment/types";
import { PaymentOfferCodeType } from "./offer_code/types";
import { ReservedProductType } from "./reserved_product/types";

export const PaymentType = objectType({
  name: "Payment",
  description: "Represents a payment",
  definition(t) {
    t.id("id");
    t.string("refCode", {  description: "A unique identifier (referral code) of the payment" });
    t.string("stripeId", {  description: "Stripe's ID value of the payment" });
    t.boolean("isRefunded", {  description: "A boolean that indicates if the whole payment was refunded" });
    t.field("cart", {
      type: CartType,
      description: "The shopping cart this payment is associated to",
      resolve: o => o.cart,
    });
    t.field("card", {
      type: CardType,
      description: "The credit or debit card this payment is associated to",
      resolve: o => o.card,
    });
    t.field("status", {
      type: PaymentStatusType,
      description: "The status of the payment",
      resolve: o => o.status,
    });
    t.nullable.field("voucherCode", {
      type: PaymentOfferCodeType,
      description: "A coupon or an offer campaign code used, to apply a discount, at this payment",
      resolve: o => o.voucherCode,
    });
    t.nullable.list.field("reservedProducts", {
      type: ReservedProductType,
      description: "A list with all the reserved products of the payment",
      resolve: o => o.reservedProducts,
    });
  },
});

export const AddPaymentType = objectType({
  name: "AddPayment",
  description: "Info to be returned when a payment is created (made)",
  definition(t) {
    t.field("payment", {
      type: PaymentType,
      description: "The payment that is created (made)",
      resolve: o => o.payment,
    });
    t.boolean("added", {
      description: "A boolean that indicates if the payments have been successfully created (made)",
    });
  },
});

export const AddPaymentResult = unionType({
  name: "AddPaymentResult",
  definition(t) {
    t.members("AddPayment", "Error");
  },
  resolveType: item => {
    if (item.name === "Error") {
      return "Error";
    } else {
      return "AddPayment";
    }
  },
});
