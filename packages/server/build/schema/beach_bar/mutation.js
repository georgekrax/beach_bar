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
exports.BeachBarUpdateStatusMutation = exports.BeachBarCrudMutation = void 0;
const common_1 = require("@beach_bar/common");
const redisKeys_1 = __importDefault(require("constants/redisKeys"));
const BeachBar_1 = require("entity/BeachBar");
const BeachBarCategory_1 = require("entity/BeachBarCategory");
const Currency_1 = require("entity/Currency");
const User_1 = require("entity/User");
const nexus_1 = require("nexus");
const checkScopes_1 = require("utils/checkScopes");
const types_1 = require("../types");
const types_2 = require("./types");
exports.BeachBarCrudMutation = nexus_1.extendType({
    type: "Mutation",
    definition(t) {
        t.field("addBeachBar", {
            type: types_2.AddBeachBarResult,
            description: "Add (register) a new #beach_bar to the platform",
            args: {
                name: nexus_1.stringArg({ description: "The name to register the #beach_bar. It should be unique among other ones" }),
                description: nexus_1.nullable(nexus_1.stringArg({ description: "A description of the #beach_bar" })),
                thumbnailUrl: nexus_1.nullable(nexus_1.stringArg({ description: "A thumbnail URL value of the #beach_bar's image to show in search results" })),
                contactPhoneNumber: nexus_1.stringArg({ description: "A phone number to contact the #beach_bar directly" }),
                hidePhoneNumber: nexus_1.booleanArg({
                    description: "A boolean that indicates if to NOT display the phone number when retrieving #beach_bar info. Its default value is set to false",
                    default: false,
                }),
                zeroCartTotal: nexus_1.booleanArg({
                    description: "Set to true if the #beach_bar accepts for a customer / user to have less than the #beach_bar minimum currency price",
                }),
                categoryId: nexus_1.intArg({ description: "The ID value of the category of the #beach_bar" }),
                openingTimeId: nexus_1.intArg({ description: "The ID value of the opening quarter time of the #beach_bar, in its country time zone" }),
                closingTimeId: nexus_1.intArg({ description: "The ID value of the closing quarter time of the #beach_bar, in its country time zone" }),
                code: nexus_1.stringArg({ description: "The response code from Google's OAuth callback" }),
                state: nexus_1.stringArg({ description: "The response state, to check if everything went correct" }),
            },
            resolve: (_, { name, description, thumbnailUrl, contactPhoneNumber, hidePhoneNumber, zeroCartTotal, categoryId, openingTimeId, closingTimeId, code, state, }, { payload, req, res, stripe, redis }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload) {
                    return { error: { code: common_1.errors.NOT_AUTHENTICATED_CODE, message: common_1.errors.NOT_AUTHENTICATED_MESSAGE } };
                }
                if (!checkScopes_1.checkScopes(payload, ["beach_bar@crud:beach_bar"])) {
                    return {
                        error: { code: common_1.errors.UNAUTHORIZED_CODE, message: common_1.errors.NOT_REGISTERED_PRIMARY_OWNER },
                    };
                }
                if (!code || code.trim().length === 0) {
                    return { error: { code: common_1.errors.INTERNAL_SERVER_ERROR, message: common_1.errors.SOMETHING_WENT_WRONG } };
                }
                if (!state || state.trim().length === 0) {
                    return { error: { code: common_1.errors.INTERNAL_SERVER_ERROR, message: common_1.errors.SOMETHING_WENT_WRONG } };
                }
                if (state !== req.cookies.scstate) {
                    return {
                        error: {
                            code: common_1.errors.INTERNAL_SERVER_ERROR,
                            message: `${common_1.errors.SOMETHING_WENT_WRONG}: Please try again`,
                        },
                    };
                }
                if (zeroCartTotal === null || zeroCartTotal === undefined) {
                    return {
                        error: {
                            code: common_1.errors.INVALID_ARGUMENTS,
                            message: "Please provide if you allow your customers to purchase products and have zero (0) as their total price in cart",
                        },
                    };
                }
                if (!openingTimeId || openingTimeId <= 0 || !closingTimeId || closingTimeId <= 0 || !categoryId || categoryId <= 0) {
                    return { error: { code: common_1.errors.INTERNAL_SERVER_ERROR, message: common_1.errors.SOMETHING_WENT_WRONG } };
                }
                const user = yield User_1.User.findOne({ where: { id: payload.sub }, relations: ["owner"] });
                if (!user) {
                    return { error: { code: common_1.errors.CONFLICT, message: common_1.errors.SOMETHING_WENT_WRONG } };
                }
                if (!user.owner) {
                    return {
                        error: { code: common_1.errors.UNAUTHORIZED_CODE, message: common_1.errors.NOT_REGISTERED_PRIMARY_OWNER },
                    };
                }
                try {
                    const response = yield stripe.oauth.token({
                        grant_type: "authorization_code",
                        code,
                    });
                    if (!response || !response.stripe_user_id || response.stripe_user_id.trim().length === 0) {
                        return { error: { code: common_1.errors.INTERNAL_SERVER_ERROR, message: common_1.errors.SOMETHING_WENT_WRONG } };
                    }
                    const stripeUserId = response.stripe_user_id;
                    const stripeAccount = yield stripe.accounts.retrieve(stripeUserId);
                    if (!stripeAccount) {
                        return { error: { code: common_1.errors.INTERNAL_SERVER_ERROR, message: common_1.errors.SOMETHING_WENT_WRONG } };
                    }
                    const currency = yield Currency_1.Currency.findOne({ isoCode: stripeAccount.default_currency.toUpperCase() });
                    if (!currency) {
                        return { error: { code: common_1.errors.INTERNAL_SERVER_ERROR, message: common_1.errors.SOMETHING_WENT_WRONG } };
                    }
                    const category = yield BeachBarCategory_1.BeachBarCategory.findOne(categoryId);
                    if (!category) {
                        return { error: { code: common_1.errors.INTERNAL_SERVER_ERROR, message: common_1.errors.SOMETHING_WENT_WRONG } };
                    }
                    const newBeachBar = BeachBar_1.BeachBar.create({
                        name,
                        description,
                        thumbnailUrl: thumbnailUrl.toString(),
                        contactPhoneNumber,
                        hidePhoneNumber,
                        defaultCurrency: currency,
                        stripeConnectId: stripeUserId,
                        zeroCartTotal,
                        category,
                        openingTimeId,
                        closingTimeId,
                    });
                    const pricingFee = yield newBeachBar.getPricingFee();
                    if (!pricingFee) {
                        return { error: { code: common_1.errors.INTERNAL_SERVER_ERROR, message: common_1.errors.SOMETHING_WENT_WRONG } };
                    }
                    newBeachBar.fee = pricingFee;
                    yield newBeachBar.save();
                    yield redis.lpush(redisKeys_1.default.BEACH_BAR_CACHE_KEY, JSON.stringify(newBeachBar));
                    res.clearCookie("scstate", { httpOnly: true, maxAge: 310000 });
                    return {
                        beachBar: newBeachBar,
                        added: true,
                    };
                }
                catch (err) {
                    if (err.message === 'duplicate key value violates unique constraint "beach_bar_name_key"') {
                        return { error: { code: common_1.errors.CONFLICT, message: "A #beach_bar with this name already exists" } };
                    }
                    if (err.message === "This authorization code has already been used. All tokens issued with this code have been revoked.") {
                        return {
                            error: { code: common_1.errors.INTERNAL_SERVER_ERROR, message: `${common_1.errors.SOMETHING_WENT_WRONG}: Please re-try the process` },
                        };
                    }
                    return { error: { message: `${common_1.errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
                }
            }),
        });
        t.field("updateBeachBar", {
            type: types_2.UpdateBeachBarResult,
            description: "Update a #beach_bar details",
            args: {
                beachBarId: nexus_1.intArg({ description: "The ID value of the #beach_bar" }),
                name: nexus_1.nullable(nexus_1.stringArg({ description: "The name to register the #beach_bar. It should be unique among other ones" })),
                description: nexus_1.nullable(nexus_1.stringArg({ description: "A description of the #beach_bar" })),
                thumbnailUrl: nexus_1.nullable(nexus_1.stringArg({ description: "A thumbnail URL value of the #beach_bar's image to show in search results" })),
                contactPhoneNumber: nexus_1.nullable(nexus_1.stringArg({ description: "A phone number to contact the #beach_bar directly" })),
                hidePhoneNumber: nexus_1.nullable(nexus_1.booleanArg({
                    description: "A boolean that indicates if to NOT display the phone number when retrieving #beach_bar info. Its default value is set to false",
                })),
                zeroCartTotal: nexus_1.nullable(nexus_1.booleanArg({
                    description: "Set to true if the #beach_bar accepts for a customer / user to have less than the #beach_bar minimum currency price",
                })),
                isAvailable: nexus_1.nullable(nexus_1.booleanArg({
                    description: "Set to true, if to show #beach_bar in the search results, even if it has no availability",
                })),
                categoryId: nexus_1.nullable(nexus_1.intArg({ description: "The ID value of the category of the #beach_bar" })),
                openingTimeId: nexus_1.nullable(nexus_1.intArg({ description: "The ID value of the opening quarter time of the #beach_bar, in its country zone" })),
                closingTimeId: nexus_1.nullable(nexus_1.intArg({ description: "The ID value of the closing quarter time of the #beach_bar, in its country zone" })),
            },
            resolve: (_, { beachBarId, name, description, thumbnailUrl, contactPhoneNumber, hidePhoneNumber, zeroCartTotal, isAvailable, categoryId, openingTimeId, closingTimeId, }, { payload }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload) {
                    return { error: { code: common_1.errors.NOT_AUTHENTICATED_CODE, message: common_1.errors.NOT_AUTHENTICATED_MESSAGE } };
                }
                if (!checkScopes_1.checkScopes(payload, ["beach_bar@crud:beach_bar", "beach_bar@update:beach_bar"])) {
                    return {
                        error: { code: common_1.errors.UNAUTHORIZED_CODE, message: "You are not allowed to update 'this' #beach_bar details" },
                    };
                }
                if (!beachBarId || beachBarId <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: common_1.errors.SOMETHING_WENT_WRONG } };
                }
                const beachBar = yield BeachBar_1.BeachBar.findOne({
                    where: { id: beachBarId },
                });
                if (!beachBar) {
                    return { error: { code: common_1.errors.CONFLICT, message: common_1.errors.BEACH_BAR_DOES_NOT_EXIST } };
                }
                try {
                    const updatedBeachBar = yield beachBar.update(name, description, thumbnailUrl, contactPhoneNumber, hidePhoneNumber, zeroCartTotal, isAvailable, categoryId, openingTimeId, closingTimeId);
                    return {
                        beachBar: updatedBeachBar,
                        updated: true,
                    };
                }
                catch (err) {
                    if (err.message === 'duplicate key value violates unique constraint "beach_bar_name_key"') {
                        return { error: { code: common_1.errors.CONFLICT, message: "A #beach_bar with this name already exists" } };
                    }
                    return { error: { message: `${common_1.errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
                }
            }),
        });
        t.field("deleteBeachBar", {
            type: types_1.DeleteResult,
            description: "Delete (remove) a #beach_bar from the platform",
            args: {
                beachBarId: nexus_1.intArg({ description: "The ID value of the #beach_bar" }),
            },
            resolve: (_, { beachBarId }, { payload, redis, stripe }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload) {
                    return { error: { code: common_1.errors.NOT_AUTHENTICATED_CODE, message: common_1.errors.NOT_AUTHENTICATED_MESSAGE } };
                }
                if (!checkScopes_1.checkScopes(payload, ["beach_bar@crud:beach_bar"])) {
                    return {
                        error: { code: common_1.errors.UNAUTHORIZED_CODE, message: common_1.errors.NOT_REGISTERED_PRIMARY_OWNER },
                    };
                }
                if (!beachBarId || beachBarId <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: common_1.errors.SOMETHING_WENT_WRONG } };
                }
                const beachBar = yield BeachBar_1.BeachBar.findOne(beachBarId);
                if (!beachBar) {
                    return { error: { code: common_1.errors.CONFLICT, message: common_1.errors.BEACH_BAR_DOES_NOT_EXIST } };
                }
                try {
                    const accountBalance = yield stripe.balance.retrieve({
                        stripeAccount: beachBar.stripeConnectId,
                    });
                    if (!accountBalance || accountBalance.available.some(data => data.amount !== 0)) {
                        return { error: { message: "Your account balance should be zero (0) in value, to delete your account" } };
                    }
                    if (process.env.NODE_ENV === "production") {
                        yield stripe.accounts.del(beachBar.stripeConnectId);
                    }
                    else {
                        yield stripe.accounts.reject(beachBar.stripeConnectId, { reason: "other" });
                    }
                    yield beachBar.customSoftRemove(redis);
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
exports.BeachBarUpdateStatusMutation = nexus_1.extendType({
    type: "Mutation",
    definition(t) {
        t.field("updateBeachBarStatus", {
            type: types_2.UpdateBeachBarResult,
            description: "Update the status of a #beach_bar. If it is active or not",
            args: {
                beachBarId: nexus_1.intArg({ description: "The ID value of the #beach_bar" }),
                isActive: nexus_1.booleanArg({ description: "Set to true if the #beach_bar is active" }),
            },
            resolve: (_, { beachBarId, isActive }, { payload }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload) {
                    return { error: { code: common_1.errors.NOT_AUTHENTICATED_CODE, message: common_1.errors.NOT_AUTHENTICATED_MESSAGE } };
                }
                if (!checkScopes_1.checkScopes(payload, ["beach_bar@crud:beach_bar"])) {
                    return {
                        error: { code: common_1.errors.UNAUTHORIZED_CODE, message: "You are not allowed to update 'this' #beach_bar status" },
                    };
                }
                if (!beachBarId || beachBarId <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: common_1.errors.SOMETHING_WENT_WRONG } };
                }
                const beachBar = yield BeachBar_1.BeachBar.findOne({
                    where: { id: beachBarId },
                    relations: ["fee", "location", "reviews", "features", "products", "entryFees", "restaurants", "openingTime", "closingTime"],
                });
                if (!beachBar) {
                    return { error: { code: common_1.errors.CONFLICT, message: common_1.errors.BEACH_BAR_DOES_NOT_EXIST } };
                }
                try {
                    const updatedBeachBar = yield beachBar.setIsActive(isActive);
                    return {
                        beachBar: updatedBeachBar,
                        updated: true,
                    };
                }
                catch (err) {
                    if (err.message === 'duplicate key value violates unique constraint "beach_bar_name_key"') {
                        return { error: { code: common_1.errors.CONFLICT, message: "A #beach_bar with this name already exists" } };
                    }
                    return { error: { message: `${common_1.errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
                }
            }),
        });
    },
});
