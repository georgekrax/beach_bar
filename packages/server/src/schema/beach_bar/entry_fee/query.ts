import { booleanArg, extendType, intArg } from "@nexus/schema";
import dayjs from "dayjs";
import { MoreThanOrEqual } from "typeorm";
import { BeachBarEntryFeeType } from "./types";
import { BeachBarEntryFee } from "@entity/BeachBarEntryFee";

export const BeachBarEntryFeeQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("getAllBeachBarEntryFees", {
      type: BeachBarEntryFeeType,
      description: "Get a list with all entry fees of a #beach_bar",
      args: {
        beachBarId: intArg({
          required: true,
          description: "The ID value of the #beach_bar",
        }),
        moreThanOrEqualToToday: booleanArg({
          required: false,
          description: "Set to true if to retrieve the entry fees from today and in the future. Its default value is set to true",
          default: true,
        }),
      },
      resolve: async (_, { beachBarId, moreThanOrEqualToToday }): Promise<BeachBarEntryFee[]> => {
        if (moreThanOrEqualToToday) {
          const entryFees = await BeachBarEntryFee.find({
            where: { beachBarId, date: MoreThanOrEqual(dayjs()) },
            relations: ["beachBar"],
          });
          return entryFees;
        } else {
          const entryFees = await BeachBarEntryFee.find({ where: { beachBarId }, relations: ["beachBar"] });
          return entryFees;
        }
      },
    });
  },
});
