import { checkScopes, isAuth, throwScopesUnauthorized } from "@/utils/auth";
import { isOwner, IsOwnerInclude } from "@/utils/beachBar";
import { updateRedis } from "@/utils/db";
import { errors, TABLES } from "@beach_bar/common";
import { UserInputError } from "apollo-server-errors";
import { ApolloError } from "apollo-server-express";
import { extendType, idArg, intArg, nullable, stringArg } from "nexus";
import { BeachBarFeatureType } from "./types";

export const BeachBarFeatureMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addBeachBarFeature", {
      type: BeachBarFeatureType,
      description: "Add (assign) a feature to a #beach_bar.",
      args: {
        beachBarId: idArg(),
        featureId: idArg(),
        description: nullable(stringArg({ description: "A short description about the service" })),
        quantity: intArg({
          default: 1,
          description: "An integer that indicates the quantity of the service, a #beach_bar provides",
        }),
      },
      resolve: async (_, { beachBarId, featureId, quantity = 1, ...args }, { prisma, payload }) => {
        isAuth(payload);
        throwScopesUnauthorized(payload, "You are not allowed to add a feature to 'this' #beach_bar", ["beach_bar@crud:beach_bar"]);

        if (beachBarId.toString().trim().length === 0) throw new UserInputError("Please provide a valid beachBarId");
        if (featureId.toString().trim().length === 0) throw new UserInputError("Please provide a valid featureId");

        const beachBar = await prisma.beachBar.findUnique({
          where: { id: +beachBarId },
          include: { ...IsOwnerInclude, features: true },
        });
        if (!beachBar) throw new ApolloError(errors.BEACH_BAR_DOES_NOT_EXIST, errors.NOT_FOUND);
        const existingFeature = beachBar.features.find(({ serviceId }) => serviceId.toString() === featureId.toString());
        if (existingFeature) {
          if (!existingFeature.deletedAt) throw new ApolloError("Feature already exists", errors.CONFLICT);
          const updatedFeature = await prisma.beachBarFeature.update({
            where: { id: existingFeature.id },
            data: { deletedAt: null },
          });

          await updateRedis({ model: "BeachBar", id: beachBar.id });
          return updatedFeature as any;
        }

        isOwner(beachBar, { userId: payload!.sub, mustBePrimary: true });

        const barFeature = TABLES.BEACH_BAR_SERVICE.find(({ id }) => id.toString() === featureId.toString());
        if (!barFeature) throw new ApolloError("Specified feature does not exist", errors.NOT_FOUND);

        try {
          const newFeature = await prisma.beachBarFeature.create({
            data: { ...args, quantity, beachBarId: beachBar.id, serviceId: barFeature.id },
          });

          await updateRedis({ model: "BeachBar", id: beachBar.id });
          return newFeature as any;
        } catch (err) {
          throw new ApolloError(errors.SOMETHING_WENT_WRONG + ": " + err.message);
        }
      },
    });
    t.field("updateBeachBarFeature", {
      type: BeachBarFeatureType,
      description: "Update a feature of a #beach_bar.",
      args: { id: idArg(), quantity: nullable(intArg()), description: nullable(stringArg()) },
      resolve: async (_, { id, quantity, ...args }, { prisma, payload }) => {
        isAuth(payload);
        throwScopesUnauthorized(payload, "You are not allowed to update a feature of 'this' #beach_bar", [
          "beach_bar@crud:beach_bar",
          "beach_bar@update:beach_bar_feature:description",
        ]);

        if (id.toString().trim().length === 0) throw new UserInputError("Please provide a valid ID");

        const feature = await prisma.beachBarFeature.findUnique({
          where: { id: BigInt(id) },
          include: { beachBar: { include: IsOwnerInclude } },
        });
        if (!feature) throw new ApolloError("Specified feature does not exist");

        const owner = isOwner(feature.beachBar, { userId: payload!.sub });

        try {
          if (quantity && (!owner.isPrimary || checkScopes(payload, ["beach_bar@crud:beach_bar"]))) {
            throw new ApolloError("You are not allowed to change the quantity of the feature", errors.UNAUTHORIZED_CODE);
          }
          const updatedFeature = await prisma.beachBarFeature.update({
            where: { id: feature.id },
            data: { ...args, quantity: quantity || undefined },
          });

          await updateRedis({ model: "BeachBar", id: feature.beachBarId });
          return updatedFeature as any;
        } catch (err) {
          throw new ApolloError(errors.SOMETHING_WENT_WRONG + ": " + err.message);
        }
      },
    });
    t.boolean("deleteBeachBarFeature", {
      description: "Delete (remove) a feature (service) from a #beach_bar.",
      args: { id: idArg() },
      resolve: async (_, { id }, { prisma, payload }) => {
        isAuth(payload);
        throwScopesUnauthorized(payload, "You are not allowed to delete (remove) a feature from 'this' #beach_bar", [
          "beach_bar@crud:beach_bar",
        ]);

        if (id.toString().trim().length === 0) throw new UserInputError("Please provide a valid ID");

        const feature = await prisma.beachBarFeature.findUnique({
          where: { id: BigInt(id) },
          include: { beachBar: { include: IsOwnerInclude } },
        });
        if (!feature) throw new ApolloError("Specified featue does not exist.");

        isOwner(feature.beachBar, { userId: payload!.sub, mustBePrimary: true });

        try {
          // TODO: Fix
          // await feature.customSoftRemove();
        } catch (err) {
          throw new ApolloError(errors.SOMETHING_WENT_WRONG + ": " + err.message);
        }

        return true;
      },
    });
  },
});
