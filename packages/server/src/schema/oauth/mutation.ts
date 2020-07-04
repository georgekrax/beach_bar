import { arg, booleanArg, extendType, stringArg } from "@nexus/schema";
import fetch from "node-fetch";
import errors from "../../constants/errors";
import { loginDetailStatus } from "../../entity/LoginDetails";
import { Platform } from "../../entity/Platform";
import { User } from "../../entity/User";
import { generateAccessToken, generateRefreshToken } from "../../utils/auth/generateAuthTokens";
import { sendRefreshToken } from "../../utils/auth/sendRefreshToken";
import { signUpUser } from "../../utils/auth/signUpUser";
import { createUserLoginDetails, findBrowser, findCity, findCountry, findOs } from "../../utils/auth/userCommon";
import { ErrorType } from "../returnTypes";
import { UserLoginDetailsInput } from "../user/types";
import { AuthorizeWithOAuthType } from "./returnTypes";
import { OAuthAuthorizationResult } from "./types";
import { MyContext, EmailScalar } from "@beach_bar/common";

export const AuthorizeWithOAuthProviders = extendType({
  type: "Mutation",
  definition(t) {
    t.field("authorizeWithGoogle", {
      type: OAuthAuthorizationResult,
      description: "Authorize a user with Google",
      nullable: false,
      args: {
        code: stringArg({ required: true, description: "The response code from Google's OAuth callback" }),
        state: stringArg({ required: true, description: "The response state, to check if everything went correct" }),
        loginDetails: arg({
          type: UserLoginDetailsInput,
          required: false,
          description: "User details in login",
        }),
        isPrimaryOwner: booleanArg({
          required: false,
          default: false,
          description: "Set to true if you want to sign up an owner for a #beach_bar",
        }),
      },
      resolve: async (
        _,
        { code, state, loginDetails, isPrimaryOwner },
        { req, res, googleOAuth2Client, uaParser, redis }: MyContext,
      ): Promise<AuthorizeWithOAuthType | ErrorType> => {
        if (!code || code === "" || code === " ") {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid code" } };
        }
        if (!state || state === "" || state === " ") {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid state" } };
        }
        if (state !== req.cookies.gstate) {
          return {
            error: {
              code: errors.INTERNAL_SERVER_ERROR,
              message: "Something went wrong. Please try again",
            },
          };
        }

        const codeVerifier = req.cookies.gcode_verifier;
        const tokens = await googleOAuth2Client.getToken({ code, codeVerifier });

        if (!tokens) {
          return {
            error: {
              code: errors.INTERNAL_SERVER_ERROR,
              message: "Something went wrong",
            },
          };
        }

        let response: any = null;
        try {
          googleOAuth2Client.setCredentials(tokens.tokens);

          const url = "https://www.googleapis.com/oauth2/v3/userinfo?alt=json";
          response = await googleOAuth2Client.request({ url });
          if (!response.data) {
            return {
              error: {
                code: errors.INTERNAL_SERVER_ERROR,
                message: "Something went wrong",
              },
            };
          }
        } catch (err) {
          return { error: { message: `Something went wrong: ${err.message}` } };
        }

        const { sub: googleId, given_name: firstName, family_name: lastName, email, locale } = response.data;

        if (!googleId || googleId === ("" || " ") || !email || email === ("" || " ")) {
          return {
            error: {
              code: errors.INTERNAL_SERVER_ERROR,
              message: "Something went wrong",
            },
          };
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

        if (country !== null && country.languageIdentifier !== locale) {
          return {
            error: {
              code: errors.INTERNAL_SERVER_ERROR,
              message: "Something went wrong",
            },
          };
        }

        // search for user in DB
        let user: User | undefined = await User.findOne({ where: { email }, relations: ["account"] });
        let signedUp = false;
        if (!user) {
          signedUp = true;
          const response = await signUpUser(
            email,
            redis,
            isPrimaryOwner,
            undefined,
            googleId,
            undefined,
            undefined,
            undefined,
            undefined,
            firstName,
            lastName,
            country,
            city,
            undefined,
          );
          // @ts-ignore
          if (response.error && !response.user) {
            // @ts-ignore
            return { error: { code: response.error.code, message: response.error.message } };
          }
          user = await User.findOne({ where: { email }, relations: ["account"] });
        }

        if (!user) {
          return {
            error: { code: errors.INTERNAL_SERVER_ERROR, message: errors.SOMETHING_WENT_WRONG },
          };
        }

        // check user's account
        if (!user.account) {
          return { error: { code: errors.INTERNAL_SERVER_ERROR, message: "Something went wrong" } };
        }

        // pass beach_bar platform to user login details
        const platform = await Platform.findOne({ name: "Google" });
        if (!platform) {
          return { error: { code: errors.INTERNAL_SERVER_ERROR, message: "Something went wrong" } };
        }

        // logined successfully
        // create user login details
        await createUserLoginDetails(loginDetailStatus.loggedIn, platform, user.account, os, browser, country, city, ipAddr);

        // get user's scopes from Redis
        const scope = await redis.smembers(`scope:${user.id}` as KeyType);
        const refreshToken = generateRefreshToken(user);
        const accessToken = generateAccessToken(user, scope);
        sendRefreshToken(res, refreshToken.token);

        try {
          await redis.hset(`${user.id.toString()}` as KeyType, "access_token", accessToken.token);
          await redis.hset(`${user.id.toString()}` as KeyType, "refresh_token", refreshToken.token);

          user.googleId = googleId;
          user.account.isActive = true;
          await user.save();
          await user.account.save();
          if (googleId !== String(user.googleId)) {
            return { error: { code: errors.INTERNAL_SERVER_ERROR, message: "Something went wrong" } };
          }
        } catch (err) {
          return { error: { message: `Something went wrong: ${err.message}` } };
        }

        res.clearCookie("gstate", { httpOnly: true, maxAge: 310000 });
        res.clearCookie("gcode_verifier", { httpOnly: true, maxAge: 310000 });
        googleOAuth2Client.revokeCredentials();

        return {
          user,
          accessToken: accessToken.token,
          signedUp,
          logined: true,
        };
      },
    });
    t.field("authorizeWithFacebook", {
      type: OAuthAuthorizationResult,
      description: "Authorize a user with Facebook",
      nullable: false,
      args: {
        code: stringArg({ required: true, description: "The response code from Google's OAuth callback" }),
        state: stringArg({ required: true, description: "The response state, to check if everything went correct" }),
        loginDetails: arg({
          type: UserLoginDetailsInput,
          required: false,
          description: "User details in login",
        }),
        isPrimaryOwner: booleanArg({
          required: false,
          default: false,
          description: "Set to true if you want to sign up an owner for a #beach_bar",
        }),
      },
      resolve: async (
        _,
        { code, state, loginDetails, isPrimaryOwner },
        { req, res, uaParser, redis }: MyContext,
      ): Promise<AuthorizeWithOAuthType | ErrorType> => {
        if (!code || code === "" || code === " ") {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid code" } };
        }
        if (!state || state === "" || state === " ") {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid state" } };
        }
        if (state !== req.cookies.fbstate) {
          return {
            error: {
              code: errors.INTERNAL_SERVER_ERROR,
              message: "Something went wrong. Please try again",
            },
          };
        }

        let requestStatus: number | undefined = undefined,
          success = false,
          facebookAccessToken: string | undefined = undefined;
        await fetch(
          `${process.env.FACEBOOK_GRAPH_API_HOSTNAME!.toString()}/v7.0/oauth/access_token?client_id=${process.env.FACEBOOK_APP_ID!.toString()}&redirect_uri=${process.env.FACEBOOK_REDIRECT_URI!.toString()}&client_secret=${process.env.FACEBOOK_APP_SECRET!.toString()}&code=${code}`,
          {
            method: "GET",
          },
        )
          .then(res => {
            requestStatus = res.status;
            return res.json();
          })
          .then(data => {
            if (data.access_token && data.token_type == "bearer" && requestStatus === 200) {
              success = true;
              facebookAccessToken = data.access_token;
            } else {
              success = false;
            }
          })
          .catch(err => {
            return { error: { message: `Something went wrong: ${err.message}` } };
          });

        if (!success || !facebookAccessToken) {
          return { error: { code: errors.INTERNAL_SERVER_ERROR, message: errors.SOMETHING_WENT_WRONG } };
        }

        requestStatus = undefined;
        success = false;
        await fetch(
          `${process.env.FACEBOOK_GRAPH_API_HOSTNAME!.toString()}/debug_token?input_token=${facebookAccessToken}&access_token=${process.env.FACEBOOK_APP_ACCESS_TOKEN!.toString()}`,
          {
            method: "GET",
          },
        )
          .then(res => {
            requestStatus = res.status;
            return res.json().then(json => json.data);
          })
          .then(data => {
            if (
              !data ||
              data.app_id !== process.env.FACEBOOK_APP_ID!.toString() ||
              data.type !== "USER" ||
              data.application !== process.env.FACEBOOK_APP_NAME!.toString() ||
              !data.is_valid
            ) {
              success = false;
            } else {
              success = true;
            }
          })
          .catch(err => {
            return { error: { message: `Something went wrong: ${err.message}` } };
          });

        if (!success) {
          return { error: { code: errors.INTERNAL_SERVER_ERROR, message: errors.SOMETHING_WENT_WRONG } };
        }

        let facebookId: string | undefined = undefined,
          facebookEmail: string | undefined = undefined,
          firstName: string | undefined = undefined,
          lastName: string | undefined = undefined,
          birthday: Date | undefined = undefined,
          pictureUrl: string | undefined = undefined,
          city: any = undefined,
          country: any = undefined;
        requestStatus = undefined;
        success = false;
        await fetch(
          `${process.env.FACEBOOK_GRAPH_API_HOSTNAME!.toString()}/me?fields=id,email,first_name,last_name,birthday,hometown,location,picture{is_silhouette,url}&access_token=${facebookAccessToken}`,
          {
            method: "GET",
          },
        )
          .then(res => {
            requestStatus = res.status;
            return res.json();
          })
          .then(data => {
            if (!data || !data.id || data.id === ("" || " ") || data.email === ("" || " ")) {
              success = false;
            } else {
              success = true;
              facebookId = data.id;
              facebookEmail = data.email;
              firstName = data.first_name;
              lastName = data.last_name;
              if (data.birthday) {
                birthday = new Date(data.birthday);
              }
              if (data.picture && !data.picture.is_silhouette) {
                pictureUrl = data.picture.data.url;
              }
              // @todo check again for this property
              city = data.hometown.name;
              country = data.location;
            }
          })
          .catch(err => {
            return { error: { message: `Something went wrong: ${err.message}` } };
          });

        if (!success || !facebookEmail || !facebookId) {
          return { error: { code: errors.INTERNAL_SERVER_ERROR, message: errors.SOMETHING_WENT_WRONG } };
        }

        let os: any = uaParser.getOS().name,
          browser: any = uaParser.getBrowser().name,
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

        // search for user in DB
        let user: User | undefined = await User.findOne({ where: { email: facebookEmail }, relations: ["account"] });
        let signedUp = false;
        if (!user) {
          signedUp = true;
          const response = await signUpUser(
            facebookEmail,
            redis,
            isPrimaryOwner,
            undefined,
            undefined,
            facebookId,
            undefined,
            undefined,
            undefined,
            firstName,
            lastName,
            country,
            city,
            birthday,
          );
          // @ts-ignore
          if (response.error && !response.user) {
            // @ts-ignore
            return { error: { code: response.error.code, message: response.error.message } };
          }
          user = await User.findOne({ where: { email: facebookEmail }, relations: ["account"] });
        }

        if (!user) {
          return {
            error: { code: errors.INTERNAL_SERVER_ERROR, message: errors.SOMETHING_WENT_WRONG },
          };
        }

        // check user's account
        if (!user.account) {
          return { error: { code: errors.INTERNAL_SERVER_ERROR, message: "Something went wrong" } };
        }

        // pass beach_bar platform to user login details
        const platform = await Platform.findOne({ name: "Facebook" });
        if (!platform) {
          return { error: { code: errors.INTERNAL_SERVER_ERROR, message: "Something went wrong" } };
        }

        // logined successfully
        // create user login details
        await createUserLoginDetails(loginDetailStatus.loggedIn, platform, user.account, os, browser, country, city, ipAddr);

        // get user's scopes from Redis
        const scope = await redis.smembers(`scope:${user.id}` as KeyType);
        const refreshToken = generateRefreshToken(user);
        const accessToken = generateAccessToken(user, scope);
        sendRefreshToken(res, refreshToken.token);

        try {
          await redis.hset(`${user.id.toString()}` as KeyType, "access_token", accessToken.token);
          await redis.hset(`${user.id.toString()}` as KeyType, "refresh_token", refreshToken.token);

          user.facebookId = facebookId;
          user.account.isActive = true;
          if (birthday && !user.account.birthday) {
            user.account.birthday = birthday;
          }
          if (pictureUrl && !user.account.imgUrl) {
            user.account.imgUrl = pictureUrl;
          }
          await user.save();
          await user.account.save();
          if (facebookId !== String(user.facebookId)) {
            return { error: { code: errors.INTERNAL_SERVER_ERROR, message: "Something went wrong" } };
          }
        } catch (err) {
          return { error: { message: `Something went wrong: ${err.message}` } };
        }

        res.clearCookie("fbstate", { httpOnly: true, maxAge: 310000 });

        return {
          user,
          accessToken: accessToken.token,
          signedUp,
          logined: true,
        };
      },
    });
    t.field("authorizeWithInstagram", {
      type: OAuthAuthorizationResult,
      description: "Authorize a user with Instagram",
      nullable: false,
      args: {
        email: arg({ type: EmailScalar, required: true, description: "Email address of user to authorize with Instagram" }),
        code: stringArg({ required: true, description: "The response code from Google's OAuth callback" }),
        state: stringArg({ required: true, description: "The response state, to check if everything went correct" }),
        loginDetails: arg({
          type: UserLoginDetailsInput,
          required: false,
          description: "User details in login",
        }),
        isPrimaryOwner: booleanArg({
          required: false,
          default: false,
          description: "Set to true if you want to sign up an owner for a #beach_bar",
        }),
      },
      resolve: async (
        _,
        { email, code, state, loginDetails, isPrimaryOwner },
        { req, res, uaParser, redis }: MyContext,
      ): Promise<AuthorizeWithOAuthType | ErrorType> => {
        if (!email || email === "" || email === " ") {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid email address" } };
        }
        if (!code || code === "" || code === " ") {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid code" } };
        }
        if (!state || state === "" || state === " ") {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid state" } };
        }
        if (state !== req.cookies.instastate) {
          return {
            error: {
              code: errors.INTERNAL_SERVER_ERROR,
              message: "Something went wrong. Please try again",
            },
          };
        }

        const requestBody = new URLSearchParams();
        requestBody.append("client_id", process.env.INSTAGRAM_APP_ID!.toString());
        requestBody.append("client_secret", process.env.INSTAGRAM_APP_SECRET!.toString());
        requestBody.append("code", code);
        requestBody.append("grant_type", "authorization_code");
        requestBody.append("redirect_uri", process.env.INSTAGRAM_REDIRECT_URI!.toString());

        let requestStatus: number | undefined = undefined,
          success = false,
          instagramAccessToken: string | undefined = undefined,
          instagramUserId: string | undefined = undefined;
        await fetch(`${process.env.INSTAGRAM_API_HOSTNAME!.toString()}/oauth/access_token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          // @ts-ignore
          body: requestBody,
        })
          .then(res => {
            requestStatus = res.status;
            return res.json();
          })
          .then(data => {
            if (data.access_token && data.user_id && data.user_id !== ("" || " ") && requestStatus === 200) {
              success = true;
              instagramAccessToken = data.access_token;
              instagramUserId = data.user_id;
            } else {
              success = false;
            }
          })
          .catch(err => {
            return { error: { message: `Something went wrong: ${err.message}` } };
          });

        if (!success || !instagramAccessToken || !instagramUserId) {
          return { error: { code: errors.INTERNAL_SERVER_ERROR, message: errors.SOMETHING_WENT_WRONG } };
        }

        let instagramId: string | undefined = undefined,
          instagramUsername: string | undefined = undefined;
        requestStatus = undefined;
        success = false;
        await fetch(
          `${process.env.INSTAGRAM_GRAPH_API_HOSTNAME!.toString()}/${instagramUserId}?fields=id,username&access_token=${instagramAccessToken}`,
          {
            method: "GET",
          },
        )
          .then(res => {
            requestStatus = res.status;
            return res.json();
          })
          .then(data => {
            if (!data || !data.id || data.id === ("" || " ")) {
              success = false;
            } else {
              success = true;
              instagramId = data.id;
              instagramUsername = data.username;
            }
          })
          .catch(err => {
            return { error: { message: `Something went wrong: ${err.message}` } };
          });

        if (!success || !instagramId || String(instagramId) !== String(instagramUserId)) {
          return { error: { code: errors.INTERNAL_SERVER_ERROR, message: errors.SOMETHING_WENT_WRONG } };
        }

        let os: any = uaParser.getOS().name,
          browser: any = uaParser.getBrowser().name,
          country: any = undefined,
          city: any = undefined,
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

        // search for user in DB
        let user: User | undefined = await User.findOne({
          where: { email },
          relations: ["account"],
        });
        let signedUp = false;
        if (!user) {
          signedUp = true;
          const response = await signUpUser(
            email,
            redis,
            isPrimaryOwner,
            undefined,
            undefined,
            undefined,
            instagramId,
            instagramUsername,
            undefined,
            undefined,
            undefined,
            country,
            city,
            undefined,
          );

          // @ts-ignore
          if (response.error && !response.user) {
            // @ts-ignore
            return { error: { code: response.error.code, message: response.error.message } };
          }
          user = await User.findOne({ where: { email, instagramUsername }, relations: ["account"] });
        }

        // check again for user & its account
        if (!user || !user.account) {
          return {
            error: { code: errors.INTERNAL_SERVER_ERROR, message: errors.SOMETHING_WENT_WRONG },
          };
        }

        // pass beach_bar platform to user login details
        const platform = await Platform.findOne({ name: "Instagram" });
        if (!platform) {
          return { error: { code: errors.INTERNAL_SERVER_ERROR, message: "Something went wrong" } };
        }

        // logined successfully
        // create user login details
        await createUserLoginDetails(loginDetailStatus.loggedIn, platform, user.account, os, browser, country, city, ipAddr);

        // get user's scopes from Redis
        const scope = await redis.smembers(`scope:${user.id}` as KeyType);
        const refreshToken = generateRefreshToken(user);
        const accessToken = generateAccessToken(user, scope);
        sendRefreshToken(res, refreshToken.token);

        try {
          await redis.hset(`${user.id.toString()}` as KeyType, "access_token", accessToken.token);
          await redis.hset(`${user.id.toString()}` as KeyType, "refresh_token", refreshToken.token);

          user.instagramId = instagramId;
          user.account.isActive = true;
          if (instagramUsername) {
            user.instagramUsername = instagramUsername;
          }
          await user.save();
          await user.account.save();
          if (instagramId !== String(user.instagramId)) {
            return { error: { code: errors.INTERNAL_SERVER_ERROR, message: "Something went wrong" } };
          }
        } catch (err) {
          return { error: { message: `Something went wrong: ${err.message}` } };
        }

        res.clearCookie("instastate", { httpOnly: true, maxAge: 310000 });

        return {
          user,
          accessToken: accessToken.token,
          signedUp,
          logined: true,
        };
      },
    });
  },
});
