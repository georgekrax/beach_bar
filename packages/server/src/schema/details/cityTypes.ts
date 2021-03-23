import { objectType } from "nexus";
import { CountryType } from "./countryTypes";

export const CityType = objectType({
  name: "City",
  description: "Represents a city of a country",
  definition(t) {
    t.id("id", { description: "The ID of the city" });
    t.string("name", { description: "The name of the city" });
    t.nullable.field("country", {
      type: CountryType,
      description: "The country of the city",
      resolve: o => o.country,
    });
  },
});
