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
exports.SearchUpdateMutation = void 0;
const SearchFilter_1 = require("entity/SearchFilter");
const UserSearch_1 = require("entity/UserSearch");
const nexus_1 = require("nexus");
const typeorm_1 = require("typeorm");
const arrEquals_1 = __importDefault(require("utils/arrEquals"));
const types_1 = require("./types");
exports.SearchUpdateMutation = nexus_1.extendType({
    type: "Mutation",
    definition(t) {
        t.nullable.field("updateSearch", {
            type: types_1.UserSearchType,
            description: "Update a previous user's search",
            args: {
                searchId: nexus_1.idArg({
                    description: "The ID value of a previous user search",
                }),
                filterIds: nexus_1.list(nexus_1.nullable(nexus_1.stringArg({
                    description: "A list with the filter IDs to add in the search, found in the documentation",
                }))),
            },
            resolve: (_, { searchId, filterIds }, { payload, redis }) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                if (!searchId || searchId <= 0) {
                    return null;
                }
                const userSearch = yield UserSearch_1.UserSearch.findOne({ where: { id: searchId }, relations: ["filters"] });
                if (!userSearch) {
                    return null;
                }
                if ((userSearch.filters &&
                    !arrEquals_1.default(filterIds, userSearch.filters.map(filter => filter.publicId))) ||
                    filterIds.length === 0 ||
                    ((_a = userSearch.filters) === null || _a === void 0 ? void 0 : _a.length) === 0) {
                    if (filterIds) {
                        const filters = yield SearchFilter_1.SearchFilter.find({ where: { publicId: typeorm_1.In(filterIds) } });
                        userSearch.filters = filters;
                    }
                    else {
                        userSearch.filters = [];
                    }
                    try {
                        yield userSearch.save();
                        const idx = yield userSearch.getRedisIdx(redis, payload ? payload.sub : undefined);
                        yield redis.lset(userSearch.getRedisKey(payload ? payload.sub : undefined), idx, JSON.stringify(userSearch));
                    }
                    catch (err) {
                        return null;
                    }
                }
                return userSearch;
            }),
        });
    },
});
