"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CityType = void 0;
const nexus_1 = require("nexus");
const countryTypes_1 = require("./countryTypes");
exports.CityType = nexus_1.objectType({
    name: "City",
    description: "Represents a city of a country",
    definition(t) {
        t.id("id", { description: "The ID of the city" });
        t.string("name", { description: "The name of the city" });
        t.nullable.string("secondName", { description: "A second name of the city" });
        t.nullable.field("country", {
            type: countryTypes_1.CountryType,
            description: "The country of the city",
            resolve: o => o.country,
        });
    },
});
