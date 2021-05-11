import { MyContext } from "@beach_bar/common";
import { ApolloError } from "apollo-server-express";
import { Cart } from "entity/Cart";
import { extendType, idArg } from "nexus";
import { TDelete } from "typings/.index";
import { DeleteGraphQlType } from "../types";

export const CartCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("deleteCart", {
      type: DeleteGraphQlType,
      description:
        "Delete a cart after a transaction. This mutation is also called if the user is not authenticated & closes the browser tab",
      args: { cartId: idArg() },
      resolve: async (_, { cartId }, { payload }: MyContext): Promise<TDelete> => {
        let cart: Cart | undefined = undefined;
        if (payload) cart = await Cart.findOne({ where: { userId: payload.sub }, order: { timestamp: "DESC" } });
        else cart = await Cart.findOne(cartId);
        if (!cart) throw new ApolloError("Please create a new shopping cart");

        try {
          await cart.customSoftRemove();
        } catch (err) {
          throw new ApolloError(err.message);
        }

        return { deleted: true };
      },
    });
  },
});
