import { BigIntScalar } from "@beach_bar/common";
import { objectType, unionType } from "@nexus/schema";
import { CartType } from "../cart/types";
import { CardType } from "../customer/card/types";
import { PaymentStatusType } from "../details/payment/types";
import { ReservedProductType } from "./reserved_product/types";

export const PaymentType = objectType({
  name: "Payment",
  description: "Represents a payment",
  definition(t) {
    t.field("id", { type: BigIntScalar, nullable: false });
    t.string("refCode", { nullable: false, description: "A unique identifier (referral code) of the payment" });
    t.string("stripeId", { nullable: false, description: "Stripe's ID value of the payment" });
    t.boolean("isRefunded", { nullable: false, description: "A boolean that indicates if the whole payment was refunded" });
    t.field("cart", {
      type: CartType,
      description: "The shopping cart this payment is associated to",
      nullable: false,
      resolve: o => o.cart,
    });
    t.field("card", {
      type: CardType,
      description: "The credit or debit card this payment is associated to",
      nullable: false,
      resolve: o => o.card,
    });
    t.field("status", {
      type: PaymentStatusType,
      description: "The status of the payment",
      nullable: false,
      resolve: o => o.status,
    });
    t.list.field("reservedProducts", {
      type: ReservedProductType,
      description: "A list with all the reserved products of the payment",
      nullable: true,
      resolve: o => o.reservedProducts,
    });
  },
});

export const AddPaymentType = objectType({
  name: "AddPayment",
  description: "Info to be returned when some payments are created (made)",
  definition(t) {
    t.list.field("payments", {
      type: PaymentType,
      description: "The payments that are created (made)",
      nullable: false,
      resolve: o => o.payments,
    });
    t.boolean("added", {
      nullable: false,
      description: "A boolean that indicates if the payments have been successfully created (made)",
    });
  },
});

export const AddPaymentResult = unionType({
  name: "AddPaymentResult",
  definition(t) {
    t.members("AddPayment", "Error");
    t.resolveType(item => {
      if (item.error) {
        return "Error";
      } else {
        return "AddPayment";
      }
    });
  },
});
