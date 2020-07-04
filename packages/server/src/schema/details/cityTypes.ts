import { objectType } from "@nexus/schema";

import { CountryType } from "./countryTypes";

export const CityType = objectType({
  name: "City",
  description: "Represents a city of a country",
  definition(t) {
    t.int("id", { nullable: false, description: "The ID of the city" });
    t.string("name", { nullable: false, description: "The name of the city" });
    t.field("country", {
      type: CountryType,
      nullable: true,
      description: "The country of the city",
      resolve: o => o.country,
    });
  },
});
