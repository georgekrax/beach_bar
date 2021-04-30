import { errors, MyContext } from "@beach_bar/common";
import { UserInputError } from "apollo-server-errors";
import { ApolloError } from "apollo-server-express";
import { BeachBar } from "entity/BeachBar";
import { BeachBarFeature } from "entity/BeachBarFeature";
import { BeachBarService } from "entity/BeachBarService";
import { extendType, idArg, intArg, nullable, stringArg } from "nexus";
import { TDelete } from "typings/.index";
import { TAddBeachBarFeature, TUpdateBeachBarFeature } from "typings/beach_bar/service";
import { isAuth, throwScopesUnauthorized } from "utils/auth/payload";
import { checkScopes } from "utils/checkScopes";
import { DeleteGraphQlType } from "../../types";
import { AddBeachBarFeatureType, UpdateBeachBarFeatureType } from "./types";

export const BeachBarFeatureMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addBeachBarFeature", {
      type: AddBeachBarFeatureType,
      description: "Add (assign) a feature to a #beach_bar",
      args: {
        beachBarId: idArg(),
        featureId: idArg(),
        quantity: intArg({
          description: "An integer that indicates the quantity of the service, a #beach_bar provides",
          default: 1,
        }),
        description: nullable(stringArg({ description: "A short description about the service" })),
      },
      resolve: async (_, { beachBarId, featureId, quantity, description }, { payload }: MyContext): Promise<TAddBeachBarFeature> => {
        isAuth(payload);
        throwScopesUnauthorized(payload, "You are not allowed to add a feature to 'this' #beach_bar", ["beach_bar@crud:beach_bar"]);

        if (!beachBarId || beachBarId.trim().length === 0) throw new UserInputError("Please provide a valid beachBarId");
        if (!featureId || featureId.trim().length === 0) throw new UserInputError("Please provide a valid featureId");

        const beachBar = await BeachBar.findOne({
          where: { id: beachBarId },
          relations: ["owners", "owners.owner", "features", "features.service"],
        });
        if (!beachBar) throw new ApolloError(errors.BEACH_BAR_DOES_NOT_EXIST, errors.NOT_FOUND);
        const feature = beachBar.features.find(feature => feature.service.id === featureId);
        if (feature) {
          if (feature.deletedAt) {
            feature.deletedAt = undefined;
            await feature.save();
            const beachBarFeature = await BeachBarFeature.findOne({
              where: { beachBar, service: feature.service },
              relations: ["beachBar", "service"],
            });
            if (!beachBarFeature) throw new ApolloError(errors.SOMETHING_WENT_WRONG);
            await beachBar.updateRedis();
            return { feature: beachBarFeature, added: true };
          } else {
            throw new ApolloError("Feature already exists", errors.CONFLICT);
          }
        }

        const owner = beachBar.owners.find(owner => String(owner.owner.userId).trim() === String(payload!.sub));
        if (!owner) throw new ApolloError('You are not an owner of "this" #beach_bar');
        if (!owner.isPrimary) throw new ApolloError(errors.YOU_ARE_NOT_BEACH_BAR_PRIMARY_OWNER, errors.UNAUTHORIZED_CODE);

        const beachBarFeature = await BeachBarService.findOne(featureId);
        if (!beachBarFeature) throw new ApolloError("Specified feature does not exist", errors.NOT_FOUND);

        const service = BeachBarFeature.create({ beachBar, service: beachBarFeature, quantity, description });
        try {
          await service.save();
          await beachBar.updateRedis();
        } catch (err) {
          throw new ApolloError(errors.SOMETHING_WENT_WRONG + ": " + err.message);
        }
        return { feature: service, added: true };
      },
    });
    t.field("updateBeachBarFeature", {
      type: UpdateBeachBarFeatureType,
      description: "Update a feature of a #beach_bar",
      args: { beachBarId: idArg(), featureId: idArg(), quantity: nullable(intArg()), description: nullable(stringArg()) },
      resolve: async (
        _,
        { beachBarId, featureId, quantity, description },
        { payload }: MyContext
      ): Promise<TUpdateBeachBarFeature> => {
        isAuth(payload);
        throwScopesUnauthorized(payload, "You are not allowed to update a feature of 'this' #beach_bar", [
          "beach_bar@crud:beach_bar",
          "beach_bar@update:beach_bar_feature:description",
        ]);

        if (!beachBarId || beachBarId.trim().length === 0) throw new UserInputError("Please provide a valid beachBarId");
        if (!featureId || featureId.trim().length === 0) throw new UserInputError("Please provide a valid featureId");

        const feature = await BeachBarFeature.findOne({
          where: { beachBarId, serviceId: featureId },
          relations: ["beachBar", "beachBar.owners", "beachBar.owners.owner", "service"],
        });
        if (!feature) throw new ApolloError("Specified feature does not exist");

        const owner = feature.beachBar.owners.find(owner => String(owner.owner.userId).trim() === String(payload!.sub).trim());
        if (!owner) throw new ApolloError('You are not an owner of "this" #beach_bar');
        if (!owner.isPrimary && checkScopes(payload, ["beach_bar@update:beach_bar_feature:description"]))
          throw new ApolloError("You are not allowed to update 'this' feature info of the #beach_bar", errors.UNAUTHORIZED_CODE);

        try {
          if (quantity >= 0 && owner.isPrimary && checkScopes(payload, ["beach_bar@crud:beach_bar"])) feature.quantity = quantity;
          else if (quantity >= 0 && (!owner.isPrimary || checkScopes(payload, ["beach_bar@crud:beach_bar"])))
            throw new ApolloError("You are not allowed to change the quantity of the feature", errors.UNAUTHORIZED_CODE);
          if (description) feature.description = description;
          await feature.save();
          await feature.beachBar.updateRedis();
        } catch (err) {
          throw new ApolloError(errors.SOMETHING_WENT_WRONG + ": " + err.message);
        }

        return { feature, updated: true };
      },
    });
    t.field("deleteBeachBarFeature", {
      type: DeleteGraphQlType,
      description: "Delete (remove) a feature (service) from a #beach_bar",
      args: { beachBarId: idArg(), featureId: idArg() },
      resolve: async (_, { beachBarId, featureId }, { payload }: MyContext): Promise<TDelete> => {
        isAuth(payload);
        throwScopesUnauthorized(payload, "You are not allowed to delete (remove) a feature from 'this' #beach_bar", [
          "beach_bar@crud:beach_bar",
        ]);

        const feature = await BeachBarFeature.findOne({
          where: { beachBarId, serviceId: featureId },
          relations: ["beachBar", "beachBar.owners", "beachBar.owners.owner", "service"],
        });
        if (!feature) throw new ApolloError("Specified featue does not exist");

        const owner = feature.beachBar.owners.find(owner => String(owner.owner.userId).trim() === String(payload!.sub).trim());
        if (!owner) throw new ApolloError('You are not an owner of "this" #beach_bar');
        if (!owner.isPrimary) throw new ApolloError(errors.YOU_ARE_NOT_BEACH_BAR_PRIMARY_OWNER, errors.UNAUTHORIZED_CODE);

        try {
          await feature.customSoftRemove(featureId);
        } catch (err) {
          throw new ApolloError(errors.SOMETHING_WENT_WRONG + ": " + err.message);
        }

        return { deleted: true };
      },
    });
  },
});
