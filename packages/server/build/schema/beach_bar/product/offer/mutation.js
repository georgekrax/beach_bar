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
exports.OfferCampaignCodeCrudMutation = exports.OfferCampaignCrudMutation = exports.CouponCodeCrudMutation = void 0;
const common_1 = require("@beach_bar/common");
const graphql_1 = require("@the_hashtag/common/dist/graphql");
const dayjs_1 = __importDefault(require("dayjs"));
const BeachBar_1 = require("entity/BeachBar");
const CouponCode_1 = require("entity/CouponCode");
const OfferCampaign_1 = require("entity/OfferCampaign");
const OfferCampaignCode_1 = require("entity/OfferCampaignCode");
const Product_1 = require("entity/Product");
const nexus_1 = require("nexus");
const typeorm_1 = require("typeorm");
const checkScopes_1 = require("utils/checkScopes");
const types_1 = require("../../../types");
const types_2 = require("./types");
exports.CouponCodeCrudMutation = nexus_1.extendType({
    type: "Mutation",
    definition(t) {
        t.field("addCouponCode", {
            type: types_2.AddCouponCodeResult,
            description: "Add a coupon code",
            args: {
                title: nexus_1.stringArg({ description: "The name or a short description of the coupon code" }),
                discountPercentage: nexus_1.floatArg({ description: "The percentage of the coupon code discount" }),
                beachBarId: nexus_1.nullable(nexus_1.idArg({ description: "The ID value of the #beach_bar, to apply the coupon code for" })),
                validUntil: nexus_1.arg({
                    type: graphql_1.DateTimeScalar,
                    description: "A timestamp that indicates until what date and time this coupon code is applicable and valid",
                }),
                isActive: nexus_1.booleanArg({
                    description: "Set to true if coupon code is active. Its default value is set to false",
                    default: false,
                }),
                timesLimit: nexus_1.intArg({
                    description: "Represents how many times this coupon code can be used",
                }),
            },
            resolve: (_, { title, discountPercentage, beachBarId, validUntil, isActive, timesLimit }, { payload }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload) {
                    return { error: { code: common_1.errors.NOT_AUTHENTICATED_CODE, message: common_1.errors.NOT_AUTHENTICATED_MESSAGE } };
                }
                if (!checkScopes_1.checkScopes(payload, ["beach_bar@crud:coupon_code"])) {
                    return {
                        error: {
                            code: common_1.errors.UNAUTHORIZED_CODE,
                            message: "You are not allowed to add (issue) a coupon code",
                        },
                    };
                }
                if (!discountPercentage || discountPercentage <= 0 || discountPercentage > 100) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a or some discount percentage" } };
                }
                const newCouponCode = CouponCode_1.CouponCode.create({
                    title,
                    discountPercentage,
                    isActive,
                    validUntil,
                    timesLimit,
                });
                if (beachBarId) {
                    const beachBar = yield BeachBar_1.BeachBar.findOne(beachBarId);
                    if (!beachBar) {
                        return { error: { code: common_1.errors.CONFLICT, message: common_1.errors.BEACH_BAR_DOES_NOT_EXIST } };
                    }
                    newCouponCode.beachBar = beachBar;
                }
                try {
                    yield newCouponCode.save();
                }
                catch (err) {
                    return { error: { message: `${common_1.errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
                }
                return {
                    couponCode: newCouponCode,
                    added: true,
                };
            }),
        });
        t.field("updateCouponCode", {
            type: types_2.UpdateCouponCodeResult,
            description: "Update a coupon code",
            args: {
                couponCodeId: nexus_1.idArg({ description: "The ID value of the coupon code" }),
                title: nexus_1.nullable(nexus_1.stringArg({ description: "The name or a short description of the coupon code" })),
                discountPercentage: nexus_1.nullable(nexus_1.floatArg({ description: "The percentage of the coupon code discount" })),
                validUntil: nexus_1.nullable(nexus_1.arg({
                    type: graphql_1.DateTimeScalar,
                    description: "A timestamp that indicates until what date and time this coupon code is applicable and valid",
                })),
                isActive: nexus_1.nullable(nexus_1.booleanArg({
                    description: "Set to true if coupon code is active. Its default value is set to false",
                })),
                timesLimit: nexus_1.nullable(nexus_1.intArg({
                    description: "Represents how many times this coupon code can be used",
                })),
            },
            resolve: (_, { couponCodeId, title, discountPercentage, validUntil, isActive, timesLimit }, { payload }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload) {
                    return { error: { code: common_1.errors.NOT_AUTHENTICATED_CODE, message: common_1.errors.NOT_AUTHENTICATED_MESSAGE } };
                }
                if (!checkScopes_1.checkScopes(payload, ["beach_bar@crud:coupon_code", "beach_bar@update:coupon_code"])) {
                    return {
                        error: {
                            code: common_1.errors.UNAUTHORIZED_CODE,
                            message: "You are not allowed to update a coupon code",
                        },
                    };
                }
                if (!couponCodeId || couponCodeId <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: common_1.errors.SOMETHING_WENT_WRONG } };
                }
                if (!discountPercentage || discountPercentage <= 0 || discountPercentage > 100) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a or some discount percentage" } };
                }
                const couponCode = yield CouponCode_1.CouponCode.findOne(couponCodeId);
                if (!couponCode) {
                    return { error: { code: common_1.errors.CONFLICT, message: "Specified coupon code does not exist" } };
                }
                try {
                    const updatedCouponCode = yield couponCode.update({
                        title,
                        discountPercentage,
                        validUntil,
                        isActive,
                        timesLimit,
                    });
                    if (updatedCouponCode.deleted) {
                        return {
                            deleted: true,
                        };
                    }
                    return {
                        couponCode: updatedCouponCode,
                        updated: true,
                    };
                }
                catch (err) {
                    return { error: { message: `${common_1.errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
                }
            }),
        });
        t.field("deleteCouponCode", {
            type: types_1.DeleteResult,
            args: {
                couponCodeId: nexus_1.idArg({ description: "The ID value of the coupon code" }),
            },
            resolve: (_, { couponCodeId }, { payload }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload) {
                    return { error: { code: common_1.errors.NOT_AUTHENTICATED_CODE, message: common_1.errors.NOT_AUTHENTICATED_MESSAGE } };
                }
                if (!checkScopes_1.checkScopes(payload, ["beach_bar@crud:coupon_code"])) {
                    return {
                        error: {
                            code: common_1.errors.UNAUTHORIZED_CODE,
                            message: "You are not allowed to delete (invalidate) a coupon code",
                        },
                    };
                }
                if (!couponCodeId || couponCodeId <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: common_1.errors.SOMETHING_WENT_WRONG } };
                }
                const couponCode = yield CouponCode_1.CouponCode.findOne(couponCodeId);
                if (!couponCode) {
                    return { error: { code: common_1.errors.CONFLICT, message: "Specified coupon code does not exist" } };
                }
                try {
                    yield couponCode.softRemove();
                }
                catch (err) {
                    return { error: { message: `${common_1.errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
                }
                return {
                    deleted: true,
                };
            }),
        });
    },
});
exports.OfferCampaignCrudMutation = nexus_1.extendType({
    type: "Mutation",
    definition(t) {
        t.field("addOfferCampaign", {
            type: types_2.AddOfferCampaignResult,
            description: "Add an offer campaign to a #beach_bar",
            args: {
                productIds: nexus_1.list(nexus_1.intArg({ description: "The ID value of the product" })),
                title: nexus_1.stringArg({ description: "The name or a short description of the coupon code" }),
                discountPercentage: nexus_1.floatArg({ description: "The percentage of the coupon code discount" }),
                validUntil: nexus_1.arg({
                    type: graphql_1.DateTimeScalar,
                    description: "A timestamp that indicates until what date and time this coupon code is applicable and valid",
                }),
                isActive: nexus_1.booleanArg({
                    description: "Set to true if coupon code is active. Its default value is set to false",
                    default: false,
                }),
            },
            resolve: (_, { productIds, title, discountPercentage, validUntil, isActive }, { payload }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload) {
                    return { error: { code: common_1.errors.NOT_AUTHENTICATED_CODE, message: common_1.errors.NOT_AUTHENTICATED_MESSAGE } };
                }
                if (!checkScopes_1.checkScopes(payload, ["beach_bar@crud:offer_campaign"])) {
                    return {
                        error: {
                            code: common_1.errors.UNAUTHORIZED_CODE,
                            message: "You are not allowed to add an offer campaign to a #beach_bar",
                        },
                    };
                }
                if (!productIds || productIds.length === 0 || productIds.some(id => id === undefined || id === null)) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a or some valid product(s)" } };
                }
                if (!discountPercentage || discountPercentage <= 0 || discountPercentage > 100) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a or some discount percentage" } };
                }
                const products = yield Product_1.Product.find({ where: { id: typeorm_1.In(productIds) } });
                if (products.some(product => !product.isActive)) {
                    return { error: { message: "All the products should be active, in order to be applied for an offer campaign" } };
                }
                const newOfferCampaign = OfferCampaign_1.OfferCampaign.create({
                    title,
                    discountPercentage,
                    isActive,
                    validUntil,
                    products,
                });
                try {
                    yield newOfferCampaign.save();
                }
                catch (err) {
                    return { error: { message: `${common_1.errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
                }
                return {
                    offerCampaign: newOfferCampaign,
                    added: true,
                };
            }),
        });
        t.field("updateOfferCampaign", {
            type: types_2.UpdateOfferCampaignResult,
            description: "Update the details of an offer campaign of a #beach_bar",
            args: {
                offerCampaignId: nexus_1.idArg({ description: "The ID value of the offer campaign" }),
                productIds: nexus_1.list(nexus_1.nullable(nexus_1.intArg({
                    description: "The ID value of the product",
                }))),
                title: nexus_1.nullable(nexus_1.stringArg({ description: "The name or a short description of the coupon code" })),
                discountPercentage: nexus_1.nullable(nexus_1.floatArg({
                    description: "The percentage of the coupon code discount",
                })),
                validUntil: nexus_1.nullable(nexus_1.arg({
                    type: graphql_1.DateTimeScalar,
                    description: "A timestamp that indicates until what date and time this coupon code is applicable and valid",
                })),
                isActive: nexus_1.nullable(nexus_1.booleanArg({
                    description: "Set to true if coupon code is active. Its default value is set to false",
                })),
            },
            resolve: (_, { offerCampaignId, productIds, title, discountPercentage, validUntil, isActive }, { payload }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload) {
                    return { error: { code: common_1.errors.NOT_AUTHENTICATED_CODE, message: common_1.errors.NOT_AUTHENTICATED_MESSAGE } };
                }
                if (!checkScopes_1.checkScopes(payload, ["beach_bar@crud:offer_campaign", "beach_bar@update:offer_campaign"])) {
                    return {
                        error: {
                            code: common_1.errors.UNAUTHORIZED_CODE,
                            message: "You are not allowed to update an offer campaign of a #beach_bar",
                        },
                    };
                }
                if (!offerCampaignId || offerCampaignId <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: common_1.errors.SOMETHING_WENT_WRONG } };
                }
                if (!discountPercentage || discountPercentage <= 0 || discountPercentage > 100) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a or some discount percentage" } };
                }
                const offerCampaign = yield OfferCampaign_1.OfferCampaign.findOne({ where: { id: offerCampaignId }, relations: ["products"] });
                if (!offerCampaign) {
                    return { error: { code: common_1.errors.CONFLICT, message: "Specified offer campaign does not exist" } };
                }
                if (!offerCampaign.validUntil || validUntil < dayjs_1.default(offerCampaign.validUntil)) {
                    return {
                        error: {
                            message: "You should delete the offer campaign, if you want it to be valid before the datetime you had initially set",
                        },
                    };
                }
                try {
                    const updatedOfferCampaign = yield offerCampaign.update(productIds, title, discountPercentage, validUntil, isActive);
                    return {
                        offerCampaign: updatedOfferCampaign,
                        updated: true,
                    };
                }
                catch (err) {
                    return { error: { message: `${common_1.errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
                }
            }),
        });
        t.field("deleteOfferCampaign", {
            type: types_1.DeleteResult,
            description: "Delete an offer campaign of a #beach_bar",
            args: {
                offerCampaignId: nexus_1.idArg({ description: "The ID value of the offer campaign" }),
            },
            resolve: (_, { offerCampaignId }, { payload }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload) {
                    return { error: { code: common_1.errors.NOT_AUTHENTICATED_CODE, message: common_1.errors.NOT_AUTHENTICATED_MESSAGE } };
                }
                if (!checkScopes_1.checkScopes(payload, ["beach_bar@crud:offer_campaign"])) {
                    return {
                        error: {
                            code: common_1.errors.UNAUTHORIZED_CODE,
                            message: "You are not allowed to delete an offer campaign of a #beach_bar",
                        },
                    };
                }
                if (!offerCampaignId || offerCampaignId <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: common_1.errors.SOMETHING_WENT_WRONG } };
                }
                const offerCampaign = yield OfferCampaign_1.OfferCampaign.findOne(offerCampaignId);
                if (!offerCampaign) {
                    return { error: { code: common_1.errors.CONFLICT, message: "Specified offer campaign does not exist" } };
                }
                try {
                    yield offerCampaign.softRemove();
                }
                catch (err) {
                    return { error: { message: `${common_1.errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
                }
                return {
                    deleted: true,
                };
            }),
        });
    },
});
exports.OfferCampaignCodeCrudMutation = nexus_1.extendType({
    type: "Mutation",
    definition(t) {
        t.field("addOfferCampaignCode", {
            type: types_2.AddOfferCampaignCodeResult,
            description: "Add (issue) a new offer code",
            args: {
                offerCampaignId: nexus_1.idArg({ description: "The ID value of the offer campaign" }),
            },
            resolve: (_, { offerCampaignId }, { payload }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload) {
                    return { error: { code: common_1.errors.NOT_AUTHENTICATED_CODE, message: common_1.errors.NOT_AUTHENTICATED_MESSAGE } };
                }
                if (!checkScopes_1.checkScopes(payload, ["beach_bar@crud:offer_campaign"])) {
                    return {
                        error: {
                            code: common_1.errors.UNAUTHORIZED_CODE,
                            message: "You are not allowed to add (issue) a new offer code",
                        },
                    };
                }
                const offerCampaign = yield OfferCampaign_1.OfferCampaign.findOne({ where: { id: offerCampaignId }, relations: ["products"] });
                if (!offerCampaign) {
                    return { error: { code: common_1.errors.CONFLICT, message: "Specified offer campaign does not exist" } };
                }
                if (dayjs_1.default(offerCampaign.validUntil) < dayjs_1.default()) {
                    return { error: { code: common_1.errors.CONFLICT, message: "Specified offer campaign has expired" } };
                }
                const newOfferCode = OfferCampaignCode_1.OfferCampaignCode.create({ campaign: offerCampaign });
                try {
                    yield newOfferCode.save();
                }
                catch (err) {
                    return { error: { message: `${common_1.errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
                }
                return {
                    offerCode: newOfferCode,
                    added: true,
                };
            }),
        });
        t.field("deleteOfferCode", {
            type: types_1.DeleteResult,
            description: "Delete (invalidate) an offer code of an offer campaign",
            args: {
                offerCodeId: nexus_1.idArg({ description: "The ID value of the offer campaign" }),
            },
            resolve: (_, { offerCodeId }, { payload }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload) {
                    return { error: { code: common_1.errors.NOT_AUTHENTICATED_CODE, message: common_1.errors.NOT_AUTHENTICATED_MESSAGE } };
                }
                if (!checkScopes_1.checkScopes(payload, ["beach_bar@crud:offer_campaign"])) {
                    return {
                        error: {
                            code: common_1.errors.UNAUTHORIZED_CODE,
                            message: "You are not allowed to delete an offer code of an offer campaign",
                        },
                    };
                }
                if (!offerCodeId || offerCodeId <= 0) {
                    return { error: { code: common_1.errors.INTERNAL_SERVER_ERROR, message: common_1.errors.SOMETHING_WENT_WRONG } };
                }
                const offerCode = yield OfferCampaignCode_1.OfferCampaignCode.findOne(offerCodeId);
                if (!offerCode) {
                    return { error: { code: common_1.errors.CONFLICT, message: "Specified offer code does not exist" } };
                }
                try {
                    yield offerCode.softRemove();
                }
                catch (err) {
                    return { error: { message: `${common_1.errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
                }
                return {
                    deleted: true,
                };
            }),
        });
    },
});
