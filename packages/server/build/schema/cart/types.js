"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartType = void 0;
const nexus_1 = require("nexus");
const types_1 = require("../user/types");
const types_2 = require("./product/types");
const types_3 = require("../types");
exports.CartType = nexus_1.objectType({
    name: "Cart",
    description: "Represents a shopping cart",
    definition(t) {
        t.implements(types_3.Node);
        t.float("total");
        t.nullable.field("user", {
            type: types_1.UserType,
            description: "The use that has created this shopping cart",
            resolve: o => o.user,
        });
        t.nullable.list.field("products", {
            type: types_2.CartProduct,
            description: "A list with all the cart products",
            resolve: o => o.products,
        });
    },
});
