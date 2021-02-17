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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeachBarEntryFeeQuery = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const BeachBarEntryFee_1 = require("entity/BeachBarEntryFee");
const nexus_1 = require("nexus");
const typeorm_1 = require("typeorm");
const types_1 = require("./types");
exports.BeachBarEntryFeeQuery = nexus_1.extendType({
    type: "Query",
    definition(t) {
        t.list.field("getAllBeachBarEntryFees", {
            type: types_1.BeachBarEntryFeeType,
            description: "Get a list with all entry fees of a #beach_bar",
            args: {
                beachBarId: nexus_1.intArg({ description: "The ID value of the #beach_bar" }),
                moreThanOrEqualToToday: nexus_1.nullable(nexus_1.booleanArg({
                    description: "Set to true if to retrieve the entry fees from today and in the future. Its default value is set to true",
                    default: true,
                })),
            },
            resolve: (_, { beachBarId, moreThanOrEqualToToday }) => __awaiter(this, void 0, void 0, function* () {
                if (moreThanOrEqualToToday) {
                    const entryFees = yield BeachBarEntryFee_1.BeachBarEntryFee.find({
                        where: { beachBarId, date: typeorm_1.MoreThanOrEqual(dayjs_1.default()) },
                        relations: ["beachBar"],
                    });
                    return entryFees;
                }
                else {
                    const entryFees = yield BeachBarEntryFee_1.BeachBarEntryFee.find({ where: { beachBarId }, relations: ["beachBar"] });
                    return entryFees;
                }
            }),
        });
    },
});
