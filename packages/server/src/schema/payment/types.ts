import { DateScalar, DateTimeScalar } from "@the_hashtag/common/dist/graphql";
import { objectType, unionType } from "nexus";
import { BeachBarType } from "schema/beach_bar/types";
import { HourTimeType, MonthTimeType } from "schema/details/time/types";
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
    t.string("refCode", { description: "A unique identifier (referral code) of the payment" });
    t.string("stripeId", { description: "Stripe's ID value of the payment" });
    t.boolean("isRefunded", { description: "A boolean that indicates if the whole payment was refunded" });
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
    t.field("timestamp", {
      type: DateTimeScalar,
      description: "The timestamp recorded, when the payment was created / paid",
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
    if (item.error) {
      return "Error";
    } else {
      return "AddPayment";
    }
  },
});

export const VisitType = objectType({
  name: "Visit",
  definition(t) {
    t.boolean("isUpcoming");
    t.boolean("isRefunded");
    t.field("time", { type: HourTimeType });
    t.field("date", { type: DateScalar });
    t.field("payment", { type: PaymentType });
  },
});

export const PaymentVisitsType = objectType({
  name: "PaymentVisits",
  description: "Represents a payment as a user's visit",
  definition(t) {
    t.field("beachBar", { type: BeachBarType });
    t.list.field("visits", { type: VisitType });
  },
});

export const PaymentVisitsDatesTypes = objectType({
  name: "PaymentVisitsDates",
  description: "Represents a user's payment visit month and years list",
  definition(t) {
    t.field("month", { type: MonthTimeType });
    t.int("year");
  },
});
