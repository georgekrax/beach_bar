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
exports.UserFavoriteBarCrudMutation = void 0;
const common_1 = require("@beach_bar/common");
const redisKeys_1 = __importDefault(require("constants/redisKeys"));
const User_1 = require("entity/User");
const UserFavoriteBar_1 = require("entity/UserFavoriteBar");
const nexus_1 = require("nexus");
const types_1 = require("schema/types");
const checkScopes_1 = require("utils/checkScopes");
const types_2 = require("./types");
exports.UserFavoriteBarCrudMutation = nexus_1.extendType({
    type: "Mutation",
    definition(t) {
        t.field("addUserFavoriteBar", {
            type: types_2.AddUserFavoriteBarResult,
            description: "Add a #beach_bar to user's favorites list",
            args: {
                beachBarId: nexus_1.intArg({ description: "The ID value of the #beach_bar, to add to the user's favorites list" }),
            },
            resolve: (_, { beachBarId }, { payload, redis }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload) {
                    return { error: { code: common_1.errors.NOT_AUTHENTICATED_CODE, message: common_1.errors.NOT_AUTHENTICATED_MESSAGE } };
                }
                if (!checkScopes_1.checkScopes(payload, ["beach_bar@crud:user"])) {
                    return {
                        error: { code: common_1.errors.UNAUTHORIZED_CODE, message: common_1.errors.NOT_AUTHENTICATED_MESSAGE },
                    };
                }
                const user = yield User_1.User.findOne(payload.sub);
                if (!user) {
                    return { error: { code: common_1.errors.CONFLICT, message: common_1.errors.SOMETHING_WENT_WRONG } };
                }
                const beachBars = (yield redis.lrange(redisKeys_1.default.BEACH_BAR_CACHE_KEY, 0, -1)).map((x) => JSON.parse(x));
                const beachBar = beachBars.find(bar => String(bar.id) === String(beachBarId));
                if (!beachBar) {
                    return { error: { code: common_1.errors.CONFLICT, message: common_1.errors.SOMETHING_WENT_WRONG } };
                }
                const newFavoriteBar = UserFavoriteBar_1.UserFavoriteBar.create({
                    beachBar,
                    user,
                });
                try {
                    yield newFavoriteBar.save();
                }
                catch (err) {
                    return { error: { message: `${common_1.errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
                }
                return {
                    favoriteBar: newFavoriteBar,
                    added: true,
                };
            }),
        });
        t.field("deleteUserFavoriteBar", {
            type: types_1.DeleteResult,
            description: "Remove a #beach_bar from a user's favorites list",
            args: {
                beachBarId: nexus_1.intArg({ description: "The ID value of the #beach_bar, to add to the user's favorites list" }),
            },
            resolve: (_, { beachBarId }, { payload }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload) {
                    return { error: { code: common_1.errors.NOT_AUTHENTICATED_CODE, message: common_1.errors.NOT_AUTHENTICATED_MESSAGE } };
                }
                if (!checkScopes_1.checkScopes(payload, ["beach_bar@crud:user"])) {
                    return {
                        error: { code: common_1.errors.UNAUTHORIZED_CODE, message: common_1.errors.NOT_AUTHENTICATED_MESSAGE },
                    };
                }
                const favoriteBar = yield UserFavoriteBar_1.UserFavoriteBar.findOne({ beachBarId: beachBarId, userId: payload.sub });
                if (!favoriteBar) {
                    return { error: { code: common_1.errors.CONFLICT, message: common_1.errors.SOMETHING_WENT_WRONG } };
                }
                try {
                    yield favoriteBar.softRemove();
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
