import { BeachBarImgUrl } from "entity/BeachBarImgUrl";
import { extendType, intArg } from "nexus";
import { BeachBarImgUrlType } from "./types";

export const BeachBarImgUrlQuery = extendType({
  type: "Query",
  definition(t) {
    t.nullable.list.field("getBeachBarImgUrl", {
      type: BeachBarImgUrlType,
      description: "Get a list with all the images (URL values) of a #beach_bar",
      args: {
        beachBarId: intArg({ description: "The ID value of the #beach_bar" }),
      },
      resolve: async (_, { beachBarId }): Promise<BeachBarImgUrl[] | null> => {
        if (!beachBarId || beachBarId <= 0) {
          return null;
        }

        const imgUrls = await BeachBarImgUrl.find({ where: { beachBarId }, relations: ["beachBar"] });
        return imgUrls;
      },
    });
  },
});
