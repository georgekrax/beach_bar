import { objectType } from "@nexus/schema";
import { CityType } from "./cityTypes";
import { CountryType } from "./countryTypes";

export const RegionType = objectType({
  name: "Region",
  description: "Represents a country's or city's region",
  definition(t) {
    t.int("id", { nullable: false });
    t.string("name", { nullable: false });
    t.field("country", {
      type: CountryType,
      description: "The country the region is located at",
      nullable: false,
      resolve: o => o.country,
    });
    t.field("city", {
      type: CityType,
      description: "The city the region is located at",
      nullable: true,
      resolve: o => o.city,
    });
  },
});
