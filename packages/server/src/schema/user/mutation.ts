import platformNames from "@/config/platformNames";
import authorizeWithHashtagQuery from "@/graphql/AUTHORIZE_WITH_HASHTAG";
import changeUserPasswordQuery from "@/graphql/CHANGE_USER_PASSWORD";
import exchangeCodeQuery from "@/graphql/EXCHANGE_CODE";
import logoutQuery from "@/graphql/LOGOUT_USER";
import sendForgotPasswordLinkMutation from "@/graphql/SEND_FORGOT_PASSWORD_LINK";
import signUpUserQuery from "@/graphql/SIGN_UP_USER";
import tokenInfoQuery from "@/graphql/TOKEN_INFO";
import updateUserQuery from "@/graphql/UPDATE_USER";
import { generateAccessToken, generateRefreshToken, isAuth, sendCookieToken } from "@/utils/auth";
import { signUpUser as registerUser } from "@/utils/auth/signUpUser";
import { createLoginDetails, findLoginDetails } from "@/utils/auth/userCommon";
import { getRedisKey } from "@/utils/db";
import { getFullName, getUserHasNew, removeUserSessions } from "@/utils/user";
import { errors } from "@beach_bar/common";
import { LoginDetailsStatus } from "@prisma/client";
import { COUNTRIES_ARR } from "@the_hashtag/common";
import { EmailScalar, UrlScalar } from "@the_hashtag/common/dist/graphql";
import { ApolloError, AuthenticationError, UserInputError } from "apollo-server-express";
import { createHash, randomBytes } from "crypto";
import { arg, booleanArg, extendType, idArg, nullable, stringArg } from "nexus";
import { graphqlClient } from "../../lib";
import { LoginAuthorizeType, UserCredentials, UserLoginDetails, UserType } from "./types";

export const UserSignUpAndLoginMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("signUp", {
      type: UserType,
      description: "Sign up a user",
      args: {
        userCredentials: arg({ type: UserCredentials, description: "Credential for signing up a user" }),
        isPrimaryOwner: nullable(booleanArg({ default: false, description: "Wether to sign up an owner for a #beach_bar" })),
      },
      resolve: async (_, { userCredentials, isPrimaryOwner }) => {
        const { email, password } = userCredentials;
        if (!email) {
          throw new UserInputError("Please provide a valid email address", { code: errors.INVALID_ARGUMENTS });
        }
        if (!password) {
          throw new UserInputError("Please provide a valid password", { code: errors.INVALID_ARGUMENTS });
        }

        try {
          const { signUpUser } = await graphqlClient.request(signUpUserQuery, {
            clientId: process.env.HASHTAG_CLIENT_ID,
            clientSecret: process.env.HASHTAG_CLIENT_SECRET,
            email,
            password,
          });

          if (signUpUser.error) {
            const { message, code } = signUpUser.error;
            if (message || code) throw new ApolloError(message, code);
          }

          const { user: hashtagUser } = signUpUser;

          if (!hashtagUser || email !== hashtagUser.email || String(hashtagUser.id).trim().length === 0) {
            throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.INTERNAL_SERVER_ERROR);
          }

          let country;
          if (hashtagUser.country?.id) country = COUNTRIES_ARR.find(({ id }) => id === hashtagUser.country.id);
          // if (hashtagUser.city?.id) city = await City.findOne(hashtagUser.city.id);

          return await registerUser({
            email: hashtagUser.email,
            isPrimaryOwner,
            hashtagId: hashtagUser.id,
            countryId: country ? country.id : undefined,
            // city: city ? city : undefined,
            birthday: hashtagUser.birthday,
          });
        } catch (err) {
          return err;
        }
      },
    });
    t.field("login", {
      type: LoginAuthorizeType,
      description: "Login a user",
      args: {
        userCredentials: arg({ type: UserCredentials, description: "Credential for signing up a user" }),
        loginDetails: nullable(arg({ type: UserLoginDetails, description: "User details" })),
      },
      resolve: async (_, { userCredentials, loginDetails: detailsArg }, { res, prisma, redis, uaParser, ipAddr }) => {
        const { email, password } = userCredentials;
        if (!email) {
          throw new UserInputError("Please provide a valid email address", { code: errors.INVALID_ARGUMENTS });
        }
        if (!password) {
          throw new UserInputError("Please provide a valid password", { code: errors.INVALID_PASSWORD_CODE });
        }

        const loginDetails = { ...findLoginDetails({ details: detailsArg, uaParser }), ipAddr: ipAddr || null };

        // search for user in DB
        const user = await prisma.user.findUnique({ where: { email }, include: { account: true } });
        if (!user?.account) throw new ApolloError(errors.USER_NOT_FOUND_MESSAGE, errors.NOT_FOUND);

        if (!user.hashtagId) {
          if (user.googleId) {
            throw new ApolloError("You have authenticated with Google", errors.GOOGLE_AUTHENTICATED_CODE);
          } else if (user.facebookId) {
            throw new ApolloError("You have authenticated with Facebook", errors.FACEBOOK_AUTHENTICATED_CODE);
          } else if (user.instagramId) {
            throw new ApolloError("You have authenticated with Instagram", errors.INSTAGRAM_AUTHENTICATED_CODE);
          }
        }

        const state = createHash("sha256").update(randomBytes(1024)).digest("hex");
        const scope = await redis.smembers(getRedisKey({ model: "User", id: user.id, scope: true }));

        let code: string, hashtagAccessToken: any, hashtagRefreshToken: any;

        try {
          const { authorizeWithHashtag } = await graphqlClient.request(authorizeWithHashtagQuery, {
            ...loginDetails,
            clientId: process.env.HASHTAG_CLIENT_ID,
            scope,
            redirectUri: process.env.HASHTAG_REDIRECT_URI,
            originUri: process.env.HASHTAG_ORIGIN_URI,
            state,
            email,
            password,
            ipAddr,
          });

          if (authorizeWithHashtag.error) {
            const { message, code } = authorizeWithHashtag.error;
            const isInvalidPassword = message === errors.INVALID_PASSWORD_MESSAGE || code === errors.INVALID_PASSWORD_CODE;
            await createLoginDetails({
              ...loginDetails,
              status: isInvalidPassword ? LoginDetailsStatus.INVALID_PASSWORD : LoginDetailsStatus.FAILED,
              platform: platformNames.BEACH_BAR,
              account: user.account,
            });
            if (code === errors.SCOPE_MISMATCH) {
              throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.INTERNAL_SERVER_ERROR);
            } else throw new ApolloError(message, code);
          }

          const { state: hashtagState, scope: hashtagScope, user: hashtagUser, prompt, code: hashtagCode } = authorizeWithHashtag;
          code = hashtagCode;
          if (
            state !== hashtagState ||
            !code ||
            code!.trim().length === 0 ||
            prompt.none !== true ||
            JSON.stringify(scope) !== JSON.stringify(hashtagScope)
          ) {
            throw new ApolloError(errors.SOMETHING_WENT_WRONG);
          }

          if (email !== hashtagUser.email) {
            throw new ApolloError(errors.SOMETHING_WENT_WRONG);
          }
        } catch (err) {
          return err;
        }

        // Exchange code for ID & Access tokens
        try {
          const { exchangeCode } = await graphqlClient.request(exchangeCodeQuery, {
            clientId: process.env.HASHTAG_CLIENT_ID,
            clientSecret: process.env.HASHTAG_CLIENT_SECRET,
            code,
          });

          if (exchangeCode.error) {
            const { message, code } = exchangeCode.error;
            if (code || message) {
              await createLoginDetails({
                ...loginDetails,
                status: LoginDetailsStatus.FAILED,
                platform: platformNames.BEACH_BAR,
                account: user.account,
              });
              throw new ApolloError(message, code);
            }
          }

          const { tokens } = exchangeCode;
          hashtagAccessToken = tokens[0];
          hashtagRefreshToken = tokens[1];
          const hashtagIdToken = tokens[2];

          if (!hashtagAccessToken || !hashtagRefreshToken || !hashtagIdToken) {
            throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.INTERNAL_SERVER_ERROR);
          }

          // Logined successfully
          // Get user info from ID token
          const { tokenInfo } = await graphqlClient.request(tokenInfoQuery, { token: hashtagIdToken.token });

          if (tokenInfo.error) {
            const { message, code } = tokenInfo.error;
            if (code || message) {
              await createLoginDetails({
                ...loginDetails,
                status: LoginDetailsStatus.FAILED,
                platform: platformNames.BEACH_BAR,
                account: user.account,
              });
              throw new ApolloError(message, code);
            }
          }

          if (
            !tokenInfo ||
            tokenInfo.email !== user.email ||
            tokenInfo.iss !== process.env.HASHTAG_TOKEN_ISSUER ||
            tokenInfo.aud !== process.env.HASHTAG_CLIENT_ID
          ) {
            throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.INTERNAL_SERVER_ERROR);
          }

          if (tokenInfo.firstName || tokenInfo.lastName || tokenInfo.pictureUrl || tokenInfo.locale) {
            try {
              await prisma.user.update({
                where: { id: user.id },
                data: {
                  firstName: tokenInfo.firstName && !user.firstName ? tokenInfo.firstName : undefined,
                  lastName: tokenInfo.lastName && !user.lastName ? tokenInfo.lastName : undefined,
                  account: {
                    update: {
                      imgUrl: tokenInfo.pictureUrl && !user.account.imgUrl ? tokenInfo.pictureUrl : undefined,
                      country: { connect: { alpha2Code: tokenInfo.locale } },
                    },
                  },
                },
              });
            } catch {}
          }
        } catch (err) {
          return err;
        }

        // create user login (successful) details
        await createLoginDetails({
          ...loginDetails,
          status: LoginDetailsStatus.LOGGED_IN,
          platform: platformNames.BEACH_BAR,
          account: user.account,
        });

        const { token: accessToken } = await generateAccessToken(user, scope);
        const { token: refreshToken } = generateRefreshToken(user, "#beach_bar");
        // sendCookieToken(res, accessToken.token, "access");
        sendCookieToken(res, refreshToken, "refresh");

        try {
          await redis.hset(
            getRedisKey({ model: "User", id: user.id }),
            "access_token",
            accessToken,
            "refresh_token",
            refreshToken,
            "hashtag_access_token",
            hashtagAccessToken.token,
            "hashtag_refresh_token",
            hashtagRefreshToken.token
          );

          await prisma.account.update({ where: { userId: user.id }, data: { isActive: true } });
        } catch (err) {
          throw new ApolloError(err, errors.SOMETHING_WENT_WRONG);
        }

        return { user, scope, isNewUser: false, accessToken, refreshToken };
      },
    });
  },
});

export const UserLogoutMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.boolean("logout", {
      description: "Logout a user",
      resolve: async (_, __, { res, redis, payload }) => {
        isAuth(payload);

        const redisUser = await redis.hgetall(getRedisKey({ model: "User", id: payload!.sub }));
        if (!redisUser) throw new ApolloError(errors.SOMETHING_WENT_WRONG);

        try {
          if ((redisUser.hashtag_access_token?.trim().length || 0) !== 0) {
            const hashtagAccessToken = redisUser.hashtag_access_token;

            const { logoutUser } = await graphqlClient.request(
              logoutQuery,
              { clientId: process.env.HASHTAG_CLIENT_ID, clientSecret: process.env.HASHTAG_CLIENT_SECRET },
              { authorization: "Bearer " + hashtagAccessToken }
            );

            const success: boolean = logoutUser.success;
            if (logoutUser.error) {
              const { message, code } = logoutUser.error;
              if ((message || code) && !success) throw new ApolloError(message, code);
            }
            if (!success) throw new ApolloError(errors.SOMETHING_WENT_WRONG);
          }
          await removeUserSessions(payload!.sub);
        } catch (err) {
          return err;
        }

        res.clearCookie(process.env.REFRESH_TOKEN_COOKIE_NAME, { httpOnly: true });
        res.clearCookie(process.env.ACCESS_TOKEN_COOKIE_NAME, { httpOnly: true });

        return true;
      },
    });
  },
});

export const UserForgotPasswordMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.boolean("sendForgotPasswordLink", {
      description: "Sends a link to the user's email address to change its password",
      args: { email: arg({ type: EmailScalar.name, description: "The email address of user" }) },
      resolve: async (_, { email }, { res, prisma }) => {
        if (!email) {
          throw new UserInputError("Please provide a valid email address", { code: errors.INVALID_ARGUMENTS });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) throw new ApolloError(errors.USER_NOT_FOUND_MESSAGE, errors.NOT_FOUND);

        if (!user.hashtagId) {
          throw new ApolloError("You have not authenticated with #hashtag", errors.HASHTAG_NOT_AUTHENTICATED_CODE);
        }

        try {
          const { sendForgotPasswordLink } = await graphqlClient.request(sendForgotPasswordLinkMutation, { email });

          if (sendForgotPasswordLink.error) {
            const { message, code } = sendForgotPasswordLink.error;
            if (message || code) throw new ApolloError(message, code);
          }
          const success: boolean = sendForgotPasswordLink.success;
          if (!success) throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.SOMETHING_WENT_WRONG);

          await removeUserSessions(user.id);
        } catch (err) {
          return err;
        }

        res.clearCookie(process.env.ACCESS_TOKEN_COOKIE_NAME);
        res.clearCookie(process.env.REFRESH_TOKEN_COOKIE_NAME);

        return true;
      },
    });
    t.boolean("changeUserPassword", {
      description: "Change a user's password",
      args: {
        email: arg({ type: EmailScalar.name, description: "Email of user to retrieve OAuth Client applications" }),
        token: stringArg({ description: "The token in the URL to identify and verify user. Each key lasts 20 minutes" }),
        newPassword: stringArg({ description: "User's new password" }),
      },
      resolve: async (_, { email, token, newPassword }, { prisma }) => {
        if (!email) {
          throw new UserInputError("Please provide a valid email", { code: errors.INVALID_ARGUMENTS });
        }
        if (!newPassword) {
          throw new UserInputError("Please provide a valid new password", { code: errors.INVALID_ARGUMENTS });
        }
        if (!token) {
          throw new UserInputError("Please provide a valid token", { code: errors.INVALID_ARGUMENTS });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) throw new ApolloError(errors.USER_NOT_FOUND_MESSAGE, errors.NOT_FOUND);

        if (!user.hashtagId) {
          throw new ApolloError("You have not authenticated with #hashtag", errors.HASHTAG_NOT_AUTHENTICATED_CODE);
        }

        try {
          const { changeUserPassword } = await graphqlClient.request(changeUserPasswordQuery, {
            email,
            token,
            newPassword,
          });

          if (changeUserPassword.error) {
            const { message, code } = changeUserPassword.error;
            if (message || code) throw new ApolloError(message, code);
          }
          const success: boolean = changeUserPassword.success;
          if (!success) throw new ApolloError(errors.SOMETHING_WENT_WRONG);
        } catch (err) {
          return err;
        }

        return true;
      },
    });
  },
});

export const UserCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("updateUser", {
      type: UserType,
      description: "Update a user's info",
      args: {
        email: nullable(arg({ type: EmailScalar.name })),
        firstName: nullable(stringArg()),
        lastName: nullable(stringArg()),
        imgUrl: nullable(arg({ type: UrlScalar.name })),
        honorificTitle: nullable(stringArg({ description: "The honorific title of the user" })),
        birthday: nullable(stringArg({ description: "User's birthday in the date format" })),
        countryId: nullable(idArg({ description: "The country of user" })),
        city: nullable(stringArg({ description: "The city or hometown of user" })),
        phoneNumber: nullable(stringArg({ description: "The phone number of user" })),
        telCountryId: nullable(idArg({ description: "The country of user's phone number" })),
        address: nullable(stringArg({ description: "User's house or office street address" })),
        zipCode: nullable(stringArg({ description: "User's house or office zip code" })),
        trackHistory: nullable(booleanArg({ description: "Indicates if to track user's history" })),
      },
      resolve: async (_, args, { payload, prisma, redis, stripe }) => {
        isAuth(payload);
        const { email, firstName, lastName, countryId, telCountryId, trackHistory, ...rest } = args;
        if (!payload!.scope.some(scope => ["beach_bar@crud:user"].includes(scope))) {
          throw new AuthenticationError("You are not allowed, do not have permission, to update this user's information");
        }
        if (email && email.trim().length === 0) throw new UserInputError("Please provide a valid email address");

        const user = await prisma.user.update({
          where: { id: payload!.sub },
          include: { customer: true, account: { include: { country: true } } },
          data: {
            email: email || undefined,
            firstName,
            lastName,
            account: {
              update: {
                ...rest,
                honorificTitle: args.honorificTitle as any,
                countryId: { set: countryId ? +countryId : undefined },
                telCountryId: { set: telCountryId ? +telCountryId : undefined },
                trackHistory: { set: trackHistory ?? undefined },
              },
            },
          },
        });
        const isNew = getUserHasNew(user, {
          ...args,
          email: email || undefined,
          countryId: countryId ? +countryId : undefined,
          telCountryId: telCountryId ? +telCountryId : undefined,
          trackHistory: trackHistory ?? undefined,
          honorificTitle: args.honorificTitle as any,
          birthday: args.birthday as any,
        });

        try {
          // if user is customer also, update its info in Stripe too
          if (isNew && user.customer) {
            const { email, account } = user;
            await stripe.customers.update(user.customer.stripeCustomerId, {
              email,
              name: getFullName(user) || undefined,
              phone: account?.phoneNumber || undefined,
              address: {
                line1: account?.address || "",
                country: account?.country?.alpha2Code || undefined,
                city: account?.city || undefined,
                postal_code: account?.zipCode || undefined,
              },
            });
          }
        } catch (err) {
          throw new ApolloError(err.message);
        }

        const redisUser = await redis.hgetall(getRedisKey({ model: "User", id: user.id }));
        if (!redisUser) throw new ApolloError(errors.SOMETHING_WENT_WRONG);

        if (redisUser.hashtag_access_token && redisUser.hashtag_access_token.trim().length !== 0 && isNew) {
          try {
            const hashtagAccessToken = redisUser.hashtag_access_token;
            const { updateUser } = await graphqlClient.request(
              updateUserQuery,
              {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                pictureUrl: user.account?.imgUrl,
                countryId: user.account?.countryId,
                // city: user.account.city,
                birthday: user.account?.birthday,
              },
              { authorization: "Bearer " + hashtagAccessToken }
            );

            if (updateUser.error) {
              const { message, code } = updateUser.error;
              if (message || code) throw new ApolloError(message, code);
            }

            if (!updateUser || String(updateUser.user.id) !== String(user.hashtagId) || !updateUser.updated) {
              throw new ApolloError(errors.SOMETHING_WENT_WRONG);
            }
          } catch (err) {
            if (!err.message.includes("jwt expired")) return err;
          }
        }

        return user;
      },
    });
    // t.field("deleteUser", {
    //   type: DeleteResult,
    //   description: "Delete a user & its account",
    //   resolve: async (_, __, { payload, redis, stripe }): Promise<DeleteType> => {
    //     if (!payload) {
    //       return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
    //     }
    //     if (!payload.scope.some(scope => ["hashtag@delete:user_account", "beach_bar@crud:user"].includes(scope))) {
    //       return {
    //         error: {
    //           code: errors.UNAUTHORIZED_CODE,
    //           message: "You are not allowed to delete 'this' user's account",
    //         },
    //       };
    //     }

    //     const user = await User.findOne({ where: { id: payload.sub }, relations: ["account", "customer"] });
    //     if (!user) {
    //       return { error: { code: errors.NOT_FOUND, message: errors.USER_NOT_FOUND_MESSAGE } };
    //     }

    //     try {
    //       if (user.customer) {
    //         await user.customer.customSoftRemove(stripe);
    //       }
    //       await user.account.softRemove();
    //       await user.softRemove();

    //       // delete the user in Redis too
    //       await removeUserSessions(user.id, redis);
    //     } catch (err) {
    //       return { error: { message: `Something went wrong: ${err.message}` } };
    //     }

    //     return {
    //       deleted: true,
    //     };
    //   },
    // });
  },
});
