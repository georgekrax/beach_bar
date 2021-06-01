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

const { min: QUANTITY_MIN, max: QUANTITY_MAX } = COMMON_CONFIG.DATA.cartProductQuantity;

export const CartProductCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addCartProduct", {
      type: AddCartProduct,
      description: "Add a product to a shopping cart",
      args: {
        cartId: idArg({ description: "The ID value of the shopping cart" }),
        productId: idArg({ description: "The ID value of the product to add" }),
        quantity: nullable(
          intArg({
            description: "The number that indicates how many times to add the product to the cart. Its default value is 1",
            default: 1,
          })
        ),
        date: arg({ type: DateScalar, description: "The date to purchase the product. Its default value its the current date" }),
        timeId: idArg({ description: "The ID value of the hour time of product use" }),
      },
      resolve: async (_, { cartId, productId, quantity, date, timeId }, { payload }: MyContext): Promise<AddCartProductType> => {
        if (quantity && quantity < QUANTITY_MIN) throw new ApolloError("Please provide a valid quantity", errors.INVALID_ARGUMENTS);
        else if (quantity && quantity > QUANTITY_MAX)
          throw new ApolloError(`You cannot set the quantity to be over value ${QUANTITY_MAX}`, errors.INVALID_ARGUMENTS);
        const cart = await getCustomRepository(CartRepository).getOrCreateCart(payload, cartId);
        if (!cart) throw new ApolloError("Please create a new shopping cart", errors.NOT_FOUND);
        const product = await Product.findOne({
          where: { id: productId },
          relations: ["beachBar", "beachBar.products", "beachBar.products.reservationLimits", "beachBar.products.reservedProducts"],
        });
        if (!product) throw new ApolloError("Product was not found", errors.NOT_FOUND);
        if (cart.products?.some(({ productId }) => productId.toString() === product.id.toString()))
          throw new ApolloError("Product already exists in the shopping cart.", errors.CONFLICT);

        const time = await HourTime.findOne(timeId);
        if (!time) throw new ApolloError("Invalid time", errors.NOT_FOUND);

        const isAvailable = product.isAvailable({ date, timeId, elevator: quantity});
        if (!isAvailable)
          throw new ApolloError("This product or service is not available for the date you selected", errors.CONFLICT);

        const newCartProduct = CartProduct.create({ cart, product, date, time, quantity });

        try {
          await newCartProduct.save();
          await cart.reload();
          newCartProduct.cart = cart;
        } catch (err) {
          if (err.message == 'duplicate key value violates unique constraint "cart_product_cart_id_product_id_key"')
            throw new ApolloError("Product already exists in the shopping cart", errors.CONFLICT);
          throw new ApolloError(err.message);
        }

        return { product: newCartProduct, added: true };
      },
    });
    t.field("updateCartProduct", {
      type: UpdateCartProduct,
      description: "Update the quantity of a product in a shopping cart",
      args: { id: idArg(), quantity: nullable(intArg()) },
      resolve: async (_, { id, quantity }): Promise<UpdateCartProductType> => {
        if (!quantity || quantity < QUANTITY_MIN) throw new ApolloError("Please provide a valid quantity", errors.INVALID_ARGUMENTS);
        else if (quantity && quantity > QUANTITY_MAX)
          throw new ApolloError(`You cannot set the quantity to be over value ${QUANTITY_MAX}`, errors.INVALID_ARGUMENTS);

        const cartProduct = await CartProduct.findOne({ where: { id }, relations: ["cart", "product", "time"] });
        if (!cartProduct || cartProduct.product.deletedAt)
          throw new ApolloError("Specified product does not exist in this shopping cart", errors.CONFLICT);

        try {
          if (quantity > 0 && cartProduct.quantity !== quantity) {
            const isAvailable =await  cartProduct.product.isAvailable({
              date: cartProduct.date.toString(),
              timeId: cartProduct.timeId.toString(),
              elevator: quantity
            });
            if (isAvailable) {
              if (quantity) {
                cartProduct.quantity = quantity;
                await getConnection()
                  .createQueryBuilder()
                  .update(CartProduct)
                  .set({ quantity })
                  .where("id = :id", { id: cartProduct.id })
                  .execute();
              }
              await cartProduct.cart.reload();
            } else
              throw new ApolloError(
                `If you update the quantity of the product to ${quantity}, the product wil not be available to be purchased, because it exceeds the limit what the #beach_bar has set for this day and hour`,
                errors.CONFLICT
              );
          }
        } catch (err) {
          throw new ApolloError(err.message);
        }

        return { product: cartProduct, updated: true };
      },
    });
    t.field("deleteCartProduct", {
      type: DeleteResult,
      description: "Delete (remove) a product from a shopping cart",
      args: { id: idArg() },
      resolve: async (_, { id }): Promise<DeleteType> => {
        const cartProduct = await CartProduct.findOne(id);
        if (!cartProduct) throw new ApolloError("Product does not exist in this shopping cart", errors.CONFLICT);

        try {
          await cartProduct.softRemove();
        } catch (err) {
          throw new ApolloError(err.message);
        }

        return { deleted: true };
      },
    });
  },
});
