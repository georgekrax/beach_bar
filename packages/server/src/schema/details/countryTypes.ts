import { objectType } from "nexus";
import { CityType } from "./cityTypes";

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

export const CountryType = objectType({
  name: "Country",
  description: "Represents a country",
  definition(t) {
    t.id("id", { description: "The ID of the country" });
    t.string("name", { description: "The name of the country" });
    t.string("alpha2Code", { description: "The ISO 2 Alpha registered code of the country" });
    t.string("alpha3Code", { description: "The ISO 3 Alpha registered code of the country" });
    t.string("callingCode", { description: "The calling code of the country" });
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
  },
});
