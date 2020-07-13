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
          relations: [
            "owners",
            "owners.owner",
            "owners.owner.user",
            "owners.owner.user.account",
            "reviews",
            "restaurants",
            "restaurants.foodItems",
            "products",
            "features",
            "features.service",
          ],
        });
        beachBars.forEach(beachBar => (beachBar.features = beachBar.features.filter(feature => !feature.deletedAt)));
        return beachBars;
      },
    });
  },
});
