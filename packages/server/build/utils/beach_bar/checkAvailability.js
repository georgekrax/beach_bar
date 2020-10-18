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
exports.checkAvailability = void 0;
const getReservationLimits_1 = require("./getReservationLimits");
const getReservedProducts_1 = require("./getReservedProducts");
exports.checkAvailability = (redis, beachBar, date, timeId, totalPeople) => __awaiter(void 0, void 0, void 0, function* () {
    const reservedProducts = yield getReservedProducts_1.getReservedProducts(redis, beachBar, date, timeId);
    const reservationLimits = getReservationLimits_1.getReservationLimits(beachBar, date, timeId);
    if (!reservationLimits || reservationLimits.length === 0) {
        return {
            hasAvailability: true,
            hasCapacity: true,
        };
    }
    else {
        const totalDateLimit = reservationLimits.reduce((sum, i) => {
            return sum + i.limitNumber;
        }, 0);
        const hasAvailability = reservedProducts.length < totalDateLimit;
        let hasCapacity = undefined;
        if (totalPeople) {
            const reservedProductsPeople = reservedProducts.reduce((sum, i) => sum + i.product.maxPeople, 0);
            const nonReservedProducts = totalDateLimit - reservedProducts.length;
            const reservationLimitsPeople = reservationLimits.reduce((sum, i) => sum + i.product.maxPeople, 0) * nonReservedProducts;
            hasCapacity = reservationLimitsPeople - reservedProductsPeople > totalPeople;
        }
        return {
            hasAvailability,
            hasCapacity,
        };
    }
});
//# sourceMappingURL=checkAvailability.js.map