"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddUserFavoriteBarResult = exports.AddUserFavoriteBarType = exports.UserFavoriteBarType = void 0;
const schema_1 = require("@nexus/schema");
const types_1 = require("schema/beach_bar/types");
const types_2 = require("../types");
exports.UserFavoriteBarType = schema_1.objectType({
    name: "UserFavoriteBar",
    description: "A user's favorite #beach_bar",
    definition(t) {
        t.field("user", {
            type: types_2.UserType,
            description: "The user object",
            nullable: false,
            resolve: o => o.user,
        });
        t.field("beachBar", {
            type: types_1.BeachBarType,
            description: "One of user's favorite #beach_bar",
            nullable: false,
            resolve: o => o.beachBar,
        });
    },
});
exports.AddUserFavoriteBarType = schema_1.objectType({
    name: "AddUserFavoriteBar",
    description: "Info to be returned when a user add #beach_bar to his / her favorite list",
    definition(t) {
        t.field("beachBar", {
            type: exports.UserFavoriteBarType,
            description: "The #beach_bar that is added",
            nullable: false,
            resolve: o => o.beachBar,
        });
        t.boolean("added", {
            nullable: false,
            description: "A boolean that indicates if the #beach_bar has been successfully being added to the user's favorites",
        });
    },
});
exports.AddUserFavoriteBarResult = schema_1.unionType({
    name: "AddUserFavoriteBarResult",
    definition(t) {
        t.members("AddUserFavoriteBar", "Error");
        t.resolveType(item => {
            if (item.error) {
                return "Error";
            }
            else {
                return "AddUserFavoriteBar";
            }
        });
    },
});
//# sourceMappingURL=types.js.map