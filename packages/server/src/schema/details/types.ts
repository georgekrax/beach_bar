import { objectType } from "nexus";
import { BeachBarCategory } from "nexus-prisma";
import { CityType } from "./cityTypes";
import { RegionType } from "./regionTypes";

export const BeachBarCategoryType = objectType({
  name: BeachBarCategory.$name,
  description: "Represents a #beach_bar's category",
  definition(t) {
    // t.id("id");
    // t.string("name");
    // t.nullable.string("description");
    t.field(BeachBarCategory.id);
    t.field(BeachBarCategory.name);
    t.field(BeachBarCategory.description);
  },
});

export const CitiesAndRegionsType = objectType({
  name: "CitiesAndRegions",
  description: "Represents an object with an array of cities and regions",
  definition(t) {
    t.list.field("cities", { type: CityType });
    t.list.field("regions", { type: RegionType });
  },
});
