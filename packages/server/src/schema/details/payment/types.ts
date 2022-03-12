import { objectType } from "nexus";
import { PaymentStatus } from "nexus-prisma";

export const PaymentStatusType = objectType({
  name: PaymentStatus.$name,
  description: "Represents the status of a payment",
  definition(t) {
    t.field(PaymentStatus.id);
    t.field(PaymentStatus.name);
  },
});
