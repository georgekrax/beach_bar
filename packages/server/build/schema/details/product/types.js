"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductCategoryType = exports.BundleProductComponentType = exports.ProductComponentType = void 0;
const graphql_1 = require("@the_hashtag/common/dist/graphql");
const nexus_1 = require("nexus");
const types_1 = require("../../beach_bar/product/types");
exports.ProductComponentType = nexus_1.objectType({
    name: "ProductComponent",
    description: "Represents a component of a #beach_bar product. For example a sunbed.",
    definition(t) {
        t.id("id");
        t.string("title");
        t.string("description");
        t.field("iconUrl", { type: graphql_1.UrlScalar });
    },
});
exports.BundleProductComponentType = nexus_1.objectType({
    name: "BundleProductComponent",
    description: "Represents a #beach_bar product & its components",
    definition(t) {
        t.field("product", {
            type: types_1.ProductType,
            description: "The product of the #beach_bar",
            resolve: o => o.product,
        });
        t.field("component", {
            type: exports.ProductComponentType,
            description: "The component of the product",
            resolve: o => o.component,
        });
        t.int("quantity");
    },
});
exports.ProductCategoryType = nexus_1.objectType({
    name: "ProductCategory",
    description: "Represents a #beach_bar's product category",
    definition(t) {
        t.id("id");
        t.string("name");
        t.string("underscoredName");
        t.nullable.string("description");
        t.list.field("productComponents", {
            type: exports.ProductComponentType,
            description: "The component of a product",
            resolve: o => o.productComponents,
        });
    },
});
