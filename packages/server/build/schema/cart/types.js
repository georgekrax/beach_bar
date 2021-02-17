"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartType = void 0;
const graphql_1 = require("@the_hashtag/common/dist/graphql");
const nexus_1 = require("nexus");
const types_1 = require("../user/types");
const types_2 = require("./product/types");
exports.CartType = nexus_1.objectType({
    name: "Cart",
    description: "Represents a shopping cart",
    definition(t) {
        t.field("id", { type: graphql_1.BigIntScalar });
        t.float("total");
        t.nullable.field("user", {
            type: types_1.UserType,
            description: "The use that has created this shopping cart",
            resolve: o => o.user,
        });
        t.nullable.list.field("products", {
            type: types_2.CartProductType,
            description: "A list with all the cart products",
            resolve: o => o.products,
        });
    },
});
