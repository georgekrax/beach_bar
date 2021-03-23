"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuthAuthorizationType = void 0;
const nexus_1 = require("nexus");
const types_1 = require("../user/types");
exports.OAuthAuthorizationType = nexus_1.objectType({
    name: "OAuthAuthorization",
    description: "User info to be returned on Google OAuth authorization",
    definition(t) {
        t.string("accessToken", { description: "The JWT access token to be returned upon successful login" });
        t.boolean("signedUp", { description: "A boolean that indicates if the user has successfully signed up" });
        t.boolean("logined", { description: "A boolean that indicates if the user has successfully logined" });
        t.field("user", {
            type: types_1.UserType,
            description: "The user being authorized",
            resolve: o => o.user,
        });
    },
});
