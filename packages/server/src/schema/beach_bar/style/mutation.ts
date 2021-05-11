import { errors, MyContext } from "@beach_bar/common";
import { ApolloError } from "apollo-server-express";
import { BeachBar } from "entity/BeachBar";
import { BeachBarStyle } from "entity/BeachBarStyle";
import { BeachBarType } from "entity/BeachBarType";
import { extendType, idArg } from "nexus";
import { DeleteGraphQlType, SuccessGraphQLType } from "schema/types";
import { TDelete, TSuccess } from "typings/.index";
import { isAuth, throwScopesUnauthorized } from "utils/auth/payload";

export const BeachBarTypeCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addBeachBarType", {
      type: SuccessGraphQLType,
      description: "Add (assign) a style to a #beach_bar",
      args: { beachBarId: idArg(), styleId: idArg() },
      resolve: async (_, { beachBarId, styleId }, { payload }: MyContext): Promise<TSuccess> => {
        isAuth(payload);
        throwScopesUnauthorized(payload, "You are not allowed to add a style to a #beach_bar", ["beach_bar@crud:beach_bar"]);

        const beachBar = await BeachBar.findOne(beachBarId);
        if (!beachBar) throw new ApolloError(errors.BEACH_BAR_DOES_NOT_EXIST, errors.NOT_FOUND);

        const style = await BeachBarStyle.findOne(styleId);
        if (!style) throw new ApolloError("Invalid style", errors.NOT_FOUND);

        const newBeachBarType = BeachBarType.create({ beachBar, style });

        try {
          await newBeachBarType.save();
        } catch (err) {
          throw new ApolloError(err.message);
        }

        return { success: true };
      },
    });
    t.field("deleteBeachBarType", {
      type: DeleteGraphQlType,
      description: "Delete (remove) a style from a #beach_bar",
      args: { beachBarId: idArg(), styleId: idArg() },
      resolve: async (_, { beachBarId, styleId }, { payload }: MyContext): Promise<TDelete> => {
        isAuth(payload);
        throwScopesUnauthorized(payload, "You are not allowed to delete a style from a #beach_bar", ["beach_bar@crud:beach_bar"]);

        const beachBarType = await BeachBarType.findOne({ beachBarId, styleId });
        if (!beachBarType) throw new ApolloError("Invalid style", errors.NOT_FOUND);

        try {
          await beachBarType.softRemove();
        } catch (err) {
          throw new ApolloError(err.message);
        }

        return { deleted: true };
      },
    });
  },
});
