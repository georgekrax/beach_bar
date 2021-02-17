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
exports.ProductQuery = void 0;
const graphql_1 = require("@the_hashtag/common/dist/graphql");
const Product_1 = require("entity/Product");
const Time_1 = require("entity/Time");
const nexus_1 = require("nexus");
const types_1 = require("./types");
exports.ProductQuery = nexus_1.extendType({
    type: "Query",
    definition(t) {
        t.list.field("hasProductReservationLimit", {
            type: types_1.AvailableProductType,
            description: "Get a list with all the hours this product has reservation limits",
            args: {
                productId: nexus_1.intArg({ description: "The ID value of the product, to search if available" }),
                date: nexus_1.nullable(nexus_1.arg({
                    type: graphql_1.DateScalar,
                    description: "The date to purchase the product. Its default value its the current date",
                })),
            },
            resolve: (_, { productId, date }) => __awaiter(this, void 0, void 0, function* () {
                if (!productId || productId <= 0) {
                    return null;
                }
                if (date && date.toString().trim().length === 0) {
                    return null;
                }
                const product = yield Product_1.Product.findOne(productId);
                if (!product) {
                    return null;
                }
                const hourTimes = yield Time_1.HourTime.find();
                if (!hourTimes) {
                    return null;
                }
                const returnResult = [];
                for (let i = 0; i < hourTimes.length; i++) {
                    const isAvailable = yield product.getReservationLimit(hourTimes[i].id, date);
                    returnResult.push({ hourTime: hourTimes[i], isAvailable: isAvailable ? false : true });
                }
                return returnResult;
            }),
        });
    },
});
