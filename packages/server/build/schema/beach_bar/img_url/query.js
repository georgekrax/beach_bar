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
exports.BeachBarImgUrlQuery = void 0;
const BeachBarImgUrl_1 = require("entity/BeachBarImgUrl");
const nexus_1 = require("nexus");
const types_1 = require("./types");
exports.BeachBarImgUrlQuery = nexus_1.extendType({
    type: "Query",
    definition(t) {
        t.nullable.list.field("getBeachBarImgUrl", {
            type: types_1.BeachBarImgUrlType,
            description: "Get a list with all the images (URL values) of a #beach_bar",
            args: {
                beachBarId: nexus_1.intArg({ description: "The ID value of the #beach_bar" }),
            },
            resolve: (_, { beachBarId }) => __awaiter(this, void 0, void 0, function* () {
                if (!beachBarId || beachBarId <= 0) {
                    return null;
                }
                const imgUrls = yield BeachBarImgUrl_1.BeachBarImgUrl.find({ where: { beachBarId }, relations: ["beachBar"] });
                return imgUrls;
            }),
        });
    },
});
