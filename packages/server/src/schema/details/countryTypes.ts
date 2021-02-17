import { objectType } from "nexus";
import { CityType } from "./cityTypes";
import { IconSizeType } from "./types";

export const CurrencyType = objectType({
  name: "Currency",
  description: "Represents a currency",
  definition(t) {
    t.id("id");
    t.string("name", { description: "The name of the currency" });
    t.string("isoCode", { description: "The ISO code of the currency internationally" });
    t.string("symbol", { description: "The currency's symbol" });
    t.nullable.string("secondSymbol", { description: "The currency's second (alternative) symbol" });
  },
});

export const CountryFlagIconType = objectType({
  name: "CountryFlagIcon",
  description: "Represents the info of an icon for a country's flag",
  definition(t) {
    t.id("id", { description: "The ID value of the flag icon" });
    t.string("urlValue", { description: "The URL value of the flag icon image" });
    t.field("size", {
      type: IconSizeType,
      description: "The size of the flag icon",
      resolve: o => o.size,
    });
  },
});

export const CountryType = objectType({
  name: "Country",
  description: "Represents a country",
  definition(t) {
    t.id("id", { description: "The ID of the country" });
    t.string("name", { description: "The name of the country" });
    t.nullable.string("shortName", { description: "A short name (abbreviation) of the country" });
    t.string("callingCode", { description: "The calling code of the country" });
    t.string("isoCode", { description: "The ISO registered code of the country" });
    t.string("languageId", { description: "The language identifier (locale) of the country" });
    t.boolean("isEu", { description: "A boolean that indicates if the country is part of European Union (EU)" });
    t.nullable.list.field("cities", {
      type: CityType,
      description: "The cities of the country",
      resolve: o => o.cities,
    });
    t.field("currency", {
      type: CurrencyType,
      description: "The currency of the country",
      resolve: o => o.currency,
    });
    t.list.field("flagIcon", {
      type: CountryFlagIconType,
      description: "The flag icons in a variety of sizes of a country",
      resolve: o => o.flagIcons,
    });
  },
});
