import { DateScalar, errors, MyContext } from "@beach_bar/common";
import { arg, extendType, intArg } from "@nexus/schema";
import { getCustomRepository } from "typeorm";
import { DeleteResult } from "../../types";
import { AddCartProductResult, UpdateCartProductResult } from "./types";
import { AddCartProductType, UpdateCartProductType } from "@typings/cart/product";
import { CartRepository } from "@entity/Cart";
import { Product } from "@entity/Product";
import { HourTime } from "@entity/Time";
import { CartProduct } from "@entity/CartProduct";
import { DeleteType } from "@typings/.index";

export const CartProductCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addCartProduct", {
      type: AddCartProductResult,
      description: "Add a product to a shopping cart",
      nullable: false,
      args: {
        cartId: intArg({ required: true, description: "The ID value of the shopping cart" }),
        productId: intArg({ required: true, description: "The ID value of the product to add" }),
        quantity: intArg({
          required: false,
          description: "The number that indicates how many times to add the product to the cart. Its default value is 1",
          default: 1,
        }),
        timeId: intArg({ required: true, description: "The ID value of the hour time of product use" }),
        date: arg({
          type: DateScalar,
          required: false,
          description: "The date to purchase the product. Its default value its the current date",
        }),
      },
      resolve: async (
        _,
        { cartId, productId, quantity, date, timeId },
        { payload }: MyContext
      ): Promise<AddCartProductType> => {
        if (!cartId || cartId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid shopping cart" } };
        }
        if (!productId || productId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid product" } };
        }
        if (quantity && quantity <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid quantity" } };
        } else if (quantity && quantity > 20) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "You cannot set the quantity to be over value 20" } };
        }
        if (!timeId || timeId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid time" } };
        }

        const cart = await getCustomRepository(CartRepository).getOrCreateCart(payload, cartId);
        if (!cart) {
          return { error: { code: errors.CONFLICT, message: "Please create a new shopping cart" } };
        }

        const product = await Product.findOne(productId);
        if (!product) {
          return { error: { code: errors.CONFLICT, message: "Specified product does not exist" } };
        }

        const time = await HourTime.findOne(timeId);
        if (!time) {
          return { error: { code: errors.CONFLICT, message: "Invalid time" } };
        }

        const isAvailable = await product.checkIfAvailable(timeId, date);
        if (!isAvailable) {
          return { error: { code: errors.CONFLICT, message: "This product or service is not available for date you selected" } };
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
            return { error: { code: errors.CONFLICT, message: "Product already exists in the shopping cart" } };
          }
          return { error: { message: `Something went wrong: ${err.message}` } };
        }

        return {
          product: newCartProduct,
          added: true,
        };
      },
    });
    t.field("updateCartProduct", {
      type: UpdateCartProductResult,
      description: "Update the quantity of a product in a shopping cart",
      nullable: false,
      args: {
        cartId: intArg({ required: true, description: "The ID value of the shopping cart" }),
        productId: intArg({ required: true, description: "The ID value of the product to update its quantity" }),
        quantity: intArg({
          required: false,
          description: "The number that indicates how many times to add the product to the cart",
        }),
      },
      resolve: async (_, { cartId, productId, quantity }): Promise<UpdateCartProductType> => {
        if (!cartId || cartId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid shopping cart" } };
        }
        if (!productId || productId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid product" } };
        }
        if (quantity <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid quantity" } };
        } else if (quantity && quantity > 20) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "You cannot set the quantity to be over value 20" } };
        }

        const cartProduct = await CartProduct.findOne({
          where: { cartId, productId },
          relations: ["cart", "product", "time"],
        });
        if (!cartProduct || cartProduct.product.deletedAt) {
          return { error: { code: errors.CONFLICT, message: "Specified product does not exist in this shopping cart" } };
        }

        try {
          if (quantity > 0 && cartProduct.quantity !== quantity) {
            const isAvailable = await cartProduct.product.checkIfAvailable(cartProduct.timeId, cartProduct.date, quantity);
            if (isAvailable) {
              cartProduct.quantity = quantity;
              await cartProduct.save();
              await cartProduct.cart.reload();
            } else {
              return {
                error: {
                  code: errors.CONFLICT,
                  message: `If you update the quantity of the product to ${quantity}, the product wil not be available to be purchased, because it exceeds the limit that the #beach_bar has set for this day or hour`,
                },
              };
            }
          }
        } catch (err) {
          return { error: { message: `Something went wrong: ${err.message}` } };
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
      nullable: false,
      args: {
        cartId: intArg({ required: true, description: "The ID value of the shopping cart" }),
        productId: intArg({ required: true, description: "The ID value of the product to delete (remove)" }),
      },
      resolve: async (_, { cartId, productId }): Promise<DeleteType> => {
        if (!cartId || cartId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid shopping cart" } };
        }
        if (!productId || productId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid product" } };
        }

        const cartProduct = await CartProduct.findOne({ cartId, productId });
        if (!cartProduct) {
          return { error: { code: errors.CONFLICT, message: "Specified product does not exist in this shopping cart" } };
        }

        try {
          await cartProduct.softRemove();
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
