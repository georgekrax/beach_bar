"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBeachBarLocationResult = exports.UpdateBeachBarLocationType = exports.AddBeachBarLocationResult = exports.AddBeachBarLocationType = exports.BeachBarLocationType = void 0;
const schema_1 = require("@nexus/schema");
const cityTypes_1 = require("../../details/cityTypes");
const countryTypes_1 = require("../../details/countryTypes");
const regionTypes_1 = require("../../details/regionTypes");
exports.BeachBarLocationType = schema_1.objectType({
    name: "BeachBarLocation",
    description: "Represents a #beach_bar's location details",
    definition(t) {
        t.int("id", { nullable: false });
        t.string("address", { nullable: false, description: "The street address of the #beach_bar" });
        t.string("zipCode", { nullable: true, description: "The zip code of the #beach_bar, for its street address" });
        t.float("latitude", { nullable: false, description: "The latitude of the #beach_bar in the maps, provided by Mapbox" });
        t.float("longitude", { nullable: false, description: "The longitude of the #beach_bar in the maps, provided by Mapbox" });
        t.list.float("whereIs", {
            nullable: true,
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
            nullable: false,
            resolve: o => o.country,
        });
        t.field("city", {
            type: cityTypes_1.CityType,
            description: "The city the #beach_bar is located at",
            nullable: false,
            resolve: o => o.city,
        });
        t.field("region", {
            type: regionTypes_1.RegionType,
            description: "The region the #beach_bar is located at",
            nullable: true,
            resolve: o => o.region,
        });
    },
});
exports.AddBeachBarLocationType = schema_1.objectType({
    name: "AddBeachBarLocation",
    description: "Info to be returned when location is added (assigned) to a #beach_bar",
    definition(t) {
        t.field("location", {
            type: exports.BeachBarLocationType,
            description: "The location of the #beach_bar that is added",
            nullable: false,
            resolve: o => o.location,
        });
        t.boolean("added", {
            nullable: false,
            description: "A boolean that indicates if the #beach_bar locations has been successfully being added",
        });
    },
});
exports.AddBeachBarLocationResult = schema_1.unionType({
    name: "AddBeachBarLocationResult",
    definition(t) {
        t.members("AddBeachBarLocation", "Error");
        t.resolveType(item => {
            if (item.error) {
                return "Error";
            }
            else {
                return "AddBeachBarLocation";
            }
        });
    },
});
exports.UpdateBeachBarLocationType = schema_1.objectType({
    name: "UpdateBeachBarLocation",
    description: "Info to be returned when the details of #beach_bar location are updated",
    definition(t) {
        t.field("location", {
            type: exports.BeachBarLocationType,
            description: "The #beach_bar location that is updated",
            nullable: false,
            resolve: o => o.location,
        });
        t.boolean("updated", {
            nullable: false,
            description: "A boolean that indicates if the #beach_bar location details have been successfully updated",
        });
    },
});
exports.UpdateBeachBarLocationResult = schema_1.unionType({
    name: "UpdateBeachBarLocationResult",
    definition(t) {
        t.members("UpdateBeachBarLocation", "Error");
        t.resolveType(item => {
            if (item.error) {
                return "Error";
            }
            else {
                return "UpdateBeachBarLocation";
            }
        });
    },
});
//# sourceMappingURL=types.js.map