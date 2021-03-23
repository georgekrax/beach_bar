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
const apollo_server_express_1 = require("apollo-server-express");
const BeachBar_1 = require("entity/BeachBar");
const BeachBarLocation_1 = require("entity/BeachBarLocation");
const City_1 = require("entity/City");
const Country_1 = require("entity/Country");
const Region_1 = require("entity/Region");
const nexus_1 = require("nexus");
const checkScopes_1 = require("utils/checkScopes");
const types_1 = require("./types");
exports.BeachBarLocationCrudMutation = nexus_1.extendType({
    type: "Mutation",
    definition(t) {
        t.field("addBeachBarLocation", {
            type: types_1.AddBeachBarLocationType,
            description: "Add (assign) a location to a #beach_bar",
            args: {
                beachBarId: nexus_1.idArg({ description: "The ID value of the #beach_bar" }),
                address: nexus_1.stringArg({ description: "The address of the #beach_bar" }),
                zipCode: nexus_1.nullable(nexus_1.stringArg({
                    description: "The zip (postal) code of the #beach_bar",
                })),
                latitude: nexus_1.stringArg({ description: "The latitude of the location of the #beach_bar" }),
                longitude: nexus_1.stringArg({ description: "The longitude of the location of the #beach_bar" }),
                countryId: nexus_1.idArg({ description: "The ID value of the country the #beach_bar is located at" }),
                city: nexus_1.stringArg({ description: "The city the #beach_bar is located at" }),
                region: nexus_1.nullable(nexus_1.idArg({ description: "The #beach_bar's region" })),
            },
            resolve: (_, { beachBarId, address, zipCode, latitude, longitude, countryId, city, region }, { payload }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload || !payload.sub)
                    throw new apollo_server_express_1.ApolloError(common_1.errors.NOT_AUTHENTICATED_MESSAGE, common_1.errors.NOT_AUTHENTICATED_CODE);
                if (!checkScopes_1.checkScopes(payload, ["beach_bar@crud:beach_bar"]))
                    throw new apollo_server_express_1.ApolloError(common_1.errors.NOT_AUTHENTICATED_CODE, common_1.errors.NOT_REGISTERED_PRIMARY_OWNER);
                if (!beachBarId || beachBarId.trim().length === 0 || !latitude || latitude.length > 16 || !longitude || longitude.length > 16)
                    throw new apollo_server_express_1.ApolloError(common_1.errors.SOMETHING_WENT_WRONG, common_1.errors.INVALID_ARGUMENTS);
                const beachBar = yield BeachBar_1.BeachBar.findOne({
                    where: { id: beachBarId },
                    relations: ["location", "reviews", "features", "products", "entryFees", "restaurants"],
                });
                if (!beachBar)
                    throw new apollo_server_express_1.ApolloError(common_1.errors.BEACH_BAR_DOES_NOT_EXIST, common_1.errors.NOT_FOUND);
                const country = yield Country_1.Country.findOne(countryId);
                if (!country)
                    throw new apollo_server_express_1.ApolloError("Specified country does not exist", common_1.errors.NOT_FOUND);
                let newCity = undefined;
                newCity = yield City_1.City.findOne({ where: `"name" ILIKE '${city}'` });
                if (!newCity) {
                    newCity = City_1.City.create({
                        name: city,
                        countryId: country.id,
                        country,
                    });
                    yield newCity.save();
                }
                let newRegion = undefined;
                if (region) {
                    newRegion = yield Region_1.Region.findOne({ where: `"name" ILIKE '${region}'` });
                    if (!newRegion) {
                        newRegion = Region_1.Region.create({
                            name: region,
                            countryId: country.id,
                            country: country,
                            cityId: city.id,
                            city: newCity,
                        });
                        yield newRegion.save();
                    }
                }
                const newLocation = BeachBarLocation_1.BeachBarLocation.create({
                    beachBar,
                    address,
                    zipCode,
                    latitude,
                    longitude,
                    country,
                    city: newCity,
                    region: newRegion,
                });
                try {
                    yield newLocation.save();
                    yield beachBar.updateRedis();
                }
                catch (err) {
                    if (err.message === 'duplicate key value violates unique constraint "beach_bar_location_beach_bar_id_key"')
                        throw new apollo_server_express_1.ApolloError("You have already set the location of this #beach_bar.", common_1.errors.CONFLICT);
                    throw new apollo_server_express_1.ApolloError(common_1.errors.SOMETHING_WENT_WRONG + ": " + err.message);
                }
                return {
                    location: newLocation,
                    added: true,
                };
            }),
        });
        t.field("updateBeachBarLocation", {
            type: types_1.UpdateBeachBarLocationType,
            description: "Update the location details of a #beach_bar",
            args: {
                locationId: nexus_1.idArg({ description: "The ID value of the #beach_bar location" }),
                address: nexus_1.nullable(nexus_1.stringArg({ description: "The address of the #beach_bar" })),
                zipCode: nexus_1.nullable(nexus_1.stringArg({
                    description: "The zip (postal) code of the #beach_bar",
                })),
                latitude: nexus_1.nullable(nexus_1.stringArg({ description: "The latitude of the location of the #beach_bar" })),
                longitude: nexus_1.nullable(nexus_1.stringArg({ description: "The longitude of the location of the #beach_bar" })),
                countryId: nexus_1.nullable(nexus_1.idArg({ description: "The ID value of the country the #beach_bar is located at" })),
                city: nexus_1.nullable(nexus_1.stringArg({ description: "The city the #beach_bar is located at" })),
                region: nexus_1.nullable(nexus_1.stringArg({ description: "The #beach_bar's region" })),
            },
            resolve: (_, { locationId, address, zipCode, latitude, longitude, countryId, city, region }, { payload }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload || !payload.sub)
                    throw new apollo_server_express_1.ApolloError(common_1.errors.NOT_AUTHENTICATED_MESSAGE, common_1.errors.NOT_AUTHENTICATED_CODE);
                if (!checkScopes_1.checkScopes(payload, ["beach_bar@crud:beach_bar", "beach_bar@update:beach_bar"]))
                    throw new apollo_server_express_1.ApolloError("You are not allowed to update 'this' #beach_bar location details", common_1.errors.UNAUTHORIZED_CODE);
                const location = yield BeachBarLocation_1.BeachBarLocation.findOne({
                    where: { id: locationId },
                    relations: ["beachBar", "country", "city", "region"],
                });
                if (!location)
                    throw new apollo_server_express_1.ApolloError("#beach_bar location does not exist", common_1.errors.NOT_FOUND);
                try {
                    const updatedLocation = yield location.update({ address, zipCode, latitude, longitude, countryId, city, region });
                    return {
                        location: updatedLocation,
                        updated: true,
                    };
                }
                catch (err) {
                    throw new apollo_server_express_1.ApolloError(common_1.errors.SOMETHING_WENT_WRONG + ": " + err.message);
                }
            }),
        });
    },
});
