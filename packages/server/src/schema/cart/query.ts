import { errors, MyContext } from "@beach_bar/common";
import { ApolloError } from "apollo-server-errors";
import { UserInputError } from "apollo-server-express";
import { Cart, CartRepository } from "entity/Cart";
import { extendType, idArg, intArg, nullable } from "nexus";
import { getCustomRepository } from "typeorm";
import { CartType } from "./types";

export const CartQuery = extendType({
  type: "Query",
  definition(t) {
    t.float("cartEntryFees", {
      args: {
        cartId: idArg({ description: "The ID values of the shopping cart" }),
        totalPeople: intArg({ description: "How many people will visit the #beach_bar" }),
      },
      resolve: async (_, { cartId, totalPeople }): Promise<number | undefined> => {
        if (!cartId || cartId.trim().length === 0) throw new UserInputError("Please provide a valid cartId");

        const cart = await Cart.findOne({
          where: { id: cartId },
          relations: ["products", "products.product", "products.product.beachBar"],
        });
        if (!cart) throw new ApolloError("Shopping cart was not found");
        return cart.getTotalEntryFees(totalPeople);
      },
    });
    t.boolean("verifyZeroCartTotal", {
      args: { cartId: idArg() },
      resolve: async (_, { cartId }): Promise<boolean | null> => {
        const cart = await Cart.findOne({
          where: { id: cartId },
          relations: ["products", "products.product", "products.product.beachBar"],
        });
        if (!cart) throw new ApolloError("Shopping cart was not found", errors.NOT_FOUND);

        const uniqueBeachBars = cart.getUniqBeachBars();
        if (!uniqueBeachBars) throw new ApolloError(errors.SOMETHING_WENT_WRONG);

        for (let i = 0; i < uniqueBeachBars.length; i++) {
          const beachBar = uniqueBeachBars[i];
          const totalPrice = await cart.getBeachBarTotal(beachBar.id);
          if (totalPrice === undefined) return false;
          const isZeroCartTotal = cart.verifyZeroCartTotal(beachBar);
          return isZeroCartTotal === undefined ? false : isZeroCartTotal;
        }
        return false;
      },
    });
    t.field("cart", {
      type: CartType,
      description: "Get the latest cart of an authenticated user or create one",
      args: { cartId: nullable(idArg({ description: "The ID values of the shopping cart, if it is created previously" })) },
      resolve: async (_, { cartId }, { payload }: MyContext): Promise<Cart> => {
        const cart = await getCustomRepository(CartRepository).getOrCreateCart(payload, cartId, true);
        if (!cart) throw new ApolloError(errors.SOMETHING_WENT_WRONG);
        return cart;
      },
    });
  },
});
