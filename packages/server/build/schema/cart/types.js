"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartType = void 0;
const schema_1 = require("@nexus/schema");
const types_1 = require("../user/types");
const types_2 = require("./product/types");
const common_1 = require("@georgekrax-hashtag/common");
exports.CartType = schema_1.objectType({
    name: "Cart",
    description: "Represents a shopping cart",
    definition(t) {
        t.field("id", { type: common_1.BigIntScalar, nullable: false });
        t.float("total", { nullable: false });
        t.field("user", {
            type: types_1.UserType,
            description: "The use that has created this shopping cart",
            nullable: true,
            resolve: o => o.user,
        });
        t.list.field("products", {
            type: types_2.CartProductType,
            description: "A list with all the cart products",
            nullable: true,
            resolve: o => o.products,
        });
    },
});
//# sourceMappingURL=types.js.map