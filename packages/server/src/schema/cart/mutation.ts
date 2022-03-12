import { Cart } from "@prisma/client";
import { ApolloError } from "apollo-server-express";
import { extendType, idArg } from "nexus";

export const CartCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.boolean("deleteCart", {
      description:
        "Delete a cart after a transaction. This mutation is also called if the user is not authenticated & closes the browser tab",
      args: { cartId: idArg() },
      resolve: async (_, { cartId }, { prisma, payload }) => {
        let cart: Cart | null = null;
        if (payload) cart = await prisma.cart.findFirst({ where: { userId: payload.sub }, orderBy: { timestamp: "desc" } });
        else cart = await prisma.cart.findUnique({ where: { id: BigInt(cartId) } });
        if (!cart) throw new ApolloError("Please create a new shopping cart");

        try {
          // TODO: Fix
          // await cart.customSoftRemove();
        } catch (err) {
          throw new ApolloError(err.message);
        }

        return true;
      },
    });
  },
});
