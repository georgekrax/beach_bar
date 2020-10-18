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
const common_1 = require("@georgekrax-hashtag/common");
const schema_1 = require("@nexus/schema");
const Cart_1 = require("entity/Cart");
exports.CartQuery = schema_1.extendType({
    type: "Query",
    definition(t) {
        t.float("getCartEntryFees", {
            nullable: true,
            args: {
                cartId: schema_1.arg({
                    type: common_1.BigIntScalar,
                    required: false,
                    description: "The ID values of the shopping cart",
                }),
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
        t.boolean("verifyZeroCartTotal", {
            nullable: true,
            args: {
                cartId: schema_1.arg({
                    type: common_1.BigIntScalar,
                    required: true,
                    description: "The ID values of the shopping cart",
                }),
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
    },
});
//# sourceMappingURL=query.js.map