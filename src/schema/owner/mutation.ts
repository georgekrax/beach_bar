import { booleanArg, extendType, intArg } from "@nexus/schema";
import { KeyType } from "ioredis";
import { getConnection } from "typeorm";
import { MyContext } from "../../common/myContext";
import errors from "../../constants/errors";
import scopes from "../../constants/scopes";
import { BeachBar } from "../../entity/BeachBar";
import { BeachBarOwner } from "../../entity/BeachBarOwner";
import { User } from "../../entity/User";
import { DeleteType, ErrorType } from "../returnTypes";
import { DeleteResult } from "../types";
import { AddBeachBarOwnerType, UpdateBeachBarOwnerType } from "./returnTypes";
import { AddBeachBarOwnerResult, UpdateBeachBarOwnerResult } from "./types";

export const OwnerCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addBeachBarOwner", {
      type: AddBeachBarOwnerResult,
      description: "Add (assign) another owner to a #beach_bar too. Only available for the primary owner of a #beach_bar",
      nullable: false,
      args: {
        userId: intArg({
          required: true,
          description: "The user to add (assign) to the #beach_bar, to become one of its owners",
        }),
        beachBarId: intArg({
          required: true,
          description: "The ID value of the #beach_bar the owner will be added (assigned) to",
        }),
        isPrimary: booleanArg({
          required: false,
          description:
            "Set to true if the user will become the or one of the primary owners of the #beach_bar. It is set to false by default",
          default: false,
        }),
      },
      resolve: async (_, { userId, beachBarId, isPrimary }, { payload }: MyContext): Promise<AddBeachBarOwnerType | ErrorType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (!payload.scope.some(scope => ["beach_bar@crud:owner_beach_bar", "beach_bar@create:owner_beach_bar"].includes(scope))) {
          return {
            error: {
              code: errors.UNAUTHORIZED_CODE,
              message: "You are not allowed to add 'this' user as an owner of the #beach_bar",
            },
          };
        }
        if (!userId || userId.toString() === ("" || " ")) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid owner" } };
        }
        if (!beachBarId || beachBarId.toString() === ("" || " ")) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid #beach_bar" } };
        }

        const beachBar = await BeachBar.findOne({
          where: { id: beachBarId },
          relations: ["owners", "owners.user", "owners.user.account"],
        });
        if (!beachBar) {
          return {
            error: { code: errors.CONFLICT, message: errors.BEACH_BAR_DOES_NOT_EXIST },
          };
        }

        let owner = await BeachBarOwner.findOne({
          where: { userId: payload.sub, beachBar },
          relations: ["user", "user.account", "beachBar"],
        });
        if (!owner && !payload.scope.includes("beach_bar@crud:beach_bar")) {
          return { error: { code: errors.CONFLICT, message: errors.SOMETHING_WENT_WRONG } };
        } else if (!owner && payload.scope.includes("beach_bar@crud:beach_bar")) {
          const user = await User.findOne({ where: { id: payload.sub }, relations: ["account", "reviews"] });
          if (!user) {
            return { error: { code: errors.CONFLICT, message: errors.SOMETHING_WENT_WRONG } };
          }
          owner = await BeachBarOwner.create({
            beachBar,
            user,
            isPrimary: true,
          }).save();
        }

        if (!owner || !owner.isPrimary) {
          return {
            error: { code: errors.CONFLICT, message: "You are not a primary owner of this #beach_bar" },
          };
        }

        const user = await User.findOne({
          where: { id: userId },
          relations: ["account", "beachBars", "beachBars.user", "beachBars.beachBar"],
        });
        if (!user) {
          return {
            error: { code: errors.CONFLICT, message: errors.USER_DOES_NOT_EXIST },
          };
        }

        if (user.beachBars && user.beachBars.map(beachBar => beachBar.beachBar.id).includes(beachBar.id)) {
          return { error: { code: errors.CONFLICT, message: "User is already an owner on 'this' #beach_bar" } };
        }

        const newOwner = BeachBarOwner.create({
          beachBar,
          user,
          isPrimary: owner.isPrimary && (isPrimary !== undefined || null ? isPrimary : false) ? true : false,
        });

        try {
          await newOwner.save();
        } catch (err) {
          return { error: { message: `Something went wrong: ${err.message}` } };
        }

        return {
          owner: newOwner,
          added: true,
        };
      },
    });
    t.field("updateBeachBarOwner", {
      type: UpdateBeachBarOwnerResult,
      description: "Update a #beach_bar's owner info",
      nullable: false,
      args: {
        beachBarId: intArg({
          required: true,
          description: "The ID value of the #beach_bar the owner is added (assigned) to",
        }),
        userId: intArg({
          required: false,
          description: "The user to update its info. It should not be null if a primary owner wants to update another owner",
        }),
        publicInfo: booleanArg({
          required: false,
          description: "A boolean that indicates if the owner info (contact details) are meant to be presented online to the public",
        }),
        isPrimary: booleanArg({
          required: false,
          description:
            "Set to true if the user will become the or one of the primary owners of the #beach_bar. It is set to false by default",
          default: false,
        }),
      },
      resolve: async (
        _,
        { beachBarId, userId, publicInfo, isPrimary },
        { payload, redis }: MyContext,
      ): Promise<UpdateBeachBarOwnerType | ErrorType> => {
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

        if (!beachBarId || beachBarId.toString() === ("" || " ")) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid #beach_bar" } };
        }
        if (userId && userId.toString() === ("" || " ")) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid owner" } };
        }

        let owner: BeachBarOwner | undefined;
        let primaryOwner: BeachBarOwner | undefined;
        if (!userId) {
          owner = await BeachBarOwner.findOne({
            where: { userId: payload.sub, beachBarId },
            relations: ["user", "user.account", "beachBar"],
          });
          if (!owner) {
            return { error: { code: errors.CONFLICT, message: "You are not an owner at this #beach_bar" } };
          }
        } else if (userId) {
          primaryOwner = await BeachBarOwner.findOne({ userId: payload.sub, beachBarId });
          if (!primaryOwner) {
            return { error: { code: errors.CONFLICT, message: "You are not an owner at this #beach_bar" } };
          }
          if (!primaryOwner.isPrimary) {
            return { error: { code: errors.UNAUTHORIZED_CODE, message: "You are not allowed to update 'this' owner info" } };
          }
          owner = await BeachBarOwner.findOne({
            where: { userId, beachBarId },
            relations: ["user", "user.account", "beachBar"],
          });
        }

        if (!owner) {
          return { error: { message: errors.SOMETHING_WENT_WRONG } };
        }

        try {
          if (isPrimary && !payload.scope.includes("beach_bar@crud:beach_bar")) {
            return { error: { code: errors.UNAUTHORIZED_CODE, message: "You are not allowed to make this owner a primary one" } };
          } else if (isPrimary && payload.scope.includes("beach_bar@crud:beach_bar")) {
            owner.isPrimary = true;
            await redis.sadd(`scope:${owner.user.id}` as KeyType, [scopes.CRUD_OWNER_BEACH_BAR, scopes.CRUD_BEACH_BAR]);
          } else {
            owner.isPrimary = false;
            await redis.srem(`scope:${owner.user.id}` as KeyType, [scopes.CRUD_OWNER_BEACH_BAR, scopes.CRUD_BEACH_BAR]);
          }
          if ((publicInfo !== undefined || null) && primaryOwner) {
            return {
              error: {
                code: errors.UNAUTHORIZED_CODE,
                message: "You are not allowed to update 'this' owner's public info",
              },
            };
          } else if ((publicInfo !== undefined || null) && !primaryOwner) {
            owner.publicInfo = publicInfo;
          }
          await owner.save();
        } catch (err) {
          return { error: { message: `Something went wrong: ${err.message}` } };
        }

        return {
          owner,
          updated: true,
        };
      },
    });
    t.field("deleteBeachBarOwner", {
      type: DeleteResult,
      description: "Delete (remove) an owner from a #beach_bar",
      nullable: false,
      args: {
        beachBarId: intArg({
          required: true,
          description: "The ID value of the #beach_bar the owner is added (assigned) to",
        }),
        userId: intArg({
          required: false,
          description:
            "The user to delete (remove) from the #beach_bar. It should be set to true if a primary owner wants to update another primary owner",
        }),
      },
      resolve: async (_, { beachBarId, userId }, { payload }: MyContext): Promise<DeleteType | ErrorType | any> => {
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

        if (userId && userId.toString() === ("" || " ")) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid owner" } };
        }
        if (!beachBarId || beachBarId.toString() === ("" || " ")) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid #beach_bar" } };
        }

        let owner: BeachBarOwner | undefined;
        if (!userId) {
          owner = await BeachBarOwner.findOne({ userId: payload.sub, beachBarId });
          if (!owner) {
            return { error: { code: errors.CONFLICT, message: "You are not an owner at this #beach_bar" } };
          }
        } else if (userId) {
          const primaryOwner = await BeachBarOwner.findOne({ userId: payload.sub, beachBarId });
          if (!primaryOwner) {
            return { error: { code: errors.CONFLICT, message: "You are not an owner at this #beach_bar" } };
          }
          if (!primaryOwner.isPrimary) {
            return { error: { code: errors.UNAUTHORIZED_CODE, message: "You are not allowed to delete 'this' owner" } };
          }
          owner = await BeachBarOwner.findOne({
            where: { userId, beachBarId },
            relations: ["user"],
          });
        }

        if (!owner) {
          return { error: { message: errors.SOMETHING_WENT_WRONG } };
        }

        try {
          await getConnection().getRepository(BeachBarOwner).softDelete({ userId: owner.userId, beachBarId });
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
