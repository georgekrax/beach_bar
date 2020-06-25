import { extendType, intArg } from "@nexus/schema";
import { IsNull } from "typeorm";
import { MyContext } from "../../common/myContext";
import errors from "../../constants/errors";
import { Cart } from "../../entity/Cart";
import { User } from "../../entity/User";
import { createCart } from "../../utils/cart/createCart";
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
        cartId: intArg({ required: false }),
      },
      resolve: async (_, { cartId }, { payload }: MyContext): Promise<Cart | undefined> => {
        // ! order the products by timestamp in the frontend
        if (payload && payload.sub) {
          const cart = await Cart.findOne({
            where: { userId: payload.sub },
            order: {
              timestamp: "DESC",
            },
            relations: ["user", "products", "products.product"],
          });
          if (!cart) {
            const user = await User.findOne(payload.sub);
            if (!user) {
              return undefined;
            }
            const cart = await createCart(user);
            if (!cart) {
              return undefined;
            }
            return cart;
          }
          return cart;
        }
        if (cartId) {
          const cart = await Cart.findOne({
            where: { id: cartId },
            relations: ["user", "products", "products.product"],
          });
          if (!cart) {
            const cart = await createCart();
            if (!cart) {
              return undefined;
            }
            return cart;
          }
          return cart;
        } else {
          const cart = await createCart();
          if (!cart) {
            return undefined;
          }
          return cart;
        }
      },
    });
    t.field("deleteCart", {
      type: DeleteResult,
      description:
        "Delete a cart after a transition. This mutation is also called if the user is not authenticated & closes the browser tab",
      nullable: false,
      args: {
        cartId: intArg({ required: true }),
      },
      resolve: async (_, { cartId }, { payload }: MyContext): Promise<DeleteType | ErrorType> => {
        if (!cartId || cartId.toString().trim().length === 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid shopping cart" } };
        }

        let user: User | undefined = undefined;
        if (payload && payload.sub) {
          user = await User.findOne(payload.sub);
          if (!user) {
            return { error: { code: errors.CONFLICT, message: errors.SOMETHING_WENT_WRONG } };
          }
        }

        const cart = await Cart.findOne({ where: { id: cartId, userId: user ? user.id : IsNull() } });
        if (!cart) {
          return { error: { code: errors.CONFLICT, message: "Please create a new shopping cart" } };
        }

        try {
          await cart.softRemove();
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
