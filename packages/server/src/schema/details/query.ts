import { extendType } from "nexus";
import { CitiesAndRegionsType } from "./types";

export const DetailsQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("citiesAndRegions", {
      type: CitiesAndRegionsType,
      description: "Fetch all the cities of #beach_bar's locations",
      resolve: async (_, __, { prisma }) => {
        const cities = await prisma.city.findMany();
        const regions = await prisma.region.findMany();
        return { cities, regions };
      },
    });
  },
});
