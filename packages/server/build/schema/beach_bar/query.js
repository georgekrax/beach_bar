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
exports.BeachBarQuery = void 0;
const common_1 = require("@beach_bar/common");
const redisKeys_1 = __importDefault(require("constants/redisKeys"));
const BeachBar_1 = require("entity/BeachBar");
const Payment_1 = require("entity/Payment");
const UserFavoriteBar_1 = require("entity/UserFavoriteBar");
const UserHistory_1 = require("entity/UserHistory");
const uniqby_1 = __importDefault(require("lodash/uniqby"));
const nexus_1 = require("nexus");
const typeorm_1 = require("typeorm");
const types_1 = require("../search/types");
const types_2 = require("./types");
exports.BeachBarQuery = nexus_1.extendType({
    type: "Query",
    definition(t) {
        t.nullable.field("getBeachBar", {
            type: types_2.BeachBarType,
            description: "Get the detail info of a #beach_bar",
            args: {
                beachBarId: nexus_1.intArg({ description: "The ID value of the #beach_bar" }),
                userVisit: nexus_1.nullable(nexus_1.booleanArg({
                    description: "Indicates if to retrieve information for user search. Its default value is set to true",
                    default: true,
                })),
            },
            resolve: (_, { beachBarId, userVisit }, { redis, ipAddr, payload }) => __awaiter(this, void 0, void 0, function* () {
                if (!beachBarId || beachBarId <= 0) {
                    return null;
                }
                const beachBars = (yield redis.lrange(redisKeys_1.default.BEACH_BAR_CACHE_KEY, 0, -1)).map((x) => JSON.parse(x));
                const beachBar = beachBars.find(beachBar => beachBar.id === beachBarId);
                if (!beachBar) {
                    return null;
                }
                if (userVisit) {
                    yield UserHistory_1.UserHistory.create({
                        activityId: common_1.COMMON_CONFIG.HISTORY_ACTIVITY.BEACH_BAR_QUERY_ID,
                        objectId: BigInt(beachBar.id),
                        userId: payload ? payload.sub : undefined,
                        ipAddr,
                    }).save();
                }
                return beachBar;
            }),
        });
        t.nullable.field("checkBeachBarAvailability", {
            type: types_2.BeachBarAvailabilityType,
            description: "Check a #beach_bar's availability",
            args: {
                beachBarId: nexus_1.intArg({ description: "The ID value of the #beach_bar, to check for availability" }),
                availability: nexus_1.nullable(nexus_1.arg({ type: types_1.SearchInputType })),
            },
            resolve: (_, { beachBarId, availability }, { redis }) => __awaiter(this, void 0, void 0, function* () {
                if (!beachBarId || beachBarId <= 0) {
                    return null;
                }
                if (!availability) {
                    return null;
                }
                const { date, timeId } = availability;
                let { adults, children } = availability;
                adults = adults || 0;
                children = children || 0;
                const totalPeople = adults + children !== 0 ? adults + children : undefined;
                const beachBar = yield BeachBar_1.BeachBar.findOne({
                    where: { id: beachBarId },
                    relations: ["products", "products.reservationLimits", "products.reservationLimits.product"],
                });
                if (!beachBar) {
                    return null;
                }
                const { hasAvailability, hasCapacity } = yield beachBar.checkAvailability(redis, date, timeId, totalPeople);
                return {
                    hasAvailability,
                    hasCapacity,
                };
            }),
        });
        t.list.field("getAllBeachBars", {
            type: types_2.BeachBarType,
            description: "A list with all the available #beach_bars",
            resolve: () => __awaiter(this, void 0, void 0, function* () {
                const beachBars = yield BeachBar_1.BeachBar.find({
                    relations: [
                        "owners",
                        "owners.owner",
                        "owners.owner.user",
                        "owners.owner.user.account",
                        "reviews",
                        "restaurants",
                        "restaurants.foodItems",
                        "products",
                        "features",
                        "features.service",
                        "location",
                        "location.country",
                        "location.city",
                        "location.region",
                    ],
                });
                beachBars.forEach(beachBar => (beachBar.features = beachBar.features.filter(feature => !feature.deletedAt)));
                return beachBars;
            }),
        });
        t.list.field("getPersonalizedBeachBars", {
            type: types_2.BeachBarType,
            description: "A list with all the #beach_bars, related to a user or are top selections",
            resolve: (_, __, { payload }) => __awaiter(this, void 0, void 0, function* () {
                const maxLength = parseInt(process.env.USER_PERSONALIZED_BEACH_BARS_LENGTH);
                let userPayments = [];
                const userId = payload === null || payload === void 0 ? void 0 : payload.sub;
                if (payload) {
                    userPayments = yield typeorm_1.getConnection()
                        .getRepository(Payment_1.Payment)
                        .createQueryBuilder("payment")
                        .leftJoinAndSelect("payment.cart", "cart")
                        .leftJoinAndSelect("cart.products", "cartProducts")
                        .leftJoinAndSelect("cartProducts.product", "cartProductsProduct")
                        .leftJoinAndSelect("cartProductsProduct.beachBar", "cartProductsProductBeachBar")
                        .leftJoinAndSelect("cartProductsProductBeachBar.location", "cartProductsProductBeachBarLocation")
                        .leftJoinAndSelect("cartProductsProductBeachBarLocation.city", "cartProductsProductBeachBarLocationCity")
                        .leftJoinAndSelect("cartProductsProductBeachBarLocation.region", "cartProductsProductBeachBarLocationRegion")
                        .where("cart.user_id = :userId", { userId: userId })
                        .orderBy("payment.timestamp", "DESC")
                        .limit(maxLength)
                        .getMany();
                }
                const favouriteBeachBars = yield UserFavoriteBar_1.UserFavoriteBar.find({
                    take: maxLength - userPayments.length,
                    where: userId ? { userId } : undefined,
                    relations: ["beachBar", "beachBar.location", "beachBar.location.city", "beachBar.location.region"],
                });
                const uniqueFavouriteBeachBars = uniqby_1.default(favouriteBeachBars.map(favourite => favourite.beachBar), "id");
                const payments = yield Payment_1.Payment.find({
                    take: maxLength - userPayments.length - (userId ? Math.round((favouriteBeachBars.length * 30) / 100) : 0),
                    order: { timestamp: "DESC" },
                    relations: [
                        "cart",
                        "cart.products",
                        "cart.products.product",
                        "cart.products.product.beachBar",
                        "cart.products.product.beachBar.location",
                        "cart.products.product.beachBar.location.city",
                        "cart.products.product.beachBar.location.region",
                    ],
                });
                const paymentsBeachBars = payments.map(payment => payment.getBeachBars());
                const flatBeachBarArr = paymentsBeachBars.flat();
                const beachBarsPayments = flatBeachBarArr.reduce((obj, b) => {
                    obj[b.id] = ++obj[b.id] || 1;
                    return obj;
                }, {});
                const uniquePaymentsBeachBars = uniqby_1.default(flatBeachBarArr, "id");
                uniquePaymentsBeachBars.sort((a, b) => (beachBarsPayments[a.id] > beachBarsPayments[b.id] ? -1 : 1));
                let finalArr = uniqby_1.default([...uniqueFavouriteBeachBars, ...uniquePaymentsBeachBars], "id");
                if (finalArr.length < maxLength) {
                    const otherBeachBars = yield BeachBar_1.BeachBar.find({
                        where: { id: typeorm_1.Not(typeorm_1.In(finalArr.map(({ id }) => id))) },
                        relations: ["location", "location.city", "location.region"],
                    });
                    finalArr = finalArr.concat(otherBeachBars);
                }
                return finalArr;
            }),
        });
    },
});
