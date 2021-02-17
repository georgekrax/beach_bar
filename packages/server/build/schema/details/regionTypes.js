"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegionType = void 0;
const nexus_1 = require("nexus");
const cityTypes_1 = require("./cityTypes");
const countryTypes_1 = require("./countryTypes");
exports.RegionType = nexus_1.objectType({
    name: "Region",
    description: "Represents a country's or city's region",
    definition(t) {
        t.id("id");
        t.string("name");
        t.field("country", {
            type: countryTypes_1.CountryType,
            description: "The country the region is located at",
            resolve: o => o.country,
        });
        t.nullable.field("city", {
            type: cityTypes_1.CityType,
            description: "The city the region is located at",
            resolve: o => o.city,
        });
    },
});
