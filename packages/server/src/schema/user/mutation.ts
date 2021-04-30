import { errors, MyContext } from "@beach_bar/common";
import { EmailScalar, UrlScalar } from "@the_hashtag/common/dist/graphql";
import { ApolloError, AuthenticationError, UserInputError } from "apollo-server-express";
import { createHash, randomBytes } from "crypto";
import { LoginDetailStatus } from "entity/LoginDetails";
import { KeyType } from "ioredis";
import { graphqlClient } from "lib";
import { arg, booleanArg, extendType, idArg, nullable, stringArg } from "nexus";
import { signUpUser as registerUser } from "utils/auth/signUpUser";
import platformNames from "../../config/platformNames";
import redisKeys from "../../constants/redisKeys";
import { City } from "../../entity/City";
import { Country } from "../../entity/Country";
import { User } from "../../entity/User";
import authorizeWithHashtagQuery from "../../graphql/AUTHORIZE_WITH_HASHTAG";
import changeUserPasswordQuery from "../../graphql/CHANGE_USER_PASSWORD";
import exchangeCodeQuery from "../../graphql/EXCHANGE_CODE";
import logoutQuery from "../../graphql/LOGOUT_USER";
import sendForgotPasswordLinkMutation from "../../graphql/SEND_FORGOT_PASSWORD_LINK";
import signUpUserQuery from "../../graphql/SIGN_UP_USER";
import tokenInfoQuery from "../../graphql/TOKEN_INFO";
import updateUserQuery from "../../graphql/UPDATE_USER";
import { SuccessObjectType } from "../../typings/.index";
import { TUser, TUserLogin, UpdateUserType } from "../../typings/user";
import { generateAccessToken, generateRefreshToken } from "../../utils/auth/generateAuthTokens";
import { sendCookieToken } from "../../utils/auth/sendCookieToken";
import { createUserLoginDetails, findLoginDetails } from "../../utils/auth/userCommon";
import { removeUserSessions } from "../../utils/removeUserSessions";
import { SuccessGraphQLType } from "../types";
import { UserCredentials, UserLoginDetails, UserLoginType, UserType, UserUpdateType } from "./types";

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
      resolve: async (_, { userCredentials, isPrimaryOwner }, { redis }: MyContext): Promise<TUser> => {
        const { email, password } = userCredentials;
        if (!email || email.trim().length === 0)
          throw new UserInputError("Please provide a valid email address", { code: errors.INVALID_ARGUMENTS });
        if (!password || password.trim().length === 0)
          throw new UserInputError("Please provide a valid password", { code: errors.INVALID_ARGUMENTS });

        try {
          const { signUpUser } = await graphqlClient.request(signUpUserQuery, {
            clientId: process.env.HASHTAG_CLIENT_ID!.toString(),
            clientSecret: process.env.HASHTAG_CLIENT_SECRET!.toString(),
            email,
            password,
          });

          if (signUpUser.error) {
            const { message, code } = signUpUser.error;
            if (message || code) throw new ApolloError(message, code);
          }

          const { user: hashtagUser } = signUpUser;

          if (!hashtagUser || email !== hashtagUser.email || String(hashtagUser.id).trim().length === 0)
            throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.INTERNAL_SERVER_ERROR);

          let country, city;
          if (hashtagUser.country && hashtagUser.country.id) country = await Country.findOne(hashtagUser.country.id);
          if (hashtagUser.city && hashtagUser.city.id) city = await City.findOne(hashtagUser.city.id);

          const response = await registerUser({
            email: hashtagUser.email,
            redis,
            isPrimaryOwner,
            hashtagId: hashtagUser.id,
            countryId: country ? country.id : undefined,
            city: city ? city : undefined,
            birthday: hashtagUser.birthday,
          });
          if (response.error && !response.user) throw new ApolloError(response.error.message, response.error.code);

          return response.user;
        } catch (err) {
          return err;
        }
      },
    });
    t.field("login", {
      type: UserLoginType,
      description: "Login a user",
      args: {
        userCredentials: arg({ type: UserCredentials, description: "Credential for signing up a user" }),
        loginDetails: nullable(arg({ type: UserLoginDetails, description: "User details" })),
      },
      resolve: async (_, { userCredentials, loginDetails }, { res, redis, uaParser, ipAddr }: MyContext): Promise<TUserLogin> => {
        const { email, password } = userCredentials;
        if (!email || email.length === 0)
          throw new UserInputError("Please provide a valid email address", { code: errors.INVALID_ARGUMENTS });
        if (!password || password.length === 0)
          throw new UserInputError("Please provide a valid password", { code: errors.INVALID_PASSWORD_CODE });

        const { osId, browserId, countryId, city } = findLoginDetails({ details: loginDetails, uaParser });

        // search for user in DB
        const user = await User.findOne({ where: { email }, relations: ["account"] });
        if (!user) throw new ApolloError(errors.USER_NOT_FOUND_MESSAGE, errors.NOT_FOUND);

        if (user.googleId && !user.hashtagId)
          throw new ApolloError("You have authenticated with Google", errors.GOOGLE_AUTHENTICATED_CODE);
        else if (user.facebookId && !user.hashtagId)
          throw new ApolloError("You have authenticated with Facebook", errors.FACEBOOK_AUTHENTICATED_CODE);
        else if (user.instagramId && !user.hashtagId)
          throw new ApolloError("You have authenticated with Instagram", errors.INSTAGRAM_AUTHENTICATED_CODE);

        const state = createHash("sha256").update(randomBytes(1024)).digest("hex");
        const scope = await redis.smembers(`${redisKeys.USER}:${user.id}:${redisKeys.USER_SCOPE}` as KeyType);

        let code: string, hashtagAccessToken: any, hashtagRefreshToken: any;

        try {
          const { authorizeWithHashtag } = await graphqlClient.request(authorizeWithHashtagQuery, {
            clientId: process.env.HASHTAG_CLIENT_ID!.toString(),
            scope,
            redirectUri: process.env.HASHTAG_REDIRECT_URI!.toString(),
            originUri: process.env.HASHTAG_ORIGIN_URI!.toString(),
            state,
            email,
            password,
            osId,
            browserId,
            countryId,
            city,
            ipAddr,
          });

          if (authorizeWithHashtag.error) {
            const { message, code } = authorizeWithHashtag.error;
            if (message === errors.INVALID_PASSWORD_MESSAGE || code === errors.INVALID_PASSWORD_CODE) {
              await createUserLoginDetails(
                LoginDetailStatus.invalidPassword,
                platformNames.BEACH_BAR,
                user.account,
                osId,
                browserId,
                countryId,
                city,
                ipAddr
              );
            } else {
              await createUserLoginDetails(
                LoginDetailStatus.failed,
                platformNames.BEACH_BAR,
                user.account,
                osId,
                browserId,
                countryId,
                city,
                ipAddr
              );
            }
            if (code === errors.SCOPE_MISMATCH) throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.INTERNAL_SERVER_ERROR);
            else throw new ApolloError(message, code);
          }

          const { state: hashtagState, scope: hashtagScope, user: hashtagUser, prompt, code: hashtagCode } = authorizeWithHashtag;
          code = hashtagCode;
          if (
            state !== hashtagState ||
            !code ||
            code!.trim().length === 0 ||
            prompt.none !== true ||
            JSON.stringify(scope) !== JSON.stringify(hashtagScope)
          )
            throw new ApolloError(errors.SOMETHING_WENT_WRONG);

          if (String(hashtagUser.id) !== String(user.hashtagId) || email !== hashtagUser.email)
            throw new ApolloError(errors.SOMETHING_WENT_WRONG);
        } catch (err) {
          return err;
        }

        // Exchange code for ID & Access tokens
        try {
          const { exchangeCode } = await graphqlClient.request(exchangeCodeQuery, {
            clientId: process.env.HASHTAG_CLIENT_ID!.toString(),
            clientSecret: process.env.HASHTAG_CLIENT_SECRET!.toString(),
            code,
          });

          if (exchangeCode.error) {
            const { message, code } = exchangeCode.error;
            if (code || message) {
              await createUserLoginDetails(
                LoginDetailStatus.failed,
                platformNames.BEACH_BAR,
                user.account,
                osId,
                browserId,
                countryId,
                city,
                ipAddr
              );
              throw new ApolloError(message, code);
            }
          }

          const { tokens } = exchangeCode;
          hashtagAccessToken = tokens[0];
          hashtagRefreshToken = tokens[1];
          const hashtagIdToken = tokens[2];

          if (!hashtagAccessToken || !hashtagRefreshToken || !hashtagIdToken)
            throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.INTERNAL_SERVER_ERROR);

          // Logined successfully
          // Get user info from ID token
          const { tokenInfo } = await graphqlClient.request(tokenInfoQuery, { token: hashtagIdToken.token });

          if (tokenInfo.error) {
            const { message, code } = exchangeCode.error;
            if (code || message) {
              await createUserLoginDetails(
                LoginDetailStatus.failed,
                platformNames.BEACH_BAR,
                user.account,
                osId,
                browserId,
                countryId,
                city,
                ipAddr
              );
              throw new ApolloError(message, code);
            }
          }

          if (
            !tokenInfo ||
            tokenInfo.email !== user.email ||
            tokenInfo.sub !== user.hashtagId ||
            tokenInfo.iss !== process.env.HASHTAG_TOKEN_ISSUER!.toString() ||
            tokenInfo.aud !== process.env.HASHTAG_CLIENT_ID!.toString()
          )
            throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.INTERNAL_SERVER_ERROR);

          if (tokenInfo.firstName || tokenInfo.lastName || tokenInfo.pictureUrl || tokenInfo.locale) {
            if (tokenInfo.firstName && !user.firstName) user.firstName = tokenInfo.firstName;
            if (tokenInfo.lastName && !user.lastName) user.lastName = tokenInfo.lastName;
            if (tokenInfo.pictureUrl && !user.account.imgUrl) user.account.imgUrl = tokenInfo.pictureUrl;
            if (tokenInfo.locale && !user.account.country) {
              const country = await Country.findOne({ where: { languageIdentifier: tokenInfo.locale } });
              if (country) user.account.country = country;
            }
          }
        } catch (err) {
          return err;
        }

        // create user login details
        await createUserLoginDetails(
          LoginDetailStatus.loggedIn,
          platformNames.BEACH_BAR,
          user.account,
          osId,
          browserId,
          countryId,
          city,
          ipAddr
        );

        const refreshToken = generateRefreshToken(user, "#beach_bar");
        const accessToken = generateAccessToken(user, scope);
        sendCookieToken(res, refreshToken.token, "refresh");
        sendCookieToken(res, accessToken.token, "access");

        try {
          await redis.hset(user.getRedisKey() as KeyType, "access_token", accessToken.token);
          await redis.hset(user.getRedisKey() as KeyType, "refresh_token", refreshToken.token);
          await redis.hset(user.getRedisKey() as KeyType, "hashtag_access_token", hashtagAccessToken.token);
          await redis.hset(user.getRedisKey() as KeyType, "hashtag_refresh_token", hashtagRefreshToken.token);

          user.account.isActive = true;
          await user.save();
          await user.account.save();
        } catch (err) {
          throw new ApolloError(err, errors.SOMETHING_WENT_WRONG);
        }

        return {
          user,
          accessToken: accessToken.token,
        };
      },
    });
  },
});

export const UserLogoutMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("logout", {
      type: SuccessGraphQLType,
      description: "Logout a user",
      resolve: async (_, __, { res, payload, redis }: MyContext): Promise<SuccessObjectType> => {
        if (!payload) throw new AuthenticationError(errors.NOT_AUTHENTICATED_MESSAGE);

        const redisUser = await redis.hgetall(`${redisKeys.USER}:${payload.sub.toString()}` as KeyType);
        if (!redisUser) throw new ApolloError(errors.SOMETHING_WENT_WRONG);

        try {
          if (redisUser.hashtag_access_token && redisUser.hashtag_access_token !== "" && redisUser.hashtag_access_token !== " ") {
            const hashtagAccessToken = redisUser.hashtag_access_token;

            const { logoutUser } = await graphqlClient.request(
              logoutQuery,
              {
                clientId: process.env.HASHTAG_CLIENT_ID!.toString(),
                clientSecret: process.env.HASHTAG_CLIENT_SECRET!.toString(),
              },
              {
                authorization: `Bearer ${hashtagAccessToken}`,
              }
            );

            const success: boolean = logoutUser.success;
            if (logoutUser.error) {
              const { message, code } = logoutUser.error;
              if ((message || code) && !success) throw new ApolloError(message, code);
            }
            if (!success) throw new ApolloError(errors.SOMETHING_WENT_WRONG);
          }
          await removeUserSessions(payload.sub, redis);
        } catch (err) {
          return err;
        }

        res.clearCookie(process.env.REFRESH_TOKEN_COOKIE_NAME!.toString(), { httpOnly: true });
        res.clearCookie(process.env.ACCESS_TOKEN_COOKIE_NAME!.toString(), { httpOnly: true });

        return { success: true };
      },
    });
  },
});

export const UserForgotPasswordMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("sendForgotPasswordLink", {
      type: SuccessGraphQLType,
      description: "Sends a link to the user's email address to change its password",
      args: { email: arg({ type: EmailScalar, description: "The email address of user" }) },
      resolve: async (_, { email }, { res, redis }): Promise<SuccessObjectType> => {
        if (!email || email.trim().length === 0)
          throw new UserInputError("Please provide a valid email address", { code: errors.INVALID_ARGUMENTS });

        const user = await User.findOne({
          where: { email },
          relations: ["account"],
        });
        if (!user) throw new ApolloError(errors.USER_NOT_FOUND_MESSAGE, errors.NOT_FOUND);

        if (!user.hashtagId) throw new ApolloError("You have not authenticated with #hashtag", errors.HASHTAG_NOT_AUTHENTICATED_CODE);

        try {
          const { sendForgotPasswordLink } = await graphqlClient.request(sendForgotPasswordLinkMutation, { email });

          if (sendForgotPasswordLink.error) {
            const { message, code } = sendForgotPasswordLink.error;
            if (message || code) throw new ApolloError(message, code);
          }
          const success: boolean = sendForgotPasswordLink.success;
          if (!success) throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.SOMETHING_WENT_WRONG);

          await removeUserSessions(user.id, redis);
        } catch (err) {
          return err;
        }

        res.clearCookie(process.env.REFRESH_TOKEN_COOKIE_NAME!.toString(), { httpOnly: true });
        res.clearCookie(process.env.ACCESS_TOKEN_COOKIE_NAME!.toString(), { httpOnly: true });

        return { success: true };
      },
    });
    t.field("changeUserPassword", {
      type: SuccessGraphQLType,
      description: "Change a user's password",
      args: {
        email: arg({ type: EmailScalar, description: "Email of user to retrieve OAuth Client applications" }),
        token: stringArg({ description: "The token in the URL to identify and verify user. Each key lasts 20 minutes" }),
        newPassword: stringArg({ description: "User's new password" }),
      },
      resolve: async (_, { email, token, newPassword }): Promise<SuccessObjectType> => {
        if (!email || email.trim().length === 0)
          throw new UserInputError("Please provide a valid email address", { code: errors.INVALID_ARGUMENTS });
        if (!newPassword || newPassword.trim().length === 0)
          throw new UserInputError("Please provide a valid new password", { code: errors.INVALID_ARGUMENTS });
        if (!token || token.trim().length === 0)
          throw new UserInputError("Please provide a valid token", { code: errors.INVALID_ARGUMENTS });

        const user = await User.findOne({
          where: { email },
          relations: ["account"],
        });
        if (!user) throw new ApolloError(errors.USER_NOT_FOUND_MESSAGE, errors.NOT_FOUND);

        if (!user.hashtagId) throw new ApolloError("You have not authenticated with #hashtag", errors.HASHTAG_NOT_AUTHENTICATED_CODE);

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

        return { success: true };
      },
    });
  },
});

export const UserCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("updateUser", {
      type: UserUpdateType,
      description: "Update a user's info",
      args: {
        email: nullable(arg({ type: EmailScalar })),
        firstName: nullable(stringArg()),
        lastName: nullable(stringArg()),
        imgUrl: nullable(arg({ type: UrlScalar })),
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
      resolve: async (
        _,
        {
          email,
          firstName,
          lastName,
          imgUrl,
          honorificTitle,
          birthday,
          countryId,
          city,
          phoneNumber,
          telCountryId,
          address,
          zipCode,
          trackHistory,
        },
        { payload, redis, stripe }: MyContext
      ): Promise<UpdateUserType> => {
        if (!payload) throw new AuthenticationError(errors.NOT_AUTHENTICATED_MESSAGE);
        if (!payload.scope.some(scope => ["beach_bar@crud:user"].includes(scope)))
          throw new AuthenticationError("You are not allowed, do not have permission, to update this user's information");
        if (email && email.trim().length === 0) throw new UserInputError("Please provide a valid email address");

        const user = await User.findOne({
          where: { id: payload.sub },
          relations: ["account", "account.country"],
        });
        if (!user) {
          throw new ApolloError(errors.USER_NOT_FOUND_MESSAGE);
        }

        let isNew = false;

        try {
          const response = await user.update({
            email,
            firstName,
            lastName,
            imgUrl,
            honorificTitle,
            birthday,
            address,
            zipCode,
            countryId,
            city,
            phoneNumber,
            telCountryId,
            trackHistory,
          });

          const { user: updatedUser, isNew: updated } = response;
          isNew = updated;
          // if user is customer also, update its info in Stripe too
          if (isNew && user.customer) {
            let name: string | undefined = undefined;
            const { email: uEmail, firstName: uFirstName, lastName: uLastName, account: uAccount } = updatedUser;
            if (uFirstName || uLastName) {
              name = `${uFirstName ? uFirstName : ""}${uFirstName && uLastName ? " " : ""}${uLastName ? uLastName : ""}`;
            }
            await stripe.customers.update(user.customer.stripeCustomerId, {
              email: uEmail,
              name,
              address: {
                line1: uAccount.address || "",
                country: uAccount.country?.isoCode || undefined,
                city: uAccount.city || undefined,
                postal_code: uAccount.zipCode || undefined,
              },
              phone: uAccount.phoneNumber,
            });
          }
        } catch (err) {
          throw new ApolloError(err.message);
        }

        const redisUser = await redis.hgetall(user.getRedisKey() as KeyType);
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
                pictureUrl: user.account.imgUrl,
                countryId: user.account.countryId,
                // city: user.account.city,
                birthday: user.account.birthday,
              },
              {
                authorization: `Bearer ${hashtagAccessToken}`,
              }
            );

            if (updateUser.error) {
              const { message, code } = updateUser.error;
              if (message || code) throw new ApolloError(message, code);
            }

            if (!updateUser || String(updateUser.user.id) !== String(user.hashtagId) || !updateUser.updated)
              throw new ApolloError(errors.SOMETHING_WENT_WRONG);
          } catch (err) {
            if (!err.message.includes("jwt expired")) return err;
          }
        }

        return {
          user,
          updated: true,
        };
      },
    });
    // t.field("deleteUser", {
    //   type: DeleteResult,
    //   description: "Delete a user & its account",
    //   resolve: async (_, __, { payload, redis, stripe }: MyContext): Promise<DeleteType> => {
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
