"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserUpdateResult = exports.UserLoginDetailsInput = exports.UserCredentialsInput = exports.UserLoginResult = exports.UserLoginType = exports.UserSignUpResult = exports.UserResult = exports.UserType = void 0;
const common_1 = require("@georgekrax-hashtag/common");
const schema_1 = require("@nexus/schema");
const types_1 = require("../beach_bar/review/types");
const types_2 = require("./account/types");
const types_3 = require("./favorite_bar/types");
exports.UserType = schema_1.objectType({
    name: "User",
    description: "Represents a user",
    definition(t) {
        t.int("id", { nullable: false, description: "User's ID value" });
        t.field("email", { type: common_1.EmailScalar, nullable: false, description: "User's email address" });
        t.string("firstName", { nullable: true, description: "User's first (given) name" });
        t.string("lastName", { nullable: true, description: "User's last (family) name" });
        t.field("account", {
            type: types_2.UserAccountType,
            description: "User's account info",
            nullable: true,
            resolve: o => o.account,
        });
        t.list.field("reviews", {
            type: types_1.BeachBarReviewType,
            description: "A user's review on a #beach_bar",
            nullable: true,
            resolve: o => o.reviews,
        });
        t.list.field("favoriteBars", {
            type: types_3.UserFavoriteBarType,
            description: "A list with all the user's favorite #beach_bars",
            nullable: true,
            resolve: o => o.favoriteBars,
        });
    },
});
exports.UserResult = schema_1.unionType({
    name: "UserTypeResult",
    definition(t) {
        t.members("User", "Error");
        t.resolveType(item => {
            if (item.error) {
                return "Error";
            }
            else {
                return "User";
            }
        });
    },
});
exports.UserSignUpResult = schema_1.unionType({
    name: "UserSignUpResult",
    definition(t) {
        t.members("User", "Error");
        t.resolveType(item => {
            if (item.error) {
                return "Error";
            }
            else {
                return "User";
            }
        });
    },
});
exports.UserLoginType = schema_1.objectType({
    name: "UserLogin",
    description: "User info to be returned on login",
    definition(t) {
        t.field("user", {
            type: exports.UserType,
            description: "The user (object) that logins",
            nullable: false,
            resolve: o => o.user,
        });
        t.string("accessToken", { nullable: false, description: "The access token to authenticate & authorize the user" });
    },
});
exports.UserLoginResult = schema_1.unionType({
    name: "UserLoginResult",
    definition(t) {
        t.members("UserLogin", "Error");
        t.resolveType(item => {
            if (item.error) {
                return "Error";
            }
            else {
                return "UserLogin";
            }
        });
    },
});
exports.UserCredentialsInput = schema_1.inputObjectType({
    name: "UserCredentialsInput",
    description: "Credentials of user to sign up / login",
    definition(t) {
        t.field("email", { type: common_1.EmailScalar, required: true, description: "Email of user to sign up" });
        t.string("password", { required: true, description: "Password of user" });
    },
});
exports.UserLoginDetailsInput = schema_1.inputObjectType({
    name: "UserLoginDetailsInput",
    description: "User details in login. The user's IP address is passed via the context",
    definition(t) {
        t.int("countryId", { required: false, description: "The ID of the country, user logins from" });
        t.int("cityId", { required: false, description: "The ID of the city, user logins from" });
    },
});
exports.UserUpdateResult = schema_1.unionType({
    name: "UserUpdateResult",
    definition(t) {
        t.members("User", "Error");
        t.resolveType(item => {
            if (item.error) {
                return "Error";
            }
            else {
                return "User";
            }
        });
    },
});
//# sourceMappingURL=types.js.map