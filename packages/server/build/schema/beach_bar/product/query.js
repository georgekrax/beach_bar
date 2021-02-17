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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductCrudQuery = void 0;
const graphql_1 = require("@the_hashtag/common/dist/graphql");
const dayjs_1 = __importDefault(require("dayjs"));
const Product_1 = require("entity/Product");
const nexus_1 = require("nexus");
const checkScopes_1 = require("utils/checkScopes");
const types_1 = require("./types");
exports.ProductCrudQuery = nexus_1.extendType({
    type: "Query",
    definition(t) {
        t.nullable.list.field("getBeachBarProducts", {
            type: types_1.ProductType,
            description: "Get all products of a #beach_bar",
            args: {
                beachBarId: nexus_1.intArg({ description: "The ID values of the #beach_bar, to get its products" }),
                isActive: nexus_1.nullable(nexus_1.booleanArg({
                    description: "A boolean that indicates to retrieve only active products",
                    default: true,
                })),
                isDeleted: nexus_1.nullable(nexus_1.booleanArg({
                    description: "A boolean that indicates to retrieve deleted products too. Its default value is set to false",
                    default: false,
                })),
            },
            resolve: (_, { beachBarId, isActive, isDeleted }, { payload }) => __awaiter(this, void 0, void 0, function* () {
                if (!beachBarId || beachBarId <= 0) {
                    return null;
                }
                if (payload && checkScopes_1.checkScopes(payload, ["beach_bar@crud:beach_bar", "beach_bar@crud:product"])) {
                    const products = yield Product_1.Product.find({
                        where: {
                            beachBarId,
                            isActive,
                        },
                        relations: ["beachBar", "category", "category.productComponents"],
                        withDeleted: isDeleted,
                    });
                    if (!products) {
                        return null;
                    }
                    return products;
                }
                const products = yield Product_1.Product.find({
                    where: { beachBarId, isActive: true },
                    relations: ["beachBar", "category", "category.productComponents"],
                });
                return products;
            }),
        });
        t.nullable.list.field("getProductAvailabilityHours", {
            type: types_1.ProductAvailabilityHourType,
            description: "Retrieve (get) a list with all the available hour times of a product",
            args: {
                productId: nexus_1.intArg({ description: "The ID value of the #beach_bar product" }),
                date: nexus_1.arg({
                    type: graphql_1.DateScalar,
                    description: "The date to search availability for",
                }),
            },
            resolve: (_, { productId, date }) => __awaiter(this, void 0, void 0, function* () {
                if (!productId || productId <= 0 || !date || date.add(1, "day") <= dayjs_1.default()) {
                    return null;
                }
                const product = yield Product_1.Product.findOne({
                    where: { id: productId },
                    relations: ["beachBar", "beachBar.openingTime", "beachBar.closingTime"],
                });
                if (!product) {
                    return null;
                }
                const res = yield product.getHoursAvailability(date);
                if (!res) {
                    return null;
                }
                return res;
            }),
        });
        t.nullable.int("getProductAvailabilityQuantity", {
            args: {
                productId: nexus_1.intArg({ description: "The ID value of the #beach_bar product" }),
                date: nexus_1.arg({
                    type: graphql_1.DateScalar,
                    description: "The date to search availability for",
                }),
                timeId: nexus_1.intArg({ description: "The ID value of the hour time to search availability for" }),
            },
            resolve: (_, { productId, date, timeId }) => __awaiter(this, void 0, void 0, function* () {
                if (!productId || productId <= 0 || !date || date.add(1, "day") <= dayjs_1.default() || !timeId || timeId <= 0) {
                    return null;
                }
                const product = yield Product_1.Product.findOne({
                    where: { id: productId },
                    relations: ["beachBar", "beachBar.openingTime", "beachBar.closingTime"],
                });
                if (!product) {
                    return null;
                }
                const res = yield product.getQuantityAvailability(date, timeId);
                if (res === null) {
                    return null;
                }
                return res;
            }),
        });
    },
});
