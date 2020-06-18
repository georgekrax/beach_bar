import { objectType } from "@nexus/schema";
import { CountryType } from "../../userDetails/countryTypes";
import { CityType } from "../../userDetails/cityTypes";
import { RegionType } from "../../userDetails/regionTypes";

export const BeachBarLocationType = objectType({
  name: "BeachBarLocation",
  description: "Represents a #beach_bar's location details",
  definition(t) {
    t.int("id", { nullable: false });
    t.string("address", { nullable: false, description: "The street address of the #beach_bar" });
    t.string("zipCode", { nullable: true, description: "The zip code of the #beach_bar, for its street address" });
    t.float("latitude", { nullable: false, description: "The latitude of the #beach_bar in the maps, provided by Google Maps API" });
    t.float("longitude", { nullable: false, description: "The longitude of the #beach_bar in the maps, provided by Google Maps API" });
    t.string("whereId", {
      nullable: false,
      description: "The 'point' value generated from latitude & longtitude, provided by the PostGIS PostgreSQL extension",
    });
    t.field("country", {
      type: CountryType,
      description: "The country the #beach_bar is located at",
      nullable: false,
      resolve: o => o.country,
    });
    t.field("city", {
      type: CityType,
      description: "The city the #beach_bar is located at",
      nullable: false,
      resolve: o => o.city,
    });
    t.field("region", {
      type: RegionType,
      description: "The region the #beach_bar is located at",
      nullable: true,
      resolve: o => o.region,
    });
  },
});
