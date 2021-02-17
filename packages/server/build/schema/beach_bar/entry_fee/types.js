"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBeachBarEntryFeeResult = exports.UpdateBeachBarEntryFeeType = exports.AddBeachBarEntryFeeResult = exports.AddBeachBarEntryFeeType = exports.BeachBarEntryFeeType = void 0;
const graphql_1 = require("@the_hashtag/common/dist/graphql");
const nexus_1 = require("nexus");
const types_1 = require("../types");
exports.BeachBarEntryFeeType = nexus_1.objectType({
    name: "BeachBarEntryFee",
    description: "Represents an entry fee for a #beach_bar",
    definition(t) {
        t.field("id", { type: graphql_1.BigIntScalar });
        t.float("fee");
        t.field("date", { type: graphql_1.DateScalar, description: "The date this entry fee is applicable for" });
        t.field("beachBar", {
            type: types_1.BeachBarType,
            description: "The #beach_bar this fee is added (assigned) to",
            resolve: o => o.beachBar,
        });
    },
});
exports.AddBeachBarEntryFeeType = nexus_1.objectType({
    name: "AddBeachBarEntryFee",
    description: "Info to be returned when an entry fee is added to a #beach_bar",
    definition(t) {
        t.list.field("fees", {
            type: exports.BeachBarEntryFeeType,
            description: "The fees that are being added & its details",
            resolve: o => o.fees,
        });
        t.boolean("added", { description: "A boolean that indicates if the fees have been successfully being added to a #beach_bar" });
    },
});
exports.AddBeachBarEntryFeeResult = nexus_1.unionType({
    name: "AddBeachBarEntryFeeResult",
    definition(t) {
        t.members("AddBeachBarEntryFee", "Error");
    },
    resolveType: item => {
        if (item.name === "Error") {
            return "Error";
        }
        else {
            return "AddBeachBarEntryFee";
        }
    },
});
exports.UpdateBeachBarEntryFeeType = nexus_1.objectType({
    name: "UpdateBeachBarEntryFee",
    description: "Info to be returned when the details of #beach_bar entry fee, are updated",
    definition(t) {
        t.list.field("fees", {
            type: exports.BeachBarEntryFeeType,
            description: "The fees being updated",
            resolve: o => o.fees,
        });
        t.boolean("updated", { description: "A boolean that indicates if the fee details have been successfully updated" });
    },
});
exports.UpdateBeachBarEntryFeeResult = nexus_1.unionType({
    name: "UpdateBeachBarEntryFeeResult",
    definition(t) {
        t.members("UpdateBeachBarEntryFee", "Error");
    },
    resolveType: item => {
        if (item.name === "Error") {
            return "Error";
        }
        else {
            return "UpdateBeachBarEntryFee";
        }
    },
});
