"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateReservedProductResult = exports.UpdateReservedProductType = exports.AddReservedProductResult = exports.AddReservedProductType = exports.ReservedProductType = void 0;
const graphql_1 = require("@the_hashtag/common/dist/graphql");
const nexus_1 = require("nexus");
const types_1 = require("../../beach_bar/product/types");
const types_2 = require("../../details/time/types");
const types_3 = require("../types");
exports.ReservedProductType = nexus_1.objectType({
    name: "ReservedProduct",
    description: "Represents a reserved product",
    definition(t) {
        t.field("id", { type: graphql_1.BigIntScalar });
        t.field("date", { type: graphql_1.DateScalar });
        t.boolean("isRefunded", { description: "A boolean that indicates if the product was refunded from the payment" });
        t.field("time", {
            type: types_2.HourTimeType,
            description: "The hour (time) that this product was reserved for",
            resolve: o => o.time,
        });
        t.field("product", {
            type: types_1.ProductType,
            description: "The product that is reserved",
            resolve: o => o.product,
        });
        t.field("payment", {
            type: types_3.PaymentType,
            description: "The payment that this product was reserved by",
            resolve: o => o.payment,
        });
    },
});
exports.AddReservedProductType = nexus_1.objectType({
    name: "AddReservedProduct",
    description: "Info to be returned when a product is marked (added) as a reserved one from a payment",
    definition(t) {
        t.field("reservedProduct", {
            type: exports.ReservedProductType,
            description: "The product that is marked as a reserved one",
            resolve: o => o.reservedProduct,
        });
        t.boolean("added", {
            description: "A boolean that indicates if the product has been successfully marked as a reserved one",
        });
    },
});
exports.AddReservedProductResult = nexus_1.unionType({
    name: "AddReservedProductResult",
    definition(t) {
        t.members("AddReservedProduct", "Error");
    },
    resolveType: item => {
        if (item.name === "Error") {
            return "Error";
        }
        else {
            return "AddReservedProduct";
        }
    },
});
exports.UpdateReservedProductType = nexus_1.objectType({
    name: "UpdateReservedProduct",
    description: "Info to be returned when a reserved product details are updated",
    definition(t) {
        t.field("reservedProduct", {
            type: exports.ReservedProductType,
            description: "The reserved product that is updated",
            resolve: o => o.reservedProduct,
        });
        t.boolean("updated", {
            description: "A boolean that indicates if the reserved product details have been successfully updated",
        });
    },
});
exports.UpdateReservedProductResult = nexus_1.unionType({
    name: "UpdateReservedProductResult",
    definition(t) {
        t.members("UpdateReservedProduct", "Error");
    },
    resolveType: item => {
        if (item.name === "Error") {
            return "Error";
        }
        else {
            return "UpdateReservedProduct";
        }
    },
});
