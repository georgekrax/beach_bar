"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductReservationLimitCrudMutation = void 0;
const common_1 = require("@beach_bar/common");
const common_2 = require("@georgekrax-hashtag/common");
const schema_1 = require("@nexus/schema");
const Product_1 = require("entity/Product");
const ProductReservationLimit_1 = require("entity/ProductReservationLimit");
const Time_1 = require("entity/Time");
const typeorm_1 = require("typeorm");
const checkScopes_1 = require("utils/checkScopes");
const types_1 = require("../../../types");
const types_2 = require("./types");
exports.ProductReservationLimitCrudMutation = schema_1.extendType({
    type: "Mutation",
    definition(t) {
        t.field("addProductReservationLimit", {
            type: types_2.AddProductReservationLimitResult,
            description: "Add a reservation limit to a #beach_bar product",
            nullable: false,
            args: {
                productId: schema_1.intArg({ required: true, description: "The ID value of the product to add this reservation limit" }),
                limit: schema_1.intArg({
                    required: true,
                    description: "The number to add as a limit a #beach_bar can provide the product, for specific date(s)",
                }),
                dates: schema_1.arg({ type: common_2.DateScalar, required: true, list: true, description: "A list of days this limit is applicable for" }),
                startTimeId: schema_1.intArg({ required: true, description: "The ID value of the hour time from when this limit is applicable" }),
                endTimeId: schema_1.intArg({
                    required: true,
                    description: "The ID value of the hour time from when this limit is terminated (is not applicable anymore)",
                }),
            },
            resolve: (_, { productId, limit, dates, startTimeId, endTimeId }, { payload }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload) {
                    return { error: { code: common_1.errors.NOT_AUTHENTICATED_CODE, message: common_1.errors.NOT_AUTHENTICATED_MESSAGE } };
                }
                if (!checkScopes_1.checkScopes(payload, ["beach_bar@crud:beach_bar", "beach_bar@crud:product_reservation_limit"])) {
                    return {
                        error: {
                            code: common_1.errors.UNAUTHORIZED_CODE,
                            message: "You are not allowed to add a or some reservation limit(s) for a #beach_bar product",
                        },
                    };
                }
                if (!dates || dates.length === 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provided a valid limit date" } };
                }
                const product = yield Product_1.Product.findOne({ where: { id: productId }, relations: ["beachBar"] });
                if (!product) {
                    return { error: { code: common_1.errors.CONFLICT, message: "Specified product does not exist" } };
                }
                const startTime = yield Time_1.HourTime.findOne(startTimeId);
                if (!startTime) {
                    return { error: { code: common_1.errors.CONFLICT, message: "Invalid start time of the limit" } };
                }
                const endTime = yield Time_1.HourTime.findOne(endTimeId);
                if (!endTime) {
                    return { error: { code: common_1.errors.CONFLICT, message: "Invalid end time of the limit" } };
                }
                const returnResults = [];
                try {
                    for (let i = 0; i < dates.length; i++) {
                        const newReservationLimit = ProductReservationLimit_1.ProductReservationLimit.create({
                            limitNumber: limit,
                            product,
                            date: dates[i],
                            startTime,
                            endTime,
                        });
                        yield newReservationLimit.save();
                        returnResults.push(newReservationLimit);
                    }
                    yield product.beachBar.updateRedis();
                }
                catch (err) {
                    return { error: { message: `${common_1.errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
                }
                return {
                    reservationLimit: returnResults,
                    added: true,
                };
            }),
        });
        t.field("updateProductReservationLimit", {
            type: types_2.UpdateProductReservationLimitResult,
            description: "Update a #beach_bar's product reservation limit",
            nullable: false,
            args: {
                reservationLimitIds: schema_1.arg({
                    type: common_2.BigIntScalar,
                    required: true,
                    list: true,
                    description: "A list with all the reservation limits to update",
                }),
                limit: schema_1.intArg({
                    required: false,
                    description: "The number to add as a limit a #beach_bar can provide the product, for specific date(s)",
                }),
                startTimeId: schema_1.intArg({ required: false, description: "The ID value of the hour time from when this limit is applicable" }),
                endTimeId: schema_1.intArg({
                    required: false,
                    description: "The ID value of the hour time from when this limit is terminated (is not applicable anymore)",
                }),
            },
            resolve: (_, { reservationLimitIds, limit, startTimeId, endTimeId }, { payload }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload) {
                    return { error: { code: common_1.errors.NOT_AUTHENTICATED_CODE, message: common_1.errors.NOT_AUTHENTICATED_MESSAGE } };
                }
                if (!checkScopes_1.checkScopes(payload, [
                    "beach_bar@crud:beach_bar",
                    "beach_bar@crud:product_reservation_limit",
                    "beach_bar@update:product_reservation_limit",
                ])) {
                    return {
                        error: {
                            code: common_1.errors.UNAUTHORIZED_CODE,
                            message: "You are not allowed to update a reservation limit for a #beach_bar product",
                        },
                    };
                }
                if (!reservationLimitIds || reservationLimitIds.length === 0 || reservationLimitIds.some(limit => limit <= 0)) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a or some valid reservation limit(s)" } };
                }
                const reservationLimits = yield ProductReservationLimit_1.ProductReservationLimit.find({
                    where: { id: typeorm_1.In(reservationLimitIds) },
                    relations: ["startTime", "endTime", "product", "product.beachBar"],
                });
                if (!reservationLimits || reservationLimits.filter(limit => !limit.product.deletedAt).length === 0) {
                    return { error: { code: common_1.errors.CONFLICT, message: "Specified reservation limit(s) do not exist" } };
                }
                try {
                    const updatedReservationLimits = [];
                    for (let i = 0; i < reservationLimits.length; i++) {
                        const updatedReservationLimit = yield reservationLimits[i].update(limit, startTimeId, endTimeId);
                        updatedReservationLimits.push(updatedReservationLimit);
                    }
                    if (updatedReservationLimits.length === 0) {
                        return { error: { message: common_1.errors.SOMETHING_WENT_WRONG } };
                    }
                    return {
                        reservationLimit: updatedReservationLimits,
                        updated: true,
                    };
                }
                catch (err) {
                    return { error: { message: `${common_1.errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
                }
            }),
        });
        t.field("deleteProductReservationLimit", {
            type: types_1.DeleteResult,
            description: "Delete a or some reservation limit(s) from a #beach_bar's product",
            nullable: false,
            args: {
                reservationLimitIds: schema_1.arg({
                    type: common_2.BigIntScalar,
                    required: true,
                    list: true,
                    description: "A list with all the reservation limits to delete",
                }),
            },
            resolve: (_, { reservationLimitIds }, { payload }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload) {
                    return { error: { code: common_1.errors.NOT_AUTHENTICATED_CODE, message: common_1.errors.NOT_AUTHENTICATED_MESSAGE } };
                }
                if (!checkScopes_1.checkScopes(payload, ["beach_bar@crud:beach_bar", "beach_bar@crud:product_reservation_limit"])) {
                    return {
                        error: {
                            code: common_1.errors.UNAUTHORIZED_CODE,
                            message: "You are not allowed to delete a or some reservation limit(s) from a #beach_bar product",
                        },
                    };
                }
                if (!reservationLimitIds || reservationLimitIds.length === 0 || reservationLimitIds.some(limit => limit <= 0)) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a or some valid reservation limit(s)" } };
                }
                const reservationLimits = yield ProductReservationLimit_1.ProductReservationLimit.find({
                    where: { id: typeorm_1.In(reservationLimitIds) },
                    relations: ["product", "product.beachBar"],
                });
                if (!reservationLimits) {
                    return { error: { code: common_1.errors.CONFLICT, message: "Specified reservation limit(s) do not exist" } };
                }
                try {
                    reservationLimits.forEach((limit) => __awaiter(this, void 0, void 0, function* () { return yield limit.softRemove(); }));
                }
                catch (err) {
                    return { error: { message: `${common_1.errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
                }
                return {
                    deleted: true,
                };
            }),
        });
    },
});
//# sourceMappingURL=mutation.js.map