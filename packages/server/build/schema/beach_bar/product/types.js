"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductAvailabilityHourType = exports.UpdateProductResult = exports.UpdateProductType = exports.AddProductResult = exports.AddProductType = exports.ProductType = void 0;
const graphql_1 = require("@the_hashtag/common/dist/graphql");
const nexus_1 = require("nexus");
const types_1 = require("../../details/product/types");
const types_2 = require("../../details/time/types");
const types_3 = require("../types");
exports.ProductType = nexus_1.objectType({
    name: "Product",
    description: "Represents a product of a #beach_bar",
    definition(t) {
        t.id("id");
        t.string("name");
        t.nullable.string("description");
        t.float("price");
        t.boolean("isActive");
        t.boolean("isIndividual");
        t.int("maxPeople");
        t.nullable.field("imgUrl", { type: graphql_1.UrlScalar });
        t.field("beachBar", {
            type: types_3.BeachBarType,
            description: "The #beach_bar that provides the product",
            resolve: o => o.beachBar,
        });
        t.field("category", {
            type: types_1.ProductCategoryType,
            description: "The category of the product",
            resolve: o => o.category,
        });
        t.field("updatedAt", { type: graphql_1.DateTimeScalar });
        t.nullable.field("deletedAt", { type: graphql_1.DateTimeScalar });
    },
});
exports.AddProductType = nexus_1.objectType({
    name: "AddProduct",
    description: "Info to be returned when a product is added to a #beach_bar",
    definition(t) {
        t.field("product", {
            type: exports.ProductType,
            description: "The product that is added",
            resolve: o => o.product,
        });
        t.boolean("added", { description: "A boolean that indicates if the product has been successfully added to the #beach_bar" });
    },
});
exports.AddProductResult = nexus_1.unionType({
    name: "AddProductResult",
    definition(t) {
        t.members("AddProduct", "Error");
    },
    resolveType: item => {
        if (item.error) {
            return "Error";
        }
        else {
            return "AddProduct";
        }
    },
});
exports.UpdateProductType = nexus_1.objectType({
    name: "UpdateProduct",
    description: "Info to be returned when a product of a #beach_bar is updated",
    definition(t) {
        t.field("product", {
            type: exports.ProductType,
            description: "The product that is updated",
            resolve: o => o.product,
        });
        t.boolean("updated", { description: "A boolean that indicates if the product has been successfully updated" });
    },
});
exports.UpdateProductResult = nexus_1.unionType({
    name: "UpdateProductResult",
    definition(t) {
        t.members("UpdateProduct", "Error");
    },
    resolveType: item => {
        if (item.error) {
            return "Error";
        }
        else {
            return "UpdateProduct";
        }
    },
});
exports.ProductAvailabilityHourType = nexus_1.objectType({
    name: "ProductAvailabilityHour",
    description: "The info to be returned when checking for a #beach_bar product's availability hour times",
    definition(t) {
        t.field("hourTime", {
            type: types_2.HourTimeType,
            description: "The hour time of a day",
            resolve: o => o.hourTime,
        });
        t.boolean("isAvailable");
    },
});
