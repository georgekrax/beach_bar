import { extendType, intArg, stringArg } from "@nexus/schema";
import { MyContext } from "../../../common/myContext";
import errors from "../../../constants/errors";
import { BeachBar } from "../../../entity/BeachBar";
import { BeachBarFeature } from "../../../entity/BeachBarFeature";
import { BeachBarService } from "../../../entity/BeachBarService";
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
        quantity: intArg({
          required: true,
          description: "An integer that indicates the quantity of the service, a #beach_bar provides",
          default: 1,
        }),
        description: stringArg({
          required: false,
          description: "A short description about the service",
        }),
      },
      resolve: async (
        _,
        { beachBarId, featureId, quantity, description },
        { payload }: MyContext,
      ): Promise<AddBeachBarFeatureType | ErrorType> => {
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
        if (!quantity || quantity.toString() === ("" || " ")) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid quantity number" } };
        }

        const beachBar = await BeachBar.findOne({
          where: { id: beachBarId },
          relations: ["owners", "owners.user", "features", "features.service"],
        });
        if (!beachBar) {
          return { error: { code: errors.CONFLICT, message: errors.BEACH_BAR_DOES_NOT_EXIST } };
        }

        const owner = beachBar.owners.find(owner => owner.user.id.toString() === payload.sub);
        if (!owner) {
          return { error: { code: errors.CONFLICT, message: errors.SOMETHING_WENT_WRONG } };
        }
        if (!owner.isPrimary) {
          return { error: { code: errors.UNAUTHORIZED_CODE, message: "You are not allowed to add 'this' feature to the #beach_bar" } };
        }

        const feature = await BeachBarService.findOne(featureId);
        if (!feature) {
          return { error: { code: errors.CONFLICT, message: "Specified feature does not exist" } };
        }

        const service = await BeachBarFeature.create({
          beachBar,
          service: feature,
          quantity,
          description,
        });
        try {
          await service.save();
        } catch (err) {
          return { error: { message: `Something went wrong: ${err.message}` } };
        }

        return {
          feature: service,
          added: true,
        };
      },
    });
  },
});
