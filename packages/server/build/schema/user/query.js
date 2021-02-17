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
exports.UserQuery = void 0;
const common_1 = require("@beach_bar/common");
const nexus_1 = require("nexus");
const User_1 = require("entity/User");
const userInfoPayloadScope_1 = require("utils/userInfoPayloadScope");
const types_1 = require("./types");
exports.UserQuery = nexus_1.extendType({
    type: "Query",
    definition(t) {
        t.field("me", {
            type: types_1.UserResult,
            description: "Returns current authenticated user",
            resolve: (_, __, { payload }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload) {
                    return { error: { code: common_1.errors.NOT_AUTHENTICATED_CODE, message: common_1.errors.NOT_AUTHENTICATED_MESSAGE } };
                }
                if (!payload.scope.some(scope => ["profile", "beach_bar@crud:user", "beach_bar@read:user"].includes(scope)) ||
                    !payload.scope.includes("email")) {
                    return {
                        error: {
                            code: common_1.errors.UNAUTHORIZED_CODE,
                            message: "You are not allowed to access 'this' user's info",
                        },
                    };
                }
                const user = yield User_1.User.findOne({
                    where: { id: payload.sub },
                    relations: [
                        "account",
                        "account.contactDetails",
                        "account.country",
                        "account.country.currency",
                        "account.city",
                        "customer",
                        "customer.reviews",
                        "customer.reviews.beachBar",
                        "customer.reviews.monthTime",
                        "customer.reviews.visitType",
                    ],
                });
                if (!user) {
                    return {
                        error: {
                            code: common_1.errors.NOT_FOUND,
                            message: common_1.errors.USER_NOT_FOUND_MESSAGE,
                        },
                    };
                }
                return userInfoPayloadScope_1.userInfoPayloadScope(payload, user);
            }),
        });
    },
});
