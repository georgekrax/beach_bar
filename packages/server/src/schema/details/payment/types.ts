import { objectType } from "@nexus/schema";

export const PaymentStatusType = objectType({
  name: "PaymentStatus",
  description: "Represents the status of a payment",
  definition(t) {
    t.int("id", { nullable: false });
    t.string("status", { nullable: false });
  },
});
