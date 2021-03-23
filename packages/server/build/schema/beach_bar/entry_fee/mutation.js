"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeachBarEntryFeeCrudMutation = void 0;
const common_1 = require("@beach_bar/common");
const graphql_1 = require("@the_hashtag/common/dist/graphql");
const BeachBar_1 = require("entity/BeachBar");
const BeachBarEntryFee_1 = require("entity/BeachBarEntryFee");
const nexus_1 = require("nexus");
const typeorm_1 = require("typeorm");
const checkScopes_1 = require("utils/checkScopes");
const types_1 = require("../../types");
const types_2 = require("./types");
exports.BeachBarEntryFeeCrudMutation = nexus_1.extendType({
    type: "Mutation",
    definition(t) {
        t.field("addBeachBarEntryFee", {
            type: types_2.AddBeachBarEntryFeeResult,
            description: "Add an entry fee(s) to a #beach_bar",
            args: {
                beachBarId: nexus_1.intArg({ description: "The ID value of the #beach_bar to add the entry fee(s)" }),
                fee: nexus_1.floatArg({ description: "The price value of the entry fee. Its value cannot be less than 0" }),
                dates: nexus_1.list(nexus_1.arg({
                    type: graphql_1.DateScalar,
                    description: "A list with all the dates to add (assign) the entry fee",
                })),
            },
            resolve: (_, { beachBarId, fee, dates }, { payload }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload) {
                    return { error: { code: common_1.errors.NOT_AUTHENTICATED_CODE, message: common_1.errors.NOT_AUTHENTICATED_MESSAGE } };
                }
                if (!checkScopes_1.checkScopes(payload, ["beach_bar@crud:beach_bar", "beach_bar@crud:beach_bar_entry_fee"])) {
                    return { error: { code: common_1.errors.UNAUTHORIZED_CODE, message: "You are not allowed to add an entry fee to a #beach_bar" } };
                }
                if (fee === null || fee === undefined || fee < 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid fee price" } };
                }
                if (!dates || dates.length === 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a or some valid date(s)" } };
                }
                const beachBar = yield BeachBar_1.BeachBar.findOne(beachBarId);
                if (!beachBar) {
                    return { error: { code: common_1.errors.CONFLICT, message: common_1.errors.BEACH_BAR_DOES_NOT_EXIST } };
                }
                const newEntryFees = [];
                try {
                    for (let i = 0; i < dates.length; i++) {
                        const newEntryFee = BeachBarEntryFee_1.BeachBarEntryFee.create({
                            fee,
                            date: dates[i],
                            beachBar,
                        });
                        yield newEntryFee.save();
                        newEntryFees.push(newEntryFee);
                    }
                    if (newEntryFees.length === 0) {
                        return { error: { message: common_1.errors.SOMETHING_WENT_WRONG } };
                    }
                    yield beachBar.updateRedis();
                }
                catch (err) {
                    if (err.message === 'duplicate key value violates unique constraint "beach_bar_entry_fee_beach_bar_id_date_key"') {
                        const entryFees = yield BeachBarEntryFee_1.BeachBarEntryFee.find({ where: { date: typeorm_1.In(dates) }, relations: ["beachBar"] });
                        if (entryFees) {
                            return {
                                fees: entryFees,
                                added: false,
                            };
                        }
                        else {
                            return { error: { message: common_1.errors.SOMETHING_WENT_WRONG } };
                        }
                    }
                    return { error: { message: `${common_1.errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
                }
                return {
                    fees: newEntryFees,
                    added: true,
                };
            }),
        });
        t.field("updateBeachBarEntryFee", {
            type: types_2.UpdateBeachBarEntryFeeResult,
            description: "Update an or many entry fee(s) of a #beach_bar",
            args: {
                entryFeeIds: nexus_1.list(nexus_1.idArg({ description: "A list with all the entry fess to update" })),
                fee: nexus_1.nullable(nexus_1.floatArg({ description: "The price value to update the entry fees" })),
            },
            resolve: (_, { entryFeeIds, price }, { payload }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload) {
                    return { error: { code: common_1.errors.NOT_AUTHENTICATED_CODE, message: common_1.errors.NOT_AUTHENTICATED_MESSAGE } };
                }
                if (!checkScopes_1.checkScopes(payload, [
                    "beach_bar@crud:beach_bar",
                    "beach_bar@crud:beach_bar_entry_fee",
                    "beach_bar@update:beach_bar_entry_fee",
                ])) {
                    return {
                        error: {
                            code: common_1.errors.UNAUTHORIZED_CODE,
                            message: "You are not allowed to update an entry fee to of a #beach_bar",
                        },
                    };
                }
                if (!entryFeeIds || entryFeeIds.length === 0 || entryFeeIds.some(feeId => feeId === 0)) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a or some valid entry fees" } };
                }
                if ((price !== null || price !== undefined) && price < 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid price value as a fee" } };
                }
                const entryFees = yield BeachBarEntryFee_1.BeachBarEntryFee.find({ where: { id: typeorm_1.In(entryFeeIds) }, relations: ["beachBar"] });
                if (!entryFees) {
                    return { error: { code: common_1.errors.CONFLICT, message: "Specified entry fee(s) do not exist" } };
                }
                try {
                    if (price !== null && price !== undefined && entryFees.some(fee => fee.fee !== price)) {
                        const updatedEntryFees = [];
                        for (let i = 0; i < entryFees.length; i++) {
                            const updatedEntryFee = yield entryFees[i].update(price);
                            updatedEntryFees.push(updatedEntryFee);
                        }
                        if (updatedEntryFees.length === 0) {
                            return { error: { message: common_1.errors.SOMETHING_WENT_WRONG } };
                        }
                        return {
                            fees: updatedEntryFees,
                            updated: true,
                        };
                    }
                    else {
                        return {
                            fees: entryFees,
                            updated: false,
                        };
                    }
                }
                catch (err) {
                    return { error: { message: `${common_1.errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
                }
            }),
        });
        t.field("deleteBeachBarEntryFee", {
            type: types_1.DeleteResult,
            description: "Delete (remove) an or some entry fees from a #beach_bar",
            args: {
                entryFeeIds: nexus_1.list(nexus_1.idArg({ description: "A list with all the ID values of entry fee(s) to delete (remove) from a #beach_bar" })),
            },
            resolve: (_, { entryFeeIds }, { payload }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload) {
                    return { error: { code: common_1.errors.NOT_AUTHENTICATED_CODE, message: common_1.errors.NOT_AUTHENTICATED_MESSAGE } };
                }
                if (!checkScopes_1.checkScopes(payload, ["beach_bar@crud:beach_bar", "beach_bar@crud:beach_bar_entry_fee"])) {
                    return {
                        error: { code: common_1.errors.UNAUTHORIZED_CODE, message: "You are not allowed to delete an entry fee from a #beach_bar" },
                    };
                }
                if (!entryFeeIds || entryFeeIds.length === 0 || entryFeeIds.some(feeId => feeId === 0)) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a or some valid entry fee(s)" } };
                }
                const entryFees = yield BeachBarEntryFee_1.BeachBarEntryFee.find({ where: { id: typeorm_1.In(entryFeeIds) }, relations: ["beachBar"] });
                if (!entryFees) {
                    return { error: { code: common_1.errors.CONFLICT, message: "Specified entry fee(s) do not exist" } };
                }
                try {
                    entryFees.forEach((entryFee) => __awaiter(this, void 0, void 0, function* () { return yield entryFee.softRemove(); }));
                }
                catch (err) {
                    return { error: { message: `${common_1.errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
                }
                return {
                    deleted: true,
                };
            }),
        });
    },
});
