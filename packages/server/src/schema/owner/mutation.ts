import { errors, MyContext } from "@beach_bar/common";
import { user } from "constants/scopes";
import { BeachBar } from "entity/BeachBar";
import { BeachBarOwner } from "entity/BeachBarOwner";
import { Owner } from "entity/Owner";
import { KeyType } from "ioredis";
import { booleanArg, extendType, intArg, nullable } from "nexus";
import { DeleteType } from "typings/.index";
import { AddBeachBarOwnerType, UpdateBeachBarOwnerType } from "typings/owner";
import arrDiff from "utils/arrDiff";
import { DeleteResult } from "../types";
import { AddBeachBarOwnerResult, UpdateBeachBarOwnerResult } from "./types";

export const OwnerCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addBeachBarOwner", {
      type: AddBeachBarOwnerResult,
      description: "Add (assign) another owner to a #beach_bar too. Only available for the primary owner of a #beach_bar",
      args: {
        beachBarId: intArg({ description: "The ID value of the #beach_bar the owner will be added (assigned) to" }),
        userId: nullable(
          intArg({
            description: "The user to add (assign) to the #beach_bar, to become one of its owners",
          })
        ),
        isPrimary: nullable(
          booleanArg({
            description:
              "Set to true if the user will become the or one of the primary owners of the #beach_bar. It is set to false by default",
            default: false,
          })
        ),
      },
      resolve: async (_, { userId, beachBarId, isPrimary }, { payload }: MyContext): Promise<AddBeachBarOwnerType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (!payload.scope.some(scope => ["beach_bar@crud:owner_beach_bar", "beach_bar@create:owner_beach_bar"].includes(scope))) {
          return {
            error: {
              code: errors.UNAUTHORIZED_CODE,
              message: "You are not allowed to add 'this' owner to a #beach_bar",
            },
          };
        }

        if (!beachBarId || beachBarId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid #beach_bar" } };
        }
        if (userId && userId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid user" } };
        }

        const beachBar = await BeachBar.findOne(beachBarId);
        if (!beachBar) {
          return { error: { code: errors.CONFLICT, message: errors.BEACH_BAR_DOES_NOT_EXIST } };
        }

        if (!userId) {
          const owner = await Owner.findOne({
            where: { userId: payload.sub },
            relations: ["user", "beachBars", "beachBars.beachBar"],
          });
          if (!owner) {
            return { error: { code: errors.UNAUTHORIZED_CODE, message: errors.YOU_ARE_NOT_AN_OWNER } };
          }
          const isOwner = await BeachBarOwner.findOne({ owner, beachBar });
          if (isOwner) {
            return { error: { code: errors.CONFLICT, message: "You are already an owner at this #beach_bar" } };
          }
          const newOwner = BeachBarOwner.create({
            beachBar,
            owner,
            isPrimary: isPrimary && payload.scope.includes("beach_bar@crud:beach_bar") ? true : false,
          });
          try {
            await newOwner.save();
            await beachBar.updateRedis();
            return {
              owner: newOwner,
              added: true,
            };
          } catch (err) {
            return { error: { message: `Something went wrong: ${err.message}` } };
          }
        } else if (userId && payload.scope.includes("beach_bar@crud:owner_beach_bar")) {
          const primaryOwner = await Owner.findOne({
            where: { userId: payload.sub },
            relations: ["beachBars", "beachBars.beachBar"],
          });
          if (!primaryOwner) {
            return { error: { code: errors.UNAUTHORIZED_CODE, message: errors.YOU_ARE_NOT_AN_OWNER } };
          }
          const primaryBeachBarOwner = await BeachBarOwner.findOne({ owner: primaryOwner, beachBar });
          if (!primaryBeachBarOwner) {
            return { error: { code: errors.UNAUTHORIZED_CODE, message: errors.YOU_ARE_NOT_BEACH_BAR_OWNER } };
          }
          if (!primaryBeachBarOwner.isPrimary) {
            return {
              error: { code: errors.UNAUTHORIZED_CODE, message: "You are not a primary owner, to add a new owner to the #beach_bar" },
            };
          }
          const owner = await Owner.findOne({ where: { userId }, relations: ["user"] });
          if (!owner) {
            return { error: { code: errors.CONFLICT, message: errors.USER_OWNER_DOES_NOT_EXIST } };
          }
          const isOwner = await BeachBarOwner.findOne({ owner, beachBar });
          if (isOwner) {
            return { error: { code: errors.CONFLICT, message: "User is already an owner of this #beach_bar" } };
          }
          const newOwner = BeachBarOwner.create({
            beachBar,
            owner,
            isPrimary: isPrimary && payload.scope.includes("beach_bar@crud:beach_bar") ? true : false,
          });
          try {
            await newOwner.save();
            await beachBar.updateRedis();
            return {
              owner: newOwner,
              added: true,
            };
          } catch (err) {
            return { error: { message: `Something went wrong: ${err.message}` } };
          }
        }
        return { error: { message: errors.SOMETHING_WENT_WRONG } };
      },
    });
    t.field("updateBeachBarOwner", {
      type: UpdateBeachBarOwnerResult,
      description: "Update a #beach_bar's owner info",
      args: {
        beachBarId: intArg({ description: "The ID value of the #beach_bar the owner is added (assigned) to" }),
        userId: nullable(
          intArg({
            description: "The user to update its info. It should not be null or 0, if a primary owner wants to update another owner",
          })
        ),
        publicInfo: nullable(
          booleanArg({
            description: "A boolean that indicates if the owner info (contact details) are meant to be presented online to the public",
          })
        ),
        isPrimary: nullable(
          booleanArg({
            description:
              "Set to true if the user will become the or one of the primary owners of the #beach_bar. It is set to false by default",
            default: false,
          })
        ),
      },
      resolve: async (
        _,
        { beachBarId, userId, publicInfo, isPrimary },
        { payload, redis }: MyContext
      ): Promise<UpdateBeachBarOwnerType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (!payload.scope.some(scope => ["beach_bar@crud:owner_beach_bar", "beach_bar@update:owner_beach_bar"].includes(scope))) {
          return {
            error: {
              code: errors.UNAUTHORIZED_CODE,
              message: "You are not allowed to update 'this' owner",
            },
          };
        }

        if (!beachBarId || beachBarId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid #beach_bar" } };
        }
        if (userId && userId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid owner" } };
        }

        let beachBarOwner: BeachBarOwner | undefined;
        let primaryBeachBarOwner: BeachBarOwner | undefined;
        if (!userId) {
          const owner = await Owner.findOne({ where: { userId: payload.sub }, relations: ["user"] });
          if (!owner) {
            return { error: { code: errors.CONFLICT, message: errors.YOU_ARE_NOT_AN_OWNER } };
          }
          beachBarOwner = await BeachBarOwner.findOne({
            where: { owner, beachBarId },
            relations: ["beachBar", "owner", "owner.user", "beachBar"],
          });
          if (!beachBarOwner) {
            return { error: { code: errors.CONFLICT, message: errors.YOU_ARE_NOT_BEACH_BAR_OWNER } };
          }
        } else if (userId) {
          const primaryOwner = await Owner.findOne({
            where: { userId: payload.sub },
            relations: ["beachBars", "beachBars.beachBar"],
          });
          if (!primaryOwner) {
            return { error: { code: errors.CONFLICT, message: errors.YOU_ARE_NOT_AN_OWNER } };
          }
          primaryBeachBarOwner = primaryOwner.beachBars.find(
            beachBar => beachBar.beachBar.id === beachBarId && (beachBar.deletedAt === null || beachBar.deletedAt === undefined)
          );
          if (!primaryBeachBarOwner) {
            return { error: { code: errors.CONFLICT, message: errors.YOU_ARE_NOT_BEACH_BAR_OWNER } };
          }
          if (!primaryBeachBarOwner.isPrimary) {
            return { error: { code: errors.UNAUTHORIZED_CODE, message: "You are not allowed to update 'this' owner info" } };
          }
          const owner = await Owner.findOne({ userId });
          if (!owner) {
            return { error: { code: errors.CONFLICT, message: errors.USER_OWNER_DOES_NOT_EXIST } };
          }
          beachBarOwner = await BeachBarOwner.findOne({
            where: { owner, beachBarId },
            relations: ["beachBar", "owner", "owner.user", "beachBar"],
          });
        }

        if (!beachBarOwner) {
          return { error: { message: errors.SOMETHING_WENT_WRONG } };
        }

        try {
          if (isPrimary && !payload.scope.includes("beach_bar@crud:beach_bar")) {
            return { error: { code: errors.UNAUTHORIZED_CODE, message: "You are not allowed to make this owner a primary one" } };
          } else if (isPrimary && payload.scope.includes("beach_bar@crud:beach_bar")) {
            beachBarOwner.isPrimary = true;
            await redis.sadd(beachBarOwner.owner.user.getRedisKey(true) as KeyType, [user.CRUD_OWNER_BEACH_BAR, user.CRUD_BEACH_BAR]);
          } else {
            beachBarOwner.isPrimary = false;
            await redis.srem(beachBarOwner.owner.user.getRedisKey(true) as KeyType, [user.CRUD_OWNER_BEACH_BAR, user.CRUD_BEACH_BAR]);
          }
          if ((publicInfo !== undefined || null) && primaryBeachBarOwner) {
            return {
              error: {
                code: errors.UNAUTHORIZED_CODE,
                message: "You are not allowed to update 'this' owner's public info",
              },
            };
          } else if ((publicInfo !== undefined || null) && !primaryBeachBarOwner) {
            beachBarOwner.publicInfo = publicInfo;
          }
          await beachBarOwner.save();
          await beachBarOwner.beachBar.updateRedis();
        } catch (err) {
          return { error: { message: `Something went wrong: ${err.message}` } };
        }

        return {
          owner: beachBarOwner,
          updated: true,
        };
      },
    });
    t.field("deleteBeachBarOwner", {
      type: DeleteResult,
      description: "Delete (remove) an owner from a #beach_bar",
      args: {
        beachBarId: intArg({ description: "The ID value of the #beach_bar the owner is added (assigned) to" }),
        userId: nullable(
          intArg({
            description:
              "The owner with its userId to delete (remove) from the #beach_bar. Its value should not be null or 0, if a primary owner wants to update another primary owner",
          })
        ),
      },
      resolve: async (_, { beachBarId, userId }, { payload, redis }: MyContext): Promise<DeleteType | any> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (!payload.scope.some(scope => ["beach_bar@crud:owner_beach_bar", "beach_bar@delete:owner_beach_bar"].includes(scope))) {
          return {
            error: {
              code: errors.UNAUTHORIZED_CODE,
              message: "You are not allowed to delete 'this' owner",
            },
          };
        }

        if (!beachBarId || beachBarId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid #beach_bar" } };
        }
        if (userId && userId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid owner" } };
        }

        let beachBarOwner: any;
        if (!userId) {
          const owner = await Owner.findOne({ userId: payload.sub });
          if (!owner) {
            return { error: { code: errors.CONFLICT, message: errors.YOU_ARE_NOT_AN_OWNER } };
          }
          beachBarOwner = await BeachBarOwner.findOne({
            where: { owner, beachBarId },
            relations: ["beachBar", "owner", "owner.user"],
          });
          if (!beachBarOwner) {
            return { error: { code: errors.CONFLICT, message: errors.YOU_ARE_NOT_BEACH_BAR_OWNER } };
          }
        } else if (userId) {
          const primaryOwner: Owner | undefined = await Owner.findOne({ userId: payload.sub });
          if (!primaryOwner) {
            return { error: { code: errors.CONFLICT, message: errors.YOU_ARE_NOT_AN_OWNER } };
          }
          const primaryBeachBarOwner = await BeachBarOwner.findOne({
            owner: primaryOwner,
            beachBarId,
          });
          if (!primaryBeachBarOwner) {
            return { error: { code: errors.CONFLICT, message: errors.YOU_ARE_NOT_BEACH_BAR_OWNER } };
          }
          if (!primaryBeachBarOwner.isPrimary) {
            return { error: { code: errors.UNAUTHORIZED_CODE, message: "You are not allowed to delete 'this' owner" } };
          }
          const owner = await Owner.findOne({ userId });
          if (!owner) {
            return { error: { code: errors.CONFLICT, message: errors.USER_OWNER_DOES_NOT_EXIST } };
          }
          beachBarOwner = await BeachBarOwner.findOne({
            where: { owner, beachBarId },
            relations: ["beachBar", "owner", "owner.user"],
          });
          if (!beachBarOwner) {
            return { error: { code: errors.CONFLICT, message: "Specified user is not an owner at this #beach_bar" } };
          }
        }

        if (!beachBarOwner) {
          return { error: { message: errors.SOMETHING_WENT_WRONG } };
        }

        try {
          const ownerScopes = await redis.smembers(beachBarOwner.owner.user.getRedisKey(true) as KeyType);
          const diff = arrDiff(user.SIMPLE_USER, ownerScopes);
          if (diff.length > 0) {
            await redis.srem(beachBarOwner.owner.user.getRedisKey(true) as KeyType, ...diff);
          }
          await beachBarOwner.softRemove();
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
