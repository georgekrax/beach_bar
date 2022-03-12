import { isAuth } from "@/utils/auth";
import { extendType } from "nexus";
import { CardType } from "./types";

export const CustomerCardQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("customerPaymentMethods", {
      type: CardType,
      description: "Get a list with all the payments methods (credit / debit cards) of the current authenticated user",
      resolve: async (_, __, { prisma, payload }) => {
        isAuth(payload);

        return await prisma.card.findMany({ where: { customer: { userId: payload!.sub } } });
      },
    });
  },
});
