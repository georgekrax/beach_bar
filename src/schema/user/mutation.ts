import { arg, extendType, stringArg } from "@nexus/schema";
import { execute, makePromise } from "apollo-link";
import { createHash, randomBytes } from "crypto";
import { verify } from "jsonwebtoken";
import { getConnection } from "typeorm";
import { MyContext } from "../../common/myContext";
import { link } from "../../config/apolloLink";
import errors from "../../constants/errors";
import { Account } from "../../entity/Account";
import { ContactDetails } from "../../entity/ContactDetails";
import { Country } from "../../entity/Country";
import { loginDetailStatus } from "../../entity/LoginDetails";
import { Platform } from "../../entity/Platform";
import { User } from "../../entity/User";
import authorizeWithHashtagQuery from "../../graphql/AUTHORIZE_WITH_HASHTAG";
import exchangeCodeQuery from "../../graphql/EXCHANGE_CODE";
import signUpUserQuery from "../../graphql/SIGN_UP_USER";
import tokenInfoQuery from "../../graphql/TOKEN_INFO";
import { generateAccessToken, generateRefreshToken } from "../../utils/auth/generateAuthTokens";
import { sendRefreshToken } from "../../utils/auth/sendRefreshToken";
import { createUserLoginDetails, findBrowser, findCity, findCountry, findOs } from "../../utils/auth/userCommon";
import { ErrorType } from "../returnTypes";
import { UserLoginType, UserSignUpType } from "./returnTypes";
import { UserCredentialsInput, UserLoginDetailsInput, UserLoginResult, UserLogoutResult, UserSignUpResult } from "./types";

// --------------------------------------------------- //
// Sign up & login mutation
// --------------------------------------------------- //

export const UserSignUpAndLoginMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("signUpUser", {
      type: UserSignUpResult,
      description: "Sign up a user",
      nullable: false,
      args: {
        userCredentials: arg({ type: UserCredentialsInput, required: true, description: "Credential for signing up a user" }),
      },
      resolve: async (_, { userCredentials }): Promise<UserSignUpType | ErrorType> => {
        const { email, password } = userCredentials;

        if (!email || email === "" || email === " ") {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid email address" } };
        }
        if (!password || password === "" || password === " ") {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid password" } };
        }

        const user = await User.findOne({ where: { email } });
        if (user) {
          return { error: { code: errors.CONFLICT, message: "User already exists" } };
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

        let hashtagId, hashtagEmail, added, errorCode, errorMessage;

        await makePromise(execute(link, operation))
          .then(res => res.data?.signUpUser)
          .then(data => {
            console.log(data.user.code);
            if (data.error) {
              errorCode = data.error.code;
              errorMessage = data.error.message;
            }
            hashtagId = data.user.id;
            hashtagEmail = data.user.email;
            added = data.added;
          })
          .catch(err => {
            return { error: { message: `Something went wrong. ${err}` } };
          });

        if ((errorCode || errorMessage) && errorCode !== errors.CONFLICT && errorMessage !== "User already exists" && !added) {
          return { error: { code: errorCode, message: errorMessage } };
        }
        if (email !== hashtagEmail || hashtagId === "" || hashtagId === " ") {
          return { error: { message: "Something went wrong" } };
        }

        const newUser = User.create({
          email: hashtagEmail,
          hashtagId: BigInt(hashtagId),
        });

        const newUserAccount = Account.create();

        try {
          await newUser.save();
          newUserAccount.user = newUser;
          await newUserAccount.save();
          const newUserContactDetails = ContactDetails.create({
            account: newUserAccount,
          });
          await newUserContactDetails.save();
        } catch (err) {
          return { error: { message: `Something went wrong. ${err}` } };
        }

        return {
          user: newUser,
          added: true,
        };
      },
    });
  },
});

export const UserLoginMutation = extendType({
  type: "Mutation",
  definition(t) {
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
      resolve: async (
        _,
        { loginDetails, userCredentials },
        { res, redis, uaParser }: MyContext,
      ): Promise<UserLoginType | ErrorType> => {
        const { email, password } = userCredentials;
        if (!email || email === "" || email === " ") {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid email address" } };
        }
        if (!password || password === "" || password === " ") {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid password" } };
        }

        let os: any = uaParser.getOS().name,
          browser: any = uaParser.getBrowser().name,
          country: any = null,
          city: any = null,
          ipAddr: string | null = null;

        if (loginDetails) {
          ({ city, country, ipAddr } = loginDetails);
        }

        try {
          os = await findOs(os);
          browser = await findBrowser(browser);
          country = await findCountry(country);
          city = await findCity(city);
        } catch (err) {
          return { error: { message: `Something went wrong. ${err}` } };
        }

        // login user
        const user = await User.findOne({
          where: { email },
          relations: ["account"],
        });
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

        if (user.googleId) {
          return {
            error: { code: errors.GOOGLE_AUTHENTICATED_CODE, message: "You have authenticated with Google" },
          };
        } else if (user.facebookId) {
          return {
            error: { code: errors.FACEBOOK_AUTHENTICATED_CODE, message: "You have authenticated with Facebook" },
          };
        } else if (user.instagramId) {
          return {
            error: { code: errors.INSTAGRAM_AUTHENTICATED_CODE, message: "You have authenticated with Instagram" },
          };
        }

        const state = createHash("sha256").update(randomBytes(1024)).digest("hex");
        const scope = ["profile", "email", "openid"];

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
          errorMessage: string | undefined = undefined;

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
            return { error: { message: `Something went wrong. ${err}` } };
          });

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

        // pass beach_bar platform to user login details
        const platform = await Platform.findOne({ where: { name: "#beach_bar" } });
        if (!platform) {
          return { error: { message: "Something went wrong" } };
        }

        if (String(hashtagId) !== String(user.hashtagId) || email !== hashtagEmail) {
          return { error: { message: "Something went wrong" } };
        }

        if (errorCode !== undefined || errorMessage !== undefined) {
          if (errorMessage === errors.INVALID_PASSWORD_MESSAGE || errorCode === errors.INVALID_PASSWORD_CODE) {
            await createUserLoginDetails(
              loginDetailStatus.invalidPassword,
              platform,
              user.account,
              os,
              browser,
              country,
              city,
              ipAddr,
            );
          }
          return { error: { code: errorCode, message: errorMessage as any } };
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

        let hashtagAccessToken: object | undefined = undefined,
          idToken: object | undefined = undefined;

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
            idToken = data.tokens[1];
          })
          .catch(err => {
            return { error: { message: `Something went wrong. ${err}` } };
          });

        if (
          !hashtagAccessToken ||
          !idToken ||
          hashtagClientId !== process.env.HASHTAG_CLIENT_ID!.toString() ||
          hashtagClientSecret !== process.env.HASHTAG_CLIENT_SECRET!.toString()
        ) {
          return { error: { message: "Something went wrong" } };
        }

        if (errorCode || errorMessage) {
          return {
            error: { code: errorCode, message: errorMessage as any },
          };
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
            return { error: { message: `Something went wrong. ${err}` } };
          });

        if (errorCode || errorMessage) {
          return { error: { code: errorCode, message: errorMessage as any } };
        }

        if (
          !tokenInfo ||
          tokenInfo.email !== user.email ||
          tokenInfo.sub !== user.hashtagId ||
          tokenInfo.iss !== "https://www.hashtag.com" ||
          tokenInfo.aud !== process.env.HASHTAG_CLIENT_ID!.toString()
        ) {
          return { error: { message: "Something went wrong" } };
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
          if (tokenInfo.locale && !user.account.contactDetails[0].country) {
            const country = await Country.findOne({ where: { languageIdentifier: tokenInfo.locale } });
            if (country) {
              user.account.contactDetails[0].country = country;
              await user.account.contactDetails[0].save();
            }
          }
        }

        // create user login details
        await createUserLoginDetails(loginDetailStatus.loggedIn, platform, user.account, os, browser, country, city, ipAddr);

        const refreshToken = generateRefreshToken(user);
        const accessToken = generateAccessToken(user);
        sendRefreshToken(res, refreshToken.token);

        await redis.hset(user.id.toString(), "access_token", accessToken.token);
        await redis.hset(user.id.toString(), "refresh_token", refreshToken.token);

        try {
          user.account.isActive = true;
          await user.save();
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

// --------------------------------------------------- //
// Logout mutation
// --------------------------------------------------- //

export const UserLogoutMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("logout", {
      type: UserLogoutResult,
      description: "Logout a user",
      args: {
        refreshToken: stringArg({ required: true }),
      },
      nullable: false,
      resolve: async (
        _,
        { refreshToken },
        { res, payload, redis }: MyContext,
      ): Promise<{
        loggedOut: boolean;
        error: string | null;
      }> => {
        if (!refreshToken) {
          return {
            loggedOut: false,
            error: "A refresh token should be provided",
          };
        }

        if (!payload || payload.sub === null) {
          return {
            loggedOut: false,
            error: "Not authenticated",
          };
        }

        let tokenPayload: any = null;
        try {
          tokenPayload = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, {
            issuer: "www.beach_bar.com",
          });
        } catch (err) {
          return {
            loggedOut: false,
            error: err,
          };
        }

        if (payload.sub !== tokenPayload.sub) {
          return {
            loggedOut: false,
            error: "You are not allowed to logout this user",
          };
        }

        await getConnection().getRepository(User).increment({ id: payload.sub }, "tokenVersion", 1);

        await getConnection()
          .createQueryBuilder()
          .update(Account)
          .set({ isActive: false })
          .where("userId = :userId", { userId: payload.sub })
          .execute();

        const tokenId = `${tokenPayload.iat}-${tokenPayload.jti}`;

        try {
          await redis.del(tokenId);
        } catch (err) {
          return {
            loggedOut: false,
            error: err,
          };
        }

        res.clearCookie("jid", { httpOnlye: true, maxAge: 15552000000 });

        return {
          loggedOut: true,
          error: null,
        };
      },
    });
  },
});

// --------------------------------------------------- //
// Forgot password mutation
// --------------------------------------------------- //

// --------------------------------------------------- //
// Change password mutation
// --------------------------------------------------- //
