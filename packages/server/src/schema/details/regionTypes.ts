import { resolve } from "@/utils/data";
import { objectType } from "nexus";
import { Region } from "nexus-prisma";

export const RegionType = objectType({
  name: Region.$name,
  description: "Represents a country's or city's region",
  definition(t) {
    // t.id("id");
    // t.string("name");
    // t.field("country", { type: CountryType, description: "The country the region is located at" });
    // t.nullable.field("city", { type: CityType, description: "The city the region is located at" });
    t.field(Region.id);
    t.field(Region.name);
    t.field(resolve(Region.country));
    t.field(resolve(Region.city));
  },
});
