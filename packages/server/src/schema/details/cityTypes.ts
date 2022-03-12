import { resolve } from "@/utils/data";
import { objectType } from "nexus";
import { City } from "nexus-prisma";

export const CityType = objectType({
  name: City.$name,
  description: "Represents a city of a country",
  definition(t) {
    // t.id("id", { description: "The ID of the city" });
    // t.string("name", { description: "The name of the city" });
    // t.nullable.field("country", { type: CountryType, description: "The country of the city" });
    t.field(City.id);
    t.field(City.name);
    t.field(resolve(City.country));
  },
});
