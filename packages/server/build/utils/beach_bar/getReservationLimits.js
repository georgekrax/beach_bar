"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReservationLimits = void 0;
const common_1 = require("@beach_bar/common");
const dayjs_1 = __importDefault(require("dayjs"));
exports.getReservationLimits = (beachBar, date, timeId) => {
    if (beachBar.products.some(product => product.reservationLimits && product.reservationLimits.length > 0)) {
        let reservationLimits = beachBar.products
            .filter(product => product !== undefined && product !== null)
            .flatMap(product => product.reservationLimits);
        if (reservationLimits.length === 0) {
            return [];
        }
        if (date) {
            reservationLimits = reservationLimits.filter((limit) => dayjs_1.default(limit.date).format(common_1.dayjsFormat.ISO_STRING) === date.format(common_1.dayjsFormat.ISO_STRING));
        }
        if (timeId) {
            reservationLimits = reservationLimits.filter(limit => limit.startTimeId >= timeId && limit.endTimeId <= timeId);
        }
        return reservationLimits;
    }
    return undefined;
};
//# sourceMappingURL=getReservationLimits.js.map