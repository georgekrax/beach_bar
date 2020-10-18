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
exports.checkMinimumProductPrice = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const CurrencyProductPrice_1 = require("entity/CurrencyProductPrice");
exports.checkMinimumProductPrice = (price, category, beachBar, currencyId) => __awaiter(void 0, void 0, void 0, function* () {
    const productPrice = yield CurrencyProductPrice_1.CurrencyProductPrice.findOne({ where: { currencyId }, relations: ["currency"] });
    if (!productPrice) {
        throw new Error("Something went wrong");
    }
    if (!category.zeroPrice && price === 0) {
        throw new Error("You are not allowed to have 0 as a price for this type of product");
    }
    if (!category.whitelist &&
        !beachBar.entryFees.map(entryFee => entryFee.date).some(date => dayjs_1.default(date).isAfter(dayjs_1.default())) &&
        price > productPrice.price) {
        throw new Error("You should set an entry fee for the next days, to have 0 as a price for this type of product");
    }
    if (price < productPrice.price && (!category.zeroPrice || !category.whitelist)) {
        throw new Error(`You are not allowed to have a price lower than ${productPrice.price}${productPrice.currency.symbol} for this type of product`);
    }
});
//# sourceMappingURL=checkMinimumProductPrice.js.map