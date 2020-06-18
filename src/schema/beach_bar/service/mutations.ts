import { extendType, intArg } from "@nexus/schema";
import { MyContext } from "../../../common/myContext";
import errors from "../../../constants/errors";
import { ErrorType } from "../../returnTypes";
import { AddBeachBarFeatureType } from "./returnTypes";
import { AddBeachBarFeatureResult } from "./types";

export const BeachBarFeatureMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addBeachBarFeature", {
      type: AddBeachBarFeatureResult,
      description: "Add (assign) a feature to a #beach_bar",
      nullable: false,
      args: {
        beachBarId: intArg({
          required: true,
          description: "The ID value of the #beach_bar to add (assign) the feature",
        }),
        featureId: intArg({
          required: true,
          description: "The ID value of the feature to add (assign) to the #beach_bar",
        }),
      },
      resolve: async (_, { beachBarId, featureId }, { payload }: MyContext): Promise<AddBeachBarFeatureType | ErrorType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (!payload.scope.some(scope => ["beach_bar@crud:beach_bar"].includes(scope))) {
          return {
            error: {
              code: errors.UNAUTHORIZED_CODE,
              message: "You are not allowed to update 'this' #beach_bar",
            },
          };
        }

        if (!beachBarId || beachBarId.toString() === ("" || " ")) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid #beach_bar" } };
        }
        if (!featureId || featureId.toString() === ("" || " ")) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid feature" } };
        }
      },
    });
  },
});
