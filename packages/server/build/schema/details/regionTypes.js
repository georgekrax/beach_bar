"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegionType = void 0;
const schema_1 = require("@nexus/schema");
const cityTypes_1 = require("./cityTypes");
const countryTypes_1 = require("./countryTypes");
exports.RegionType = schema_1.objectType({
    name: "Region",
    description: "Represents a country's or city's region",
    definition(t) {
        t.int("id", { nullable: false });
        t.string("name", { nullable: false });
        t.field("country", {
            type: countryTypes_1.CountryType,
            description: "The country the region is located at",
            nullable: false,
            resolve: o => o.country,
        });
        t.field("city", {
            type: cityTypes_1.CityType,
            description: "The city the region is located at",
            nullable: true,
            resolve: o => o.city,
        });
    },
});
//# sourceMappingURL=regionTypes.js.map