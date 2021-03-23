"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBeachBarLocationType = exports.AddBeachBarLocationType = exports.BeachBarLocationType = void 0;
const nexus_1 = require("nexus");
const cityTypes_1 = require("../../details/cityTypes");
const countryTypes_1 = require("../../details/countryTypes");
const regionTypes_1 = require("../../details/regionTypes");
exports.BeachBarLocationType = nexus_1.objectType({
    name: "BeachBarLocation",
    description: "Represents a #beach_bar's location details",
    definition(t) {
        t.id("id");
        t.string("address", { description: "The street address of the #beach_bar" });
        t.nullable.string("zipCode", { description: "The zip code of the #beach_bar, for its street address" });
        t.float("latitude", { description: "The latitude of the #beach_bar in the maps, provided by Mapbox" });
        t.float("longitude", { description: "The longitude of the #beach_bar in the maps, provided by Mapbox" });
        t.nullable.list.float("whereIs", {
            description: "The 'point' value generated from latitude & longitude, provided by the PostGIS PostgreSQL extension",
            resolve: o => {
                if (o.whereIs.coordinates) {
                    return o.whereIs.coordinates;
                }
                else {
                    return null;
                }
            },
        });
        t.field("country", {
            type: countryTypes_1.CountryType,
            description: "The country the #beach_bar is located at",
            resolve: o => o.country,
        });
        t.field("city", {
            type: cityTypes_1.CityType,
            description: "The city the #beach_bar is located at",
            resolve: o => o.city,
        });
        t.nullable.field("region", {
            type: regionTypes_1.RegionType,
            description: "The region the #beach_bar is located at",
            resolve: o => o.region,
        });
    },
});
exports.AddBeachBarLocationType = nexus_1.objectType({
    name: "AddBeachBarLocation",
    description: "Info to be returned when location is added (assigned) to a #beach_bar",
    definition(t) {
        t.field("location", {
            type: exports.BeachBarLocationType,
            description: "The location of the #beach_bar that is added",
            resolve: o => o.location,
        });
        t.boolean("added", { description: "A boolean that indicates if the #beach_bar locations has been successfully being added" });
    },
});
exports.UpdateBeachBarLocationType = nexus_1.objectType({
    name: "UpdateBeachBarLocation",
    description: "Info to be returned when the details of #beach_bar location are updated",
    definition(t) {
        t.field("location", {
            type: exports.BeachBarLocationType,
            description: "The #beach_bar location that is updated",
            resolve: o => o.location,
        });
        t.boolean("updated", {
            description: "A boolean that indicates if the #beach_bar location details have been successfully updated",
        });
    },
});
