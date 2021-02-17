"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddUserFavoriteBarResult = exports.AddUserFavoriteBarType = exports.UserFavoriteBarType = void 0;
const nexus_1 = require("nexus");
const types_1 = require("schema/beach_bar/types");
const types_2 = require("../types");
exports.UserFavoriteBarType = nexus_1.objectType({
    name: "UserFavoriteBar",
    description: "A user's favorite #beach_bar",
    definition(t) {
        t.field("user", {
            type: types_2.UserType,
            description: "The user object",
            resolve: o => o.user,
        });
        t.field("beachBar", {
            type: types_1.BeachBarType,
            description: "One of user's favorite #beach_bar",
            resolve: o => o.beachBar,
        });
    },
});
exports.AddUserFavoriteBarType = nexus_1.objectType({
    name: "AddUserFavoriteBar",
    description: "Info to be returned when a user add #beach_bar to his / her favorite list",
    definition(t) {
        t.field("beachBar", {
            type: exports.UserFavoriteBarType,
            description: "The #beach_bar that is added",
            resolve: o => o.beachBar,
        });
        t.boolean("added", {
            description: "A boolean that indicates if the #beach_bar has been successfully being added to the user's favorites",
        });
    },
});
exports.AddUserFavoriteBarResult = nexus_1.unionType({
    name: "AddUserFavoriteBarResult",
    definition(t) {
        t.members("AddUserFavoriteBar", "Error");
    },
    resolveType: item => {
        if (item.name === "Error") {
            return "Error";
        }
        else {
            return "AddUserFavoriteBar";
        }
    },
});
