import { DATA } from "@/constants/data";
import { isAuth, throwScopesUnauthorized } from "@/utils/auth";
import { getRedisKey, RELATIONS, updateRedis } from "@/utils/db";
import { errors, TABLES, toSlug } from "@beach_bar/common";
import { UrlScalar } from "@the_hashtag/common/dist/graphql";
import { ApolloError, UserInputError } from "apollo-server-express";
import { arg, booleanArg, extendType, idArg, nullable, stringArg } from "nexus";
import { BeachBarType } from "./types";

const BEACH_BAR_REDIS_KEY = getRedisKey({ model: "BeachBar" });

export const BeachBarCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.boolean("cacheBeachBars", {
      resolve: async (_, __, { prisma, redis }) => {
        const beachBars = await prisma.beachBar.findMany({ include: RELATIONS.BEACH_BAR_EXTENSIVE });
        await Promise.all(beachBars.map(async beachBar => await redis.lpush(BEACH_BAR_REDIS_KEY, JSON.stringify(beachBar))));
        return true;
      },
    });
    t.field("addBeachBar", {
      type: BeachBarType,
      description: "Add (register) a new #beach_bar to the platform",
      args: {
        name: stringArg({ description: "The name to register the #beach_bar. It should be unique among other ones" }),
        description: nullable(stringArg({ description: "A description of the #beach_bar" })),
        thumbnailUrl: nullable(
          arg({ type: UrlScalar.name, description: "A thumbnail URL value of the #beach_bar's image to show in search results" })
        ),
        contactPhoneNumber: stringArg({ description: "A phone number to contact the #beach_bar directly" }),
        hidePhoneNumber: nullable(
          booleanArg({
            default: false,
            description:
              "A boolean that indicates if to NOT display the phone number when retrieving #beach_bar info. Its default value is set to false",
          })
        ),
        zeroCartTotal: booleanArg({
          description:
            "Set to true if the #beach_bar accepts for a customer / user to have less than the #beach_bar minimum currency price",
        }),
        categoryId: idArg({ description: "The ID value of the category of the #beach_bar" }),
        openingTimeId: idArg({ description: "The ID value of the opening quarter time of the #beach_bar, in its country time zone" }),
        closingTimeId: idArg({ description: "The ID value of the closing quarter time of the #beach_bar, in its country time zone" }),
        code: stringArg({ description: "The response code from Stripe.com" }),
        state: stringArg({ description: "The response state, to check if everything went correct" }),
      },
      resolve: async (
        _,
        { name, hidePhoneNumber = false, zeroCartTotal, categoryId, openingTimeId, closingTimeId, code, state, ...args },
        { req, res, prisma, redis, stripe, payload }
      ) => {
        isAuth(payload);
        throwScopesUnauthorized(payload, errors.NOT_REGISTERED_PRIMARY_OWNER, ["beach_bar@crud:beach_bar"]);

        if (code.trim().length === 0 || !state || state.trim().length === 0) {
          throw new UserInputError(errors.SOMETHING_WENT_WRONG);
        }
        if (state !== req.cookies.scstate) {
          throw new UserInputError(errors.SOMETHING_WENT_WRONG + ": Please try again");
        }
        if (zeroCartTotal == null) {
          throw new UserInputError(
            "Please provide if you will allow your customers to purchase products and have zero (0.00) as their total price in cart"
          );
        }
        if (
          openingTimeId.toString().trim().length === 0 ||
          closingTimeId.toString().trim().length === 0 ||
          categoryId.toString().trim().length === 0
        ) {
          throw new UserInputError(errors.SOMETHING_WENT_WRONG);
        }

        const user = await prisma.user.findUnique({ where: { id: payload!.sub }, include: { owner: true } });
        if (!user) throw new ApolloError(errors.USER_NOT_FOUND_MESSAGE, errors.NOT_FOUND);
        if (!user.owner) throw new ApolloError(errors.NOT_REGISTERED_PRIMARY_OWNER, errors.UNAUTHORIZED_CODE);

        try {
          const response = await stripe.oauth.token({ grant_type: "authorization_code", code });
          if (!response?.stripe_user_id || response.stripe_user_id.trim().length === 0) {
            throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.INTERNAL_SERVER_ERROR);
          }

          const stripeUserId = response.stripe_user_id;
          const stripeAccount = await stripe.accounts.retrieve(stripeUserId);
          if (!stripeAccount) throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.INTERNAL_SERVER_ERROR);

          const currency = await prisma.currency.findUnique({ where: { isoCode: stripeAccount.default_currency.toUpperCase() } });
          if (!currency) throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.INTERNAL_SERVER_ERROR);

          const category = TABLES.BEACH_BAR_CATEGORY.find(({ id }) => id.toString() === categoryId.toString());
          if (!category) throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.INTERNAL_SERVER_ERROR);

          const pricingFee = DATA.BEACH_BAR.PRICING_FEES.find(({ isDefault }) => isDefault === true);
          if (!pricingFee) throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.INTERNAL_SERVER_ERROR);

          const newBeachBar = await prisma.beachBar.create({
            data: {
              ...args,
              name,
              zeroCartTotal,
              slug: toSlug(name),
              hidePhoneNumber: hidePhoneNumber || false,
              stripeConnectId: stripeUserId,
              openingTimeId: +openingTimeId,
              closingTimeId: +closingTimeId,
              feeId: pricingFee.id,
              categoryId: category.id,
              currencyId: currency.id,
            },
          });

          await redis.lpush(BEACH_BAR_REDIS_KEY, JSON.stringify(newBeachBar));
          res.clearCookie("scstate");

          return newBeachBar;
        } catch (err) {
          if (err.message === 'duplicate key value violates unique constraint "beach_bar_name_key"') {
            throw new ApolloError("A #beach_bar with this name already exists.", errors.CONFLICT);
          }
          if (err.message === "This authorization code has already been used. All tokens issued with this code have been revoked") {
            throw new ApolloError(errors.SOMETHING_WENT_WRONG + ": Please try to repeat the process", errors.INTERNAL_SERVER_ERROR);
          }
          throw new ApolloError(errors.SOMETHING_WENT_WRONG + ": " + err.message);
        }
      },
    });
    t.field("updateBeachBar", {
      type: BeachBarType,
      description: "Update a #beach_bar details",
      args: {
        id: idArg(),
        name: nullable(stringArg()),
        description: nullable(stringArg()),
        thumbnailUrl: nullable(arg({ type: UrlScalar.name })),
        contactPhoneNumber: nullable(stringArg()),
        hidePhoneNumber: nullable(booleanArg()),
        zeroCartTotal: nullable(booleanArg()),
        isActive: nullable(booleanArg()),
        displayRegardlessCapacity: nullable(booleanArg()),
        categoryId: nullable(idArg()),
        openingTimeId: nullable(idArg()),
        closingTimeId: nullable(idArg()),
      },
      resolve: async (
        _,
        {
          id,
          name,
          isActive,
          hidePhoneNumber,
          contactPhoneNumber,
          zeroCartTotal,
          displayRegardlessCapacity,
          categoryId,
          openingTimeId,
          closingTimeId,
          ...args
        },
        { prisma, payload }
      ) => {
        isAuth(payload);
        throwScopesUnauthorized(payload, 'You are not allowed to update "this" #beach_bar\'s details', [
          "beach_bar@crud:beach_bar",
          "beach_bar@update:beach_bar",
        ]);

        if (id.toString().trim().length === 0) throw new UserInputError("Please provide a valid ID");

        try {
          let newName: string | undefined = undefined;
          let newSlug: string | undefined = undefined;
          if (name) {
            newName = name;
            newSlug = toSlug(newName);
          }

          const updatedBeachBar = await prisma.beachBar.update({
            where: { id: +id },
            data: {
              ...args,
              name: newName,
              slug: newSlug,
              isActive: isActive ?? undefined,
              hidePhoneNumber: hidePhoneNumber ?? undefined,
              contactPhoneNumber: contactPhoneNumber ?? undefined,
              zeroCartTotal: zeroCartTotal ?? undefined,
              displayRegardlessCapacity: zeroCartTotal ?? undefined,
              categoryId: categoryId ? +categoryId : undefined,
              openingTimeId: openingTimeId ? +openingTimeId : undefined,
              closingTimeId: closingTimeId ? +closingTimeId : undefined,
            },
          });

          await updateRedis({ model: "BeachBar", id: updatedBeachBar.id });
          return updatedBeachBar;
        } catch (err) {
          if (err.message === 'duplicate key value violates unique constraint "beach_bar_name_key"') {
            throw new ApolloError("A #beach_bar with this name already exists.", errors.CONFLICT);
          }
          throw new ApolloError(errors.SOMETHING_WENT_WRONG + ": " + err.message);
        }
      },
    });
    t.boolean("deleteBeachBar", {
      description: "Delete (remove) a #beach_bar from the platform",
      args: { id: idArg() },
      resolve: async (_, { id }, { prisma, stripe, payload }) => {
        isAuth(payload);
        throwScopesUnauthorized(payload, errors.NOT_REGISTERED_PRIMARY_OWNER, ["beach_bar@crud:beach_bar"]);

        if (id.toString().trim().length === 0) throw new UserInputError("Please provide a valid ID");

        const beachBar = await prisma.beachBar.findUnique({ where: { id: +id } });
        if (!beachBar) throw new ApolloError(errors.BEACH_BAR_DOES_NOT_EXIST, errors.NOT_FOUND);

        try {
          // delete Connect account in Stripe, but first check its balance to be zero (0)
          const accountBalance = await stripe.balance.retrieve({ stripeAccount: beachBar.stripeConnectId });
          if (!accountBalance || accountBalance.available.some(data => data.amount !== 0)) {
            throw new ApolloError("Your account balance should be zero (0) in value, to delete your account.");
          }

          if (process.env.NODE_ENV === "production") await stripe.accounts.del(beachBar.stripeConnectId);
          else await stripe.accounts.reject(beachBar.stripeConnectId, { reason: "other" });

          // TODO: Fix
          // await beachBar.customSoftRemove();
        } catch (err) {
          throw new ApolloError(errors.SOMETHING_WENT_WRONG + ": " + err.message);
        }

        return true;
      },
    });
  },
});

export const BeachBarUpdateMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.boolean("completeBeachBarSignUp", {
      description: "Event fired when a #beach_bar has completed the sign up process",
      args: { beachBarId: idArg() },
      resolve: async (_, { beachBarId }, { prisma, payload }) => {
        isAuth(payload);
        throwScopesUnauthorized(payload, errors.YOU_ARE_NOT_BEACH_BAR_OWNER, ["beach_bar@crud:beach_bar"]);

        if (beachBarId.toString().trim().length === 0) throw new UserInputError("Please provide a valid beachBarId");

        const beachBar = await prisma.beachBar.findUnique({ where: { id: +beachBarId } });
        if (!beachBar) throw new ApolloError(errors.BEACH_BAR_DOES_NOT_EXIST, errors.NOT_FOUND);

        try {
          const updatedBeachBar = await prisma.beachBar.update({ where: { id: beachBar.id }, data: { hasCompletedSignUp: true } });
          await updateRedis({ model: "BeachBar", id: updatedBeachBar.id });
        } catch (err) {
          throw new ApolloError(errors.SOMETHING_WENT_WRONG + ": " + err.message);
        }

        return true;
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
