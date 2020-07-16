import { MyContext, errors } from "@beach_bar/common";
import { booleanArg, extendType, intArg, stringArg } from "@nexus/schema";
import { BeachBar } from "../../entity/BeachBar";
import { Currency } from "../../entity/Currency";
import { User } from "../../entity/User";
import { checkScopes } from "../../utils/checkScopes";
import { DeleteType, ErrorType } from "../returnTypes";
import { DeleteResult } from "../types";
import { AddBeachBarType, UpdateBeachBarType } from "./returnTypes";
import { AddBeachBarResult, UpdateBeachBarResult } from "./types";

export const BeachBarCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addBeachBar", {
      type: AddBeachBarResult,
      description: "Add (register) a new #beach_bar to the platform",
      nullable: false,
      args: {
        name: stringArg({
          required: true,
          description: "The name to register the #beach_bar. It should be unique among other ones",
        }),
        description: stringArg({
          required: false,
          description: "A description of the #beach_bar",
        }),
        thumbnailUrl: stringArg({
          required: false,
          description: "A thumbnail URL value of the #beach_bar's image to show in search results",
        }),
        zeroCartTotal: booleanArg({
          required: true,
          description:
            "Set to true if the #beach_bar accepts for a customer / user to have less than the #beach_bar minimum currency price",
        }),
        openingTimeId: intArg({
          required: true,
          description: "The ID value of the opening quarter time of the #beach_bar, in its country time zone",
        }),
        closingTimeId: intArg({
          required: true,
          description: "The ID value of the closing quarter time of the #beach_bar, in its country time zone",
        }),
        code: stringArg({ required: true, description: "The response code from Google's OAuth callback" }),
        state: stringArg({ required: true, description: "The response state, to check if everything went correct" }),
      },
      resolve: async (
        _,
        { name, description, thumbnailUrl, zeroCartTotal, openingTimeId, closingTimeId, code, state },
        { payload, req, res, redis, stripe }: MyContext,
      ): Promise<AddBeachBarType | ErrorType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (!checkScopes(payload, ["beach_bar@crud:beach_bar"])) {
          return {
            error: { code: errors.UNAUTHORIZED_CODE, message: errors.NOT_REGISTERED_PRIMARY_OWNER },
          };
        }

        if (!code || code.trim().length === 0) {
          return { error: { code: errors.INTERNAL_SERVER_ERROR, message: errors.SOMETHING_WENT_WRONG } };
        }
        if (!state || state.trim().length === 0) {
          return { error: { code: errors.INTERNAL_SERVER_ERROR, message: errors.SOMETHING_WENT_WRONG } };
        }
        if (state !== req.cookies.scstate) {
          return {
            error: {
              code: errors.INTERNAL_SERVER_ERROR,
              message: `${errors.SOMETHING_WENT_WRONG}: Please try again`,
            },
          };
        }
        if (zeroCartTotal === null || zeroCartTotal === undefined) {
          return {
            error: {
              code: errors.INVALID_ARGUMENTS,
              message:
                "Please provide if you allow your customers to purchase products and have zero (0) as their total price in cart",
            },
          };
        }
        if (!openingTimeId || openingTimeId <= 0 || !closingTimeId || closingTimeId <= 0) {
          return { error: { code: errors.INTERNAL_SERVER_ERROR, message: errors.SOMETHING_WENT_WRONG } };
        }

        const user = await User.findOne({ where: { id: payload.sub }, relations: ["owner"] });
        if (!user) {
          return { error: { code: errors.CONFLICT, message: errors.SOMETHING_WENT_WRONG } };
        }
        if (!user.owner) {
          return {
            error: { code: errors.UNAUTHORIZED_CODE, message: errors.NOT_REGISTERED_PRIMARY_OWNER },
          };
        }

        try {
          const response = await stripe.oauth.token({
            grant_type: "authorization_code",
            code,
          });
          if (!response || !response.stripe_user_id || response.stripe_user_id.trim().length === 0) {
            return { error: { code: errors.INTERNAL_SERVER_ERROR, message: errors.SOMETHING_WENT_WRONG } };
          }

          const stripeUserId = response.stripe_user_id;

          const stripeAccount = await stripe.accounts.retrieve(stripeUserId);
          if (!stripeAccount) {
            return { error: { code: errors.INTERNAL_SERVER_ERROR, message: errors.SOMETHING_WENT_WRONG } };
          }

          const currency = await Currency.findOne({ isoCode: stripeAccount.default_currency.toUpperCase() });
          if (!currency) {
            return { error: { message: errors.SOMETHING_WENT_WRONG } };
          }

          const newBeachBar = BeachBar.create({
            name,
            description,
            thumbnailUrl,
            defaultCurrency: currency,
            stripeConnectId: stripeUserId,
            zeroCartTotal,
            openingTimeId,
            closingTimeId,
          });

          const pricingFee = await newBeachBar.getPricingFee();
          if (!pricingFee) {
            return { error: { code: errors.INTERNAL_SERVER_ERROR, message: errors.SOMETHING_WENT_WRONG } };
          }
          newBeachBar.fee = pricingFee;
          await newBeachBar.save();

          // cache #beach_bar in Redis
          await redis.lpush(newBeachBar.getRedisKey(), JSON.stringify(newBeachBar));

          res.clearCookie("scstate", { httpOnly: true, maxAge: 310000 });

          return {
            beachBar: newBeachBar,
            added: true,
          };
        } catch (err) {
          if (err.message === 'duplicate key value violates unique constraint "beach_bar_name_key"') {
            return { error: { code: errors.CONFLICT, message: "A #beach_bar with this name already exists" } };
          }
          if (err.message === "This authorization code has already been used. All tokens issued with this code have been revoked.") {
            return {
              error: { code: errors.INTERNAL_SERVER_ERROR, message: `${errors.SOMETHING_WENT_WRONG}: Please re-try the process` },
            };
          }
          return { error: { message: `${errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
        }
      },
    });
    t.field("updateBeachBar", {
      type: UpdateBeachBarResult,
      description: "Update a #beach_bar details",
      nullable: false,
      args: {
        beachBarId: intArg({
          required: true,
          description: "The ID value of the #beach_bar",
        }),
        name: stringArg({
          required: false,
          description: "The name to register the #beach_bar. It should be unique among other ones",
        }),
        description: stringArg({
          required: false,
          description: "A description of the #beach_bar",
        }),
        thumbnailUrl: stringArg({
          required: false,
          description: "A thumbnail URL value of the #beach_bar's image to show in search results",
        }),
        zeroCartTotal: booleanArg({
          required: false,
          description:
            "Set to true if the #beach_bar accepts for a customer / user to have less than the #beach_bar minimum currency price",
        }),
        isAvailable: booleanArg({
          required: false,
          description: "Set to true, if to show #beach_bar in the search results, even if it has no availability",
        }),
        openingTimeId: intArg({
          required: true,
          description: "The ID value of the opening quarter time of the #beach_bar, in its country time zone",
        }),
        closingTimeId: intArg({
          required: true,
          description: "The ID value of the closing quarter time of the #beach_bar, in its country time zone",
        }),
      },
      resolve: async (
        _,
        { beachBarId, name, description, thumbnailUrl, zeroCartTotal, isAvailable, openingTimeId, closingTimeId },
        { payload, redis }: MyContext,
      ): Promise<UpdateBeachBarType | ErrorType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (!checkScopes(payload, ["beach_bar@crud:beach_bar", "beach_bar@update:beach_bar"])) {
          return {
            error: { code: errors.UNAUTHORIZED_CODE, message: "You are not allowed to update 'this' #beach_bar details" },
          };
        }

        if (!beachBarId || beachBarId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: errors.SOMETHING_WENT_WRONG } };
        }

        const beachBar = await BeachBar.findOne({
          where: { id: beachBarId },
        });
        if (!beachBar) {
          return { error: { code: errors.CONFLICT, message: errors.BEACH_BAR_DOES_NOT_EXIST } };
        }

        try {
          const updatedBeachBar = await beachBar.update(
            redis,
            name,
            description,
            thumbnailUrl,
            zeroCartTotal,
            isAvailable,
            openingTimeId,
            closingTimeId,
          );
          return {
            beachBar: updatedBeachBar,
            updated: true,
          };
        } catch (err) {
          if (err.message === 'duplicate key value violates unique constraint "beach_bar_name_key"') {
            return { error: { code: errors.CONFLICT, message: "A #beach_bar with this name already exists" } };
          }
          return { error: { message: `${errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
        }
      },
    });
    t.field("deleteBeachBar", {
      type: DeleteResult,
      description: "Delete (remove) a #beach_bar from the platform",
      nullable: false,
      args: {
        beachBarId: intArg({
          required: true,
          description: "The ID value of the #beach_bar",
        }),
      },
      resolve: async (_, { beachBarId }, { payload, redis, stripe }: MyContext): Promise<DeleteType | ErrorType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (!checkScopes(payload, ["beach_bar@crud:beach_bar"])) {
          return {
            error: { code: errors.UNAUTHORIZED_CODE, message: errors.NOT_REGISTERED_PRIMARY_OWNER },
          };
        }

        if (!beachBarId || beachBarId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: errors.SOMETHING_WENT_WRONG } };
        }

        const beachBar = await BeachBar.findOne(beachBarId);
        if (!beachBar) {
          return { error: { code: errors.CONFLICT, message: errors.BEACH_BAR_DOES_NOT_EXIST } };
        }

        try {
          // delete Connect account in Stripe, but first check its balance to be zero (0)
          const accountBalance = await stripe.balance.retrieve({
            stripeAccount: beachBar.stripeConnectId,
          });
          if (!accountBalance || accountBalance.available.some(data => data.amount !== 0)) {
            return { error: { message: "Your account balance should be zero (0) in value, to delete your account" } };
          }

          if (process.env.NODE_ENV === "production") {
            await stripe.accounts.del(beachBar.stripeConnectId);
          } else {
            await stripe.accounts.reject(beachBar.stripeConnectId, { reason: "other" });
          }

          await beachBar.customSoftRemove(redis);
        } catch (err) {
          return { error: { message: `${errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
        }

        return {
          deleted: true,
        };
      },
    });
  },
});

export const BeachBarUpdateStatusMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("updateBeachBarStatus", {
      type: UpdateBeachBarResult,
      description: "Update the status of a #beach_bar. If it is active or not",
      nullable: false,
      args: {
        beachBarId: intArg({
          required: true,
          description: "The ID value of the #beach_bar",
        }),
        isActive: booleanArg({
          required: true,
          description: "Set to true if the #beach_bar is active",
        }),
      },
      resolve: async (_, { beachBarId, isActive }, { payload, redis }: MyContext): Promise<UpdateBeachBarType | ErrorType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (!checkScopes(payload, ["beach_bar@crud:beach_bar"])) {
          return {
            error: { code: errors.UNAUTHORIZED_CODE, message: "You are not allowed to update 'this' #beach_bar status" },
          };
        }

        if (!beachBarId || beachBarId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: errors.SOMETHING_WENT_WRONG } };
        }

        const beachBar = await BeachBar.findOne({
          where: { id: beachBarId },
          relations: ["fee", "location", "reviews", "features", "products", "entryFees", "restaurants", "openingTime", "closingTime"],
        });
        if (!beachBar) {
          return { error: { code: errors.CONFLICT, message: errors.BEACH_BAR_DOES_NOT_EXIST } };
        }

        try {
          const updatedBeachBar = await beachBar.setIsActive(redis, isActive);

          return {
            beachBar: updatedBeachBar,
            updated: true,
          };
        } catch (err) {
          if (err.message === 'duplicate key value violates unique constraint "beach_bar_name_key"') {
            return { error: { code: errors.CONFLICT, message: "A #beach_bar with this name already exists" } };
          }
          return { error: { message: `${errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
        }
      },
    });
  },
});
