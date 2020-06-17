import { booleanArg, extendType, intArg } from "@nexus/schema";
import { MyContext } from "../../common/myContext";
import errors from "../../constants/errors";
import { BeachBar } from "../../entity/BeachBar";
import { BeachBarOwner } from "../../entity/BeachBarOwner";
import { User } from "../../entity/User";
import { ErrorType } from "../returnTypes";
import { AddBeachBarOwnerType } from "./returnTypes";
import { AddBeachBarOwnerResult } from "./types";

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
          description: "The ID value of the #beach_bar the owner will be added (assigned)",
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
        if (!userId || userId === ("" || " ")) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid owner" } };
        }
        if (!beachBarId || beachBarId === ("" || " ")) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid #beach_bar" } };
        }
        if (isPrimary || isPrimary === ("" || " ")) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: errors.SOMETHING_WENT_WRONG } };
        }

        const beachBar = await BeachBar.findOne({
          where: { id: beachBarId },
          relations: ["owners", "owners.user", "owners.user.account"],
        });
        if (!beachBar) {
          return {
            error: { code: errors.CONFLICT, message: "Specified #beach_bar does not exist" },
          };
        }

        const owner = beachBar.owners.find(owner => owner.user.id === payload.sub);
        if (!owner) {
          return {
            error: { code: errors.CONFLICT, message: errors.SOMETHING_WENT_WRONG },
          };
        }

        const user = await User.findOne({
          where: { id: userId },
          relations: ["account", "beachBars", "beachBars.user", "beachBar.beachBar"],
        });
        if (!user) {
          return {
            error: { code: errors.CONFLICT, message: "Specified user does not exist" },
          };
        }

        if (user.beachBars && user.beachBars.map(beachBar => beachBar.beachBar.id).includes(beachBar.id)) {
          return { error: { code: errors.CONFLICT, message: "User is already an owner on 'this' #beach_bar" } };
        }

        const newOwner = BeachBarOwner.create({
          beachBar,
          user,
          isPrimary: owner.isPrimary && isPrimary ? true : false,
        });

        try {
          await newOwner.save();
        } catch (err) {
          return { error: { message: `Something went wrong: ${err.message}` } };
        }

        return {
          beachBar,
          user,
          isPrimary: newOwner.isPrimary,
          added: true,
        };
      },
    });
  },
});
