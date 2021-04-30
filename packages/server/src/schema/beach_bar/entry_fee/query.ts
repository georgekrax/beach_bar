// import dayjs from "dayjs";
// import { BeachBarEntryFee } from "entity/BeachBarEntryFee";
// import { booleanArg, extendType, intArg, nullable } from "nexus";
// import { MoreThanOrEqual } from "typeorm";
// import { BeachBarEntryFeeType } from "./types";

// export const BeachBarEntryFeeQuery = extendType({
//   type: "Query",
//   definition(t) {
//     t.list.field("getAllBeachBarEntryFees", {
//       type: BeachBarEntryFeeType,
//       description: "Get a list with all entry fees of a #beach_bar",
//       args: {
//         beachBarId: intArg({ description: "The ID value of the #beach_bar" }),
//         moreThanOrEqualToToday: nullable(
//           booleanArg({
//             description: "Set to true if to retrieve the entry fees from today and in the future. Its default value is set to true",
//             default: true,
//           })
//         ),
//       },
//       resolve: async (_, { beachBarId, moreThanOrEqualToToday }): Promise<BeachBarEntryFee[]> => {
//         if (moreThanOrEqualToToday) {
//           const entryFees = await BeachBarEntryFee.find({
//             where: { beachBarId, date: MoreThanOrEqual(dayjs()) },
//             relations: ["beachBar"],
//           });
//           return entryFees;
//         } else {
//           const entryFees = await BeachBarEntryFee.find({ where: { beachBarId }, relations: ["beachBar"] });
//           return entryFees;
//         }
//       },
//     });
//   },
// });
