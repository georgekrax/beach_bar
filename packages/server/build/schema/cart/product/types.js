"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCartProductResult = exports.UpdateCartProductType = exports.AddCartProductResult = exports.AddCartProductType = exports.CartProductType = void 0;
const graphql_1 = require("@the_hashtag/common/dist/graphql");
const nexus_1 = require("nexus");
const types_1 = require("../../beach_bar/product/types");
const types_2 = require("../../details/time/types");
const types_3 = require("../types");
exports.CartProductType = nexus_1.objectType({
    name: "CartProduct",
    description: "Represents a shopping cart with its products",
    definition(t) {
        t.int("quantity");
        t.field("date", { type: graphql_1.DateScalar, description: "The date of purchase of the product" });
        t.field("timestamp", { type: graphql_1.DateTimeScalar });
        t.field("cart", {
            type: types_3.CartType,
            description: "The shopping cart the product is added to",
            resolve: o => o.cart,
        });
        t.field("product", {
            type: types_1.ProductType,
            description: "The product that is added to the shopping cart",
            resolve: o => o.product,
        });
        t.field("time", {
            type: types_2.HourTimeType,
            description: "The hour of use of the product",
            resolve: o => o.time,
        });
    },
});
exports.AddCartProductType = nexus_1.objectType({
    name: "AddCartProduct",
    description: "Info to be returned when a product is added to a shopping cart",
    definition(t) {
        t.field("product", {
            type: exports.CartProductType,
            description: "The product that is added to the cart",
            resolve: o => o.product,
        });
        t.boolean("added", {
            description: "A boolean that indicates if the product has been successfully added to the cart",
        });
    },
});
exports.AddCartProductResult = nexus_1.unionType({
    name: "AddCartProductResult",
    definition(t) {
        t.members("AddCartProduct", "Error");
    },
    resolveType: item => {
        if (item.name === "Error") {
            return "Error";
        }
        else {
            return "AddCartProduct";
        }
    },
});
exports.UpdateCartProductType = nexus_1.objectType({
    name: "UpdateCartProduct",
    description: "Info to be returned when a product of a shopping cart is updated",
    definition(t) {
        t.field("product", {
            type: exports.CartProductType,
            description: "The product that is updated",
            resolve: o => o.product,
        });
        t.boolean("updated", {
            description: "A boolean that indicates if the product has been successfully updated",
        });
    },
});
exports.UpdateCartProductResult = nexus_1.unionType({
    name: "UpdateCartProductResult",
    definition(t) {
        t.members("UpdateCartProduct", "Error");
    },
    resolveType: item => {
        if (item.name === "Error") {
            return "Error";
        }
        else {
            return "UpdateCartProduct";
        }
    },
});
