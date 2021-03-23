"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserUpdateType = exports.UserLoginDetails = exports.UserCredentials = exports.UserLoginType = exports.UserResult = exports.UserType = void 0;
const graphql_1 = require("@the_hashtag/common/dist/graphql");
const nexus_1 = require("nexus");
const types_1 = require("../beach_bar/review/types");
const types_2 = require("../beach_bar/review/votes/types");
const types_3 = require("../types");
const types_4 = require("./account/types");
const types_5 = require("./favorite_bar/types");
exports.UserType = nexus_1.objectType({
    name: "User",
    description: "Represents a user",
    definition(t) {
        t.id("id", { description: "User's ID value" });
        t.field("email", { type: graphql_1.EmailScalar, description: "User's email address" });
        t.nullable.string("firstName", { description: "User's first (given) name" });
        t.nullable.string("lastName", { description: "User's last (family) name" });
        t.field("account", {
            type: types_4.UserAccountType,
            description: "User's account info",
            resolve: o => o.account,
        });
        t.nullable.list.field("reviews", {
            type: types_1.BeachBarReviewType,
            description: "A user's review on a #beach_bar",
            resolve: o => o.reviews,
        });
        t.nullable.list.field("favoriteBars", {
            type: types_5.UserFavoriteBarType,
            description: "A list with all the user's favorite #beach_bars",
            resolve: o => o.favoriteBars,
        });
        t.nullable.list.field("reviewVotes", {
            type: types_2.ReviewVoteType,
            description: "A list of all the votes of the user",
            resolve: o => o.reviewVotes,
        });
    },
});
exports.UserResult = nexus_1.unionType({
    name: "UserTypeResult",
    definition(t) {
        t.members("User", "Error");
    },
    resolveType: item => {
        if (item.error) {
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
exports.UserCredentials = nexus_1.inputObjectType({
    name: "UserCredentials",
    description: "Credentials of user to sign up / login",
    definition(t) {
        t.field("email", { type: graphql_1.EmailScalar, description: "Email of user to sign up" });
        t.string("password", { description: "Password of user" });
    },
});
exports.UserLoginDetails = nexus_1.inputObjectType({
    name: "UserLoginDetails",
    description: "User details in login. The user's IP address is passed via the context",
    definition(t) {
        t.nullable.string("city", { description: "The city name from where user logins from" });
        t.nullable.string("countryAlpha2Code", { description: "The alpha 2 code of the country, from where the user logins" });
    },
});
exports.UserUpdateType = nexus_1.objectType({
    name: "UserUpdate",
    description: "User details to be returned on update",
    definition(t) {
        t.implements(types_3.UpdateGraphQLType);
        t.field("user", { type: exports.UserType });
    },
});
