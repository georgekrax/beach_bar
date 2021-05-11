import { errors, MyContext } from "@beach_bar/common";
import { ApolloError } from "apollo-server-express";
import { user } from "constants/scopes";
import { BeachBar } from "entity/BeachBar";
import { BeachBarOwner } from "entity/BeachBarOwner";
import { Owner } from "entity/Owner";
import { KeyType } from "ioredis";
import { booleanArg, extendType, idArg, nullable } from "nexus";
import { DeleteType } from "typings/.index";
import { TAddBeachBarOwner, TUpdateBeachBarOwner } from "typings/owner";
import arrDiff from "utils/arrDiff";
import { isAuth, throwScopesUnauthorized } from "utils/auth/payload";
import { DeleteResult } from "../types";
import { AddBeachBarOwnerType, UpdateBeachBarOwnerType } from "./types";

export const OwnerCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addBeachBarOwner", {
      type: AddBeachBarOwnerType,
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
      resolve: async (_, { userId, beachBarId, isPrimary }, { payload }: MyContext): Promise<TAddBeachBarOwner> => {
        isAuth(payload);
        throwScopesUnauthorized(payload, 'You are not allowed to add "this" user as an owner of the #beach_bar', [
          "beach_bar@crud:owner_beach_bar",
          "beach_bar@create:owner_beach_bar",
        ]);

        const beachBar = await BeachBar.findOne(beachBarId);
        if (!beachBar) throw new ApolloError(errors.BEACH_BAR_DOES_NOT_EXIST, errors.NOT_FOUND);

        if (!userId) {
          const owner = await Owner.findOne({
            where: { userId: payload!.sub },
            relations: ["user", "beachBars", "beachBars.beachBar"],
          });
          if (!owner) throw new ApolloError(errors.YOU_ARE_NOT_AN_OWNER, errors.UNAUTHORIZED_CODE);
          const isOwner = await BeachBarOwner.findOne({ owner, beachBar });
          if (isOwner) throw new ApolloError("You are already an owner at this #beach_bar", errors.CONFLICT);
          const newOwner = BeachBarOwner.create({
            beachBar,
            owner,
            isPrimary: isPrimary && payload!.scope.includes("beach_bar@crud:beach_bar") ? true : false,
          });
          try {
            await newOwner.save();
            await beachBar.updateRedis();
            return { owner: newOwner, added: true };
          } catch (err) {
            throw new ApolloError(err.message);
          }
        } else if (userId && payload!.scope.includes("beach_bar@crud:owner_beach_bar")) {
          const primaryOwner = await Owner.findOne({
            where: { userId: payload!.sub },
            relations: ["beachBars", "beachBars.beachBar"],
          });
          if (!primaryOwner) throw new ApolloError(errors.YOU_ARE_NOT_AN_OWNER, errors.UNAUTHORIZED_CODE);
          const primaryBeachBarOwner = await BeachBarOwner.findOne({ owner: primaryOwner, beachBar });
          if (!primaryBeachBarOwner) throw new ApolloError(errors.YOU_ARE_NOT_BEACH_BAR_OWNER, errors.UNAUTHORIZED_CODE);
          if (!primaryBeachBarOwner.isPrimary)
            throw new ApolloError("You are not a primary owner, to add a new owner to the #beach_bar", errors.UNAUTHORIZED_CODE);
          const owner = await Owner.findOne({ where: { userId }, relations: ["user"] });
          if (!owner) throw new ApolloError(errors.USER_OWNER_DOES_NOT_EXIST, errors.NOT_FOUND);
          const isOwner = await BeachBarOwner.findOne({ owner, beachBar });
          if (isOwner) throw new ApolloError("User is already an owner of this #beach_bar", errors.CONFLICT);
          const newOwner = BeachBarOwner.create({
            beachBar,
            owner,
            isPrimary: isPrimary && payload!.scope.includes("beach_bar@crud:beach_bar") ? true : false,
          });
          try {
            await newOwner.save();
            await beachBar.updateRedis();
            return { owner: newOwner, added: true };
          } catch (err) {
            throw new ApolloError(err.message);
          }
        }
        throw new ApolloError(errors.SOMETHING_WENT_WRONG);
      },
    });
    t.field("updateBeachBarOwner", {
      type: UpdateBeachBarOwnerType,
      description: "Update a #beach_bar's owner info",
      args: {
        beachBarId: idArg(),
        userId: nullable(idArg()),
        publicInfo: nullable(booleanArg()),
        isPrimary: nullable(booleanArg({ default: false })),
      },
      resolve: async (
        _,
        { beachBarId, userId, publicInfo, isPrimary },
        { payload, redis }: MyContext
      ): Promise<TUpdateBeachBarOwner> => {
        isAuth(payload);
        throwScopesUnauthorized(payload, "You are not allowed to update a #beach_bar owner", [
          "beach_bar@crud:owner_beach_bar",
          "beach_bar@update:owner_beach_bar",
        ]);

        let beachBarOwner: BeachBarOwner | undefined;
        let primaryBeachBarOwner: BeachBarOwner | undefined;
        if (!userId) {
          const owner = await Owner.findOne({ where: { userId: payload!.sub }, relations: ["user"] });
          if (!owner) throw new ApolloError(errors.YOU_ARE_NOT_AN_OWNER, errors.NOT_FOUND);
          beachBarOwner = await BeachBarOwner.findOne({
            where: { owner, beachBarId },
            relations: ["beachBar", "owner", "owner.user", "beachBar"],
          });
          if (!beachBarOwner) throw new ApolloError(errors.YOU_ARE_NOT_AN_OWNER, errors.NOT_FOUND);
        } else if (userId) {
          const primaryOwner = await Owner.findOne({
            where: { userId: payload!.sub },
            relations: ["beachBars", "beachBars.beachBar"],
          });
          if (!primaryOwner) throw new ApolloError(errors.YOU_ARE_NOT_AN_OWNER, errors.NOT_FOUND);
          primaryBeachBarOwner = primaryOwner.beachBars.find(
            beachBar => beachBar.beachBar.id === beachBarId && (beachBar.deletedAt === null || beachBar.deletedAt === undefined)
          );
          if (!primaryBeachBarOwner) throw new ApolloError(errors.YOU_ARE_NOT_BEACH_BAR_OWNER, errors.NOT_FOUND);
          if (!primaryBeachBarOwner.isPrimary) throw new ApolloError('You are not allowed to update "this" owner\'s info');
          const owner = await Owner.findOne({ userId });
          if (!owner) throw new ApolloError(errors.USER_OWNER_DOES_NOT_EXIST, errors.NOT_FOUND);
          beachBarOwner = await BeachBarOwner.findOne({
            where: { owner, beachBarId },
            relations: ["beachBar", "owner", "owner.user", "beachBar"],
          });
        }

        if (!beachBarOwner) throw new ApolloError(errors.SOMETHING_WENT_WRONG);

        try {
          if (isPrimary && !payload!.scope.includes("beach_bar@crud:beach_bar"))
            throw new ApolloError("You are not allowed to make this owner a primary one", errors.UNAUTHORIZED_CODE);
          else if (isPrimary && payload!.scope.includes("beach_bar@crud:beach_bar")) {
            beachBarOwner.isPrimary = true;
            await redis.sadd(beachBarOwner.owner.user.getRedisKey(true) as KeyType, [user.CRUD_OWNER_BEACH_BAR, user.CRUD_BEACH_BAR]);
          } else {
            beachBarOwner.isPrimary = false;
            await redis.srem(beachBarOwner.owner.user.getRedisKey(true) as KeyType, [user.CRUD_OWNER_BEACH_BAR, user.CRUD_BEACH_BAR]);
          }
          if ((publicInfo !== undefined || null) && primaryBeachBarOwner)
            throw new ApolloError('You are not allowed to update "this" owner\'s public info');
          else if ((publicInfo !== undefined || null) && !primaryBeachBarOwner) beachBarOwner.publicInfo = publicInfo;
          await beachBarOwner.save();
          await beachBarOwner.beachBar.updateRedis();
        } catch (err) {
          throw new ApolloError(err.message);
        }

        return { owner: beachBarOwner, updated: true };
      },
    });
    t.field("deleteBeachBarOwner", {
      type: DeleteResult,
      description: "Delete (remove) an owner from a #beach_bar",
      args: { beachBarId: idArg(), userId: nullable(idArg()) },
      resolve: async (_, { beachBarId, userId }, { payload, redis }: MyContext): Promise<DeleteType | any> => {
        isAuth(payload);
        throwScopesUnauthorized(payload, "You are not allowed to delete an owner from a #beach_bar", [
          "beach_bar@crud:owner_beach_bar",
          "beach_bar@delete:owner_beach_bar",
        ]);

        let beachBarOwner: any;
        if (!userId) {
          const owner = await Owner.findOne({ userId: payload!.sub });
          if (!owner) throw new ApolloError(errors.YOU_ARE_NOT_AN_OWNER, errors.NOT_FOUND);
          beachBarOwner = await BeachBarOwner.findOne({
            where: { owner, beachBarId },
            relations: ["beachBar", "owner", "owner.user"],
          });
          if (!beachBarOwner) throw new ApolloError(errors.YOU_ARE_NOT_BEACH_BAR_OWNER, errors.NOT_FOUND);
        } else if (userId) {
          const primaryOwner: Owner | undefined = await Owner.findOne({ userId: payload!.sub });
          if (!primaryOwner) throw new ApolloError(errors.YOU_ARE_NOT_AN_OWNER, errors.NOT_FOUND);
          const primaryBeachBarOwner = await BeachBarOwner.findOne({ owner: primaryOwner, beachBarId });
          if (!primaryBeachBarOwner) throw new ApolloError(errors.YOU_ARE_NOT_BEACH_BAR_OWNER, errors.NOT_FOUND);
          if (!primaryBeachBarOwner.isPrimary) throw new ApolloError("You are not allowed to delete an owner from this #beach_bar");
          const owner = await Owner.findOne({ userId });
          if (!owner) throw new ApolloError(errors.USER_DOES_NOT_EXIST, errors.NOT_FOUND);
          beachBarOwner = await BeachBarOwner.findOne({
            where: { owner, beachBarId },
            relations: ["beachBar", "owner", "owner.user"],
          });
          if (!beachBarOwner) throw new ApolloError("User is not an owner at this #beach_bar");
        }

        if (!beachBarOwner) throw new ApolloError(errors.SOMETHING_WENT_WRONG);

        try {
          const ownerScopes = await redis.smembers(beachBarOwner.owner.user.getRedisKey(true) as KeyType);
          const diff = arrDiff(user.SIMPLE_USER, ownerScopes);
          if (diff.length > 0) await redis.srem(beachBarOwner.owner.user.getRedisKey(true) as KeyType, ...diff);
          await beachBarOwner.softRemove();
        } catch (err) {
          throw new ApolloError(err.message);
        }

        return { deleted: true };
      },
    });
  },
});
