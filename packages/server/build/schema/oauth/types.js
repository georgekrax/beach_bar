"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuthAuthorizationResult = exports.OAuthAuthorizationType = void 0;
const schema_1 = require("@nexus/schema");
const types_1 = require("../user/types");
exports.OAuthAuthorizationType = schema_1.objectType({
    name: "OAuthAuthorization",
    description: "User info to be returned on Google OAuth authorization",
    definition(t) {
        t.string("accessToken", { nullable: false, description: "The JWT access token to be returned upon successful login" });
        t.boolean("signedUp", { nullable: false, description: "A boolean that indicates if the user has successfully signed up" });
        t.boolean("logined", { nullable: false, description: "A boolean that indicates if the user has successfully logined" });
        t.field("user", {
            type: types_1.UserType,
            description: "The user being authorized",
            nullable: false,
            resolve: o => o.user,
        });
    },
});
exports.OAuthAuthorizationResult = schema_1.unionType({
    name: "OAuthAuthorizationResult",
    definition(t) {
        t.members("OAuthAuthorization", "Error");
        t.resolveType(item => {
            if (item.error) {
                return "Error";
            }
            else {
                return "OAuthAuthorization";
            }
        });
    },
});
//# sourceMappingURL=types.js.map