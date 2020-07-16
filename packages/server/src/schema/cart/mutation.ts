import { BigIntScalar, errors, MyContext } from "@beach_bar/common";
import { arg, extendType } from "@nexus/schema";
import { getCustomRepository } from "typeorm";
import { Cart, CartRepository } from "../../entity/Cart";
import { DeleteType, ErrorType } from "../returnTypes";
import { DeleteResult } from "../types";
import { CartType } from "./types";

export const CartCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("getOrCreateCart", {
      type: CartType,
      description: "Get the latest cart of an authenticated user or create one",
      nullable: false,
      args: {
        cartId: arg({
          type: BigIntScalar,
          required: false,
          description: "The ID values of the shopping cart, if it is created previously",
        }),
      },
      resolve: async (_, { cartId }, { payload }: MyContext): Promise<Cart | undefined> => {
        // ! order the products by timestamp in the frontend
        const cart = await getCustomRepository(CartRepository).getOrCreateCart(payload, cartId);
        if (!cart) {
          return undefined;
        }
        return cart;
      },
    });
    t.field("deleteCart", {
      type: DeleteResult,
      description:
        "Delete a cart after a transition. This mutation is also called if the user is not authenticated & closes the browser tab",
      nullable: false,
      args: {
        cartId: arg({ type: BigIntScalar, required: true, description: "The ID values of the shopping cart" }),
      },
      resolve: async (_, { cartId }, { payload }: MyContext): Promise<DeleteType | ErrorType> => {
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
