import { MyContext } from "@beach_bar/common";
import { Cart, CartRepository } from "entity/Cart";
import { extendType, idArg, nullable } from "nexus";
import { getCustomRepository } from "typeorm";
import { CartType } from "./types";

export const CartQuery = extendType({
  type: "Query",
  definition(t) {
    t.nullable.float("getCartEntryFees", {
      args: {
        cartId: nullable(idArg({ description: "The ID values of the shopping cart" })),
      },
      resolve: async (_, { cartId }): Promise<number | undefined> => {
        if (!cartId || cartId <= 0) {
          return undefined;
        }

        const cart = await Cart.findOne({
          where: { id: cartId },
          relations: ["products", "products.product", "products.product.beachBar"],
        });
        if (!cart) {
          return undefined;
        }

        const cartEntryFeeTotal = await cart.getBeachBarsEntryFeeTotal();
        return cartEntryFeeTotal;
      },
    });
    t.nullable.boolean("verifyZeroCartTotal", {
      args: {
        cartId: idArg({ description: "The ID values of the shopping cart" }),
      },
      resolve: async (_, { cartId }): Promise<boolean | null> => {
        if (!cartId || cartId <= 0) {
          return null;
        }

        const cart = await Cart.findOne({
          where: { id: cartId },
          relations: ["products", "products.product", "products.product.beachBar"],
        });
        if (!cart) {
          return null;
        }

        const uniqueBeachBars = cart.getUniqueBeachBars();
        if (!uniqueBeachBars) {
          return null;
        }

        for (let i = 0; i < uniqueBeachBars.length; i++) {
          const beachBar = uniqueBeachBars[i];
          const totalPrice = await cart.getBeachBarTotalPrice(beachBar.id);
          if (totalPrice === undefined) {
            return null;
          }
          const isZeroCartTotal = cart.verifyZeroCartTotal(beachBar);
          return isZeroCartTotal === undefined ? null : isZeroCartTotal;
        }
        return null;
      },
    });
    t.nullable.field("getCart", {
      type: CartType,
      description: "Get the latest cart of an authenticated user or create one",
      args: {
        cartId: nullable(idArg({ description: "The ID values of the shopping cart, if it is created previously" })),
      },
      resolve: async (_, { cartId }, { payload }: MyContext): Promise<Cart | null> => {
        const cart = await getCustomRepository(CartRepository).getOrCreateCart(payload, cartId, true);
        if (!cart) {
          return null;
        }
        return cart;
      },
    });
  },
});
