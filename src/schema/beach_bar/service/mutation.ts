import { extendType, intArg, stringArg } from "@nexus/schema";
import { getConnection } from "typeorm";
import { MyContext } from "../../../common/myContext";
import errors from "../../../constants/errors";
import { BeachBar } from "../../../entity/BeachBar";
import { BeachBarFeature } from "../../../entity/BeachBarFeature";
import { BeachBarService } from "../../../entity/BeachBarService";
import { DeleteType, ErrorType } from "../../returnTypes";
import { DeleteResult } from "../../types";
import { AddBeachBarFeatureType, UpdateBeachBarFeatureType } from "./returnTypes";
import { AddBeachBarFeatureResult, UpdateBeachBarFeatureResult } from "./types";

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
              message: "You are not allowed to add a feature to 'this' #beach_bar",
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

        if (
          beachBar.features.find(
            feature => feature.service.id === featureId && (feature.deletedAt === null || feature.deletedAt === undefined),
          )
        ) {
          return { error: { code: errors.CONFLICT, message: "Feature already exists" } };
        }

        const owner = beachBar.owners.find(owner => owner.owner.user.id === payload.sub);
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

        const service = BeachBarFeature.create({
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
        console.log(service);
        return {
          feature: service,
          added: true,
        };
      },
    });
    t.field("updateBeachBarFeature", {
      type: UpdateBeachBarFeatureResult,
      description: "Update a feature of a #beach_bar",
      nullable: false,
      args: {
        beachBarId: intArg({
          required: true,
          description: "The ID value of the #beach_bar to update its feature info",
        }),
        featureId: intArg({
          required: true,
          description: "The ID value of the feature of the #beach_bar, to update its info",
        }),
        quantity: intArg({
          required: false,
          description: "An integer that indicates the quantity of the service, a #beach_bar provides",
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
      ): Promise<UpdateBeachBarFeatureType | ErrorType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (
          !payload.scope.some(scope => ["beach_bar@crud:beach_bar", "beach_bar@update:beach_bar_feature:description"].includes(scope))
        ) {
          return {
            error: {
              code: errors.UNAUTHORIZED_CODE,
              message: "You are not allowed to update a feature of 'this' #beach_bar",
            },
          };
        }

        if (!beachBarId || beachBarId.toString().trim().length === 0 || beachBarId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid #beach_bar" } };
        }
        if (!featureId || featureId.toString().trim().length === 0 || featureId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid feature" } };
        }
        if (quantity && (quantity.toString().trim().length === 0 || quantity <= 0)) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid quantity number" } };
        }

        const feature = await BeachBarFeature.findOne({
          where: { beachBarId, serviceId: featureId },
          relations: ["beachBar", "beachBar.owners", "beachBar.owners.user", "service"],
        });
        if (!feature) {
          return { error: { code: errors.CONFLICT, message: "Specified feature does not exist" } };
        }

        const owner = feature.beachBar.owners.find(owner => owner.owner.user.id === payload.sub);
        if (!owner) {
          return { error: { code: errors.CONFLICT, message: errors.SOMETHING_WENT_WRONG } };
        }
        if (!owner.isPrimary && !payload.scope.includes("beach_bar@update:beach_bar_feature:description")) {
          return {
            error: { code: errors.UNAUTHORIZED_CODE, message: "You are not allowed to update 'this' feature info of the #beach_bar" },
          };
        }

        try {
          if (quantity >= 0 && owner.isPrimary && payload.scope.includes("beach_bar@crud:beach_bar")) {
            feature.quantity = quantity;
          } else if (quantity >= 0 && (!owner.isPrimary || !payload.scope.includes("beach_bar@crud:beach_bar"))) {
            return { error: { code: errors.UNAUTHORIZED_CODE, message: "You are not allowed to change the quantity of the feature" } };
          }
          if (description) {
            feature.description = description;
          }
          await feature.save();
        } catch (err) {
          return { error: { message: `Something went wrong: ${err.message}` } };
        }

        return {
          feature,
          updated: true,
        };
      },
    });
    t.field("deleteBeachBarFeature", {
      type: DeleteResult,
      description: "Delete (remove) a feature (service) from a #beach_bar",
      nullable: false,
      args: {
        beachBarId: intArg({
          required: true,
          description: "The ID value of the #beach_bar to delete (remove) its feature",
        }),
        featureId: intArg({
          required: true,
          description: "The ID value of the feature of the #beach_bar, to delete (remove)",
        }),
      },
      resolve: async (_, { beachBarId, featureId }, { payload }: MyContext): Promise<DeleteType | ErrorType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (!payload.scope.some(scope => ["beach_bar@crud:beach_bar"].includes(scope))) {
          return {
            error: {
              code: errors.UNAUTHORIZED_CODE,
              message: "You are not allowed to delete (remove) a feature from 'this' #beach_bar",
            },
          };
        }

        if (!beachBarId || beachBarId.toString().trim().length === 0 || beachBarId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid #beach_bar" } };
        }
        if (!featureId || featureId.toString().trim().length === 0 || featureId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid feature" } };
        }

        const feature = await BeachBarFeature.findOne({
          where: { beachBarId, serviceId: featureId },
          relations: ["beachBar", "beachBar.owners", "beachBar.owners.user", "service"],
        });
        if (!feature) {
          return { error: { code: errors.CONFLICT, message: "Specified feature does not exist" } };
        }

        const owner = feature.beachBar.owners.find(owner => owner.owner.user.id === payload.sub);
        if (!owner) {
          return { error: { code: errors.CONFLICT, message: errors.SOMETHING_WENT_WRONG } };
        }
        if (!owner.isPrimary) {
          return {
            error: {
              code: errors.UNAUTHORIZED_CODE,
              message: "You are not allowed to delete (remove) 'this' feature from the #beach_bar",
            },
          };
        }

        try {
          await getConnection()
            .getRepository(BeachBarFeature)
            .softDelete({ beachBarId: feature.beachBarId, serviceId: feature.serviceId });
        } catch (err) {
          return { error: { message: `Something went wrong: ${err.message}` } };
        }

        return {
          deleted: true,
        };
      },
    });
  },
});
