import { errors, MyContext } from "@beach_bar/common";
import { BeachBar } from "entity/BeachBar";
import { BeachBarStyle } from "entity/BeachBarStyle";
import { BeachBarType } from "entity/BeachBarType";
import { extendType, idArg } from "nexus";
import { DeleteResult, SuccessResult } from "schema/types";
import { DeleteType, SuccessType } from "typings/.index";
import { checkScopes } from "utils/checkScopes";

export const BeachBarTypeCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addBeachBarType", {
      type: SuccessResult,
      description: "Add (assign) a style to a #beach_bar",
      args: {
        beachBarId: idArg({ description: "The ID value of the #beach_bar, to assign the style" }),
        styleId: idArg({ description: "The ID value of the style to assign" }),
      },
      resolve: async (_, { beachBarId, styleId }, { payload }: MyContext): Promise<SuccessType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (!checkScopes(payload, ["beach_bar@crud:beach_bar"])) {
          return {
            error: { code: errors.UNAUTHORIZED_CODE, message: "You are not allowed to add a style to a #beach_bar" },
          };
        }

        const beachBar = await BeachBar.findOne(beachBarId);
        if (!beachBar) {
          return { error: { code: errors.CONFLICT, message: errors.BEACH_BAR_DOES_NOT_EXIST } };
        }

        const style = await BeachBarStyle.findOne(styleId);
        if (!style) {
          return { error: { code: errors.CONFLICT, message: errors.SOMETHING_WENT_WRONG } };
        }

        const newBeachBarType = await BeachBarType.create({
          beachBar,
          style,
        });

        try {
          await newBeachBarType.save();
        } catch (err) {
          return { error: { message: `${errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
        }

        return {
          success: true,
        };
      },
    });
    t.field("deleteBeachBarType", {
      type: DeleteResult,
      description: "Delete (remove) a style from a #beach_bar",
      args: {
        beachBarId: idArg({ description: "The ID value of the #beach_bar, to remove the style" }),
        styleId: idArg({ description: "The ID value of the style to remove" }),
      },
      resolve: async (_, { beachBarId, styleId }, { payload }: MyContext): Promise<DeleteType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (!checkScopes(payload, ["beach_bar@crud:beach_bar"])) {
          return {
            error: { code: errors.UNAUTHORIZED_CODE, message: "You are not allowed to delete a style from a #beach_bar" },
          };
        }

        const beachBarType = await BeachBarType.findOne({ beachBarId, styleId });
        if (!beachBarType) {
          return { error: { code: errors.CONFLICT, message: "This style is not assigned to this #beach_bar" } };
        }

        try {
          await beachBarType.softRemove();
        } catch (err) {
          return { error: { message: `${errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
        }

        return {
          deleted: true,
        };
      },
    });
  },
});
