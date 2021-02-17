import { objectType } from "nexus";
import { CityType } from "./cityTypes";
import { CountryType } from "./countryTypes";

export const RegionType = objectType({
  name: "Region",
  description: "Represents a country's or city's region",
  definition(t) {
    t.id("id");
    t.string("name");
    t.field("country", {
      type: CountryType,
      description: "The country the region is located at",
      resolve: o => o.country,
    });
    t.nullable.field("city", {
      type: CityType,
      description: "The city the region is located at",
      resolve: o => o.city,
    });
  },
});
