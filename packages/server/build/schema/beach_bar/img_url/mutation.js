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
exports.BeachBarImgUrlCrudMutation = void 0;
const common_1 = require("@beach_bar/common");
const common_2 = require("@georgekrax-hashtag/common");
const schema_1 = require("@nexus/schema");
const BeachBar_1 = require("entity/BeachBar");
const BeachBarImgUrl_1 = require("entity/BeachBarImgUrl");
const types_1 = require("schema/types");
const checkScopes_1 = require("utils/checkScopes");
const types_2 = require("./types");
exports.BeachBarImgUrlCrudMutation = schema_1.extendType({
    type: "Mutation",
    definition(t) {
        t.field("addBeachBarImgUrl", {
            type: types_2.AddBeachBarImgUrlResult,
            description: "Add an image (URL) to a #beach_bar",
            nullable: false,
            args: {
                beachBarId: schema_1.intArg({
                    required: true,
                    description: "The ID value of the #beach_bar",
                }),
                imgUrl: schema_1.arg({
                    type: common_2.UrlScalar,
                    required: true,
                    description: "The URL value of the image",
                }),
                description: schema_1.stringArg({
                    required: false,
                    description: "A short description about what the image represents. The characters of the description should not exceed the number 175",
                }),
            },
            resolve: (_, { beachBarId, imgUrl, description }, { payload }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload) {
                    return { error: { code: common_1.errors.NOT_AUTHENTICATED_CODE, message: common_1.errors.NOT_AUTHENTICATED_MESSAGE } };
                }
                if (!checkScopes_1.checkScopes(payload, ["beach_bar@crud:beach_bar", "beach_bar@crud:beach_bar_img_url"])) {
                    return { error: { code: common_1.errors.UNAUTHORIZED_CODE, message: "You are not allowed to add an image to a #beach_bar" } };
                }
                if (!beachBarId || beachBarId <= 0 || !imgUrl) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: common_1.errors.SOMETHING_WENT_WRONG } };
                }
                const beachBar = yield BeachBar_1.BeachBar.findOne(beachBarId);
                if (!beachBar) {
                    return { error: { code: common_1.errors.CONFLICT, message: common_1.errors.BEACH_BAR_DOES_NOT_EXIST } };
                }
                const newImgUrl = BeachBarImgUrl_1.BeachBarImgUrl.create({
                    beachBar,
                    imgUrl: imgUrl.toString(),
                    description,
                });
                try {
                    yield newImgUrl.save();
                }
                catch (err) {
                    return { error: { message: `${common_1.errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
                }
                return {
                    imgUrl: newImgUrl,
                    added: true,
                };
            }),
        });
        t.field("updateBeachBaImgUrl", {
            type: types_2.UpdateBeachBarImgUrlResult,
            description: "Update the details of a #beach_bar's image",
            nullable: false,
            args: {
                imgUrlId: schema_1.idArg({
                    required: true,
                    description: "The ID value of the #beach_bar's image",
                }),
                imgUrl: schema_1.arg({
                    type: common_2.UrlScalar,
                    required: false,
                    description: "The URL value of the image",
                }),
                description: schema_1.stringArg({
                    required: false,
                    description: "A short description about what the image represents. The characters of the description should not exceed the number 175",
                }),
            },
            resolve: (_, { imgUrlId, imgUrl, description }, { payload }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload) {
                    return { error: { code: common_1.errors.NOT_AUTHENTICATED_CODE, message: common_1.errors.NOT_AUTHENTICATED_MESSAGE } };
                }
                if (!checkScopes_1.checkScopes(payload, ["beach_bar@crud:beach_bar", "beach_bar@crud:beach_bar_img_url", "beach_bar@update:beach_bar_img_url"])) {
                    return { error: { code: common_1.errors.UNAUTHORIZED_CODE, message: "You are not allowed to update an image of a #beach_bar" } };
                }
                if (!imgUrlId || imgUrlId <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: common_1.errors.SOMETHING_WENT_WRONG } };
                }
                const beachBarImgUrl = yield BeachBarImgUrl_1.BeachBarImgUrl.findOne({ where: { id: imgUrlId }, relations: ["beachBar"] });
                if (!beachBarImgUrl) {
                    return { error: { code: common_1.errors.CONFLICT, message: "Specified image does not exist" } };
                }
                try {
                    const updatedImgUrl = yield beachBarImgUrl.update(imgUrl, description);
                    return {
                        imgUrl: updatedImgUrl,
                        updated: true,
                    };
                }
                catch (err) {
                    return { error: { message: `${common_1.errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
                }
            }),
        });
        t.field("deleteBeachBarImgUrl", {
            type: types_1.DeleteResult,
            description: "Delete an image (URL) from a #beach_bar",
            nullable: false,
            args: {
                imgUrlId: schema_1.idArg({
                    required: true,
                    description: "The ID value of the #beach_bar's image",
                }),
            },
            resolve: (_, { imgUrlId }, { payload }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload) {
                    return { error: { code: common_1.errors.NOT_AUTHENTICATED_CODE, message: common_1.errors.NOT_AUTHENTICATED_MESSAGE } };
                }
                if (!checkScopes_1.checkScopes(payload, ["beach_bar@crud:beach_bar", "beach_bar@crud:beach_bar_img_url"])) {
                    return { error: { code: common_1.errors.UNAUTHORIZED_CODE, message: "You are not allowed to delete an image from a #beach_bar" } };
                }
                if (!imgUrlId || imgUrlId <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: common_1.errors.SOMETHING_WENT_WRONG } };
                }
                const imgUrl = yield BeachBarImgUrl_1.BeachBarImgUrl.findOne({ where: { id: imgUrlId }, relations: ["beachBar"] });
                if (!imgUrl) {
                    return { error: { code: common_1.errors.CONFLICT, message: "Specified image does not exist" } };
                }
                try {
                    yield imgUrl.softRemove();
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
//# sourceMappingURL=mutation.js.map