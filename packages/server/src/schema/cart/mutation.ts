import { errors, MyContext } from "@beach_bar/common";
import { Cart } from "entity/Cart";
import { extendType, idArg } from "nexus";
import { DeleteType } from "typings/.index";
import { DeleteResult } from "../types";

export const CartCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("deleteCart", {
      type: DeleteResult,
      description:
        "Delete a cart after a transaction. This mutation is also called if the user is not authenticated & closes the browser tab",
      args: {
        cartId: idArg({ description: "The ID values of the shopping cart" }),
      },
      resolve: async (_, { cartId }, { payload }: MyContext): Promise<DeleteType> => {
        if (!cartId || cartId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid shopping cart" } };
        }

        let cart: Cart | undefined = undefined;
        if (payload) {
          cart = await Cart.findOne({
            where: { userId: payload.sub },
            order: {
              timestamp: "DESC",
            },
          });
        } else {
          cart = await Cart.findOne(cartId);
        }
        if (!cart) {
          return { error: { code: errors.CONFLICT, message: "Please create a new shopping cart" } };
        }

        try {
          await cart.customSoftRemove();
        } catch (err) {
          return { error: { message: `Something went wrong: ${err.message}` } };
        }

        return {
          deleted: true,
        };
      },
    });
  },
});
