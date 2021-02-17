"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartProductCrudMutation = void 0;
const common_1 = require("@beach_bar/common");
const graphql_1 = require("@the_hashtag/common/dist/graphql");
const Cart_1 = require("entity/Cart");
const CartProduct_1 = require("entity/CartProduct");
const Product_1 = require("entity/Product");
const Time_1 = require("entity/Time");
const nexus_1 = require("nexus");
const typeorm_1 = require("typeorm");
const types_1 = require("../../types");
const types_2 = require("./types");
exports.CartProductCrudMutation = nexus_1.extendType({
    type: "Mutation",
    definition(t) {
        t.field("addCartProduct", {
            type: types_2.AddCartProductResult,
            description: "Add a product to a shopping cart",
            args: {
                cartId: nexus_1.intArg({ description: "The ID value of the shopping cart" }),
                productId: nexus_1.intArg({ description: "The ID value of the product to add" }),
                quantity: nexus_1.nullable(nexus_1.intArg({
                    description: "The number that indicates how many times to add the product to the cart. Its default value is 1",
                    default: 1,
                })),
                timeId: nexus_1.intArg({ description: "The ID value of the hour time of product use" }),
                date: nexus_1.nullable(nexus_1.arg({
                    type: graphql_1.DateScalar,
                    description: "The date to purchase the product. Its default value its the current date",
                })),
            },
            resolve: (_, { cartId, productId, quantity, date, timeId }, { payload }) => __awaiter(this, void 0, void 0, function* () {
                if (!cartId || cartId <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid shopping cart" } };
                }
                if (!productId || productId <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid product" } };
                }
                if (quantity && quantity <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid quantity" } };
                }
                else if (quantity && quantity > 20) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "You cannot set the quantity to be over value 20" } };
                }
                if (!timeId || timeId <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid time" } };
                }
                const cart = yield typeorm_1.getCustomRepository(Cart_1.CartRepository).getOrCreateCart(payload, cartId);
                if (!cart) {
                    return { error: { code: common_1.errors.CONFLICT, message: "Please create a new shopping cart" } };
                }
                const product = yield Product_1.Product.findOne(productId);
                if (!product) {
                    return { error: { code: common_1.errors.CONFLICT, message: "Specified product does not exist" } };
                }
                const time = yield Time_1.HourTime.findOne(timeId);
                if (!time) {
                    return { error: { code: common_1.errors.CONFLICT, message: "Invalid time" } };
                }
                const isAvailable = yield product.checkIfAvailable(timeId, date);
                if (!isAvailable) {
                    return { error: { code: common_1.errors.CONFLICT, message: "This product or service is not available for date you selected" } };
                }
                const newCartProduct = CartProduct_1.CartProduct.create({
                    cart,
                    product,
                    date,
                    time,
                    quantity,
                });
                try {
                    yield newCartProduct.save();
                    yield cart.reload();
                    newCartProduct.cart = cart;
                }
                catch (err) {
                    if (err.message == 'duplicate key value violates unique constraint "cart_product_cart_id_product_id_key"') {
                        return { error: { code: common_1.errors.CONFLICT, message: "Product already exists in the shopping cart" } };
                    }
                    return { error: { message: `Something went wrong: ${err.message}` } };
                }
                return {
                    product: newCartProduct,
                    added: true,
                };
            }),
        });
        t.field("updateCartProduct", {
            type: types_2.UpdateCartProductResult,
            description: "Update the quantity of a product in a shopping cart",
            args: {
                cartId: nexus_1.intArg({ description: "The ID value of the shopping cart" }),
                productId: nexus_1.intArg({ description: "The ID value of the product to update its quantity" }),
                quantity: nexus_1.nullable(nexus_1.intArg({
                    description: "The number that indicates how many times to add the product to the cart",
                })),
            },
            resolve: (_, { cartId, productId, quantity }) => __awaiter(this, void 0, void 0, function* () {
                if (!cartId || cartId <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid shopping cart" } };
                }
                if (!productId || productId <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid product" } };
                }
                if (quantity <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid quantity" } };
                }
                else if (quantity && quantity > 20) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "You cannot set the quantity to be over value 20" } };
                }
                const cartProduct = yield CartProduct_1.CartProduct.findOne({
                    where: { cartId, productId },
                    relations: ["cart", "product", "time"],
                });
                if (!cartProduct || cartProduct.product.deletedAt) {
                    return { error: { code: common_1.errors.CONFLICT, message: "Specified product does not exist in this shopping cart" } };
                }
                try {
                    if (quantity > 0 && cartProduct.quantity !== quantity) {
                        const isAvailable = yield cartProduct.product.checkIfAvailable(cartProduct.timeId, cartProduct.date, quantity);
                        if (isAvailable) {
                            cartProduct.quantity = quantity;
                            yield cartProduct.save();
                            yield cartProduct.cart.reload();
                        }
                        else {
                            return {
                                error: {
                                    code: common_1.errors.CONFLICT,
                                    message: `If you update the quantity of the product to ${quantity}, the product wil not be available to be purchased, because it exceeds the limit that the #beach_bar has set for this day or hour`,
                                },
                            };
                        }
                    }
                }
                catch (err) {
                    return { error: { message: `Something went wrong: ${err.message}` } };
                }
                return {
                    product: cartProduct,
                    updated: true,
                };
            }),
        });
        t.field("deleteCartProduct", {
            type: types_1.DeleteResult,
            description: "Delete (remove) a product from a shopping cart",
            args: {
                cartId: nexus_1.intArg({ description: "The ID value of the shopping cart" }),
                productId: nexus_1.intArg({ description: "The ID value of the product to delete (remove)" }),
            },
            resolve: (_, { cartId, productId }) => __awaiter(this, void 0, void 0, function* () {
                if (!cartId || cartId <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid shopping cart" } };
                }
                if (!productId || productId <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid product" } };
                }
                const cartProduct = yield CartProduct_1.CartProduct.findOne({ cartId, productId });
                if (!cartProduct) {
                    return { error: { code: common_1.errors.CONFLICT, message: "Specified product does not exist in this shopping cart" } };
                }
                try {
                    yield cartProduct.softRemove();
                }
                catch (err) {
                    return { error: { message: `Something went wrong: ${err.message}` } };
                }
                return {
                    deleted: true,
                };
            }),
        });
    },
});
