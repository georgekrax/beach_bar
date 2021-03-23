import { errors, MyContext, toSlug } from "@beach_bar/common";
import { ApolloError } from "apollo-server-express";
import redisKeys from "constants/redisKeys";
import { BeachBar } from "entity/BeachBar";
import { BeachBarCategory } from "entity/BeachBarCategory";
import { Currency } from "entity/Currency";
import { User } from "entity/User";
import { booleanArg, extendType, idArg, intArg, nullable, stringArg } from "nexus";
import { DeleteType } from "typings/.index";
import { TAddBeachBar, TUpdateBeachBar } from "typings/beach_bar";
import { checkScopes } from "utils/checkScopes";
import { DeleteResult } from "../types";
import { AddBeachBarType,UpdateBeachBarType } from "./types";

export const BeachBarCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addBeachBar", {
      type: AddBeachBarType,
      description: "Add (register) a new #beach_bar to the platform",
      args: {
        name: stringArg({ description: "The name to register the #beach_bar. It should be unique among other ones" }),
        description: nullable(stringArg({ description: "A description of the #beach_bar" })),
        thumbnailUrl: nullable(
          stringArg({ description: "A thumbnail URL value of the #beach_bar's image to show in search results" })
        ),
        contactPhoneNumber: stringArg({ description: "A phone number to contact the #beach_bar directly" }),
        hidePhoneNumber: booleanArg({
          description:
            "A boolean that indicates if to NOT display the phone number when retrieving #beach_bar info. Its default value is set to false",
          default: false,
        }),
        zeroCartTotal: booleanArg({
          description:
            "Set to true if the #beach_bar accepts for a customer / user to have less than the #beach_bar minimum currency price",
        }),
        categoryId: idArg({ description: "The ID value of the category of the #beach_bar" }),
        openingTimeId: idArg({ description: "The ID value of the opening quarter time of the #beach_bar, in its country time zone" }),
        closingTimeId: idArg({ description: "The ID value of the closing quarter time of the #beach_bar, in its country time zone" }),
        code: stringArg({ description: "The response code from Google's OAuth callback" }),
        state: stringArg({ description: "The response state, to check if everything went correct" }),
      },
      resolve: async (
        _,
        {
          name,
          description,
          thumbnailUrl,
          contactPhoneNumber,
          hidePhoneNumber,
          zeroCartTotal,
          categoryId,
          openingTimeId,
          closingTimeId,
          code,
          state,
        },
        { payload, req, res, stripe, redis }: MyContext
      ): Promise<TAddBeachBar> => {
        if (!payload || !payload.sub) throw new ApolloError(errors.NOT_AUTHENTICATED_MESSAGE, errors.NOT_AUTHENTICATED_CODE);
        if (!checkScopes(payload, ["beach_bar@crud:beach_bar"]))
          throw new ApolloError(errors.NOT_REGISTERED_PRIMARY_OWNER, errors.UNAUTHORIZED_CODE);

        if (!code || code.trim().length === 0 || !state || state.trim().length === 0)
          throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.INTERNAL_SERVER_ERROR);
        if (state !== req.cookies.scstate)
          throw new ApolloError(errors.SOMETHING_WENT_WRONG + ": Please try again.", errors.SOMETHING_WENT_WRONG);
        if (zeroCartTotal === null || zeroCartTotal === undefined)
          throw new ApolloError(
            "Please provide if you allow your customers to purchase products and have zero (0) as their total price in cart",
            errors.INVALID_ARGUMENTS
          );
        if (
          !openingTimeId ||
          openingTimeId.trim().length === 0 ||
          !closingTimeId ||
          closingTimeId.trim().length === 0 ||
          !categoryId ||
          categoryId.trim().length === 0
        )
          throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.INTERNAL_SERVER_ERROR);

        const user = await User.findOne({ where: { id: payload.sub }, relations: ["owner"] });
        if (!user) throw new ApolloError(errors.USER_NOT_FOUND_MESSAGE, errors.NOT_FOUND);
        if (!user.owner) throw new ApolloError(errors.NOT_REGISTERED_PRIMARY_OWNER, errors.UNAUTHORIZED_CODE);

        try {
          const response = await stripe.oauth.token({
            grant_type: "authorization_code",
            code,
          });
          if (!response || !response.stripe_user_id || response.stripe_user_id.trim().length === 0)
            throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.INTERNAL_SERVER_ERROR);

          const stripeUserId = response.stripe_user_id;

          const stripeAccount = await stripe.accounts.retrieve(stripeUserId);
          if (!stripeAccount) throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.INTERNAL_SERVER_ERROR);

          const currency = await Currency.findOne({ isoCode: stripeAccount.default_currency.toUpperCase() });
          if (!currency) throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.INTERNAL_SERVER_ERROR);

          const category = await BeachBarCategory.findOne(categoryId);
          if (!category) throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.INTERNAL_SERVER_ERROR);

          const newBeachBar = BeachBar.create({
            name,
            slug: toSlug(name),
            description,
            thumbnailUrl: thumbnailUrl.toString(),
            contactPhoneNumber,
            hidePhoneNumber,
            defaultCurrency: currency,
            stripeConnectId: stripeUserId,
            zeroCartTotal,
            category,
            openingTimeId,
            closingTimeId,
          });

          const pricingFee = await newBeachBar.getPricingFee();
          if (!pricingFee) throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.INTERNAL_SERVER_ERROR);
          newBeachBar.fee = pricingFee;
          await newBeachBar.save();

          await redis.lpush(redisKeys.BEACH_BAR_CACHE_KEY, JSON.stringify(newBeachBar));

          res.clearCookie("scstate");

          return {
            beachBar: newBeachBar,
            added: true,
          };
        } catch (err) {
          if (err.message === 'duplicate key value violates unique constraint "beach_bar_name_key"')
            throw new ApolloError("A #beach_bar with this name already exists.", errors.CONFLICT);
          if (err.message === "This authorization code has already been used. All tokens issued with this code have been revoked.")
            throw new ApolloError(errors.SOMETHING_WENT_WRONG + ": Please try to repeat the process", errors.INTERNAL_SERVER_ERROR);
          throw new ApolloError(errors.SOMETHING_WENT_WRONG + ": " + err.message);
        }
      },
    });
    t.field("updateBeachBar", {
      type: UpdateBeachBarType,
      description: "Update a #beach_bar details",
      args: {
        beachBarId: idArg({ description: "The ID value of the #beach_bar" }),
        name: nullable(stringArg({ description: "The name to register the #beach_bar. It should be unique among other ones" })),
        description: nullable(stringArg({ description: "A description of the #beach_bar" })),
        thumbnailUrl: nullable(
          stringArg({ description: "A thumbnail URL value of the #beach_bar's image to show in search results" })
        ),
        contactPhoneNumber: nullable(stringArg({ description: "A phone number to contact the #beach_bar directly" })),
        hidePhoneNumber: nullable(
          booleanArg({
            description:
              "A boolean that indicates if to NOT display the phone number when retrieving #beach_bar info. Its default value is set to false",
          })
        ),
        zeroCartTotal: nullable(
          booleanArg({
            description:
              "Set to true if the #beach_bar accepts for a customer / user to have less than the #beach_bar minimum currency price",
          })
        ),
        isAvailable: nullable(
          booleanArg({
            description: "Set to true, if to show #beach_bar in the search results, even if it has no availability",
          })
        ),
        isActive: nullable(booleanArg({ description: "Set to true if the #beach_bar is active" })),
        categoryId: nullable(idArg({ description: "The ID value of the category of the #beach_bar" })),
        openingTimeId: nullable(
          idArg({ description: "The ID value of the opening quarter time of the #beach_bar, in its country zone" })
        ),
        closingTimeId: nullable(
          idArg({ description: "The ID value of the closing quarter time of the #beach_bar, in its country zone" })
        ),
      },
      resolve: async (
        _,
        {
          beachBarId,
          name,
          description,
          thumbnailUrl,
          contactPhoneNumber,
          hidePhoneNumber,
          zeroCartTotal,
          isAvailable,
          isActive,
          categoryId,
          openingTimeId,
          closingTimeId,
        },
        { payload }: MyContext
      ): Promise<TUpdateBeachBar> => {
        if (!payload || !payload.sub) throw new ApolloError(errors.NOT_AUTHENTICATED_MESSAGE, errors.NOT_AUTHENTICATED_CODE);
        if (!checkScopes(payload, ["beach_bar@crud:beach_bar", "beach_bar@update:beach_bar"]))
          throw new ApolloError('You are not allowed to update "this" #beach_bar\'s details', errors.UNAUTHORIZED_CODE);

        if (!beachBarId || beachBarId.trim().length === 0)
          throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.INVALID_ARGUMENTS);

        const beachBar = await BeachBar.findOne({
          where: { id: beachBarId },
          relations: ["location"],
        });
        if (!beachBar) throw new ApolloError(errors.BEACH_BAR_DOES_NOT_EXIST, errors.NOT_FOUND);

        try {
          const updatedBeachBar = await beachBar.update(
            name,
            description,
            thumbnailUrl,
            contactPhoneNumber,
            hidePhoneNumber,
            zeroCartTotal,
            isAvailable,
            isActive,
            categoryId,
            openingTimeId,
            closingTimeId
          );
          return {
            beachBar: updatedBeachBar,
            updated: true,
          };
        } catch (err) {
          if (err.message === 'duplicate key value violates unique constraint "beach_bar_name_key"')
            throw new ApolloError("A #beach_bar with this name already exists.", errors.CONFLICT);
          throw new ApolloError(errors.SOMETHING_WENT_WRONG + ": " + err.message);
        }
      },
    });
    t.field("deleteBeachBar", {
      type: DeleteResult,
      description: "Delete (remove) a #beach_bar from the platform",
      args: {
        beachBarId: intArg({ description: "The ID value of the #beach_bar" }),
      },
      resolve: async (_, { beachBarId }, { payload, redis, stripe }: MyContext): Promise<DeleteType> => {
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

// export const BeachBarUpdateStatusMutation = extendType({
//   type: "Mutation",
//   definition(t) {
//     t.field("updateBeachBarStatus", {
//       type: UpdateBeachBarResult,
//       description: "Update the status of a #beach_bar. If it is active or not",
//       args: {
//         beachBarId: intArg({ description: "The ID value of the #beach_bar" }),
//         isActive: booleanArg({ description: "Set to true if the #beach_bar is active" }),
//       },
//       resolve: async (_, { beachBarId, isActive }, { payload }: MyContext): Promise<UpdateBeachBarType> => {
//         if (!payload) {
//           return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
//         }
//         if (!checkScopes(payload, ["beach_bar@crud:beach_bar"])) {
//           return {
//             error: { code: errors.UNAUTHORIZED_CODE, message: "You are not allowed to update 'this' #beach_bar status" },
//           };
//         }

//         if (!beachBarId || beachBarId <= 0) {
//           return { error: { code: errors.INVALID_ARGUMENTS, message: errors.SOMETHING_WENT_WRONG } };
//         }

//         const beachBar = await BeachBar.findOne({
//           where: { id: beachBarId },
//           relations: ["fee", "location", "reviews", "features", "products", "entryFees", "restaurants", "openingTime", "closingTime"],
//         });
//         if (!beachBar) {
//           return { error: { code: errors.CONFLICT, message: errors.BEACH_BAR_DOES_NOT_EXIST } };
//         }

//         try {
//           const updatedBeachBar = await beachBar.setIsActive(isActive);

//           return {
//             beachBar: updatedBeachBar,
//             updated: true,
//           };
//         } catch (err) {
//           if (err.message === 'duplicate key value violates unique constraint "beach_bar_name_key"') {
//             return { error: { code: errors.CONFLICT, message: "A #beach_bar with this name already exists" } };
//           }
//           return { error: { message: `${errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
//         }
//       },
//     });
//   },
// });
