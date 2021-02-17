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
exports.SearchQuery = void 0;
const common_1 = require("@beach_bar/common");
const redisKeys_1 = __importDefault(require("constants/redisKeys"));
const _index_1 = require("constants/_index");
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const BeachBar_1 = require("entity/BeachBar");
const SearchFilter_1 = require("entity/SearchFilter");
const SearchInputValue_1 = require("entity/SearchInputValue");
const UserHistory_1 = require("entity/UserHistory");
const UserSearch_1 = require("entity/UserSearch");
const nexus_1 = require("nexus");
const typeorm_1 = require("typeorm");
const checkAvailability_1 = require("utils/beach_bar/checkAvailability");
const types_1 = require("./types");
exports.SearchQuery = nexus_1.extendType({
    type: "Query",
    definition(t) {
        t.list.field("getSearchInputValues", {
            type: types_1.FormattedSearchInputValueType,
            description: "Returns a list of formatted search input values",
            resolve: () => __awaiter(this, void 0, void 0, function* () {
                const inputValues = yield SearchInputValue_1.SearchInputValue.find({ relations: ["country", "city", "region", "beachBar"] });
                return inputValues;
            }),
        });
        t.nullable.list.field("getLatestUserSearches", {
            type: types_1.UserSearchType,
            description: "Get a list with a user's latest searches",
            resolve: (_, __, { payload, redis }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload) {
                    return null;
                }
                const searches = (yield redis.lrange(`${redisKeys_1.default.USER}:${payload.sub}:${redisKeys_1.default.USER_SEARCH}`, 0, -1)).map((x) => JSON.parse(x));
                const userSearches = searches.filter(search => search.userId && parseInt(search.userId.toString()) === payload.sub);
                const result = [];
                const map = new Map();
                for (let i = 0; i < userSearches.length; i++) {
                    if (!map.has(userSearches[i].inputValueId)) {
                        map.set(userSearches[i].inputValueId, true);
                        result.push(userSearches[i]);
                    }
                }
                return result;
            }),
        });
        t.nullable.field("search", {
            type: types_1.SearchResult,
            description: "Search for available #beach_bars",
            args: {
                inputId: nexus_1.nullable(nexus_1.stringArg({
                    description: "The ID value of the search input value, found in the documentation",
                })),
                inputValue: nexus_1.nullable(nexus_1.stringArg({
                    description: "The search input value, found in the documentation",
                })),
                availability: nexus_1.nullable(nexus_1.arg({ type: types_1.SearchInputType })),
                filterIds: nexus_1.list(nexus_1.nullable(nexus_1.stringArg({ description: "A list with the filter IDs to add in the search, found in the documentation" }))),
                searchId: nexus_1.nullable(nexus_1.idArg({ description: "The ID value of a previous user search" })),
            },
            resolve: (_, { inputId, inputValue, availability, filterIds, searchId }, { payload, redis, ipAddr }) => __awaiter(this, void 0, void 0, function* () {
                dayjs_1.default.extend(utc_1.default);
                if (searchId && !payload) {
                    const searches = (yield redis.lrange(redisKeys_1.default.USER_SEARCH, 0, -1)).map((x) => JSON.parse(x));
                    const userSearch = searches.find(search => BigInt(search.search.id) === BigInt(searchId));
                    if (!userSearch) {
                        return { error: { code: common_1.errors.CONFLICT, message: common_1.errors.SOMETHING_WENT_WRONG } };
                    }
                    yield UserHistory_1.UserHistory.create({
                        activityId: _index_1.historyActivity.SEARCH_ID,
                        objectId: userSearch.search.id,
                        userId: undefined,
                        ipAddr,
                    }).save();
                    return userSearch;
                }
                else if (searchId && payload) {
                    const searches = (yield redis.lrange(`${redisKeys_1.default.USER}:${payload.sub}:${redisKeys_1.default.USER_SEARCH}`, 0, -1)).map((x) => JSON.parse(x));
                    const userSearch = searches.find(search => BigInt(search.search.id) === BigInt(searchId));
                    if (!userSearch) {
                        return { error: { code: common_1.errors.CONFLICT, message: common_1.errors.SOMETHING_WENT_WRONG } };
                    }
                    yield UserHistory_1.UserHistory.create({
                        activityId: _index_1.historyActivity.SEARCH_ID,
                        objectId: userSearch.search.id,
                        userId: payload.sub,
                        ipAddr,
                    }).save();
                    return userSearch;
                }
                else {
                    if (!inputId && !inputValue) {
                        return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "You should specify either an inputId or an inputValue" } };
                    }
                    if (inputId && (inputId.trim().length === 0 || inputId.length !== 5)) {
                        return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Invalid inputId" } };
                    }
                    if (inputValue && inputValue.trim().length === 0) {
                        return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Invalid inputValue" } };
                    }
                    if (availability) {
                        if (availability.date && availability.date.add(1, "day") < dayjs_1.default()) {
                            return { error: { code: common_1.errors.LATER_DATE_ERROR_CODE, message: "Please provide a date later or equal to today" } };
                        }
                        if (availability.adults !== undefined && availability.adults > 12) {
                            return { error: { code: common_1.errors.MAX_ADULTS_ERROR_CODE, message: "You cannot search for more than 12 adults" } };
                        }
                        if (availability.children !== undefined && availability.children > 8) {
                            return { error: { code: common_1.errors.MAX_CHILDREN_ERROR_CODE, message: "You cannot search for more than 8 children" } };
                        }
                    }
                    let searchInput;
                    if (inputId) {
                        searchInput = yield SearchInputValue_1.SearchInputValue.findOne({ publicId: inputId.trim() });
                    }
                    else if (inputValue) {
                        const allSearchInputs = yield SearchInputValue_1.SearchInputValue.find({ relations: ["country", "city", "region", "beachBar"] });
                        searchInput = allSearchInputs.find(input => input.format().toLowerCase() === inputValue.toLowerCase());
                    }
                    if (!searchInput) {
                        return { error: { code: common_1.errors.CONFLICT, message: "Invalid search input" } };
                    }
                    const redisResults = (yield typeorm_1.getCustomRepository(BeachBar_1.BeachBarRepository).findInRedis()).filter(bar => bar.isActive);
                    redisResults.forEach(beachBar => (beachBar.features = beachBar.features.filter((feature) => !feature.deletedAt)));
                    redisResults.forEach(beachBar => (beachBar.products = beachBar.products.filter((product) => !product.deletedAt)));
                    let beachBars = [];
                    if (searchInput.beachBarId) {
                        beachBars = redisResults.filter(beachBar => beachBar.id === searchInput.beachBarId);
                        beachBars = beachBars.slice(0, beachBars.length);
                    }
                    else {
                        if (searchInput.countryId) {
                            beachBars = redisResults.filter(beachBar => beachBar.location.countryId === searchInput.countryId);
                        }
                        if (searchInput.cityId) {
                            beachBars = redisResults.filter(beachBar => beachBar.location.cityId === searchInput.cityId);
                        }
                        if (searchInput.regionId) {
                            beachBars = redisResults.filter(beachBar => beachBar.location.regionId === searchInput.regionId);
                        }
                    }
                    let results = beachBars.map(bar => {
                        return { beachBar: bar, availability: { hasAvailability: undefined, hasCapacity: undefined } };
                    });
                    if (availability && availability.date) {
                        const { date } = availability;
                        const timeId = availability.timeId ? availability.timeId : undefined;
                        const adults = availability.adults || 0;
                        const children = availability.children || 0;
                        results = [];
                        const totalPeople = adults + children !== 0 ? adults + children : undefined;
                        for (let i = 0; i < beachBars.length; i++) {
                            const { hasAvailability, hasCapacity } = yield checkAvailability_1.checkAvailability(redis, beachBars[i], date, timeId, totalPeople);
                            results.push({
                                beachBar: beachBars[i],
                                availability: {
                                    hasAvailability,
                                    hasCapacity,
                                },
                            });
                        }
                    }
                    let filters = [];
                    if (filterIds && filterIds.length > 0) {
                        filters = yield SearchFilter_1.SearchFilter.find({ where: { publicId: typeorm_1.In(filterIds) } });
                    }
                    const userSearch = UserSearch_1.UserSearch.create({
                        searchDate: availability && availability.date ? availability.date.format(common_1.dayjsFormat.ISO_STRING) : undefined,
                        searchAdults: availability && availability.adults,
                        searchChildren: availability && availability.children,
                        userId: payload ? payload.sub : undefined,
                        inputValue: searchInput,
                        filters,
                    });
                    try {
                        yield userSearch.save();
                        const returnResult = { results, search: userSearch };
                        if (payload && payload.sub) {
                            yield redis.lpush(`${redisKeys_1.default.USER}:${payload.sub}:${redisKeys_1.default.USER_SEARCH}`, JSON.stringify(returnResult));
                        }
                        yield redis.lpush(redisKeys_1.default.USER_SEARCH, JSON.stringify(returnResult));
                        yield UserHistory_1.UserHistory.create({
                            activityId: _index_1.historyActivity.SEARCH_ID,
                            objectId: userSearch.id,
                            userId: payload ? payload.sub : undefined,
                            ipAddr,
                        }).save();
                    }
                    catch (err) {
                        return { error: { code: common_1.errors.INTERNAL_SERVER_ERROR, message: `${common_1.errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
                    }
                    return {
                        results,
                        search: userSearch,
                    };
                }
            }),
        });
    },
});
