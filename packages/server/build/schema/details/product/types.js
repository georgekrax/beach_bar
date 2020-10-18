"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductCategoryType = exports.BundleProductComponentType = exports.ProductComponentType = void 0;
const common_1 = require("@georgekrax-hashtag/common");
const schema_1 = require("@nexus/schema");
const types_1 = require("../../beach_bar/product/types");
exports.ProductComponentType = schema_1.objectType({
    name: "ProductComponent",
    description: "Represents a component of a #beach_bar product. For example a sunbed.",
    definition(t) {
        t.int("id", { nullable: false });
        t.string("title", { nullable: false });
        t.string("description", { nullable: false });
        t.field("iconUrl", { type: common_1.UrlScalar, nullable: false });
    },
});
exports.BundleProductComponentType = schema_1.objectType({
    name: "BundleProductComponent",
    description: "Represents a #beach_bar product & its components",
    definition(t) {
        t.field("product", {
            type: types_1.ProductType,
            description: "The product of the #beach_bar",
            nullable: false,
            resolve: o => o.product,
        });
        t.field("component", {
            type: exports.ProductComponentType,
            description: "The component of the product",
            nullable: false,
            resolve: o => o.component,
        });
        t.int("quantity", { nullable: false });
    },
});
exports.ProductCategoryType = schema_1.objectType({
    name: "ProductCategory",
    description: "Represents a #beach_bar's product category",
    definition(t) {
        t.int("id", { nullable: false });
        t.string("name", { nullable: false });
        t.string("underscoredName", { nullable: false });
        t.string("description", { nullable: true });
        t.list.field("productComponents", {
            type: exports.ProductComponentType,
            description: "The component of a product",
            nullable: false,
            resolve: o => o.productComponents,
        });
    },
});
//# sourceMappingURL=types.js.map