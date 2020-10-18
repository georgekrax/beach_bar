"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBeachBarEntryFeeResult = exports.UpdateBeachBarEntryFeeType = exports.AddBeachBarEntryFeeResult = exports.AddBeachBarEntryFeeType = exports.BeachBarEntryFeeType = void 0;
const common_1 = require("@georgekrax-hashtag/common");
const schema_1 = require("@nexus/schema");
const types_1 = require("../types");
exports.BeachBarEntryFeeType = schema_1.objectType({
    name: "BeachBarEntryFee",
    description: "Represents an entry fee for a #beach_bar",
    definition(t) {
        t.field("id", { type: common_1.BigIntScalar, nullable: false });
        t.float("fee", { nullable: false });
        t.field("date", { type: common_1.DateScalar, nullable: false, description: "The date this entry fee is applicable for" });
        t.field("beachBar", {
            type: types_1.BeachBarType,
            nullable: false,
            description: "The #beach_bar this fee is added (assigned) to",
            resolve: o => o.beachBar,
        });
    },
});
exports.AddBeachBarEntryFeeType = schema_1.objectType({
    name: "AddBeachBarEntryFee",
    description: "Info to be returned when an entry fee is added to a #beach_bar",
    definition(t) {
        t.list.field("fees", {
            type: exports.BeachBarEntryFeeType,
            description: "The fees that are being added & its details",
            nullable: false,
            resolve: o => o.fees,
        });
        t.boolean("added", {
            nullable: false,
            description: "A boolean that indicates if the fees have been successfully being added to a #beach_bar",
        });
    },
});
exports.AddBeachBarEntryFeeResult = schema_1.unionType({
    name: "AddBeachBarEntryFeeResult",
    definition(t) {
        t.members("AddBeachBarEntryFee", "Error");
        t.resolveType(item => {
            if (item.error) {
                return "Error";
            }
            else {
                return "AddBeachBarEntryFee";
            }
        });
    },
});
exports.UpdateBeachBarEntryFeeType = schema_1.objectType({
    name: "UpdateBeachBarEntryFee",
    description: "Info to be returned when the details of #beach_bar entry fee, are updated",
    definition(t) {
        t.list.field("fees", {
            type: exports.BeachBarEntryFeeType,
            description: "The fees being updated",
            nullable: false,
            resolve: o => o.fees,
        });
        t.boolean("updated", {
            nullable: false,
            description: "A boolean that indicates if the fee details have been successfully updated",
        });
    },
});
exports.UpdateBeachBarEntryFeeResult = schema_1.unionType({
    name: "UpdateBeachBarEntryFeeResult",
    definition(t) {
        t.members("UpdateBeachBarEntryFee", "Error");
        t.resolveType(item => {
            if (item.error) {
                return "Error";
            }
            else {
                return "UpdateBeachBarEntryFee";
            }
        });
    },
});
//# sourceMappingURL=types.js.map