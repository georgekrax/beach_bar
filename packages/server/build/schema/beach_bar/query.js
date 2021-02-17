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
const redisKeys_1 = __importDefault(require("constants/redisKeys"));
const _index_1 = require("constants/_index");
const BeachBar_1 = require("entity/BeachBar");
const UserHistory_1 = require("entity/UserHistory");
const nexus_1 = require("nexus");
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
                        activityId: _index_1.historyActivity.BEACH_BAR_QUERY_ID,
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
        t.nullable.list.field("getAllBeachBars", {
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
                    ],
                });
                beachBars.forEach(beachBar => (beachBar.features = beachBar.features.filter(feature => !feature.deletedAt)));
                return beachBars;
            }),
        });
    },
});
