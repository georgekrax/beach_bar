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
const apollo_server_express_1 = require("apollo-server-express");
const redisKeys_1 = __importDefault(require("constants/redisKeys"));
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
        t.list.field("searchInputValues", {
            type: types_1.FormattedSearchInputValueType,
            description: "Returns a list of formatted search input values",
            resolve: () => __awaiter(this, void 0, void 0, function* () {
                const inputValues = yield SearchInputValue_1.SearchInputValue.find({
                    relations: [
                        "country",
                        "city",
                        "city.country",
                        "region",
                        "region.country",
                        "beachBar",
                        "beachBar.location",
                        "beachBar.location.country",
                        "beachBar.location.city",
                        "beachBar.location.city.country",
                        "beachBar.location.region",
                        "beachBar.location.region.country",
                    ],
                });
                const beachBarsWithPayments = yield Promise.all(inputValues
                    .filter(({ beachBar }) => beachBar)
                    .map(({ beachBar }) => __awaiter(this, void 0, void 0, function* () {
                    const payments = yield beachBar.getPayments();
                    return Object.assign(Object.assign({}, beachBar), { payments });
                })));
                const sortedBeachBarsLocations = beachBarsWithPayments
                    .sort((a, b) => b.payments.length - a.payments.length)
                    .map(({ location }) => location);
                const sortedResults = inputValues.sort((a, b) => {
                    if ((a.countryId && !a.cityId) || (b.countryId && !b.cityId))
                        return 0;
                    if (a.beachBarId || b.beachBarId)
                        return 1;
                    const aCountryIdx = sortedBeachBarsLocations.findIndex(location => { var _a; return location.countryId.toString() === ((_a = a.countryId) === null || _a === void 0 ? void 0 : _a.toString()); });
                    const bCountryIdx = sortedBeachBarsLocations.findIndex(location => { var _a; return location.countryId.toString() === ((_a = b.countryId) === null || _a === void 0 ? void 0 : _a.toString()); });
                    let res = bCountryIdx - aCountryIdx;
                    const aCityIdx = sortedBeachBarsLocations.findIndex(location => { var _a; return location.cityId.toString() === ((_a = a.cityId) === null || _a === void 0 ? void 0 : _a.toString()); });
                    const bCityIdx = sortedBeachBarsLocations.findIndex(location => { var _a; return location.cityId.toString() === ((_a = b.cityId) === null || _a === void 0 ? void 0 : _a.toString()); });
                    res = bCityIdx - aCityIdx;
                    return res;
                });
                return [...sortedResults];
            }),
        });
        t.list.field("getLatestUserSearches", {
            type: types_1.UserSearchType,
            description: "Get a list with a user's latest searches",
            resolve: (_, __, { payload, redis }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload || !payload.sub)
                    return [];
                const searches = (yield redis.lrange(`${redisKeys_1.default.USER}:${payload.sub}:${redisKeys_1.default.USER_SEARCH}`, 0, -1)).map((x) => JSON.parse(x));
                const userSearches = searches.filter(search => search.search.userId && parseInt(search.search.userId.toString()) === payload.sub);
                const result = [];
                const map = new Map();
                for (let i = 0; i < userSearches.length; i++) {
                    if (!map.has(userSearches[i].search.inputValueId)) {
                        map.set(userSearches[i].search.inputValueId, true);
                        result.push(userSearches[i].search);
                    }
                }
                return result.sort((a, b) => (dayjs_1.default(a.updatedAt) > dayjs_1.default(b.updatedAt) ? -1 : 1));
            }),
        });
        t.nullable.field("search", {
            type: types_1.SearchType,
            description: "Search for available #beach_bars",
            args: {
                inputId: nexus_1.nullable(nexus_1.idArg({
                    description: "The ID value of the search input value, found in the documentation",
                })),
                inputValue: nexus_1.nullable(nexus_1.stringArg({
                    description: "The search input value, found in the documentation",
                })),
                availability: nexus_1.nullable(nexus_1.arg({ type: types_1.SearchInputType })),
                searchId: nexus_1.nullable(nexus_1.idArg({ description: "The ID value of a previous user search" })),
                filterIds: nexus_1.nullable(nexus_1.list(nexus_1.stringArg({ description: "A list with the filter IDs to add in the search, found in the documentation" }))),
                sortId: nexus_1.nullable(nexus_1.idArg({ description: "A ID of the sort filter the user has selected, found in the documentation" })),
            },
            resolve: (_, { inputId, inputValue, availability, searchId, filterIds, sortId }, { payload, redis, ipAddr }) => __awaiter(this, void 0, void 0, function* () {
                dayjs_1.default.extend(utc_1.default);
                if (searchId && !payload) {
                    const searches = (yield redis.lrange(redisKeys_1.default.USER_SEARCH, 0, -1)).map((x) => JSON.parse(x));
                    const userSearch = searches.find(search => BigInt(search.search.id) === BigInt(searchId));
                    if (!userSearch)
                        throw new apollo_server_express_1.ApolloError(`User search with ID ${searchId} was not found`, common_1.errors.NOT_FOUND);
                    yield UserHistory_1.UserHistory.create({
                        activityId: common_1.COMMON_CONFIG.HISTORY_ACTIVITY.SEARCH_ID,
                        objectId: userSearch.search.id,
                        userId: undefined,
                        ipAddr,
                    }).save();
                    return userSearch;
                }
                else if (searchId && payload) {
                    const searches = (yield redis.lrange(`${redisKeys_1.default.USER}:${payload.sub}:${redisKeys_1.default.USER_SEARCH}`, 0, -1)).map((x) => JSON.parse(x));
                    const userSearch = searches.find(search => BigInt(search.search.id) === BigInt(searchId));
                    if (!userSearch)
                        throw new apollo_server_express_1.ApolloError(`User search with ID ${searchId} was not found`, common_1.errors.NOT_FOUND);
                    yield UserHistory_1.UserHistory.create({
                        activityId: common_1.COMMON_CONFIG.HISTORY_ACTIVITY.SEARCH_ID,
                        objectId: userSearch.search.id,
                        userId: payload.sub,
                        ipAddr,
                    }).save();
                    return userSearch;
                }
                else {
                    if (!inputId && !inputValue)
                        throw new apollo_server_express_1.UserInputError("You should specify either an inputId or an inputValue");
                    if (inputId && (inputId.trim().length === 0 || inputId.length !== 5))
                        throw new apollo_server_express_1.UserInputError("Invalid inputId");
                    if (inputValue && inputValue.trim().length === 0)
                        throw new apollo_server_express_1.UserInputError("Invalid inputValue");
                    if (availability) {
                        if (availability.date && dayjs_1.default(availability.date).add(1, "day") < dayjs_1.default())
                            throw new apollo_server_express_1.ApolloError("Please provide a date later or equal to today", common_1.errors.LATER_DATE_ERROR_CODE);
                        if (availability.adults !== undefined && availability.adults > 12)
                            throw new apollo_server_express_1.ApolloError("You cannot search for more than 12 adults", common_1.errors.MAX_ADULTS_ERROR_CODE);
                        if (availability.children !== undefined && availability.children > 8)
                            throw new apollo_server_express_1.ApolloError("You cannot search for more than 8 children", common_1.errors.MAX_CHILDREN_ERROR_CODE);
                    }
                    let searchInput;
                    if (inputId)
                        searchInput = yield SearchInputValue_1.SearchInputValue.findOne({ publicId: inputId.trim() });
                    else if (inputValue) {
                        const allSearchInputs = yield SearchInputValue_1.SearchInputValue.find({ relations: ["country", "city", "region", "beachBar"] });
                        searchInput = allSearchInputs.find(input => input.format().toLowerCase().includes(inputValue.toLowerCase()));
                    }
                    if (!searchInput)
                        throw new apollo_server_express_1.ApolloError("Invalid search input", common_1.errors.NOT_FOUND);
                    const redisResults = yield BeachBar_1.BeachBar.find({ where: { isActive: true }, relations: ["features", "products", "location"] });
                    redisResults.forEach(beachBar => (beachBar.features = beachBar.features.filter((feature) => !feature.deletedAt)));
                    redisResults.forEach(beachBar => (beachBar.products = beachBar.products.filter((product) => !product.deletedAt)));
                    let beachBars = [];
                    if (searchInput.beachBarId) {
                        beachBars = redisResults.filter(beachBar => beachBar.id === searchInput.beachBarId);
                        beachBars = beachBars.slice(0, beachBars.length);
                    }
                    else {
                        if (searchInput.countryId)
                            beachBars = redisResults.filter(beachBar => beachBar.location.countryId === searchInput.countryId);
                        if (searchInput.cityId)
                            beachBars = redisResults.filter(beachBar => beachBar.location.cityId === searchInput.cityId);
                        if (searchInput.regionId)
                            beachBars = redisResults.filter(beachBar => beachBar.location.regionId === searchInput.regionId);
                    }
                    let results = beachBars.map(bar => ({
                        beachBar: bar,
                        availability: { hasAvailability: undefined, hasCapacity: undefined },
                    }));
                    if (availability && availability.date) {
                        const { date } = availability;
                        const timeId = availability.timeId ? availability.timeId : undefined;
                        const adults = availability.adults || 0;
                        const children = availability.children || 0;
                        results = [];
                        const totalPeople = adults + children !== 0 ? adults + children : undefined;
                        for (let i = 0; i < beachBars.length; i++) {
                            const { hasAvailability, hasCapacity } = yield checkAvailability_1.checkAvailability(redis, beachBars[i], date, timeId, totalPeople);
                            results.push({ beachBar: beachBars[i], availability: { hasAvailability, hasCapacity } });
                        }
                    }
                    let filters = [];
                    if (filterIds && filterIds.length > 0)
                        filters = yield SearchFilter_1.SearchFilter.find({ where: { publicId: typeorm_1.In(filterIds) } });
                    const userSearch = UserSearch_1.UserSearch.create({
                        searchDate: availability && availability.date ? dayjs_1.default(availability.date).format(common_1.dayjsFormat.ISO_STRING) : undefined,
                        searchAdults: availability && availability.adults,
                        searchChildren: availability && availability.children,
                        userId: payload ? payload.sub : undefined,
                        inputValue: searchInput,
                        inputValueId: searchInput.id,
                        filters,
                        sortId,
                    });
                    try {
                        yield userSearch.save();
                        const res = { results, search: userSearch };
                        if (payload && payload.sub)
                            yield redis.lpush(`${redisKeys_1.default.USER}:${payload.sub}:${redisKeys_1.default.USER_SEARCH}`, JSON.stringify(res));
                        yield redis.lpush(redisKeys_1.default.USER_SEARCH, JSON.stringify(res));
                        yield UserHistory_1.UserHistory.create({
                            activityId: common_1.COMMON_CONFIG.HISTORY_ACTIVITY.SEARCH_ID,
                            objectId: userSearch.id,
                            userId: payload ? payload.sub : undefined,
                            ipAddr,
                        }).save();
                        return res;
                    }
                    catch (err) {
                        throw new apollo_server_express_1.ApolloError(common_1.errors.SOMETHING_WENT_WRONG + ": " + err.message, common_1.errors.INTERNAL_SERVER_ERROR);
                    }
                }
            }),
        });
    },
});
