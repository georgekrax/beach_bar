import {
  getEntryFees,
  GetEntryFeesInclude,
  getOrCreateCart,
  getUniqBeachBars,
  GetUniqBeachBarsInclude,
  verifyZeroCart,
} from "@/utils/cart";
import { errors } from "@beach_bar/common";
import { ApolloError } from "apollo-server-errors";
import { UserInputError } from "apollo-server-express";
import ms from "ms";
import { extendType, idArg, nullable } from "nexus";
import { CartType } from "./types";

export const CartQuery = extendType({
  type: "Query",
  definition(t) {
    t.float("cartEntryFees", {
      args: {
        cartId: idArg({ description: "The ID values of the shopping cart" }),
        beachBarId: nullable(idArg()),
        // totalPeople: intArg({ description: "How many people will visit the #beach_bar" }),
      },
      resolve: async (_, { cartId, beachBarId }, { prisma }) => {
        if (cartId.toString().trim().length === 0) throw new UserInputError("Please provide a valid cartId");

        const cart = await prisma.cart.findUnique({ where: { id: BigInt(cartId) }, include: GetEntryFeesInclude });
        if (!cart) throw new ApolloError("Shopping cart was not found.");
        return getEntryFees(cart, { beachBarId: beachBarId ? +beachBarId : undefined });
      },
    });
    t.boolean("verifyZeroCartTotal", {
      args: { cartId: idArg() },
      resolve: async (_, { cartId }, { prisma }) => {
        const cart = await prisma.cart.findUnique({ where: { id: BigInt(cartId) }, include: GetUniqBeachBarsInclude });
        if (!cart) throw new ApolloError("Shopping cart was not found", errors.NOT_FOUND);

        const uniqBars = getUniqBeachBars(cart);

        for (let i = 0; i < uniqBars.length; i++) {
          const beachBar = uniqBars[i];
          // const totalPrice = getTotal(cart, { beachBarId: beachBar.id });
          // if (totalPrice) return false;
          return verifyZeroCart({ beachBar });
        }
        return false;
      },
    });
    t.field("cart", {
      type: CartType,
      description: "Get the latest cart of an authenticated user or create one",
      args: { cartId: nullable(idArg({ description: "The ID value of the shopping cart, if it is created previously" })) },
      resolve: async (_, { cartId }, { req, res, payload }) => {
        const idCookie = req.cookies[process.env.CART_COOKIE_NAME];
        const cart = await getOrCreateCart({ payload, cartId: cartId || idCookie, getOnly: false });
        if (!cart) throw new ApolloError(errors.SOMETHING_WENT_WRONG);
        if (!idCookie || String(idCookie) !== String(cart.id)) {
          // TODO: Remove cookie in payment
          res.cookie(process.env.CART_COOKIE_NAME, cart.id, {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            maxAge: ms("2 weeks"),
            sameSite: "strict",
          });
        }
        return cart;
      },
    });
  },
});
