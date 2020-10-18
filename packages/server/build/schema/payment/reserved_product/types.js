"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateReservedProductResult = exports.UpdateReservedProductType = exports.AddReservedProductResult = exports.AddReservedProductType = exports.ReservedProductType = void 0;
const common_1 = require("@georgekrax-hashtag/common");
const schema_1 = require("@nexus/schema");
const types_1 = require("../../beach_bar/product/types");
const types_2 = require("../../details/time/types");
const types_3 = require("../types");
exports.ReservedProductType = schema_1.objectType({
    name: "ReservedProduct",
    description: "Represents a reserved product",
    definition(t) {
        t.field("id", { type: common_1.BigIntScalar, nullable: false });
        t.field("date", { type: common_1.DateScalar, nullable: false });
        t.boolean("isRefunded", { nullable: false, description: "A boolean that indicates if the product was refunded from the payment" });
        t.field("time", {
            type: types_2.HourTimeType,
            description: "The hour (time) that this product was reserved for",
            nullable: false,
            resolve: o => o.time,
        });
        t.field("product", {
            type: types_1.ProductType,
            description: "The product that is reserved",
            nullable: false,
            resolve: o => o.product,
        });
        t.field("payment", {
            type: types_3.PaymentType,
            description: "The payment that this product was reserved by",
            nullable: false,
            resolve: o => o.payment,
        });
    },
});
exports.AddReservedProductType = schema_1.objectType({
    name: "AddReservedProduct",
    description: "Info to be returned when a product is marked (added) as a reserved one from a payment",
    definition(t) {
        t.field("reservedProduct", {
            type: exports.ReservedProductType,
            description: "The product that is marked as a reserved one",
            nullable: false,
            resolve: o => o.reservedProduct,
        });
        t.boolean("added", {
            nullable: false,
            description: "A boolean that indicates if the product has been successfully marked as a reserved one",
        });
    },
});
exports.AddReservedProductResult = schema_1.unionType({
    name: "AddReservedProductResult",
    definition(t) {
        t.members("AddReservedProduct", "Error");
        t.resolveType(item => {
            if (item.error) {
                return "Error";
            }
            else {
                return "AddReservedProduct";
            }
        });
    },
});
exports.UpdateReservedProductType = schema_1.objectType({
    name: "UpdateReservedProduct",
    description: "Info to be returned when a reserved product details are updated",
    definition(t) {
        t.field("reservedProduct", {
            type: exports.ReservedProductType,
            description: "The reserved product that is updated",
            nullable: false,
            resolve: o => o.reservedProduct,
        });
        t.boolean("updated", {
            nullable: false,
            description: "A boolean that indicates if the reserved product details have been successfully updated",
        });
    },
});
exports.UpdateReservedProductResult = schema_1.unionType({
    name: "UpdateReservedProductResult",
    definition(t) {
        t.members("UpdateReservedProduct", "Error");
        t.resolveType(item => {
            if (item.error) {
                return "Error";
            }
            else {
                return "UpdateReservedProduct";
            }
        });
    },
});
//# sourceMappingURL=types.js.map