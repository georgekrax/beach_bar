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
exports.CartQuery = void 0;
const Cart_1 = require("entity/Cart");
const nexus_1 = require("nexus");
const typeorm_1 = require("typeorm");
const types_1 = require("./types");
exports.CartQuery = nexus_1.extendType({
    type: "Query",
    definition(t) {
        t.nullable.float("getCartEntryFees", {
            args: {
                cartId: nexus_1.nullable(nexus_1.idArg({ description: "The ID values of the shopping cart" })),
            },
            resolve: (_, { cartId }) => __awaiter(this, void 0, void 0, function* () {
                if (!cartId || cartId <= 0) {
                    return undefined;
                }
                const cart = yield Cart_1.Cart.findOne({
                    where: { id: cartId },
                    relations: ["products", "products.product", "products.product.beachBar"],
                });
                if (!cart) {
                    return undefined;
                }
                const cartEntryFeeTotal = yield cart.getBeachBarsEntryFeeTotal();
                return cartEntryFeeTotal;
            }),
        });
        t.nullable.boolean("verifyZeroCartTotal", {
            args: {
                cartId: nexus_1.idArg({ description: "The ID values of the shopping cart" }),
            },
            resolve: (_, { cartId }) => __awaiter(this, void 0, void 0, function* () {
                if (!cartId || cartId <= 0) {
                    return null;
                }
                const cart = yield Cart_1.Cart.findOne({
                    where: { id: cartId },
                    relations: ["products", "products.product", "products.product.beachBar"],
                });
                if (!cart) {
                    return null;
                }
                const uniqueBeachBars = cart.getUniqueBeachBars();
                if (!uniqueBeachBars) {
                    return null;
                }
                for (let i = 0; i < uniqueBeachBars.length; i++) {
                    const beachBar = uniqueBeachBars[i];
                    const totalPrice = yield cart.getBeachBarTotalPrice(beachBar.id);
                    if (totalPrice === undefined) {
                        return null;
                    }
                    const isZeroCartTotal = cart.verifyZeroCartTotal(beachBar);
                    return isZeroCartTotal === undefined ? null : isZeroCartTotal;
                }
                return null;
            }),
        });
        t.nullable.field("getCart", {
            type: types_1.CartType,
            description: "Get the latest cart of an authenticated user or create one",
            args: {
                cartId: nexus_1.nullable(nexus_1.idArg({ description: "The ID values of the shopping cart, if it is created previously" })),
            },
            resolve: (_, { cartId }, { payload }) => __awaiter(this, void 0, void 0, function* () {
                const cart = yield typeorm_1.getCustomRepository(Cart_1.CartRepository).getOrCreateCart(payload, cartId, true);
                if (!cart) {
                    return null;
                }
                return cart;
            }),
        });
    },
});
