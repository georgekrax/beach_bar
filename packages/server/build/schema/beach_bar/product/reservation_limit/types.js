"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailableProductType = exports.UpdateProductReservationLimitResult = exports.UpdateProductReservationLimitType = exports.AddProductReservationLimitResult = exports.AddProductReservationLimitType = exports.ProductReservationLimitType = void 0;
const common_1 = require("@georgekrax-hashtag/common");
const schema_1 = require("@nexus/schema");
const types_1 = require("../../../details/time/types");
const types_2 = require("../types");
exports.ProductReservationLimitType = schema_1.objectType({
    name: "ProductReservationLimit",
    description: "Represents a the limit number, on how many times a product can be provided by a #beach_bar on a specific date",
    definition(t) {
        t.field("id", { type: common_1.BigIntScalar, nullable: false });
        t.int("limitNumber", { nullable: false });
        t.field("date", { type: common_1.DateScalar, nullable: false, description: "The date this limit is applicable for the product" });
        t.field("product", {
            type: types_2.ProductType,
            description: "The product this limit is assigned to",
            nullable: false,
            resolve: o => o.product,
        });
        t.field("startTime", {
            type: types_1.HourTimeType,
            description: "The hour that this limit is applicable for",
            nullable: false,
            resolve: o => o.startTime,
        });
        t.field("endTime", {
            type: types_1.HourTimeType,
            description: "The hour that this limit ends",
            nullable: false,
            resolve: o => o.endTime,
        });
    },
});
exports.AddProductReservationLimitType = schema_1.objectType({
    name: "AddProductReservationLimit",
    description: "Info to be returned when a reservation limit is added to a #beach_bar's product",
    definition(t) {
        t.list.field("reservationLimit", {
            type: exports.ProductReservationLimitType,
            description: "The reservation limit that is added",
            nullable: false,
            resolve: o => o.reservationLimit,
        });
        t.boolean("added", {
            nullable: false,
            description: "A boolean that indicates if the limit has been successfully added to the product",
        });
    },
});
exports.AddProductReservationLimitResult = schema_1.unionType({
    name: "AddProductReservationLimitResult",
    definition(t) {
        t.members("AddProductReservationLimit", "Error");
        t.resolveType(item => {
            if (item.error) {
                return "Error";
            }
            else {
                return "AddProductReservationLimit";
            }
        });
    },
});
exports.UpdateProductReservationLimitType = schema_1.objectType({
    name: "UpdateProductReservationLimit",
    description: "Info to be returned when a reservation limit of a #beach_bar's product is updated",
    definition(t) {
        t.list.field("reservationLimit", {
            type: exports.ProductReservationLimitType,
            description: "The reservation limit that is updated",
            nullable: false,
            resolve: o => o.reservationLimit,
        });
        t.boolean("updated", {
            nullable: false,
            description: "A boolean that indicates if the limit details has been successfully updated",
        });
    },
});
exports.UpdateProductReservationLimitResult = schema_1.unionType({
    name: "UpdateProductReservationLimitResult",
    definition(t) {
        t.members("UpdateProductReservationLimit", "Error");
        t.resolveType(item => {
            if (item.error) {
                return "Error";
            }
            else {
                return "UpdateProductReservationLimit";
            }
        });
    },
});
exports.AvailableProductType = schema_1.objectType({
    name: "AvailableProduct",
    description: "Info to be returned, when checking if a #beach_bar product is available",
    definition(t) {
        t.field("hourTime", {
            type: types_1.HourTimeType,
            description: "The hour (time), to check if available",
            nullable: false,
            resolve: o => o.hourTime,
        });
        t.boolean("isAvailable", {
            nullable: false,
            description: "A boolean that indicates if the product is available in the hour time",
        });
    },
});
//# sourceMappingURL=types.js.map