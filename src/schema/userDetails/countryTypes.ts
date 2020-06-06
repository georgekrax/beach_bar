import { objectType } from "@nexus/schema";

import { CityType } from "./cityTypes";

export const CountryType = objectType({
  name: "Country",
  description: "Represents a country",
  definition(t) {
    t.int("id", { nullable: false, description: "The ID of the country" });
    t.string("name", { nullable: false, description: "The name of the country" });
    t.string("callingCode", { nullable: false, description: "The calling code of the country" });
    t.string("isoCode", { nullable: false, description: "The ISO registered code of the country" });
    t.string("languageId", { nullable: false, description: "The language identifier (locale) of the country" });
    t.list.field("cities", {
      type: CityType,
      nullable: true,
      description: "The cities of the country",
      resolve: o => o.cities,
    });
  },
});
