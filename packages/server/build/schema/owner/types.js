"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBeachBarOwnerResult = exports.UpdateBeachBarOwnerType = exports.AddBeachBarOwnerResult = exports.AddBeachBarOwnerType = exports.BeachBarOwnerType = exports.OwnerType = void 0;
const common_1 = require("@georgekrax-hashtag/common");
const schema_1 = require("@nexus/schema");
const types_1 = require("../beach_bar/types");
const types_2 = require("../user/types");
exports.OwnerType = schema_1.objectType({
    name: "Owner",
    description: "Represents a user that is an owner of a #beach_bar",
    definition(t) {
        t.int("id", { nullable: false });
        t.field("user", {
            type: types_2.UserType,
            description: "The user that is the owner or one of the owners of the #beach_bar",
            nullable: false,
            resolve: o => o.user,
        });
    },
});
exports.BeachBarOwnerType = schema_1.objectType({
    name: "BeachBarOwner",
    description: "Represents a #beach_bar's owner",
    definition(t) {
        t.boolean("isPrimary", {
            nullable: false,
            description: "A boolean that indicates if the owner is the user that also created the #beach_bar & can make modifications",
        });
        t.boolean("publicInfo", {
            nullable: false,
            description: "A boolean that indicates if the owner info (contact details) are allowed to be presented to the public",
        });
        t.field("beachBar", {
            type: types_1.BeachBarType,
            description: "The #beach_bar the user is assigned to as an owner, either as a primary one or not",
            nullable: false,
            resolve: o => o.beachBar,
        });
        t.field("owner", {
            type: exports.OwnerType,
            description: "The owner of the #beach_bar",
            nullable: false,
            resolve: o => o.owner,
        });
        t.field("timestamp", {
            type: common_1.DateTimeScalar,
            nullable: false,
            description: "The date and time the owner was added (assigned) to the #beach_bar",
        });
    },
});
exports.AddBeachBarOwnerType = schema_1.objectType({
    name: "AddBeachBarOwner",
    description: "Info to be returned when an owner is added (assigned) to a #beach_bar",
    definition(t) {
        t.field("owner", {
            type: exports.BeachBarOwnerType,
            description: "The owner being added & its info",
            nullable: false,
            resolve: o => o.owner,
        });
        t.boolean("added", {
            nullable: false,
            description: "A boolean that indicates if the owner has been successfully being added (assigned) to a #beach_bar",
        });
    },
});
exports.AddBeachBarOwnerResult = schema_1.unionType({
    name: "AddBeachBarOwnerResult",
    definition(t) {
        t.members("AddBeachBarOwner", "Error");
        t.resolveType(item => {
            if (item.error) {
                return "Error";
            }
            else {
                return "AddBeachBarOwner";
            }
        });
    },
});
exports.UpdateBeachBarOwnerType = schema_1.objectType({
    name: "UpdateBeachBarOwner",
    description: "Info to be returned when the info of a #beach_bar owner, are updated",
    definition(t) {
        t.field("owner", {
            type: exports.BeachBarOwnerType,
            description: "The owner being added & its info",
            nullable: false,
            resolve: o => o.owner,
        });
        t.boolean("updated", {
            nullable: false,
            description: "A boolean that indicates if the owner info have been successfully updated",
        });
    },
});
exports.UpdateBeachBarOwnerResult = schema_1.unionType({
    name: "UpdateBeachBarOwnerResult",
    definition(t) {
        t.members("UpdateBeachBarOwner", "Error");
        t.resolveType(item => {
            if (item.error) {
                return "Error";
            }
            else {
                return "UpdateBeachBarOwner";
            }
        });
    },
});
//# sourceMappingURL=types.js.map