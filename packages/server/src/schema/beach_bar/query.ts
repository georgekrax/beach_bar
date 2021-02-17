import { MyContext } from "@beach_bar/common";
import redisKeys from "constants/redisKeys";
import { historyActivity } from "constants/_index";
import { BeachBar } from "entity/BeachBar";
import { UserHistory } from "entity/UserHistory";
import { arg, booleanArg, extendType, intArg, nullable } from "nexus";
import { BeachBarAvailabilityReturnType } from "typings/beach_bar";
import { SearchInputType } from "../search/types";
import { BeachBarAvailabilityType, BeachBarType } from "./types";

export const BeachBarQuery = extendType({
  type: "Query",
  definition(t) {
    t.nullable.field("getBeachBar", {
      type: BeachBarType,
      description: "Get the detail info of a #beach_bar",
      args: {
        beachBarId: intArg({ description: "The ID value of the #beach_bar" }),
        userVisit: nullable(booleanArg({
          description: "Indicates if to retrieve information for user search. Its default value is set to true",
          default: true,
        })),
      },
      resolve: async (_, { beachBarId, userVisit }, { redis, ipAddr, payload }: MyContext): Promise<BeachBar | null> => {
        if (!beachBarId || beachBarId <= 0) {
          return null;
        }

        const beachBars: BeachBar[] = (await redis.lrange(redisKeys.BEACH_BAR_CACHE_KEY, 0, -1)).map((x: string) => JSON.parse(x));
        const beachBar = beachBars.find(beachBar => beachBar.id === beachBarId);
        if (!beachBar) {
          return null;
        }
        if (userVisit) {
          await UserHistory.create({
            activityId: historyActivity.BEACH_BAR_QUERY_ID,
            objectId: BigInt(beachBar.id),
            userId: payload ? payload.sub : undefined,
            ipAddr,
          }).save();
        }

        return beachBar;
      },
    });
    t.nullable.field("checkBeachBarAvailability", {
      type: BeachBarAvailabilityType,
      description: "Check a #beach_bar's availability",
      args: {
        beachBarId: intArg({ description: "The ID value of the #beach_bar, to check for availability" }),
        availability: nullable(arg({ type: SearchInputType })),
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
    t.nullable.list.field("getAllBeachBars", {
      type: BeachBarType,
      description: "A list with all the available #beach_bars",
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
