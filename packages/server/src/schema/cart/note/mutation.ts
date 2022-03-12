import { getOrCreateCart } from "@/utils/cart";
import { errors } from "@beach_bar/common";
import { ApolloError } from "apollo-server-express";
import { extendType, idArg, stringArg } from "nexus";
import { CartNoteType } from "./types";

export const CartNoteCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addCartNote", {
      type: CartNoteType,
      description: "Add a note to a shopping cart's #beach_bar",
      args: {
        body: stringArg({ description: "The text - content of the note for the #beach_bar" }),
        cartId: idArg({ description: "The ID value of the shopping cart" }),
        beachBarId: idArg({ description: "The ID value of the #beach_bar" }),
      },
      resolve: async (_, { body, cartId, beachBarId }, { prisma, payload }) => {
        const cart = await getOrCreateCart({ payload, cartId });
        if (!cart) throw new ApolloError("Please create a new shopping cart", errors.NOT_FOUND);

        if (
          cart.products?.some(({ product }) => product.beachBarId.toString() !== beachBarId.toString()) ||
          cart.foods?.some(({ food }) => food.beachBarId.toString() !== beachBarId.toString())
        ) {
          throw new ApolloError(
            "There is not a product or food from the specified #beach_bar, in this shopping cart",
            errors.INVALID_ARGUMENTS
          );
        }

        try {
          return await prisma.cartNote.create({ data: { cartId: cart.id, beachBarId: +beachBarId, body } });
        } catch (err) {
          if (err.message.includes("cart_note_cart_id_beach_bar_id_key")) {
            throw new ApolloError("Note has already been added in your shopping cart");
          }
          throw new ApolloError(err.message);
        }
      },
    });
    t.field("updateCartNote", {
      type: CartNoteType,
      description: "Update the body of a shopping's cart note",
      args: { id: idArg(), body: stringArg() },
      resolve: async (_, { id, body }, { prisma }) => {
        return await prisma.cartNote.update({ where: { id: BigInt(id) }, data: { body: { set: body } } });
      },
    });
  },
});
