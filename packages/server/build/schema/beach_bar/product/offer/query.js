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
exports.VoucherCoderQuery = void 0;
const common_1 = require("@beach_bar/common");
const common_2 = require("@georgekrax-hashtag/common");
const schema_1 = require("@nexus/schema");
const BeachBar_1 = require("entity/BeachBar");
const CouponCode_1 = require("entity/CouponCode");
const OfferCampaignCode_1 = require("entity/OfferCampaignCode");
const checkScopes_1 = require("utils/checkScopes");
const checkVoucherCode_1 = require("utils/checkVoucherCode");
const types_1 = require("./types");
exports.VoucherCoderQuery = schema_1.extendType({
    type: "Query",
    definition(t) {
        t.field("getVoucherCode", {
            type: types_1.VoucherCodeQueryResult,
            description: "Get the product offer or coupon, based on its referral code",
            nullable: true,
            args: {
                refCode: schema_1.stringArg({
                    required: true,
                    description: "The referral code of the product offer or coupon",
                }),
            },
            resolve: (_, { refCode }) => __awaiter(this, void 0, void 0, function* () {
                if (!refCode || refCode.trim().length === 0) {
                    return { error: { code: common_1.errors.INTERNAL_SERVER_ERROR, message: "Invalid coupon code" } };
                }
                const res = yield checkVoucherCode_1.checkVoucherCode(refCode);
                if (res.couponCode) {
                    return res.couponCode;
                }
                else if (res.offerCode) {
                    return res.offerCode;
                }
                return res.error;
            }),
        });
        t.list.field("getBeachBarOfferCampaigns", {
            type: types_1.OfferCampaignType,
            description: "Get a list with all the offer campaigns of a #beach_bar",
            nullable: true,
            args: {
                beachBarId: schema_1.intArg({
                    required: true,
                    description: "The ID value of the #beach_bar",
                }),
            },
            resolve: (_, { beachBarId }) => __awaiter(this, void 0, void 0, function* () {
                if (!beachBarId || beachBarId <= 0) {
                    return null;
                }
                const beachBar = yield BeachBar_1.BeachBar.findOne({
                    where: { id: beachBarId },
                    relations: ["products", "products.offerCampaigns", "products.offerCampaigns.products"],
                });
                if (!beachBar) {
                    return null;
                }
                const result = [];
                beachBar.products.map(product => { var _a; return (_a = product.offerCampaigns) === null || _a === void 0 ? void 0 : _a.forEach(campaign => result.push(campaign)); });
                return result;
            }),
        });
        t.field("revealCouponCode", {
            type: types_1.CouponCodeRevealResult,
            description: "Get a coupon's code details & its referral code",
            nullable: false,
            args: {
                couponCodeId: schema_1.arg({
                    type: common_2.BigIntScalar,
                    required: true,
                    description: "The ID value of the coupon code",
                }),
            },
            resolve: (_, { couponCodeId }, { payload }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload) {
                    return { error: { code: common_1.errors.NOT_AUTHENTICATED_CODE, message: common_1.errors.NOT_AUTHENTICATED_MESSAGE } };
                }
                if (!checkScopes_1.checkScopes(payload, ["beach_bar@crud:coupon_code"])) {
                    return {
                        error: {
                            code: common_1.errors.UNAUTHORIZED_CODE,
                            message: "You are not allowed to retrieve the referral code of a coupon",
                        },
                    };
                }
                const couponCode = yield CouponCode_1.CouponCode.findOne(couponCodeId);
                if (!couponCode) {
                    return { error: { code: common_1.errors.CONFLICT, message: "Specified coupon code does not exist" } };
                }
                return couponCode;
            }),
        });
        t.field("revealOfferCampaignCode", {
            type: types_1.OfferCampaignCodeRevealResult,
            description: "Get an offer's campaign code details + its referral code",
            nullable: false,
            args: {
                offerCampaignCodeId: schema_1.arg({
                    type: common_2.BigIntScalar,
                    required: true,
                    description: "The ID value of the offer campaign code",
                }),
            },
            resolve: (_, { offerCampaignCodeId }, { payload }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload) {
                    return { error: { code: common_1.errors.NOT_AUTHENTICATED_CODE, message: common_1.errors.NOT_AUTHENTICATED_MESSAGE } };
                }
                if (!checkScopes_1.checkScopes(payload, ["beach_bar@crud:offer_campaign"])) {
                    return {
                        error: {
                            code: common_1.errors.UNAUTHORIZED_CODE,
                            message: "You are not allowed to retrieve the referral code of an offer campaign code",
                        },
                    };
                }
                const offerCampaignCode = yield OfferCampaignCode_1.OfferCampaignCode.findOne(offerCampaignCodeId);
                if (!offerCampaignCode) {
                    return { error: { code: common_1.errors.CONFLICT, message: "Specified offer campaign code does not exist" } };
                }
                return offerCampaignCode;
            }),
        });
    },
});
//# sourceMappingURL=query.js.map