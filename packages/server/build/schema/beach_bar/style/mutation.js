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
exports.BeachBarTypeCrudMutation = void 0;
const common_1 = require("@beach_bar/common");
const BeachBar_1 = require("entity/BeachBar");
const BeachBarStyle_1 = require("entity/BeachBarStyle");
const BeachBarType_1 = require("entity/BeachBarType");
const nexus_1 = require("nexus");
const types_1 = require("schema/types");
const checkScopes_1 = require("utils/checkScopes");
exports.BeachBarTypeCrudMutation = nexus_1.extendType({
    type: "Mutation",
    definition(t) {
        t.field("addBeachBarType", {
            type: types_1.SuccessResult,
            description: "Add (assign) a style to a #beach_bar",
            args: {
                beachBarId: nexus_1.idArg({ description: "The ID value of the #beach_bar, to assign the style" }),
                styleId: nexus_1.idArg({ description: "The ID value of the style to assign" }),
            },
            resolve: (_, { beachBarId, styleId }, { payload }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload) {
                    return { error: { code: common_1.errors.NOT_AUTHENTICATED_CODE, message: common_1.errors.NOT_AUTHENTICATED_MESSAGE } };
                }
                if (!checkScopes_1.checkScopes(payload, ["beach_bar@crud:beach_bar"])) {
                    return {
                        error: { code: common_1.errors.UNAUTHORIZED_CODE, message: "You are not allowed to add a style to a #beach_bar" },
                    };
                }
                const beachBar = yield BeachBar_1.BeachBar.findOne(beachBarId);
                if (!beachBar) {
                    return { error: { code: common_1.errors.CONFLICT, message: common_1.errors.BEACH_BAR_DOES_NOT_EXIST } };
                }
                const style = yield BeachBarStyle_1.BeachBarStyle.findOne(styleId);
                if (!style) {
                    return { error: { code: common_1.errors.CONFLICT, message: common_1.errors.SOMETHING_WENT_WRONG } };
                }
                const newBeachBarType = yield BeachBarType_1.BeachBarType.create({
                    beachBar,
                    style,
                });
                try {
                    yield newBeachBarType.save();
                }
                catch (err) {
                    return { error: { message: `${common_1.errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
                }
                return {
                    success: true,
                };
            }),
        });
        t.field("deleteBeachBarType", {
            type: types_1.DeleteResult,
            description: "Delete (remove) a style from a #beach_bar",
            args: {
                beachBarId: nexus_1.idArg({ description: "The ID value of the #beach_bar, to remove the style" }),
                styleId: nexus_1.idArg({ description: "The ID value of the style to remove" }),
            },
            resolve: (_, { beachBarId, styleId }, { payload }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload) {
                    return { error: { code: common_1.errors.NOT_AUTHENTICATED_CODE, message: common_1.errors.NOT_AUTHENTICATED_MESSAGE } };
                }
                if (!checkScopes_1.checkScopes(payload, ["beach_bar@crud:beach_bar"])) {
                    return {
                        error: { code: common_1.errors.UNAUTHORIZED_CODE, message: "You are not allowed to delete a style from a #beach_bar" },
                    };
                }
                const beachBarType = yield BeachBarType_1.BeachBarType.findOne({ beachBarId, styleId });
                if (!beachBarType) {
                    return { error: { code: common_1.errors.CONFLICT, message: "This style is not assigned to this #beach_bar" } };
                }
                try {
                    yield beachBarType.softRemove();
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
