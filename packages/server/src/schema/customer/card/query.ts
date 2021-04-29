import { errors, MyContext } from "@beach_bar/common";
import { ApolloError } from "apollo-server-express";
import { Card } from "entity/Card";
import { User } from "entity/User";
import { extendType } from "nexus";
import { CardType } from "./types";

export const CustomerCardQuery = extendType({
  type: "Query",
  definition(t) {
    t.nullable.list.field("getCustomerPaymentMethods", {
      type: CardType,
      description: "Get a list with all the payments methods (credit / debit cards) of the current authenticated user",
      resolve: async (_, __, { payload }: MyContext): Promise<Card[] | null> => {
        if (!payload || !payload.sub) return null;

        const user = await User.findOne({
          where: { id: payload.sub },
          relations: ["customer", "customer.cards", "customer.cards.customer", "customer.cards.brand", "customer.cards.country"],
        });
        if (!user) throw new ApolloError(errors.USER_NOT_FOUND_MESSAGE, errors.NOT_FOUND);
        if (!user.customer) return [];

        return user.customer.cards || [];
      },
    });
  },
});