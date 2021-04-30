// import { errors, MyContext } from "@beach_bar/common";
// import { DateScalar } from "@the_hashtag/common/dist/graphql";
// import { BeachBar } from "entity/BeachBar";
// import { BeachBarEntryFee } from "entity/BeachBarEntryFee";
// import { arg, extendType, floatArg, idArg, intArg, list, nullable } from "nexus";
// import { In } from "typeorm";
// import { DeleteType } from "typings/.index";
// import { AddBeachBarEntryFeeType, UpdateBeachBarEntryFeeType } from "typings/beach_bar/entry_fee";
// import { checkScopes } from "utils/checkScopes";
// import { DeleteResult } from "../../types";
// import { AddBeachBarEntryFeeResult, UpdateBeachBarEntryFeeResult } from "./types";

// export const BeachBarEntryFeeCrudMutation = extendType({
//   type: "Mutation",
//   definition(t) {
//     t.field("addBeachBarEntryFee", {
//       type: AddBeachBarEntryFeeResult,
//       description: "Add an entry fee(s) to a #beach_bar",
//       args: {
//         beachBarId: intArg({ description: "The ID value of the #beach_bar to add the entry fee(s)" }),
//         fee: floatArg({ description: "The price value of the entry fee. Its value cannot be less than 0" }),
//         dates: list(
//           arg({
//             type: DateScalar,
//             description: "A list with all the dates to add (assign) the entry fee",
//           })
//         ),
//       },
//       resolve: async (_, { beachBarId, fee, dates }, { payload }: MyContext): Promise<AddBeachBarEntryFeeType> => {
//         if (!payload) {
//           return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
//         }
//         if (!checkScopes(payload, ["beach_bar@crud:beach_bar", "beach_bar@crud:beach_bar_entry_fee"])) {
//           return { error: { code: errors.UNAUTHORIZED_CODE, message: "You are not allowed to add an entry fee to a #beach_bar" } };
//         }
//         if (fee === null || fee === undefined || fee < 0) {
//           return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid fee price" } };
//         }
//         if (!dates || dates.length === 0) {
//           return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a or some valid date(s)" } };
//         }

//         const beachBar = await BeachBar.findOne(beachBarId);
//         if (!beachBar) {
//           return { error: { code: errors.CONFLICT, message: errors.BEACH_BAR_DOES_NOT_EXIST } };
//         }

//         const newEntryFees: BeachBarEntryFee[] = [];

//         try {
//           for (let i = 0; i < dates.length; i++) {
//             const newEntryFee = BeachBarEntryFee.create({
//               fee,
//               date: dates[i],
//               beachBar,
//             });
//             await newEntryFee.save();
//             newEntryFees.push(newEntryFee);
//           }
//           if (newEntryFees.length === 0) {
//             return { error: { message: errors.SOMETHING_WENT_WRONG } };
//           }
//           await beachBar.updateRedis();
//         } catch (err) {
//           if (err.message === 'duplicate key value violates unique constraint "beach_bar_entry_fee_beach_bar_id_date_key"') {
//             const entryFees = await BeachBarEntryFee.find({ where: { date: In(dates) }, relations: ["beachBar"] });
//             if (entryFees) {
//               return {
//                 fees: entryFees,
//                 added: false,
//               };
//             } else {
//               return { error: { message: errors.SOMETHING_WENT_WRONG } };
//             }
//           }
//           return { error: { message: `${errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
//         }

//         return {
//           fees: newEntryFees,
//           added: true,
//         };
//       },
//     });
//     t.field("updateBeachBarEntryFee", {
//       type: UpdateBeachBarEntryFeeResult,
//       description: "Update an or many entry fee(s) of a #beach_bar",
//       args: {
//         entryFeeIds: list(idArg({ description: "A list with all the entry fess to update" })),
//         fee: nullable(floatArg({ description: "The price value to update the entry fees" })),
//       },
//       resolve: async (_, { entryFeeIds, price }, { payload }: MyContext): Promise<UpdateBeachBarEntryFeeType> => {
//         if (!payload) {
//           return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
//         }
//         if (
//           !checkScopes(payload, [
//             "beach_bar@crud:beach_bar",
//             "beach_bar@crud:beach_bar_entry_fee",
//             "beach_bar@update:beach_bar_entry_fee",
//           ])
//         ) {
//           return {
//             error: {
//               code: errors.UNAUTHORIZED_CODE,
//               message: "You are not allowed to update an entry fee to of a #beach_bar",
//             },
//           };
//         }

//         if (!entryFeeIds || entryFeeIds.length === 0 || entryFeeIds.some(feeId => feeId === 0)) {
//           return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a or some valid entry fees" } };
//         }
//         if ((price !== null || price !== undefined) && price < 0) {
//           return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid price value as a fee" } };
//         }

//         const entryFees = await BeachBarEntryFee.find({ where: { id: In(entryFeeIds) }, relations: ["beachBar"] });
//         if (!entryFees) {
//           return { error: { code: errors.CONFLICT, message: "Specified entry fee(s) do not exist" } };
//         }

//         try {
//           if (price !== null && price !== undefined && entryFees.some(fee => fee.fee !== price)) {
//             const updatedEntryFees: BeachBarEntryFee[] = [];
//             for (let i = 0; i < entryFees.length; i++) {
//               const updatedEntryFee = await entryFees[i].update(price);
//               updatedEntryFees.push(updatedEntryFee);
//             }

//             if (updatedEntryFees.length === 0) {
//               return { error: { message: errors.SOMETHING_WENT_WRONG } };
//             }
//             return {
//               fees: updatedEntryFees,
//               updated: true,
//             };
//           } else {
//             return {
//               fees: entryFees,
//               updated: false,
//             };
//           }
//         } catch (err) {
//           return { error: { message: `${errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
//         }
//       },
//     });
//     t.field("deleteBeachBarEntryFee", {
//       type: DeleteResult,
//       description: "Delete (remove) an or some entry fees from a #beach_bar",
//       args: {
//         entryFeeIds: list(
//           idArg({ description: "A list with all the ID values of entry fee(s) to delete (remove) from a #beach_bar" })
//         ),
//       },
//       resolve: async (_, { entryFeeIds }, { payload }: MyContext): Promise<DeleteType> => {
//         if (!payload) {
//           return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
//         }
//         if (!checkScopes(payload, ["beach_bar@crud:beach_bar", "beach_bar@crud:beach_bar_entry_fee"])) {
//           return {
//             error: { code: errors.UNAUTHORIZED_CODE, message: "You are not allowed to delete an entry fee from a #beach_bar" },
//           };
//         }

//         if (!entryFeeIds || entryFeeIds.length === 0 || entryFeeIds.some(feeId => feeId === 0)) {
//           return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a or some valid entry fee(s)" } };
//         }

//         const entryFees = await BeachBarEntryFee.find({ where: { id: In(entryFeeIds) }, relations: ["beachBar"] });
//         if (!entryFees) {
//           return { error: { code: errors.CONFLICT, message: "Specified entry fee(s) do not exist" } };
//         }

//         try {
//           entryFees.forEach(async (entryFee: BeachBarEntryFee) => await entryFee.softRemove());
//         } catch (err) {
//           return { error: { message: `${errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
//         }

//         return {
//           deleted: true,
//         };
//       },
//     });
//   },
// });
