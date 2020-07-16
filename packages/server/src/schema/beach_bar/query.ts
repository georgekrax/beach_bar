import { MyContext } from "@beach_bar/common";
import { arg, extendType, intArg } from "@nexus/schema";
import { BeachBar } from "../../entity/BeachBar";
import { SearchInputType } from "../search/types";
import { BeachBarAvailabilityReturnType } from "./returnTypes";
import { BeachBarAvailabilityType, BeachBarType } from "./types";

export const BeachBarQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("checkBeachBarAvailability", {
      type: BeachBarAvailabilityType,
      description: "Check a #beach_bar's availability",
      nullable: true,
      args: {
        beachBarId: intArg({
          required: true,
          description: "The ID value of the #beach_bar, to check for availability",
        }),
        availability: arg({
          type: SearchInputType,
          required: false,
        }),
      },
      resolve: async (_, { beachBarId, availability }, { redis }: MyContext): Promise<BeachBarAvailabilityReturnType | null> => {
        if (!beachBarId || beachBarId <= 0) {
          return null;
        }
        if (!availability) {
          return null;
        }
        const { date, timeId } = availability;
        let { adults, children } = availability;
        adults = adults || 0;
        children = children || 0;
        const totalPeople = adults + children !== 0 ? adults + children : undefined;

        const beachBar = await BeachBar.findOne({
          where: { id: beachBarId },
          relations: ["products", "products.reservationLimits", "products.reservationLimits.product"],
        });
        if (!beachBar) {
          return null;
        }
        const { hasAvailability, hasCapacity } = await beachBar.checkAvailability(redis, date, timeId, totalPeople);

        return {
          hasAvailability,
          hasCapacity,
        };
      },
    });
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
