import { DateScalar, EmailScalar, errors, MyContext, UrlScalar } from "@beach_bar/common";
import platformNames from "@constants/platformNames";
import redisKeys from "@constants/redisKeys";
import { loginDetails as loginDetailsStatus } from "@constants/status";
import { City } from "@entity/City";
import { Country } from "@entity/Country";
import { User } from "@entity/User";
import { arg, booleanArg, extendType, intArg, stringArg } from "@nexus/schema";
import { DeleteType, SuccessType } from "@typings/.index";
import { UpdateUserType, UserLoginType, UserSignUpType } from "@typings/user";
import { generateAccessToken, generateRefreshToken } from "@utils/auth/generateAuthTokens";
import { sendRefreshToken } from "@utils/auth/sendRefreshToken";
import { signUpUser } from "@utils/auth/signUpUser";
import { createUserLoginDetails, findBrowser, findCity, findCountry, findOs } from "@utils/auth/userCommon";
import { removeUserSessions } from "@utils/removeUserSessions";
import { execute, makePromise } from "apollo-link";
import { createHash, randomBytes } from "crypto";
import { KeyType } from "ioredis";
import { link } from "../../config/apolloLink";
import authorizeWithHashtagQuery from "../../graphql/AUTHORIZE_WITH_HASHTAG";
import changeUserPasswordQuery from "../../graphql/CHANGE_USER_PASSWORD";
import exchangeCodeQuery from "../../graphql/EXCHANGE_CODE";
import logoutQuery from "../../graphql/LOGOUT_USER";
import sendForgotPasswordLinkQuery from "../../graphql/SEND_FORGOT_PASSWORD_LINK";
import signUpUserQuery from "../../graphql/SIGN_UP_USER";
import tokenInfoQuery from "../../graphql/TOKEN_INFO";
import updateUserQuery from "../../graphql/UPDATE_USER";
import { DeleteResult, SuccessResult } from "../types";
import { UserCredentialsInput, UserLoginDetailsInput, UserLoginResult, UserSignUpResult, UserUpdateResult } from "./types";

export const UserSignUpAndLoginMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("signUp", {
      type: UserSignUpResult,
      description: "Sign up a user",
      nullable: false,
      args: {
        userCredentials: arg({
          type: UserCredentialsInput,
          required: true,
          description: "Credential for signing up a user",
        }),
        isPrimaryOwner: booleanArg({
          required: false,
          default: false,
          description: "Set to true if you want to sign up an owner for a #beach_bar",
        }),
      },
      resolve: async (_, { userCredentials, isPrimaryOwner }, { redis }: MyContext): Promise<UserSignUpType> => {
        const { email, password } = userCredentials;
        if (!email || email === "" || email === " ") {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid email address" } };
        }
        if (!password || password === "" || password === " ") {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid password" } };
        }

        const operation = {
          query: signUpUserQuery,
          variables: {
            clientId: process.env.HASHTAG_CLIENT_ID!.toString(),
            clientSecret: process.env.HASHTAG_CLIENT_SECRET!.toString(),
            email,
            password,
          },
        };

        let hashtagUser, added, errorCode, errorMessage;

        await makePromise(execute(link, operation))
          .then(res => res.data?.signUpUser)
          .then(data => {
            if (data.error) {
              errorCode = data.error.code;
              errorMessage = data.error.message;
            }
            hashtagUser = data.user;
            added = data.added;
          })
          .catch(err => {
            return { error: { message: `Something went wrong: ${err.message}` } };
          });

        if (
          (errorCode || errorMessage) &&
          errorCode !== errors.CONFLICT &&
          errorMessage !== "User already exists" &&
          !added &&
          !hashtagUser
        ) {
          return { error: { code: errorCode, message: errorMessage } };
        }
        if (email !== hashtagUser.email || hashtagUser.id === "" || hashtagUser.id === " ") {
          return { error: { message: errors.SOMETHING_WENT_WRONG } };
        }

        let country, city;
        if (hashtagUser.country && hashtagUser.country.id) {
          country = await Country.findOne(hashtagUser.country.id);
        }
        if (hashtagUser.city && hashtagUser.city.id) {
          city = await City.findOne(hashtagUser.city.id);
        }

        const response = await signUpUser(
          hashtagUser.email,
          redis,
          isPrimaryOwner,
          hashtagUser.id,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          country,
          city,
          hashtagUser.birthday
        );
        // @ts-ignore
        if (response.error && !response.user) {
          // @ts-ignore
          return { error: { code: response.error.code, message: response.error.message } };
        }

        return {
          // @ts-ignore
          user: response.user,
          added: true,
        };
      },
    });
    t.field("login", {
      type: UserLoginResult,
      description: "Login a user",
      nullable: false,
      args: {
        loginDetails: arg({
          type: UserLoginDetailsInput,
          required: false,
          description: "User details in login",
        }),
        userCredentials: arg({
          type: UserCredentialsInput,
          required: true,
          description: "Credential for signing up a user",
        }),
      },
      resolve: async (_, { loginDetails, userCredentials }, { res, redis, uaParser, ipAddr }: MyContext): Promise<UserLoginType> => {
        const { email, password } = userCredentials;
        if (!email || email === "" || email === " ") {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid email address" } };
        }
        if (!password || password === "" || password === " ") {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid password" } };
        }

        let os: any = uaParser.getOS().name,
          browser: any = uaParser.getBrowser().name,
          country: any = undefined,
          city: any = undefined;

        if (loginDetails) {
          ({ city, country } = loginDetails);
        }

        try {
          os = await findOs(os);
          browser = await findBrowser(browser);
          country = await findCountry(country);
          city = await findCity(city);
        } catch (err) {
          return { error: { message: `Something went wrong: ${err.message}` } };
        }

        // search for user in DB
        const user = await User.findOne({ where: { email }, relations: ["account"] });
        if (!user) {
          return {
            error: {
              code: errors.NOT_FOUND,
              message: errors.USER_NOT_FOUND_MESSAGE,
            },
          };
        }

        // check user's account
        if (!user.account) {
          return {
            error: {
              message: "Something went wrong",
            },
          };
        }

        if (user.googleId && !user.hashtagId) {
          return {
            error: { code: errors.GOOGLE_AUTHENTICATED_CODE, message: "You have authenticated with Google" },
          };
        } else if (user.facebookId && !user.hashtagId) {
          return {
            error: { code: errors.FACEBOOK_AUTHENTICATED_CODE, message: "You have authenticated with Facebook" },
          };
        } else if (user.instagramId && !user.hashtagId) {
          return {
            error: { code: errors.INSTAGRAM_AUTHENTICATED_CODE, message: "You have authenticated with Instagram" },
          };
        }

        const state = createHash("sha256").update(randomBytes(1024)).digest("hex");
        const scope = await redis.smembers(`${redisKeys.USER}:${user.id}:${redisKeys.USER_SCOPE}` as KeyType);

        const authorizeWithHashtagOperation = {
          query: authorizeWithHashtagQuery,
          variables: {
            clientId: process.env.HASHTAG_CLIENT_ID!.toString(),
            scope,
            redirectUri: process.env.HASHTAG_REDIRECT_URI!.toString(),
            originUri: process.env.HASHTAG_ORIGIN_URI!.toString(),
            state,
            email,
            password,
            os: os ? os.name : null,
            browser: browser ? browser.name : null,
            country: country ? country.name : null,
            city: city ? city.name : null,
            ipAddr,
          },
        };

        let hashtagEmail: string | undefined = undefined,
          hashtagId: bigint | undefined = undefined,
          hashtagState: string | undefined = undefined,
          hashtagScope: string[] | undefined = undefined,
          hashtagClientId: string | undefined = undefined,
          hashtagClientSecret: string | undefined = undefined,
          code: string | undefined = undefined,
          prompt: boolean | undefined = undefined,
          authorized: boolean | undefined = undefined,
          errorCode: string | undefined = undefined,
          errorMessage: string | any = undefined;

        await makePromise(execute(link, authorizeWithHashtagOperation))
          .then(res => res.data?.authorizeWithHashtag)
          .then(data => {
            if (data.error) {
              errorCode = data.error.code;
              errorMessage = data.error.message;
            }
            hashtagEmail = data.user.email;
            hashtagId = data.user.id;
            hashtagState = data.state;
            hashtagScope = data.scope;
            hashtagClientId = data.oauthClient.clientId;
            hashtagClientSecret = data.oauthClient.clientSecret;
            code = data.code;
            prompt = data.prompt.none;
            authorized = data.authorized;
          })
          .catch(err => {
            return { error: { message: `Something went wrong: ${err.message}` } };
          });

        if (errorCode || errorMessage) {
          if (errorMessage === errors.INVALID_PASSWORD_MESSAGE || errorCode === errors.INVALID_PASSWORD_CODE) {
            await createUserLoginDetails(
              loginDetailsStatus.INVALID_PASSWORD,
              platformNames.BEACH_BAR,
              user.account,
              os,
              browser,
              country,
              city,
              ipAddr
            );
          } else {
            await createUserLoginDetails(
              loginDetailsStatus.FAILED,
              platformNames.BEACH_BAR,
              user.account,
              os,
              browser,
              country,
              city,
              ipAddr
            );
          }
          if (errorCode === errors.SCOPE_MISMATCH) {
            return { error: { code: errors.INTERNAL_SERVER_ERROR, message: errors.SOMETHING_WENT_WRONG } };
          }
          return { error: { code: errorCode, message: errorMessage } };
        }

        if (
          state !== hashtagState ||
          !code ||
          code === "" ||
          code === " " ||
          prompt !== true ||
          !authorized ||
          hashtagClientId !== process.env.HASHTAG_CLIENT_ID!.toString() ||
          hashtagClientSecret !== process.env.HASHTAG_CLIENT_SECRET!.toString() ||
          JSON.stringify(scope) !== JSON.stringify(hashtagScope)
        ) {
          return { error: { message: "Something went wrong" } };
        }

        if (String(hashtagId) !== String(user.hashtagId) || email !== hashtagEmail) {
          return { error: { message: "Something went wrong" } };
        }

        // exchange for ID & Access tokens
        const exchangeCodeOperation = {
          query: exchangeCodeQuery,
          variables: {
            clientId: process.env.HASHTAG_CLIENT_ID!.toString(),
            clientSecret: process.env.HASHTAG_CLIENT_SECRET!.toString(),
            code,
          },
        };

        let hashtagAccessToken: any = undefined,
          hashtagRefreshToken: any = undefined,
          idToken: any = undefined;

        await makePromise(execute(link, exchangeCodeOperation))
          .then(res => res.data?.exchangeCode)
          .then(data => {
            if (data.error) {
              errorCode = data.error.code;
              errorMessage = data.error.message;
            }
            hashtagClientId = data.oauthClient.clientId;
            hashtagClientSecret = data.oauthClient.clientSecret;
            hashtagAccessToken = data.tokens[0];
            hashtagRefreshToken = data.tokens[1];
            idToken = data.tokens[2];
          })
          .catch(err => {
            return { error: { message: `Something went wrong: ${err.message}` } };
          });

        if (errorCode || errorMessage) {
          await createUserLoginDetails(
            loginDetailsStatus.FAILED,
            platformNames.BEACH_BAR,
            user.account,
            os,
            browser,
            country,
            city,
            ipAddr
          );
          return {
            error: { code: errorCode, message: errorMessage },
          };
        }

        if (
          !hashtagAccessToken ||
          !hashtagRefreshToken ||
          !idToken ||
          hashtagClientId !== process.env.HASHTAG_CLIENT_ID!.toString() ||
          hashtagClientSecret !== process.env.HASHTAG_CLIENT_SECRET!.toString()
        ) {
          return { error: { code: errors.INTERNAL_SERVER_ERROR, message: "Something went wrong" } };
        }

        // logined successfully
        // get user info from ID token
        const tokenInfoOperation = {
          query: tokenInfoQuery,
          variables: {
            // @ts-ignore
            token: idToken.token,
          },
        };

        let tokenInfo: any = undefined;

        await makePromise(execute(link, tokenInfoOperation))
          .then(res => res.data?.tokenInfo)
          .then(data => {
            if (data.error) {
              errorCode = data.error.code;
              errorMessage = data.error.message;
            }
            tokenInfo = data;
          })
          .catch(err => {
            return { error: { message: `Something went wrong: ${err.message}` } };
          });

        if (errorCode || errorMessage) {
          await createUserLoginDetails(
            loginDetailsStatus.FAILED,
            platformNames.BEACH_BAR,
            user.account,
            os,
            browser,
            country,
            city,
            ipAddr
          );
          return { error: { code: errorCode, message: errorMessage as any } };
        }

        if (
          !tokenInfo ||
          tokenInfo.email !== user.email ||
          tokenInfo.sub !== user.hashtagId ||
          tokenInfo.iss !== process.env.HASHTAG_TOKEN_ISSUER!.toString() ||
          tokenInfo.aud !== process.env.HASHTAG_CLIENT_ID!.toString()
        ) {
          return { error: { code: errors.INTERNAL_SERVER_ERROR, message: "Something went wrong" } };
        }

        if (tokenInfo.firstName || tokenInfo.lastName || tokenInfo.pictureUrl || tokenInfo.locale) {
          if (tokenInfo.firstName && !user.firstName) {
            user.firstName = tokenInfo.firstName;
          }
          if (tokenInfo.lastName && !user.lastName) {
            user.lastName = tokenInfo.lastName;
          }
          if (tokenInfo.pictureUrl && !user.account.imgUrl) {
            user.account.imgUrl = tokenInfo.pictureUrl;
          }
          if (tokenInfo.locale && !user.account.country) {
            const country = await Country.findOne({ where: { languageIdentifier: tokenInfo.locale } });
            if (country) {
              user.account.country = country;
            }
          }
        }

        // create user login details
        await createUserLoginDetails(
          loginDetailsStatus.LOGGED_IN,
          platformNames.BEACH_BAR,
          user.account,
          os,
          browser,
          country,
          city,
          ipAddr
        );

        const refreshToken = generateRefreshToken(user);
        const accessToken = generateAccessToken(user, scope);
        sendRefreshToken(res, refreshToken.token);

        try {
          await redis.hset(user.getRedisKey() as KeyType, "access_token", accessToken.token);
          await redis.hset(user.getRedisKey() as KeyType, "refresh_token", refreshToken.token);
          await redis.hset(user.getRedisKey() as KeyType, "hashtag_access_token", hashtagAccessToken.token);
          await redis.hset(user.getRedisKey() as KeyType, "hashtag_refresh_token", hashtagRefreshToken.token);

          user.account.isActive = true;
          await user.save();
          await user.account.save();
        } catch (err) {
          return { error: { message: `Something went wrong. ${err}` } };
        }

        return {
          user,
          accessToken: accessToken.token,
          success: true,
        };
      },
    });
  },
});

export const UserLogoutMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("logout", {
      type: SuccessResult,
      description: "Logout a user",
      nullable: false,
      resolve: async (_, __, { res, payload, redis }: MyContext): Promise<SuccessType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }

        const redisUser = await redis.hgetall(`${redisKeys.USER}:${payload.sub.toString()}` as KeyType);
        if (!redisUser) {
          return { error: { message: "Something went wrong" } };
        }

        if (redisUser.hashtag_access_token && redisUser.hashtag_access_token !== "" && redisUser.hashtag_access_token !== " ") {
          const hashtagAccessToken = redisUser.hashtag_access_token;
          const logoutOperation = {
            query: logoutQuery,
            variables: {
              clientId: process.env.HASHTAG_CLIENT_ID!.toString(),
              clientSecret: process.env.HASHTAG_CLIENT_SECRET!.toString(),
            },
            context: {
              headers: {
                authorization: `Bearer ${hashtagAccessToken}`,
              },
            },
          };

          let success: boolean | undefined = undefined,
            errorCode: string | undefined = undefined,
            errorMessage: string | any = undefined;

          await makePromise(execute(link, logoutOperation))
            .then(res => res.data?.logoutUser)
            .then(data => {
              if (data.error) {
                errorCode = data.error.code;
                errorMessage = data.error.message;
              }
              success = data.success;
            })
            .catch(err => {
              return { error: { message: `Something went wrong. ${err}` } };
            });

          if ((errorCode || errorMessage) && !success) {
            return { error: { code: errorCode, message: errorMessage } };
          }
        }

        try {
          await removeUserSessions(payload.sub, redis);
        } catch (err) {
          return { error: { message: `Something went wrong. ${err}` } };
        }

        res.clearCookie(process.env.REFRESH_TOKEN_COOKIE_NAME!.toString(), { httpOnly: true });

        return {
          success: true,
        };
      },
    });
  },
});

export const UserForgotPasswordMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("sendForgotPasswordLink", {
      type: SuccessResult,
      description: "Sends a link to the user's email address to change its password",
      nullable: false,
      args: {
        email: arg({
          type: EmailScalar,
          required: true,
          description: "The email address of user",
        }),
      },
      resolve: async (_, { email }, { res, redis }): Promise<SuccessType> => {
        if (!email || email === "" || email === " ") {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid email address" } };
        }

        const user = await User.findOne({
          where: { email },
          relations: ["account"],
        });
        if (!user) {
          return {
            error: { code: errors.NOT_FOUND, message: "User does not exist" },
          };
        }

        if (!user.hashtagId) {
          return {
            error: { code: errors.HASHTAG_NOT_AUTHENTICATED_CODE, message: "You have not authenticated with #hashtag" },
          };
        }

        const sendForgotPasswordLinkOperation = {
          query: sendForgotPasswordLinkQuery,
          variables: {
            email,
          },
        };

        let success: boolean | undefined = undefined,
          errorCode: string | undefined = undefined,
          errorMessage: string | any = undefined;

        await makePromise(execute(link, sendForgotPasswordLinkOperation))
          .then(res => res.data?.sendForgotPasswordLink)
          .then(data => {
            if (data.error) {
              errorCode = data.error.code;
              errorMessage = data.error.message;
            }
            success = data.success;
          })
          .catch(err => {
            return { error: { message: `Something went wrong. ${err}` } };
          });

        if (errorCode || errorMessage) {
          return { error: { code: errorCode, message: errorMessage } };
        }

        if (!success) {
          return { error: { message: "Something went wrong" } };
        }

        try {
          await removeUserSessions(user.id, redis);
        } catch (err) {
          return { error: { message: `Something went wrong. ${err}` } };
        }
        res.clearCookie(process.env.REFRESH_TOKEN_COOKIE_NAME!.toString(), { httpOnly: true });

        return {
          success,
        };
      },
    });
    t.field("changeUserPassword", {
      type: SuccessResult,
      description: "Change a user's password",
      nullable: false,
      args: {
        email: arg({
          type: EmailScalar,
          required: true,
          description: "Email of user to retrieve OAuth Client applications",
        }),
        key: stringArg({
          required: true,
          description: "The key in the URL to identify and verify user. Each key lasts 20 minutes",
        }),
        newPassword: stringArg({
          required: true,
          description: "User's new password",
        }),
      },
      resolve: async (_, { email, key, newPassword }): Promise<SuccessType> => {
        if (!email || email === "" || email === " ") {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid email address" } };
        }
        if (!newPassword || newPassword === "" || newPassword === " ") {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid newPassword" } };
        }
        if (!key || key === "" || key === " ") {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid key" } };
        }

        const user = await User.findOne({
          where: { email },
          relations: ["account"],
        });
        if (!user) {
          return {
            error: { code: errors.NOT_FOUND, message: "User does not exist" },
          };
        }

        if (!user.hashtagId) {
          return {
            error: { code: errors.HASHTAG_NOT_AUTHENTICATED_CODE, message: "You have not authenticated with #hashtag" },
          };
        }

        const changeUserPasswordOperation = {
          query: changeUserPasswordQuery,
          variables: {
            email,
            key,
            newPassword,
          },
        };

        let success: boolean | undefined = undefined,
          errorCode: string | undefined = undefined,
          errorMessage: string | any = undefined;

        await makePromise(execute(link, changeUserPasswordOperation))
          .then(res => res.data?.changeUserPassword)
          .then(data => {
            if (data.error) {
              errorCode = data.error.code;
              errorMessage = data.error.message;
            }
            success = data.success;
          })
          .catch(err => {
            return { error: { message: `Something went wrong. ${err}` } };
          });

        if (errorCode || errorMessage) {
          return { error: { code: errorCode, message: errorMessage } };
        }
        if (!success) {
          return { error: { message: "Something went wrong" } };
        }

        return {
          success,
        };
      },
    });
  },
});

export const UserCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("updateUser", {
      type: UserUpdateResult,
      description: "Update a user's info",
      nullable: false,
      args: {
        email: arg({
          type: EmailScalar,
          required: false,
        }),
        username: stringArg({
          required: false,
        }),
        firstName: stringArg({
          required: false,
        }),
        lastName: stringArg({
          required: false,
        }),
        imgUrl: arg({
          type: UrlScalar,
          required: false,
        }),
        personTitle: stringArg({
          required: false,
          description: "The honorific title of the user",
        }),
        birthday: arg({
          type: DateScalar,
          required: false,
          description: "User's birthday in the date format",
        }),
        countryId: intArg({
          required: false,
          description: "The country of user",
        }),
        cityId: intArg({
          required: false,
          description: "The city or hometown of user",
        }),
        address: stringArg({
          required: false,
          description: "User's house or office street address",
        }),
        zipCode: stringArg({
          required: false,
          description: "User's house or office zip code",
        }),
        trackHistory: booleanArg({
          required: false,
          description: "Indicates if to track user's history",
        }),
      },
      resolve: async (
        _,
        { email, username, firstName, lastName, imgUrl, personTitle, birthday, countryId, cityId, address, zipCode, trackHistory },
        { payload, redis, stripe }: MyContext
      ): Promise<UpdateUserType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (!payload.scope.some(scope => ["beach_bar@crud:user"].includes(scope))) {
          return {
            error: {
              code: errors.UNAUTHORIZED_CODE,
              message: "You are not allowed to update a user",
            },
          };
        }

        if (email && email.trim().length === 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid email address" } };
        }

        const user = await User.findOne({
          where: { id: payload.sub },
          relations: ["account", "account.country", "account.city", "account.preferences", "customer", "reviews", "reviews.visitType"],
        });
        if (!user) {
          return { error: { code: errors.NOT_FOUND, message: errors.USER_NOT_FOUND_MESSAGE } };
        }

        let isNew = false;

        try {
          const response = await user.update({
            email,
            username,
            firstName,
            lastName,
            imgUrl,
            personTitle,
            birthday,
            address,
            zipCode,
            countryId,
            cityId,
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
                city: uAccount.city?.name || undefined,
                postal_code: uAccount.zipCode || undefined,
              },
              // @ts-ignore
              phone: uAccount.contactDetails ? (uAccount.contactDetails?.[0].phoneNumber as any) : undefined,
            });
          }
        } catch (err) {
          return {
            error: { message: `Something went wrong: ${err.message}` },
          };
        }

        const redisUser = await redis.hgetall(user.getRedisKey() as KeyType);
        if (!redisUser) {
          return { error: { message: errors.SOMETHING_WENT_WRONG } };
        }

        if (
          redisUser.hashtag_access_token &&
          redisUser.hashtag_access_token !== "" &&
          redisUser.hashtag_access_token !== " " &&
          isNew
        ) {
          const hashtagAccessToken = redisUser.hashtag_access_token;
          const updateUserOperation = {
            query: updateUserQuery,
            variables: {
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              pictureUrl: user.account.imgUrl,
              countryId: user.account.countryId,
              cityId: user.account.cityId,
              birthday: user.account.birthday,
            },
            context: {
              headers: {
                authorization: `Bearer ${hashtagAccessToken}`,
              },
            },
          };

          let hashtagUser: any = undefined,
            updated: boolean | undefined = undefined,
            errorCode: string | undefined = undefined,
            errorMessage: string | any = undefined;

          await makePromise(execute(link, updateUserOperation))
            .then(res => res.data?.updateUser)
            .then(data => {
              if (data.error) {
                errorCode = data.error.code;
                errorMessage = data.error.message;
              }
              hashtagUser = data.user;
              updated = data.updated;
            })
            .catch(err => {
              return { error: { message: `Something went wrong. ${err}` } };
            });

          if (errorCode || errorMessage) {
            return { error: { code: errorCode, message: errorMessage } };
          }

          if (!hashtagUser || String(hashtagUser.id) !== String(user.hashtagId) || !updated) {
            return { error: { message: errors.SOMETHING_WENT_WRONG } };
          }
        }

        return {
          user,
          updated: true,
        };
      },
    });
    t.field("deleteUser", {
      type: DeleteResult,
      description: "Delete a user & its account",
      nullable: false,
      resolve: async (_, __, { payload, redis, stripe }: MyContext): Promise<DeleteType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (!payload.scope.some(scope => ["hashtag@delete:user_account", "beach_bar@crud:user"].includes(scope))) {
          return {
            error: {
              code: errors.UNAUTHORIZED_CODE,
              message: "You are not allowed to delete 'this' user's account",
            },
          };
        }

        const user = await User.findOne({ where: { id: payload.sub }, relations: ["account", "customer"] });
        if (!user) {
          return { error: { code: errors.NOT_FOUND, message: errors.USER_NOT_FOUND_MESSAGE } };
        }

        try {
          if (user.customer) {
            await user.customer.customSoftRemove(stripe);
          }
          await user.account.softRemove();
          await user.softRemove();

          // delete the user in Redis too
          await removeUserSessions(user.id, redis);
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
