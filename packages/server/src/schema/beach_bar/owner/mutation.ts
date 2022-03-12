import { user } from "@/constants/scopes";
import { NonReadonly } from "@/typings/index";
import { arrDiff } from "@/utils/arr";
import { isAuth, throwScopesUnauthorized } from "@/utils/auth";
import { getRedisKey, updateRedis } from "@/utils/db";
import { errors } from "@beach_bar/common";
import { ApolloError } from "apollo-server-express";
import { booleanArg, extendType, idArg, nullable } from "nexus";
import { BeachBarOwnerType } from "./types";

export const OwnerCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addBeachBarOwner", {
      type: BeachBarOwnerType,
      description: "Add (assign) another owner to a #beach_bar too. Only available for the primary owner of a #beach_bar",
      args: {
        beachBarId: idArg({ description: "The ID value of the #beach_bar the owner will be added (assigned) to" }),
        userId: nullable(idArg({ description: "The user to add (assign) to the #beach_bar, to become one of its owners" })),
        isPrimary: nullable(
          booleanArg({
            description:
              "Set to true if the user will become the or one of the primary owners of the #beach_bar. It is set to false by default",
            default: false,
          })
        ),
      },
      resolve: async (_, { userId, beachBarId, isPrimary = false }, { prisma, payload }) => {
        isAuth(payload);
        throwScopesUnauthorized(payload, 'You are not allowed to add "this" user as an owner of the #beach_bar', [
          "beach_bar@crud:owner_beach_bar",
          "beach_bar@create:owner_beach_bar",
        ]);

        const hasScope = userId && payload!.scope.includes("beach_bar@crud:owner_beach_bar");

        const owner = await prisma.owner.findUnique({ where: { userId: hasScope ? +userId : payload!.sub } });
        if (!owner) {
          if (hasScope) {
            throw new ApolloError(errors.USER_OWNER_DOES_NOT_EXIST, errors.NOT_FOUND);
          } else {
            throw new ApolloError(errors.YOU_ARE_NOT_AN_OWNER, errors.UNAUTHORIZED_CODE);
          }
        }

        const barOwner = await prisma.beachBarOwner.findFirst({ where: { ownerId: owner.id, beachBarId: +beachBarId } });

        if (hasScope && !barOwner?.isPrimary) {
          throw new ApolloError("You are not a primary owner, to add a new owner to the #beach_bar", errors.UNAUTHORIZED_CODE);
        }

        if (barOwner) throw new ApolloError("You are already an owner at this #beach_bar", errors.CONFLICT);

        try {
          const newOwner = await prisma.beachBarOwner.create({
            data: {
              ownerId: owner.id,
              beachBarId: +beachBarId,
              isPrimary: isPrimary && payload!.scope.includes("beach_bar@crud:beach_bar") ? true : false,
            },
          });
          await updateRedis({ model: "BeachBar", id: +beachBarId });
          return newOwner;
        } catch (err) {
          throw new ApolloError(err.message);
        }

        // if (!userId) {
        // const newOwner = BeachBarOwner.create({
        //   beachBar,
        //   owner,
        //   isPrimary: isPrimary && payload!.scope.includes("beach_bar@crud:beach_bar") ? true : false,
        // });
        // try {
        // await newOwner.save();
        // await beachBar.updateRedis();
        //     return newOwner;
        //   } catch (err) {
        //     throw new ApolloError(err.message);
        //   }
        // } else if (userId && payload!.scope.includes("beach_bar@crud:owner_beach_bar")) {
        // const primaryOwner = await Owner.findOne({
        //   where: { userId: payload!.sub },
        //   relations: ["beachBars", "beachBars.beachBar"],
        // });
        // if (!primaryOwner) throw new ApolloError(errors.YOU_ARE_NOT_AN_OWNER, errors.UNAUTHORIZED_CODE);
        // const primaryBarOwner = await BeachBarOwner.findOne({ owner: primaryOwner, beachBar });
        // if (!primaryBarOwner) throw new ApolloError(errors.YOU_ARE_NOT_BEACH_BAR_OWNER, errors.UNAUTHORIZED_CODE);
        // if (!primaryBarOwner.isPrimary) {
        //   throw new ApolloError("You are not a primary owner, to add a new owner to the #beach_bar", errors.UNAUTHORIZED_CODE);
        // }
        // const owner = await Owner.findOne({ where: { userId }, relations: ["user"] });
        // if (!owner) throw new ApolloError(errors.USER_OWNER_DOES_NOT_EXIST, errors.NOT_FOUND);
        // const isOwner = await BeachBarOwner.findOne({ owner, beachBar });
        // if (isOwner) throw new ApolloError("User is already an owner of this #beach_bar", errors.CONFLICT);

        // try {
        //   const newOwner = await prisma.beachBarOwner.create({
        //     data: {
        //       ownerId: owner.id,
        //       beachBarId: +beachBarId,
        //       isPrimary: isPrimary && payload!.scope.includes("beach_bar@crud:beach_bar") ? true : false,
        //     },
        //   });
        //   await updateRedis({ model: "BeachBar", id: +beachBarId });
        //   return newOwner;
        // } catch (err) {
        //   throw new ApolloError(err.message);
        // }
        // }
      },
    });
    t.field("updateBeachBarOwner", {
      type: BeachBarOwnerType,
      description: "Update a #beach_bar's owner info",
      args: {
        beachBarId: idArg(),
        ownerId: idArg(),
        publicInfo: nullable(booleanArg()),
        isPrimary: nullable(booleanArg({ default: false })),
      },
      resolve: async (_, { beachBarId, ownerId, publicInfo, isPrimary = false }, { prisma, redis, payload }) => {
        isAuth(payload);
        throwScopesUnauthorized(payload, "You are not allowed to update a #beach_bar owner", [
          "beach_bar@crud:owner_beach_bar",
          "beach_bar@update:owner_beach_bar",
        ]);

        const owner = await prisma.owner.findUnique({ where: { id: +ownerId } });
        if (!owner) throw new ApolloError(errors.YOU_ARE_NOT_AN_OWNER, errors.NOT_FOUND);

        const beachBarOwners = await prisma.beachBarOwner.findMany({ where: { beachBarId: +beachBarId }, include: { owner: true } });
        const hasPrimaryOwner = beachBarOwners.some(({ isPrimary }) => isPrimary);
        const barOwner = beachBarOwners.find(({ ownerId }) => ownerId === owner.id) || null;
        if (!barOwner) throw new ApolloError(errors.YOU_ARE_NOT_AN_OWNER, errors.NOT_FOUND);

        const redisKey = getRedisKey({ model: "User", id: barOwner.owner.userId, scope: true });
        const scopes = [user.CRUD_OWNER_BEACH_BAR, user.CRUD_BEACH_BAR];
        let newIsPrimary: boolean | undefined = undefined;
        try {
          if (isPrimary && !payload!.scope.includes("beach_bar@crud:beach_bar")) {
            throw new ApolloError("You are not allowed to make this owner a primary one", errors.UNAUTHORIZED_CODE);
          } else if (isPrimary && payload!.scope.includes("beach_bar@crud:beach_bar")) {
            newIsPrimary = true;
            await redis.sadd(redisKey, scopes);
          } else {
            newIsPrimary = false;
            await redis.srem(redisKey, scopes);
          }
          if (publicInfo != null && hasPrimaryOwner) {
            throw new ApolloError('You are not allowed to update "this" owner\'s public info');
          }

          const updatedOwner = await prisma.beachBarOwner.update({
            where: { id: barOwner.id },
            data: { isPrimary: newIsPrimary, publicInfo: publicInfo != null && !hasPrimaryOwner ? publicInfo : undefined },
          });
          await updateRedis({ model: "BeachBar", id: barOwner.beachBarId });
          return updatedOwner;
        } catch (err) {
          throw new ApolloError(err.message);
        }
      },
    });
    t.boolean("deleteBeachBarOwner", {
      description: "Delete (remove) an owner from a #beach_bar",
      args: { ownerId: idArg(), beachBarId: idArg() },
      resolve: async (_, { ownerId, beachBarId }, { prisma, redis, payload }) => {
        isAuth(payload);
        throwScopesUnauthorized(payload, "You are not allowed to delete an owner from a #beach_bar", [
          "beach_bar@crud:owner_beach_bar",
          "beach_bar@delete:owner_beach_bar",
        ]);

        const owner = await prisma.owner.findUnique({ where: { id: +(payload?.sub || ownerId) } });
        if (!owner) throw new ApolloError(errors.YOU_ARE_NOT_AN_OWNER, errors.NOT_FOUND);
        const barOwner = await prisma.beachBarOwner.findFirst({
          where: { ownerId: owner.id, beachBarId: +beachBarId },
          include: { owner: true },
        });
        if (!barOwner) throw new ApolloError(errors.YOU_ARE_NOT_BEACH_BAR_OWNER, errors.NOT_FOUND);
        if (!barOwner.isPrimary && payload?.sub) {
          throw new ApolloError("You are not allowed to delete an owner from this #beach_bar");
        }

        const redisKey = getRedisKey({ model: "User", id: barOwner.owner.userId, scope: true });
        try {
          const ownerScopes = await redis.smembers(redisKey);
          const diff = arrDiff(user.SIMPLE_USER as NonReadonly<typeof user.SIMPLE_USER>, ownerScopes);
          if (diff.length > 0) await redis.srem(redisKey, ...diff);
          // TODO: Fix
          // await barOwner.softRemove();
        } catch (err) {
          throw new ApolloError(err.message);
        }

        return true;
      },
    });
  },
});
