import { getTotal } from "@/utils/cart";
import { resolve } from "@/utils/data";
import { idArg, nullable, objectType, unionType } from "nexus";
import { Payment } from "nexus-prisma";
import { BeachBarType } from "../beach_bar/types";
import { HourTimeType, MonthTimeType } from "../details/time/types";

export const PaymentType = objectType({
  name: Payment.$name,
  description: "Represents a payment",
  definition(t) {
    // t.id("id");
    // t.string("refCode", { description: "A unique identifier (referral code) of the payment" });
    // t.string("stripeId", { description: "Stripe's ID value of the payment" });
    // t.boolean("isRefunded", { description: "A boolean that indicates if the whole payment was refunded" });
    // t.field("cart", { type: CartType, description: "The shopping cart this payment is associated to" });
    // t.field("card", { type: CardType, description: "The credit or debit card this payment is associated to" });
    // t.field("status", { type: PaymentStatusType, description: "The status of the payment" });
    // t.float("stripeProccessingFee");
    // t.float("appFee");
    // t.nullable.field("voucherCode", {
    //   type: PaymentOfferCodeType,
    //   description: "A coupon or an offer campaign code used, to apply a discount, at this payment",
    // });
    // t.nullable.list.field("reservedProducts", {
    //   type: ReservedProductType,
    //   description: "A list with all the reserved products of the payment",
    // });
    // t.field("timestamp", { type: DateTime });
    // t.nullable.field("deletedAt", { type: DateTime });
    t.field(Payment.id);
    t.field(Payment.refCode);
    t.field(Payment.stripeId);
    t.field(Payment.isRefunded);
    t.field(Payment.stripeProccessingFee);
    t.field(Payment.appFee);
    t.field(resolve(Payment.cart));
    t.field(resolve(Payment.card));
    t.field(resolve(Payment.status));
    // t.field(resolve(Payment.couponCode));
    // t.field(resolve(Payment.offerCode));
    t.field(resolve(Payment.reservedProducts));
    t.field(Payment.deletedAt);
    t.field(Payment.timestamp);
    t.nullable.float("total", {
      args: { beachBarId: nullable(idArg()) },
      resolve: (o, { beachBarId }): number | null => {
        const cart = o["cart"];
        if (!cart) return null;
        return getTotal(cart, !beachBarId ? undefined : { beachBarId: +beachBarId }).totalWithEntryFees;
      },
    });
  },
});

export const AddPaymentType = objectType({
  name: "AddPayment",
  description: "Info to be returned when a payment is created (made)",
  definition(t) {
    t.field("payment", { type: PaymentType, description: "The payment that is created (made)" });
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
  resolveType: item => (item["error"] ? "Error" : "AddPayment"),
});

export const VisitType = objectType({
  name: "Visit",
  definition(t) {
    t.boolean("isUpcoming");
    t.boolean("isRefunded");
    t.field("startTime", { type: HourTimeType });
    t.field("endTime", { type: HourTimeType });
    t.date("date");
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
