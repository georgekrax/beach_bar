import { extendType, intArg } from "@nexus/schema";
import { getCustomRepository } from "typeorm";
import { MyContext } from "../../../common/myContext";
import errors from "../../../constants/errors";
import { CartRepository } from "../../../entity/Cart";
import { CartProduct } from "../../../entity/CartProduct";
import { Product } from "../../../entity/Product";
import { DeleteType, ErrorType } from "../../returnTypes";
import { DeleteResult } from "../../types";
import { AddCartProductType, UpdateCartProductType } from "./returnTypes";
import { AddCartProductResult, UpdateCartProductResult } from "./types";

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
      },
      resolve: async (_, { cartId, productId, quantity }, { payload }: MyContext): Promise<AddCartProductType | ErrorType> => {
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

        const cart = await getCustomRepository(CartRepository).getOrCreateCart(payload, cartId);
        if (!cart) {
          return { error: { code: errors.CONFLICT, message: "Please create a new shopping cart" } };
        }

        const product = await Product.findOne(productId);
        if (!product) {
          return { error: { code: errors.CONFLICT, message: "Specified product does not exist" } };
        }

        const newCartProduct = CartProduct.create({
          cart,
          product,
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
      resolve: async (_, { cartId, productId, quantity }): Promise<UpdateCartProductType | ErrorType> => {
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
          relations: ["cart", "product"],
        });
        if (!cartProduct) {
          return { error: { code: errors.CONFLICT, message: "Specified product does not exist in this shopping cart" } };
        }

        try {
          if (quantity > 0 && cartProduct.quantity !== quantity) {
            cartProduct.quantity = quantity;
            await cartProduct.save();
            await cartProduct.cart.reload();
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
      resolve: async (_, { cartId, productId }): Promise<DeleteType | ErrorType> => {
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
