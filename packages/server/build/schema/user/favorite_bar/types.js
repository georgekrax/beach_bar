"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserFavoriteBarType = exports.UserFavoriteBarType = void 0;
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
exports.UpdateUserFavoriteBarType = nexus_1.objectType({
    name: "UpdateUserFavoriteBar",
    description: "Info to be returned when a user's #beach_bar favourite list is updated",
    definition(t) {
        t.field("favouriteBar", {
            type: exports.UserFavoriteBarType,
            description: "The #beach_bar that is added / removed",
            resolve: o => o.favouriteBar,
        });
        t.boolean("updated", {
            description: "A boolean that indicates if the user's favorites #beach_bar list is updated",
        });
    },
});
