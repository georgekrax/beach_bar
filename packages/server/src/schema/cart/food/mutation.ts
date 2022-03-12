import { getOrCreateCart } from "@/utils/cart";
import { errors } from "@beach_bar/common";
import { ApolloError } from "apollo-server-express";
import { extendType, idArg, intArg, nullable } from "nexus";
import { CartFoodType } from "./types";

const DEFAULT_QUANTITY = 1;

export const CartFoodCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addCartFood", {
      type: CartFoodType,
      description: "Add a food to a shopping cart",
      args: {
        cartId: idArg({ description: "The ID value of the shopping cart" }),
        foodId: idArg({ description: "The ID value of the food to add" }),
        quantity: nullable(
          intArg({ description: "The number that indicates how many times to add the food to the cart. Its default value is 1" })
        ),
      },
      resolve: async (_, { cartId, foodId, quantity = DEFAULT_QUANTITY }, { prisma, payload }) => {
        if (quantity && quantity < 0) throw new ApolloError("Please provide a valid quantity", errors.INVALID_ARGUMENTS);
        const cart = await getOrCreateCart({ payload, cartId });
        if (!cart) throw new ApolloError("Please create a new shopping cart", errors.NOT_FOUND);

        const food = await prisma.food.findUnique({ where: { id: BigInt(foodId) }, include: {} });
        if (!food) throw new ApolloError("Food was not found", errors.NOT_FOUND);
        const maxQuantity = food.maxQuantity;
        if (quantity && quantity > maxQuantity) {
          throw new ApolloError(`You cannot purchase more than ${maxQuantity} items of this product`, errors.INVALID_ARGUMENTS);
        }

        if (cart.foods?.some(({ foodId, deletedAt }) => String(foodId) === String(food.id) && !deletedAt)) {
          throw new ApolloError("Food already exists in the shopping cart", errors.CONFLICT);
        }

        try {
          return await prisma.cartFood.create({ data: { cartId: cart.id, foodId: food.id, quantity: quantity || DEFAULT_QUANTITY } });
        } catch (err) {
          if (err.message.includes("cart_food_cart_id_food_id_deleted_at_key")) {
            throw new ApolloError("Food already exists in your shopping cart", errors.CONFLICT);
          }
          throw new ApolloError(err.message);
        }
      },
    });
    t.field("updateCartFood", {
      type: CartFoodType,
      description: "Update the quantity of a food in a shopping cart",
      args: { id: idArg(), quantity: intArg() },
      resolve: async (_, { id, quantity }, { prisma }) => {
        if (quantity <= 0) throw new ApolloError("Please provide a valid quantity", errors.INVALID_ARGUMENTS);

        const cartFood = await prisma.cartFood.findUnique({ where: { id: BigInt(id) }, include: { food: true } });
        if (!cartFood || cartFood.food.deletedAt) {
          throw new ApolloError("Specified food does not exist in this shopping cart", errors.CONFLICT);
        }
        const maxQuantity = cartFood.food.maxQuantity;
        if (quantity && quantity > maxQuantity) {
          throw new ApolloError(`You cannot purchase more than ${maxQuantity} items of this product`, errors.INVALID_ARGUMENTS);
        }

        try {
          if (quantity > 0 && cartFood.quantity !== quantity) {
            return await prisma.cartFood.update({ where: { id: cartFood.id }, data: { quantity: { set: quantity } } });
          }
        } catch (err) {
          throw new ApolloError(err.message);
        }

        return cartFood;
      },
    });
    t.boolean("deleteCartFood", {
      description: "Delete (remove) a food from a shopping cart",
      args: { id: idArg() },
      resolve: async (_, { id }, { prisma }): Promise<boolean> => {
        const cartFood = await prisma.cartFood.findUnique({ where: { id: BigInt(id) } });
        if (!cartFood) throw new ApolloError("Food does not exist in this shopping cart", errors.CONFLICT);

        try {
          // TODO: Fix
          // await cartFood.softRemove();
        } catch (err) {
          throw new ApolloError(err.message);
        }

        return true;
      },
    });
  },
});
