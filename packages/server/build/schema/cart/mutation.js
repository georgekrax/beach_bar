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
exports.CartCrudMutation = void 0;
const common_1 = require("@beach_bar/common");
const Cart_1 = require("entity/Cart");
const nexus_1 = require("nexus");
const types_1 = require("../types");
exports.CartCrudMutation = nexus_1.extendType({
    type: "Mutation",
    definition(t) {
        t.field("deleteCart", {
            type: types_1.DeleteResult,
            description: "Delete a cart after a transaction. This mutation is also called if the user is not authenticated & closes the browser tab",
            args: {
                cartId: nexus_1.idArg({ description: "The ID values of the shopping cart" }),
            },
            resolve: (_, { cartId }, { payload }) => __awaiter(this, void 0, void 0, function* () {
                if (!cartId || cartId <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid shopping cart" } };
                }
                let cart = undefined;
                if (payload) {
                    cart = yield Cart_1.Cart.findOne({
                        where: { userId: payload.sub },
                        order: {
                            timestamp: "DESC",
                        },
                    });
                }
                else {
                    cart = yield Cart_1.Cart.findOne(cartId);
                }
                if (!cart) {
                    return { error: { code: common_1.errors.CONFLICT, message: "Please create a new shopping cart" } };
                }
                try {
                    yield cart.customSoftRemove();
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
