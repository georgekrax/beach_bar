import { BigIntScalar } from "@beach_bar/common";
import { arg, extendType } from "@nexus/schema";
import { Cart } from "../../entity/Cart";

export const CartQuery = extendType({
  type: "Query",
  definition(t) {
    t.float("getCartEntryFees", {
      nullable: true,
      args: {
        cartId: arg({
          type: BigIntScalar,
          required: false,
          description: "The ID values of the shopping cart",
        }),
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
    t.boolean("verifyZeroCartTotal", {
      nullable: true,
      args: {
        cartId: arg({
          type: BigIntScalar,
          required: true,
          description: "The ID values of the shopping cart",
        }),
      },
      resolve: async (_, { cartId }): Promise<boolean | undefined> => {
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

        const uniqueBeachBars = cart.getUniqueBeachBars();
        if (!uniqueBeachBars) {
          return undefined;
        }

        for (let i = 0; i < uniqueBeachBars.length; i++) {
          const beachBar = uniqueBeachBars[i];
          const totalPrice = await cart.getBeachBarTotalPrice(beachBar.id);
          if (totalPrice === undefined) {
            return undefined;
          }
          const isZeroCartTotal = cart.verifyZeroCartTotal(beachBar);
          return isZeroCartTotal;
        }
      },
    });
  },
});
