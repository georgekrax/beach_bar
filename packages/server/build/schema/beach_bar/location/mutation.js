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
exports.BeachBarLocationCrudMutation = void 0;
const common_1 = require("@beach_bar/common");
const schema_1 = require("@nexus/schema");
const BeachBar_1 = require("entity/BeachBar");
const BeachBarLocation_1 = require("entity/BeachBarLocation");
const City_1 = require("entity/City");
const Country_1 = require("entity/Country");
const Region_1 = require("entity/Region");
const checkScopes_1 = require("utils/checkScopes");
const types_1 = require("./types");
exports.BeachBarLocationCrudMutation = schema_1.extendType({
    type: "Mutation",
    definition(t) {
        t.field("addBeachBarLocation", {
            type: types_1.AddBeachBarLocationResult,
            description: "Add (assign) a location to a #beach_bar",
            nullable: false,
            args: {
                beachBarId: schema_1.intArg({
                    required: true,
                    description: "The ID value of the #beach_bar",
                }),
                address: schema_1.stringArg({
                    required: true,
                    description: "The address of the #beach_bar",
                }),
                zipCode: schema_1.stringArg({
                    required: false,
                    description: "The zip (postal) code of the #beach_bar",
                }),
                latitude: schema_1.stringArg({
                    required: true,
                    description: "The latitude of the location of the #beach_bar",
                }),
                longitude: schema_1.stringArg({
                    required: true,
                    description: "The longitude of the location of the #beach_bar",
                }),
                countryId: schema_1.idArg({
                    required: true,
                    description: "The ID value of the country the #beach_bar is located at",
                }),
                cityId: schema_1.idArg({
                    required: true,
                    description: "The ID value of the city the #beach_bar is located at",
                }),
                regionId: schema_1.intArg({
                    required: false,
                    description: "The ID value of the #beach_bar region",
                }),
            },
            resolve: (_, { beachBarId, address, zipCode, latitude, longitude, countryId, cityId, regionId }, { payload }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload) {
                    return { error: { code: common_1.errors.NOT_AUTHENTICATED_CODE, message: common_1.errors.NOT_AUTHENTICATED_MESSAGE } };
                }
                if (!checkScopes_1.checkScopes(payload, ["beach_bar@crud:beach_bar"])) {
                    return {
                        error: { code: common_1.errors.UNAUTHORIZED_CODE, message: common_1.errors.NOT_REGISTERED_PRIMARY_OWNER },
                    };
                }
                if (!beachBarId || beachBarId <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: common_1.errors.SOMETHING_WENT_WRONG } };
                }
                if (!latitude || latitude.length > 16) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: common_1.errors.SOMETHING_WENT_WRONG } };
                }
                if (!longitude || longitude.length > 16) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: common_1.errors.SOMETHING_WENT_WRONG } };
                }
                if (!countryId || countryId <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid country" } };
                }
                if (!cityId || cityId <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid city" } };
                }
                const beachBar = yield BeachBar_1.BeachBar.findOne({
                    where: { id: beachBarId },
                    relations: ["location", "reviews", "features", "products", "entryFees", "restaurants"],
                });
                if (!beachBar) {
                    return { error: { code: common_1.errors.CONFLICT, message: common_1.errors.BEACH_BAR_DOES_NOT_EXIST } };
                }
                const country = yield Country_1.Country.findOne(countryId);
                if (!country) {
                    return { error: { code: common_1.errors.CONFLICT, message: "Specified country does not exist" } };
                }
                const city = yield City_1.City.findOne(cityId);
                if (!city) {
                    return { error: { code: common_1.errors.CONFLICT, message: "Specified city does not exist" } };
                }
                let region = undefined;
                if (regionId) {
                    const beachBarRegion = yield Region_1.Region.findOne(regionId);
                    if (!region) {
                        return { error: { code: common_1.errors.CONFLICT, message: "Specified region does not exist" } };
                    }
                    region = beachBarRegion;
                }
                const newLocation = BeachBarLocation_1.BeachBarLocation.create({
                    beachBar,
                    address,
                    zipCode,
                    latitude,
                    longitude,
                    country,
                    city,
                    region,
                });
                try {
                    yield newLocation.save();
                    yield beachBar.updateRedis();
                }
                catch (err) {
                    if (err.message === 'duplicate key value violates unique constraint "beach_bar_location_beach_bar_id_key"') {
                        return { error: { code: common_1.errors.CONFLICT, message: "You have already set the location of this #beach_bar" } };
                    }
                    return { error: { message: `${common_1.errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
                }
                return {
                    location: newLocation,
                    added: true,
                };
            }),
        });
        t.field("updateBeachBarLocation", {
            type: types_1.UpdateBeachBarLocationResult,
            description: "Update the location details of a #beach_bar",
            nullable: false,
            args: {
                locationId: schema_1.intArg({
                    required: true,
                    description: "The ID value of the #beach_bar location",
                }),
                address: schema_1.stringArg({
                    required: false,
                    description: "The address of the #beach_bar",
                }),
                zipCode: schema_1.stringArg({
                    required: false,
                    description: "The zip (postal) code of the #beach_bar",
                }),
                latitude: schema_1.stringArg({
                    required: false,
                    description: "The latitude of the location of the #beach_bar",
                }),
                longitude: schema_1.stringArg({
                    required: false,
                    description: "The longitude of the location of the #beach_bar",
                }),
                countryId: schema_1.intArg({
                    required: false,
                    description: "The ID value of the country the #beach_bar is located at",
                }),
                cityId: schema_1.intArg({
                    required: false,
                    description: "The ID value of the city the #beach_bar is located at",
                }),
                regionId: schema_1.intArg({
                    required: false,
                    description: "The ID value of the #beach_bar region",
                }),
            },
            resolve: (_, { locationId, address, zipCode, latitude, longitude, countryId, cityId, regionId }, { payload }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload) {
                    return { error: { code: common_1.errors.NOT_AUTHENTICATED_CODE, message: common_1.errors.NOT_AUTHENTICATED_MESSAGE } };
                }
                if (!checkScopes_1.checkScopes(payload, ["beach_bar@crud:beach_bar", "beach_bar@update:beach_bar"])) {
                    return {
                        error: { code: common_1.errors.UNAUTHORIZED_CODE, message: "You are not allowed to update 'this' #beach_bar location details" },
                    };
                }
                if (!locationId || locationId <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: common_1.errors.SOMETHING_WENT_WRONG } };
                }
                const location = yield BeachBarLocation_1.BeachBarLocation.findOne({
                    where: { id: locationId },
                    relations: ["beachBar", "country", "city", "region"],
                });
                if (!location) {
                    return { error: { code: common_1.errors.CONFLICT, message: common_1.errors.SOMETHING_WENT_WRONG } };
                }
                try {
                    const updatedLocation = yield location.update(address, zipCode, latitude, longitude, countryId, cityId, regionId);
                    return {
                        location: updatedLocation,
                        updated: true,
                    };
                }
                catch (err) {
                    return { error: { message: `${common_1.errors.SOMETHING_WENT_WRONG}${err.message ? `: ${err.message}` : ""}}` } };
                }
            }),
        });
    },
});
//# sourceMappingURL=mutation.js.map