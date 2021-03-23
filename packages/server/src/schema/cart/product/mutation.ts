import { COMMON_CONFIG, errors, MyContext } from "@beach_bar/common";
import { DateScalar } from "@the_hashtag/common/dist/graphql";
import { ApolloError } from "apollo-server-express";
import { CartRepository } from "entity/Cart";
import { CartProduct } from "entity/CartProduct";
import { Product } from "entity/Product";
import { HourTime } from "entity/Time";
import { arg, extendType, idArg, intArg, nullable } from "nexus";
import { getConnection, getCustomRepository } from "typeorm";
import { DeleteType } from "typings/.index";
import { AddCartProductType, UpdateCartProductType } from "typings/cart/product";
import { DeleteResult } from "../../types";
import { AddCartProduct, UpdateCartProduct } from "./types";

const QUANTITY_MIN = COMMON_CONFIG.DATA.cartProductQuantity.min;
const QUANTITY_MAX = COMMON_CONFIG.DATA.cartProductQuantity.max;

export const CartProductCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addCartProduct", {
      type: AddCartProduct,
      description: "Add a product to a shopping cart",
      args: {
        cartId: idArg({ description: "The ID value of the shopping cart" }),
        productId: intArg({ description: "The ID value of the product to add" }),
        quantity: nullable(
          intArg({
            description: "The number that indicates how many times to add the product to the cart. Its default value is 1",
            default: 1,
          })
        ),
        timeId: intArg({ description: "The ID value of the hour time of product use" }),
        date: nullable(
          arg({
            type: DateScalar,
            description: "The date to purchase the product. Its default value its the current date",
          })
        ),
      },
      resolve: async (_, { cartId, productId, quantity, date, timeId }, { payload }: MyContext): Promise<AddCartProductType> => {
        if (!cartId || cartId <= 0) {
          throw new ApolloError("Please provide a valid shopping cart", errors.INVALID_ARGUMENTS);
        }
        if (!productId || productId <= 0) {
          throw new ApolloError("Please provide a valid product", errors.INVALID_ARGUMENTS);
        }
        if (quantity && quantity < QUANTITY_MIN) {
          throw new ApolloError("Please provide a valid quantity", errors.INVALID_ARGUMENTS);
        } else if (quantity && quantity > QUANTITY_MAX) {
          throw new ApolloError(`You cannot set the quantity to be over value ${QUANTITY_MAX}`, errors.INVALID_ARGUMENTS);
        }
        if (!timeId || timeId <= 0) {
          throw new ApolloError("Please provide a valid time", errors.INVALID_ARGUMENTS);
        }

        const cart = await getCustomRepository(CartRepository).getOrCreateCart(payload, cartId);
        if (!cart) {
          throw new ApolloError("Please create a new shopping cart", errors.CONFLICT);
        }

        const product = await Product.findOne(productId);
        if (!product) {
          throw new ApolloError("Specified product does not exist", errors.CONFLICT);
        }

        const time = await HourTime.findOne(timeId);
        if (!time) {
          throw new ApolloError("Invalid time", errors.CONFLICT);
        }

        const isAvailable = await product.checkIfAvailable(timeId, date);
        if (!isAvailable) {
          throw new ApolloError("This product or service is not available for date you selected", errors.CONFLICT);
        }

        const newCartProduct = CartProduct.create({
          cart,
          product,
          date,
          time,
          quantity,
        });

        try {
          await newCartProduct.save();
          await cart.reload();
          newCartProduct.cart = cart;
        } catch (err) {
          if (err.message == 'duplicate key value violates unique constraint "cart_product_cart_id_product_id_key"') {
            throw new ApolloError("Product already exists in the shopping cart", errors.CONFLICT);
          }
          throw new ApolloError(`Something went wrong: ${err.message}`, errors.SOMETHING_WENT_WRONG);
        }

        return {
          product: newCartProduct,
          added: true,
        };
      },
    });
    t.field("updateCartProduct", {
      type: UpdateCartProduct,
      description: "Update the quantity of a product in a shopping cart",
      args: {
        cartId: idArg({ description: "The ID value of the shopping cart" }),
        productId: intArg({ description: "The ID value of the product to update its quantity" }),
        quantity: nullable(
          intArg({
            description: "The number that indicates how many times to add the product to the cart",
          })
        ),
      },
      resolve: async (_, { cartId, productId, quantity }): Promise<UpdateCartProductType> => {
        if (!cartId || cartId <= 0) {
          throw new ApolloError("Please provide a valid shopping cart", errors.INVALID_ARGUMENTS);
        }
        if (!productId || productId <= 0) {
          throw new ApolloError("Please provide a valid product", errors.INVALID_ARGUMENTS);
        }
        if (!quantity || quantity < QUANTITY_MIN) {
          throw new ApolloError("Please provide a valid quantity", errors.INVALID_ARGUMENTS);
        } else if (quantity && quantity > QUANTITY_MAX) {
          throw new ApolloError(`You cannot set the quantity to be over value ${QUANTITY_MAX}`, errors.INVALID_ARGUMENTS);
        }

        const cartProduct = await CartProduct.findOne({
          where: { cartId, productId },
          relations: ["cart", "product", "time"],
        });
        if (!cartProduct || cartProduct.product.deletedAt) {
          throw new ApolloError("Specified product does not exist in this shopping cart", errors.CONFLICT);
        }

        try {
          if (quantity > 0 && cartProduct.quantity !== quantity) {
            const isAvailable = await cartProduct.product.checkIfAvailable(cartProduct.timeId, cartProduct.date, quantity);
            if (isAvailable) {
              if (quantity) {
                cartProduct.quantity = quantity;
                await getConnection()
                  .createQueryBuilder()
                  .update(CartProduct)
                  .set({ quantity })
                  .where("cartId = :cartId", { cartId: cartProduct.cartId })
                  .where("productId = :productId", { productId: cartProduct.productId })
                  .execute();
              }
              await cartProduct.cart.reload();
            } else {
              throw new ApolloError(
                `If you update the quantity of the product to ${quantity}, the product wil not be available to be purchased, because it exceeds the limit that the #beach_bar has set for this day or hour`,
                errors.CONFLICT
              );
            }
          }
        } catch (err) {
          throw new ApolloError(`Something went wrong: ${err.message}`, errors.SOMETHING_WENT_WRONG);
        }

        return {
          product: cartProduct,
          updated: true,
        };
      },
    });
    t.field("deleteCartProduct", {
      type: DeleteResult,
      description: "Delete (remove) a product from a shopping cart",
      args: {
        cartId: idArg({ description: "The ID value of the shopping cart" }),
        productId: intArg({ description: "The ID value of the product to delete (remove)" }),
      },
      resolve: async (_, { cartId, productId }): Promise<DeleteType> => {
        if (!cartId || cartId <= 0) {
          throw new ApolloError("Please provide a valid shopping cart", errors.INVALID_ARGUMENTS);
        }
        if (!productId || productId <= 0) {
          throw new ApolloError("Please provide a valid product", errors.INVALID_ARGUMENTS);
        }

        const cartProduct = await CartProduct.findOne({ cartId, productId });
        if (!cartProduct) {
          throw new ApolloError("Specified product does not exist in this shopping cart", errors.CONFLICT);
        }

        try {
          await cartProduct.softRemove();
        } catch (err) {
          throw new ApolloError(`Something went wrong: ${err.message}`, errors.SOMETHING_WENT_WRONG);
        }

        return {
          deleted: true,
        };
      },
    });
  },
});
