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
const apollo_server_express_1 = require("apollo-server-express");
const User_1 = require("entity/User");
const nexus_1 = require("nexus");
const userInfoPayloadScope_1 = require("utils/userInfoPayloadScope");
const types_1 = require("./types");
exports.UserQuery = nexus_1.extendType({
    type: "Query",
    definition(t) {
        t.nullable.field("me", {
            type: types_1.UserType,
            description: "Returns current authenticated user",
            resolve: (_, __, { payload }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload)
                    return null;
                if (!payload.scope.some(scope => ["profile", "beach_bar@crud:user", "beach_bar@read:user"].includes(scope)) ||
                    !payload.scope.includes("email"))
                    throw new apollo_server_express_1.ApolloError("You are not allowed to access this user's info", common_1.errors.UNAUTHORIZED_CODE);
                const user = yield User_1.User.findOne({
                    where: { id: payload.sub },
                    relations: [
                        "account",
                        "account.country",
                        "account.country.currency",
                        "customer",
                        "customer.reviews",
                        "customer.reviews.beachBar",
                        "customer.reviews.monthTime",
                        "customer.reviews.visitType",
                        "reviewVotes",
                        "reviewVotes.type",
                        "reviewVotes.review",
                        "reviewVotes.user",
                    ],
                });
                if (!user)
                    return null;
                return userInfoPayloadScope_1.userInfoPayloadScope(payload, user);
            }),
        });
    },
});
