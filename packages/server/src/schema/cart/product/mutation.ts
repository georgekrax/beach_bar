import { getOrCreateCart } from "@/utils/cart";
import { isAvailable, IsAvailableProductInclude } from "@/utils/product";
import { COMMON_CONFIG, errors, TABLES } from "@beach_bar/common";
import { DateScalar } from "@the_hashtag/common/dist/graphql";
import { ApolloError } from "apollo-server-express";
import { arg, extendType, idArg, intArg, nullable } from "nexus";
import { CartProductType } from "./types";

const { min: QUANTITY_MIN, max: QUANTITY_MAX } = COMMON_CONFIG.DATA.cartProductQuantity;
const DEFAULT_QUANTITY = 1;

export const CartProductCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addCartProduct", {
      type: CartProductType,
      description: "Add a product to a shopping cart",
      args: {
        cartId: idArg({ description: "The ID value of the shopping cart" }),
        productId: idArg({ description: "The ID value of the product to add" }),
        quantity: nullable(
          intArg({ description: "The number that indicates how many times to add the product to the cart. Its default value is 1" })
        ),
        date: arg({ type: DateScalar.name, description: "The date to purchase the product. Its default value its the current date" }),
        people: intArg({ description: "The number of people that are going to use the product" }),
        startTimeId: idArg({ description: "The ID value of the starting hour time of product use" }),
        endTimeId: idArg({ description: "The ID value of the ending hour time of product use" }),
      },
      resolve: async (
        _,
        { cartId, productId, quantity = DEFAULT_QUANTITY, date, people, startTimeId, endTimeId },
        { prisma, payload }
      ) => {
        if (quantity && quantity < QUANTITY_MIN) {
          throw new ApolloError("Please provide a valid quantity", errors.INVALID_ARGUMENTS);
        } else if (quantity && quantity > QUANTITY_MAX) {
          throw new ApolloError(`You cannot set the quantity to be over value ${QUANTITY_MAX}`, errors.INVALID_ARGUMENTS);
        }
        const cart = await getOrCreateCart({ payload, cartId });
        if (!cart) throw new ApolloError("Please create a new shopping cart", errors.NOT_FOUND);

        const product = await prisma.product.findUnique({ where: { id: +productId }, include: IsAvailableProductInclude });
        if (!product) throw new ApolloError("Product was not found", errors.NOT_FOUND);
        if (people > product.maxPeople) throw new ApolloError("This product cannot fit " + people + " people");
        if (cart.products?.some(({ productId }) => productId.toString() === product.id.toString())) {
          throw new ApolloError("Product already exists in the shopping cart.", errors.CONFLICT);
        }

        const startTime = TABLES.HOUR_TIME.find(({ id }) => id.toString() === startTimeId.toString());
        if (!startTime) throw new ApolloError("Invalid start time.", errors.NOT_FOUND);

        const endTime = TABLES.HOUR_TIME.find(({ id }) => id.toString() === endTimeId.toString());
        if (!endTime) throw new ApolloError("Invalid end time.", errors.NOT_FOUND);
        
        const hasAvailability = await isAvailable(product, {
          date,
          startTimeId: startTime.id,
          endTimeId: endTime.id,
          elevator: quantity,
        });
        if (!hasAvailability) {
          throw new ApolloError("This product or service is not available for the date you selected", errors.CONFLICT);
        }

        try {
          return await prisma.cartProduct.create({
            data: {
              people,
              cartId: cart.id,
              productId: product.id,
              startTimeId: startTime.id,
              endTimeId: endTime.id,
              date: new Date(date.toString()),
              quantity: quantity || DEFAULT_QUANTITY,
            },
          });
        } catch (err) {
          if (err.message === 'duplicate key value violates unique constraint "cart_product_cart_id_product_id_key"') {
            throw new ApolloError("Product already exists in the shopping cart", errors.CONFLICT);
          }
          throw new ApolloError(err.message);
        }
      },
    });
    t.field("updateCartProduct", {
      type: CartProductType,
      description: "Update the quantity of a product in a shopping cart",
      args: { id: idArg(), quantity: nullable(intArg()) },
      resolve: async (_, { id, quantity }, { prisma }) => {
        if (!quantity || quantity < QUANTITY_MIN) {
          throw new ApolloError("Please provide a valid quantity", errors.INVALID_ARGUMENTS);
        } else if (quantity && quantity > QUANTITY_MAX) {
          throw new ApolloError(`You cannot set the quantity to be over ${QUANTITY_MAX}`, errors.INVALID_ARGUMENTS);
        }

        const cartProduct = await prisma.cartProduct.findUnique({
          where: { id: BigInt(id) },
          include: { product: { include: IsAvailableProductInclude } },
        });
        if (!cartProduct || cartProduct.product.deletedAt) {
          throw new ApolloError("Specified product does not exist in this shopping cart", errors.CONFLICT);
        }

        try {
          if (quantity > 0 && cartProduct.quantity !== quantity) {
            const hasAvailability = await isAvailable(cartProduct.product, {
              ...cartProduct,
              date: cartProduct.date.toString(),
              elevator: Math.abs(quantity - cartProduct.quantity),
            });
            if (hasAvailability) {
              if (quantity) {
                return await prisma.cartProduct.update({ where: { id: cartProduct.id }, data: { quantity: { set: quantity } } });
              }
              // await cartProduct.cart.reload();
            } else {
              throw new ApolloError(
                `If you update the quantity of the product to ${quantity}, the product wil not be available to be purchased, because it exceeds the limit what the #beach_bar has set for this day and hour`,
                errors.CONFLICT
              );
            }
          }
        } catch (err) {
          throw new ApolloError(err.message);
        }

        return cartProduct;
      },
    });
    t.boolean("deleteCartProduct", {
      description: "Delete (remove) a product from a shopping cart",
      args: { id: idArg() },
      resolve: async (_, { id }, { prisma }) => {
        const cartProduct = await prisma.cartProduct.findUnique({ where: { id: BigInt(id) } });
        if (!cartProduct) throw new ApolloError("Product does not exist in this shopping cart", errors.CONFLICT);

        try {
          // TODO: Fix
          // await cartProduct.softRemove();
        } catch (err) {
          throw new ApolloError(err.message);
        }

        return true;
      },
    });
  },
});
