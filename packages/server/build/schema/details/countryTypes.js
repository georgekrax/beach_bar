"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountryType = exports.CountryFlagIconType = exports.CurrencyType = void 0;
const schema_1 = require("@nexus/schema");
const cityTypes_1 = require("./cityTypes");
const types_1 = require("./types");
exports.CurrencyType = schema_1.objectType({
    name: "Currency",
    description: "Represents a currency",
    definition(t) {
        t.int("id", { nullable: false });
        t.string("name", { nullable: false, description: "The name of the currency" });
        t.string("isoCode", { nullable: false, description: "The ISO code of the currency internationally" });
        t.string("symbol", { nullable: false, description: "The currency's symbol" });
        t.string("secondSymbol", { nullable: true, description: "The currency's second (alternative) symbol" });
    },
});
exports.CountryFlagIconType = schema_1.objectType({
    name: "CountryFlagIcon",
    description: "Represents the info of an icon for a country's flag",
    definition(t) {
        t.int("id", { nullable: false, description: "The ID value of the flag icon" });
        t.string("urlValue", { nullable: false, description: "The URL value of the flag icon image" });
        t.field("size", {
            type: types_1.IconSizeType,
            description: "The size of the flag icon",
            nullable: false,
            resolve: o => o.size,
        });
    },
});
exports.CountryType = schema_1.objectType({
    name: "Country",
    description: "Represents a country",
    definition(t) {
        t.int("id", { nullable: false, description: "The ID of the country" });
        t.string("name", { nullable: false, description: "The name of the country" });
        t.string("shortName", { nullable: true, description: "A short name (abbreviation) of the country" });
        t.string("callingCode", { nullable: false, description: "The calling code of the country" });
        t.string("isoCode", { nullable: false, description: "The ISO registered code of the country" });
        t.string("languageId", { nullable: false, description: "The language identifier (locale) of the country" });
        t.boolean("isEu", { nullable: false, description: "A boolean that indicates if the country is part of European Union (EU)" });
        t.list.field("cities", {
            type: cityTypes_1.CityType,
            description: "The cities of the country",
            nullable: true,
            resolve: o => o.cities,
        });
        t.field("currency", {
            type: exports.CurrencyType,
            description: "The currency of the country",
            nullable: false,
            resolve: o => o.currency,
        });
        t.list.field("flagIcon", {
            type: exports.CountryFlagIconType,
            description: "The flag icons in a variety of sizes of a country",
            nullable: false,
            resolve: o => o.flagIcons,
        });
    },
});
//# sourceMappingURL=countryTypes.js.map