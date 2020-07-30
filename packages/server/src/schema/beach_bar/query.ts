import { MyContext } from "@beach_bar/common";
import { arg, booleanArg, extendType, intArg } from "@nexus/schema";
// import { Types } from "mongoose";
// import historyActivity from "@constants/historyActivity";
import redisKeys from "@constants/redisKeys";
// import userHistory from "../../models/userHistory";
import { SearchInputType } from "../search/types";
import { BeachBarAvailabilityType, BeachBarType } from "./types";
import { BeachBarAvailabilityReturnType } from "@typings/beach_bar";
import { BeachBar } from "@entity/BeachBar";
import userHistory from "models/userHistory";
import { Types } from "mongoose";
import historyActivity from "@constants/historyActivity";

export const BeachBarQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("getBeachBar", {
      type: BeachBarType,
      description: "Get the detail info of a #beach_bar",
      nullable: true,
      args: {
        beachBarId: intArg({
          required: true,
          description: "The ID value of the #beach_bar",
        }),
        userVisit: booleanArg({
          required: false,
          description: "Indicates if to retrieve information for user search. Its default value is set to true",
          default: true,
        }),
      },
      resolve: async (_, { beachBarId, userVisit }, { redis, ipAddr }: MyContext): Promise<BeachBar | null> => {
        if (!beachBarId || beachBarId <= 0) {
          return null;
        }

        const beachBars: BeachBar[] = (await redis.lrange(redisKeys.BEACH_BAR_CACHE_KEY, 0, -1)).map((x: string) => JSON.parse(x));
        const beachBar = beachBars.find(beachBar => beachBar.id === beachBarId);
        if (!beachBar) {
          return null;
        }
        if (userVisit) {
          await userHistory.create({
            activityId: new Types.ObjectId(historyActivity.BEACH_BAR_SEARCH_ID),
            objectId: beachBar.id,
            userId: undefined,
            ipAddr,
          });
        }

        return beachBar;
      },
    });
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
      resolve: async (): Promise<BeachBar[]> => {
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
