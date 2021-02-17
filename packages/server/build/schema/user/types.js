"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserUpdateResult = exports.UserLoginDetailsInput = exports.UserCredentialsInput = exports.UserLoginResult = exports.UserLoginType = exports.UserSignUpResult = exports.UserResult = exports.UserType = void 0;
const graphql_1 = require("@the_hashtag/common/dist/graphql");
const nexus_1 = require("nexus");
const types_1 = require("../beach_bar/review/types");
const types_2 = require("./account/types");
const types_3 = require("./favorite_bar/types");
exports.UserType = nexus_1.objectType({
    name: "User",
    description: "Represents a user",
    definition(t) {
        t.id("id", { description: "User's ID value" });
        t.field("email", { type: graphql_1.EmailScalar, description: "User's email address" });
        t.nullable.string("firstName", { description: "User's first (given) name" });
        t.nullable.string("lastName", { description: "User's last (family) name" });
        t.nullable.field("account", {
            type: types_2.UserAccountType,
            description: "User's account info",
            resolve: o => o.account,
        });
        t.nullable.list.field("reviews", {
            type: types_1.BeachBarReviewType,
            description: "A user's review on a #beach_bar",
            resolve: o => o.reviews,
        });
        t.nullable.list.field("favoriteBars", {
            type: types_3.UserFavoriteBarType,
            description: "A list with all the user's favorite #beach_bars",
            resolve: o => o.favoriteBars,
        });
    },
});
exports.UserResult = nexus_1.unionType({
    name: "UserTypeResult",
    definition(t) {
        t.members("User", "Error");
    },
    resolveType: item => {
        if (item.name === "Error") {
            return "Error";
        }
        else {
            return "User";
        }
    },
});
exports.UserSignUpResult = nexus_1.unionType({
    name: "UserSignUpResult",
    definition(t) {
        t.members("User", "Error");
    },
    resolveType: item => {
        if (item.name === "Error") {
            return "Error";
        }
        else {
            return "User";
        }
    },
});
exports.UserLoginType = nexus_1.objectType({
    name: "UserLogin",
    description: "User info to be returned on login",
    definition(t) {
        t.field("user", {
            type: exports.UserType,
            description: "The user (object) that logins",
            resolve: o => o.user,
        });
        t.string("accessToken", { description: "The access token to authenticate & authorize the user" });
    },
});
exports.UserLoginResult = nexus_1.unionType({
    name: "UserLoginResult",
    definition(t) {
        t.members("UserLogin", "Error");
    },
    resolveType: item => {
        if (item.name === "Error") {
            return "Error";
        }
        else {
            return "UserLogin";
        }
    },
});
exports.UserCredentialsInput = nexus_1.inputObjectType({
    name: "UserCredentialsInput",
    description: "Credentials of user to sign up / login",
    definition(t) {
        t.field("email", { type: graphql_1.EmailScalar, description: "Email of user to sign up" });
        t.string("password", { description: "Password of user" });
    },
});
exports.UserLoginDetailsInput = nexus_1.inputObjectType({
    name: "UserLoginDetailsInput",
    description: "User details in login. The user's IP address is passed via the context",
    definition(t) {
        t.int("countryId", { description: "The ID of the country, user logins from" });
        t.int("cityId", { description: "The ID of the city, user logins from" });
    },
});
exports.UserUpdateResult = nexus_1.unionType({
    name: "UserUpdateResult",
    definition(t) {
        t.members("User", "Error");
    },
    resolveType: item => {
        if (item.name === "Error") {
            return "Error";
        }
        else {
            return "User";
        }
    },
});
