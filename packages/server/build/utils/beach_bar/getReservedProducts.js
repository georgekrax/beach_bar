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
exports.getReservedProducts = void 0;
const common_1 = require("@beach_bar/common");
const redisKeys_1 = __importDefault(require("constants/redisKeys"));
const dayjs_1 = __importDefault(require("dayjs"));
exports.getReservedProducts = (redis, beachBar, date, timeId) => __awaiter(void 0, void 0, void 0, function* () {
    const redisReservedProducts = yield redis.lrange(`${redisKeys_1.default.BEACH_BAR_CACHE_KEY}:${beachBar.id}:${redisKeys_1.default.RESERVED_PRODUCT_CACHE_KEY}`, 0, -1);
    let reservedProducts = redisReservedProducts.map(x => JSON.parse(x));
    if (date) {
        reservedProducts = reservedProducts.filter(product => dayjs_1.default(product.date).format(common_1.dayjsFormat.ISO_STRING) === date.format(common_1.dayjsFormat.ISO_STRING));
    }
    if (timeId) {
        reservedProducts = reservedProducts.filter(product => product.timeId === timeId);
    }
    return reservedProducts;
});
//# sourceMappingURL=getReservedProducts.js.map