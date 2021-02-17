import { BigIntScalar } from "@the_hashtag/common/dist/graphql";
import { Cart } from "entity/Cart";
import { arg, extendType, nullable } from "nexus";

export const CartQuery = extendType({
  type: "Query",
  definition(t) {
    t.nullable.float("getCartEntryFees", {
      args: {
        cartId: nullable(arg({
          type: BigIntScalar,
          description: "The ID values of the shopping cart",
        })),
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
        cartId: arg({
          type: BigIntScalar,
          description: "The ID values of the shopping cart",
        }),
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
  },
});
