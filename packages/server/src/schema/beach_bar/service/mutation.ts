import { errors, MyContext } from "@beach_bar/common";
import { BeachBar } from "entity/BeachBar";
import { BeachBarFeature } from "entity/BeachBarFeature";
import { BeachBarService } from "entity/BeachBarService";
import { extendType, intArg, nullable, stringArg } from "nexus";
import { DeleteType } from "typings/.index";
import { AddBeachBarFeatureType, UpdateBeachBarFeatureType } from "typings/beach_bar/service";
import { DeleteResult } from "../../types";
import { AddBeachBarFeatureResult, UpdateBeachBarFeatureResult } from "./types";

export const BeachBarFeatureMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addBeachBarFeature", {
      type: AddBeachBarFeatureResult,
      description: "Add (assign) a feature to a #beach_bar",
      args: {
        beachBarId: intArg({ description: "The ID value of the #beach_bar to add (assign) the feature" }),
        featureId: intArg({ description: "The ID value of the feature to add (assign) to the #beach_bar" }),
        quantity: intArg({
          description: "An integer that indicates the quantity of the service, a #beach_bar provides",
          default: 1,
        }),
        description: nullable(stringArg({ description: "A short description about the service" })),
      },
      resolve: async (
        _,
        { beachBarId, featureId, quantity, description },
        { payload }: MyContext
      ): Promise<AddBeachBarFeatureType> => {
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

        if (!beachBarId || beachBarId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid #beach_bar" } };
        }
        if (!featureId || featureId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid feature" } };
        }

        const beachBar = await BeachBar.findOne({
          where: { id: beachBarId },
          relations: ["owners", "owners.owner", "features", "features.service"],
        });
        if (!beachBar) {
          return { error: { code: errors.CONFLICT, message: errors.BEACH_BAR_DOES_NOT_EXIST } };
        }
        const feature = beachBar.features.find(feature => feature.service.id === featureId);
        if (feature) {
          if (feature.deletedAt) {
            feature.deletedAt = undefined;
            await feature.save();
            const beachBarFeature = await BeachBarFeature.findOne({
              where: { beachBar, service: feature.service },
              relations: ["beachBar", "service"],
            });
            if (!beachBarFeature) {
              return { error: { message: errors.SOMETHING_WENT_WRONG } };
            }
            await beachBar.updateRedis();
            return {
              feature: beachBarFeature,
              added: true,
            };
          } else {
            return { error: { code: errors.CONFLICT, message: "Feature already exists" } };
          }
        }

        const owner = beachBar.owners.find(owner => String(owner.owner.userId).trim() === String(payload.sub));
        if (!owner) {
          return { error: { code: errors.CONFLICT, message: errors.SOMETHING_WENT_WRONG } };
        }
        if (!owner.isPrimary) {
          return { error: { code: errors.UNAUTHORIZED_CODE, message: "You are not allowed to add 'this' feature to the #beach_bar" } };
        }

        const beachBarFeature = await BeachBarService.findOne(featureId);
        if (!beachBarFeature) {
          return { error: { code: errors.CONFLICT, message: "Specified feature does not exist" } };
        }

        const service = BeachBarFeature.create({
          beachBar,
          service: beachBarFeature,
          quantity,
          description,
        });
        try {
          await service.save();
          await beachBar.updateRedis();
        } catch (err) {
          return { error: { message: `Something went wrong: ${err.message}` } };
        }
        return {
          feature: service,
          added: true,
        };
      },
    });
    t.field("updateBeachBarFeature", {
      type: UpdateBeachBarFeatureResult,
      description: "Update a feature of a #beach_bar",
      args: {
        beachBarId: intArg({ description: "The ID value of the #beach_bar to update its feature info" }),
        featureId: intArg({ description: "The ID value of the feature of the #beach_bar, to update its info" }),
        quantity: nullable(intArg({ description: "An integer that indicates the quantity of the service, a #beach_bar provides" })),
        description: nullable(stringArg({ description: "A short description about the service" })),
      },
      resolve: async (
        _,
        { beachBarId, featureId, quantity, description },
        { payload }: MyContext
      ): Promise<UpdateBeachBarFeatureType> => {
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

        if (!beachBarId || beachBarId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid #beach_bar" } };
        }
        if (!featureId || featureId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid feature" } };
        }

        const feature = await BeachBarFeature.findOne({
          where: { beachBarId, serviceId: featureId },
          relations: ["beachBar", "beachBar.owners", "beachBar.owners.owner", "service"],
        });
        if (!feature) {
          return { error: { code: errors.CONFLICT, message: "Specified feature does not exist" } };
        }

        const owner = feature.beachBar.owners.find(owner => String(owner.owner.userId).trim() === String(payload.sub).trim());
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
          await feature.beachBar.updateRedis();
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
      args: {
        beachBarId: intArg({ description: "The ID value of the #beach_bar to delete (remove) its feature" }),
        featureId: intArg({ description: "The ID value of the feature of the #beach_bar, to delete (remove)" }),
      },
      resolve: async (_, { beachBarId, featureId }, { payload }: MyContext): Promise<DeleteType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (!payload.scope.includes("beach_bar@crud:beach_bar")) {
          return {
            error: {
              code: errors.UNAUTHORIZED_CODE,
              message: "You are not allowed to delete (remove) a feature from 'this' #beach_bar",
            },
          };
        }

        if (!beachBarId || beachBarId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid #beach_bar" } };
        }
        if (!featureId || featureId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid feature" } };
        }

        const feature = await BeachBarFeature.findOne({
          where: { beachBarId, serviceId: featureId },
          relations: ["beachBar", "beachBar.owners", "beachBar.owners.owner", "service"],
        });
        if (!feature) {
          return { error: { code: errors.CONFLICT, message: "Specified feature does not exist" } };
        }

        const owner = feature.beachBar.owners.find(owner => String(owner.owner.userId).trim() === String(payload.sub).trim());
        if (!owner) {
          return { error: { code: errors.CONFLICT, message: errors.SOMETHING_WENT_WRONG } };
        }
        if (!owner.isPrimary) {
          return {
            error: {
              code: errors.UNAUTHORIZED_CODE,
              message: errors.YOU_ARE_NOT_BEACH_BAR_PRIMARY_OWNER,
            },
          };
        }

        try {
          await feature.customSoftRemove(featureId);
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
