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
exports.checkVoucherCode = void 0;
const common_1 = require("@beach_bar/common");
const _index_1 = require("constants/_index");
const dayjs_1 = __importDefault(require("dayjs"));
const CouponCode_1 = require("entity/CouponCode");
const OfferCampaignCode_1 = require("entity/OfferCampaignCode");
exports.checkVoucherCode = (refCode) => __awaiter(void 0, void 0, void 0, function* () {
    if (refCode.trim().length === _index_1.voucherCodeLength.COUPON_CODE) {
        const couponCode = yield CouponCode_1.CouponCode.findOne({ refCode });
        if (!couponCode) {
            return { error: { error: { code: common_1.errors.CONFLICT, message: common_1.errors.INVALID_REF_CODE_MESSAGE } } };
        }
        if (!couponCode.isActive || dayjs_1.default(couponCode.validUntil) < dayjs_1.default()) {
            return { error: { error: { code: common_1.errors.INVALID_PRODUCT_OFFER_CODE, message: common_1.errors.INVALID_REF_CODE_MESSAGE } } };
        }
        if (couponCode.timesLimit && couponCode.timesUsed >= couponCode.timesLimit) {
            return {
                error: { error: { code: common_1.errors.INVALID_PRODUCT_OFFER_CODE, message: "You have exceeded the times of use of a coupon code" } },
            };
        }
        return {
            couponCode,
        };
    }
    else if (refCode.trim().length === _index_1.voucherCodeLength.OFFER_CAMPAIGN_CODE) {
        const offerCode = yield OfferCampaignCode_1.OfferCampaignCode.findOne({ where: { refCode }, relations: ["campaign", "campaign.products"] });
        if (!offerCode) {
            return { error: { error: { code: common_1.errors.CONFLICT, message: common_1.errors.INVALID_REF_CODE_MESSAGE } } };
        }
        if (dayjs_1.default(offerCode.campaign.validUntil) < dayjs_1.default() || !offerCode.campaign.isActive) {
            return { error: { error: { code: common_1.errors.INVALID_PRODUCT_OFFER_CODE, message: common_1.errors.INVALID_REF_CODE_MESSAGE } } };
        }
        return {
            offerCode,
        };
    }
    else {
        return { error: { error: { code: common_1.errors.INVALID_PRODUCT_OFFER_CODE, message: common_1.errors.INVALID_REF_CODE_MESSAGE } } };
    }
});
//# sourceMappingURL=checkVoucherCode.js.map