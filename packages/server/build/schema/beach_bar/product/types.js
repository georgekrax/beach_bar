"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductAvailabilityHourType = exports.UpdateProductResult = exports.UpdateProductType = exports.AddProductResult = exports.AddProductType = exports.ProductType = void 0;
const common_1 = require("@georgekrax-hashtag/common");
const schema_1 = require("@nexus/schema");
const types_1 = require("../../details/product/types");
const types_2 = require("../../details/time/types");
const types_3 = require("../types");
exports.ProductType = schema_1.objectType({
    name: "Product",
    description: "Represents a product of a #beach_bar",
    definition(t) {
        t.int("id", { nullable: false });
        t.string("name", { nullable: false });
        t.string("description", { nullable: true });
        t.float("price", { nullable: false });
        t.boolean("isActive", { nullable: false });
        t.boolean("isIndividual", { nullable: false });
        t.int("maxPeople", { nullable: false });
        t.field("imgUrl", { type: common_1.UrlScalar, nullable: true });
        t.field("beachBar", {
            type: types_3.BeachBarType,
            description: "The #beach_bar that provides the product",
            nullable: false,
            resolve: o => o.beachBar,
        });
        t.field("category", {
            type: types_1.ProductCategoryType,
            description: "The category of the product",
            nullable: false,
            resolve: o => o.category,
        });
        t.field("updatedAt", { type: common_1.DateTimeScalar, nullable: false });
        t.field("deletedAt", { type: common_1.DateTimeScalar, nullable: true });
    },
});
exports.AddProductType = schema_1.objectType({
    name: "AddProduct",
    description: "Info to be returned when a product is added to a #beach_bar",
    definition(t) {
        t.field("product", {
            type: exports.ProductType,
            description: "The product that is added",
            nullable: false,
            resolve: o => o.product,
        });
        t.boolean("added", {
            nullable: false,
            description: "A boolean that indicates if the product has been successfully added to the #beach_bar",
        });
    },
});
exports.AddProductResult = schema_1.unionType({
    name: "AddProductResult",
    definition(t) {
        t.members("AddProduct", "Error");
        t.resolveType(item => {
            if (item.error) {
                return "Error";
            }
            else {
                return "AddProduct";
            }
        });
    },
});
exports.UpdateProductType = schema_1.objectType({
    name: "UpdateProduct",
    description: "Info to be returned when a product of a #beach_bar is updated",
    definition(t) {
        t.field("product", {
            type: exports.ProductType,
            description: "The product that is updated",
            nullable: false,
            resolve: o => o.product,
        });
        t.boolean("updated", { nullable: false, description: "A boolean that indicates if the product has been successfully updated" });
    },
});
exports.UpdateProductResult = schema_1.unionType({
    name: "UpdateProductResult",
    definition(t) {
        t.members("UpdateProduct", "Error");
        t.resolveType(item => {
            if (item.error) {
                return "Error";
            }
            else {
                return "UpdateProduct";
            }
        });
    },
});
exports.ProductAvailabilityHourType = schema_1.objectType({
    name: "ProductAvailabilityHour",
    description: "The info to be returned when checking for a #beach_bar product's availability hour times",
    definition(t) {
        t.field("hourTime", {
            type: types_2.HourTimeType,
            description: "The hour time of a day",
            nullable: false,
            resolve: o => o.hourTime,
        });
        t.boolean("isAvailable", { nullable: false });
    },
});
//# sourceMappingURL=types.js.map