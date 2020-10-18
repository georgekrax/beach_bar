"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CityType = void 0;
const schema_1 = require("@nexus/schema");
const countryTypes_1 = require("./countryTypes");
exports.CityType = schema_1.objectType({
    name: "City",
    description: "Represents a city of a country",
    definition(t) {
        t.int("id", { nullable: false, description: "The ID of the city" });
        t.string("name", { nullable: false, description: "The name of the city" });
        t.string("secondName", { nullable: true, description: "A second name of the city" });
        t.field("country", {
            type: countryTypes_1.CountryType,
            nullable: true,
            description: "The country of the city",
            resolve: o => o.country,
        });
    },
});
//# sourceMappingURL=cityTypes.js.map