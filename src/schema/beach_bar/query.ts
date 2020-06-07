import { extendType } from "@nexus/schema";
import { BeachBar } from "../../entity/BeachBar";
import { BeachBarType } from "./types";

export const BeachBarQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("getAllBeachBars", {
      type: BeachBarType,
      description: "A list with all the available #beach_bars",
      nullable: true,
      resolve: async () => {
        const beachBars = await BeachBar.find({
          where: { isActive: true },
          relations: ["owners", "reviews", "restaurants", "restaurants.foodItems", "serviceBeachBar"],
        });
        return beachBars;
      },
    });
  },
});
