"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCartProductResult = exports.UpdateCartProductType = exports.AddCartProductResult = exports.AddCartProductType = exports.CartProductType = void 0;
const common_1 = require("@georgekrax-hashtag/common");
const schema_1 = require("@nexus/schema");
const types_1 = require("../../beach_bar/product/types");
const types_2 = require("../../details/time/types");
const types_3 = require("../types");
exports.CartProductType = schema_1.objectType({
    name: "CartProduct",
    description: "Represents a shopping cart with its products",
    definition(t) {
        t.int("quantity", { nullable: false });
        t.field("date", { type: common_1.DateScalar, nullable: false, description: "The date of purchase of the product" });
        t.field("timestamp", { type: common_1.DateTimeScalar, nullable: false });
        t.field("cart", {
            type: types_3.CartType,
            description: "The shopping cart the product is added to",
            nullable: false,
            resolve: o => o.cart,
        });
        t.field("product", {
            type: types_1.ProductType,
            description: "The product that is added to the shopping cart",
            nullable: false,
            resolve: o => o.product,
        });
        t.field("time", {
            type: types_2.HourTimeType,
            description: "The hour of use of the product",
            nullable: false,
            resolve: o => o.time,
        });
    },
});
exports.AddCartProductType = schema_1.objectType({
    name: "AddCartProduct",
    description: "Info to be returned when a product is added to a shopping cart",
    definition(t) {
        t.field("product", {
            type: exports.CartProductType,
            description: "The product that is added to the cart",
            nullable: false,
            resolve: o => o.product,
        });
        t.boolean("added", {
            nullable: false,
            description: "A boolean that indicates if the product has been successfully added to the cart",
        });
    },
});
exports.AddCartProductResult = schema_1.unionType({
    name: "AddCartProductResult",
    definition(t) {
        t.members("AddCartProduct", "Error");
        t.resolveType(item => {
            if (item.error) {
                return "Error";
            }
            else {
                return "AddCartProduct";
            }
        });
    },
});
exports.UpdateCartProductType = schema_1.objectType({
    name: "UpdateCartProduct",
    description: "Info to be returned when a product of a shopping cart is updated",
    definition(t) {
        t.field("product", {
            type: exports.CartProductType,
            description: "The product that is updated",
            nullable: false,
            resolve: o => o.product,
        });
        t.boolean("updated", {
            nullable: false,
            description: "A boolean that indicates if the product has been successfully updated",
        });
    },
});
exports.UpdateCartProductResult = schema_1.unionType({
    name: "UpdateCartProductResult",
    definition(t) {
        t.members("UpdateCartProduct", "Error");
        t.resolveType(item => {
            if (item.error) {
                return "Error";
            }
            else {
                return "UpdateCartProduct";
            }
        });
    },
});
//# sourceMappingURL=types.js.map