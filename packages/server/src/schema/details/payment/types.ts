import { objectType } from "nexus";

export const PaymentStatusType = objectType({
  name: "PaymentStatus",
  description: "Represents the status of a payment",
  definition(t) {
    t.id("id");
    t.string("status");
  },
});
