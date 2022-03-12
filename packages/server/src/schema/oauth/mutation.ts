import platformNames from "@/config/platformNames";
import { generateAccessToken, generateRefreshToken } from "@/utils/auth";
import { signUpUser, SignUpUserOptions } from "@/utils/auth/signUpUser";
import { createLoginDetails, findLoginDetails } from "@/utils/auth/userCommon";
import { getRedisKey } from "@/utils/db";
import { errors } from "@beach_bar/common";
import { LoginDetailsStatus } from "@prisma/client";
import { EmailScalar } from "@the_hashtag/common/dist/graphql";
import { ApolloError } from "apollo-server-express";
import dayjs from "dayjs";
import { arg, booleanArg, extendType, nullable, stringArg } from "nexus";
import { LoginAuthorizeType, UserLoginDetails } from "../user/types";
import { OAuthProviderEnum, OAuthUserInput } from "./types";

const fetch = (...args) => import("node-fetch").then(module => module.default([...args] as any));

export const AuthorizeWithOAuthProviders = extendType({
  type: "Mutation",
  definition(t) {
    t.field("authorize", {
      type: LoginAuthorizeType,
      args: {
        user: arg({ type: OAuthUserInput }),
        provider: arg({ type: OAuthProviderEnum }),
        loginDetails: nullable(arg({ type: UserLoginDetails, description: "User details in login" })),
        isPrimaryOwner: nullable(
          booleanArg({ default: false, description: "Set to true if you want to sign up an owner for a #beach_bar" })
        ),
      },
      resolve: async (
        _,
        { user: userArg, provider, loginDetails: detailsArg, isPrimaryOwner = false },
        { redis, prisma, uaParser, ipAddr }
      ) => {
        const loginDetails = { ...findLoginDetails({ details: detailsArg, uaParser }), ipAddr: ipAddr || null };
        console.log(isPrimaryOwner, provider);
        console.log(userArg);

        let options: Pick<SignUpUserOptions, "googleId" | "facebookId" | "instagramId" | "instagramUsername"> = {};
        const userProviderId = userArg.id.toString();
        switch (provider) {
          case "Google":
            options = { googleId: userProviderId };
            break;
          case "Facebook":
            options = { facebookId: userProviderId };
            break;
          case "Instagram":
            options = { instagramId: userProviderId, instagramUsername: userArg.username };
            break;
        }

        // Search for user in DB
        let user = await prisma.user.findUnique({ where: { email: userArg.email }, include: { account: true } });
        const isNewUser = !!user;
        if (!user) user = await signUpUser({ ...loginDetails, ...userArg, ...options, isPrimaryOwner });

        // Check user & its account
        if (!user?.account) throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.INTERNAL_SERVER_ERROR);

        try {
          // Logined successfully
          // Create user login details
          await createLoginDetails({
            ...loginDetails,
            status: LoginDetailsStatus.LOGGED_IN,
            platform: platformNames.GOOGLE,
            account: user.account,
          });
        } catch (err) {
          throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.SOMETHING_WENT_WRONG);
        }

        // Get user's scopes from Redis
        const scope = await redis.smembers(getRedisKey({ model: "User", id: user.id, scope: true }));
        const { token: refreshToken } = generateRefreshToken(user, "Google");
        const { token: accessToken } = await generateAccessToken(user, scope);

        try {
          await redis.hset(getRedisKey({ model: "User", id: user.id }), "access_token", accessToken, "refresh_token", refreshToken);
          await prisma.user.updateMany({ where: { id: user.id }, data: { ...options } });
          await prisma.account.updateMany({ where: { id: user.account.id }, data: { isActive: true } });
        } catch (err) {
          throw new ApolloError(errors.SOMETHING_WENT_WRONG + ": " + err.message, errors.SOMETHING_WENT_WRONG);
        }

        return { user, scope, isNewUser,accessToken, refreshToken };
      },
    });
    t.field("authorizeWithGoogle", {
      type: LoginAuthorizeType,
      description: "Authorize a user with Google",
      args: {
        code: stringArg({ description: "The response code from Google's OAuth callback" }),
        state: stringArg({ description: "The response state, to check if everything went correct" }),
        loginDetails: nullable(arg({ type: UserLoginDetails, description: "User details in login" })),
        isPrimaryOwner: nullable(
          booleanArg({ default: false, description: "Set to true if you want to sign up an owner for a #beach_bar" })
        ),
      },
      resolve: async (
        _,
        { code, state, loginDetails: detailsArg, isPrimaryOwner = false },
        { prisma, req, res, googleOAuth2Client, uaParser, redis, ipAddr }
      ) => {
        if (!code || code.trim().length === 0 || !state || state.trim().length === 0) {
          throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.INTERNAL_SERVER_ERROR);
        }
        if (state !== req.cookies.gstate) {
          throw new ApolloError(errors.SOMETHING_WENT_WRONG + ". Please try again", errors.INTERNAL_SERVER_ERROR);
        }

        const codeVerifier = req.cookies.gcode_verifier;
        const tokens = await googleOAuth2Client.getToken({ code, codeVerifier });

        if (!tokens) throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.INTERNAL_SERVER_ERROR);

        let response: any = null;
        try {
          googleOAuth2Client.setCredentials(tokens.tokens);

          const url = "https://www.googleapis.com/oauth2/v3/userinfo?alt=json";
          response = await googleOAuth2Client.request({ url });
          if (!response.data) throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.INTERNAL_SERVER_ERROR);
        } catch (err) {
          throw new ApolloError(errors.SOMETHING_WENT_WRONG + ": " + err.message, errors.SOMETHING_WENT_WRONG);
        }

        const { sub: googleId, given_name: firstName, family_name: lastName, email } = response.data;

        if (!googleId || googleId.trim().length === 0 || !email || email.trim().length === 0) {
          throw new ApolloError(errors.SOMETHING_WENT_WRONG + ". Please try again.", errors.INTERNAL_SERVER_ERROR);
        }

        const loginDetails = { ...findLoginDetails({ details: detailsArg, uaParser }), ipAddr: ipAddr || null };

        // Search for user in DB
        let user = await prisma.user.findUnique({ where: { email }, include: { account: true } });
        const isNewUser = !!user;
        if (!user) user = await signUpUser({ ...loginDetails, email, isPrimaryOwner, googleId, firstName, lastName });

        // Check user & its account
        if (!user?.account) throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.INTERNAL_SERVER_ERROR);

        // Logined successfully
        try {
          // Create user login details
          await createLoginDetails({
            ...loginDetails,
            status: LoginDetailsStatus.LOGGED_IN,
            platform: platformNames.GOOGLE,
            account: user.account,
          });
        } catch (err) {
          throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.SOMETHING_WENT_WRONG);
        }

        // Get user's scopes from Redis
        const scope = await redis.smembers(getRedisKey({ model: "User", id: user.id, scope: true }));
        const { token: refreshToken } = generateRefreshToken(user, "Google");
        const { token: accessToken } = await generateAccessToken(user, scope);
        // sendCookieToken(res, refreshToken.token, "refresh");
        // sendCookieToken(res, accessToken.token, "access");

        try {
          await redis.hset(getRedisKey({ model: "User", id: user.id }), "access_token", accessToken, "refresh_token", refreshToken);
          await prisma.user.update({ where: { id: user.id }, data: { googleId, account: { update: { isActive: true } } } });
        } catch (err) {
          throw new ApolloError(errors.SOMETHING_WENT_WRONG + ": " + err.message, errors.SOMETHING_WENT_WRONG);
        }

        res.clearCookie("gstate", { httpOnly: true });
        res.clearCookie("gcode_verifier", { httpOnly: true });
        googleOAuth2Client.revokeCredentials();

        return { user, scope: [], accessToken, refreshToken, isNewUser };
      },
    });
    t.field("authorizeWithFacebook", {
      type: LoginAuthorizeType,
      description: "Authorize a user with Facebook",
      args: {
        code: stringArg({ description: "The response code from Google's OAuth callback" }),
        state: stringArg({ description: "The response state, to check if everything went correct" }),
        loginDetails: nullable(arg({ type: UserLoginDetails, description: "User details in login" })),
        isPrimaryOwner: nullable(
          booleanArg({ default: false, description: "Set to true if you want to sign up an owner for a #beach_bar" })
        ),
      },
      resolve: async (_, { code, state, loginDetails: detailsArg, isPrimaryOwner }, { prisma, req, res, uaParser, redis, ipAddr }) => {
        if (!code || code.trim().length === 0 || !state || state.trim().length === 0) {
          throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.SOMETHING_WENT_WRONG);
        }
        if (state !== req.cookies.fbstate) {
          throw new ApolloError(errors.SOMETHING_WENT_WRONG + ". Please try again", errors.INTERNAL_SERVER_ERROR);
        }

        let requestStatus: number | undefined = undefined,
          success = false,
          facebookAccessToken: string | undefined = undefined;
        await fetch(
          `${process.env.FACEBOOK_GRAPH_API_HOSTNAME}/v7.0/oauth/access_token?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${process.env.FACEBOOK_REDIRECT_URI}&client_secret=${process.env.FACEBOOK_APP_SECRET}&code=${code}`,
          {
            method: "GET",
          }
        )
          .then(res => {
            requestStatus = res.status;
            return res.json();
          })
          .then((data: any) => {
            if (data.access_token && data.token_type == "bearer" && requestStatus === 200) {
              success = true;
              facebookAccessToken = data.access_token;
            } else success = false;
          })
          .catch(err => {
            throw new ApolloError(errors.SOMETHING_WENT_WRONG + ":" + err.message, errors.SOMETHING_WENT_WRONG);
          });

        if (!success || !facebookAccessToken) throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.INTERNAL_SERVER_ERROR);

        requestStatus = undefined;
        success = false;
        await fetch(
          `${process.env.FACEBOOK_GRAPH_API_HOSTNAME}/debug_token?input_token=${facebookAccessToken}&access_token=${process.env.FACEBOOK_APP_ACCESS_TOKEN}`,
          {
            method: "GET",
          }
        )
          .then((res: any) => {
            requestStatus = res.status;
            return res.json().then(json => json.data);
          })
          .then(data => {
            if (
              !data ||
              data.app_id !== process.env.FACEBOOK_APP_ID ||
              data.type !== "USER" ||
              data.application !== process.env.FACEBOOK_APP_NAME ||
              !data.is_valid
            )
              success = false;
            else success = true;
          })
          .catch(err => {
            throw new ApolloError(errors.SOMETHING_WENT_WRONG + ":" + err.message, errors.SOMETHING_WENT_WRONG);
          });

        if (!success) throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.INTERNAL_SERVER_ERROR);

        let facebookId: string | undefined = undefined,
          facebookEmail: string | undefined = undefined,
          firstName: string | undefined = undefined,
          lastName: string | undefined = undefined,
          birthday: Date | undefined = undefined,
          pictureUrl: string | undefined = undefined;
        requestStatus = undefined;
        success = false;
        await fetch(
          `${process.env.FACEBOOK_GRAPH_API_HOSTNAME}/me?fields=id,email,first_name,last_name,birthday,hometown,location,picture{is_silhouette,url}&access_token=${facebookAccessToken}`,
          {
            method: "GET",
          }
        )
          .then(res => {
            requestStatus = res.status;
            return res.json();
          })
          .then((data: any) => {
            if (!data || !data.id || data.id.trim().length === 0 || data.email.trim().length === 0) success = false;
            else {
              success = true;
              facebookId = data.id;
              facebookEmail = data.email;
              firstName = data.first_name;
              lastName = data.last_name;
              if (data.birthday) birthday = dayjs(data.birthday).toDate();
              if (data.picture && !data.picture.is_silhouette) pictureUrl = data.picture.data.url;
            }
          })
          .catch(err => {
            throw new ApolloError(errors.SOMETHING_WENT_WRONG + ":" + err.message, errors.SOMETHING_WENT_WRONG);
          });

        if (!success || !facebookEmail || !facebookId) {
          throw new ApolloError(errors.INTERNAL_SERVER_ERROR, errors.INTERNAL_SERVER_ERROR);
        }

        const loginDetails = { ...findLoginDetails({ details: detailsArg, uaParser }), ipAddr: ipAddr || null };

        // Search for user in DB
        let user = await prisma.user.findUnique({ where: { email: facebookEmail }, include: { account: true } });
        const isNewUser = !!user;
        if (!user) {
          user = await signUpUser({
            ...loginDetails,
            email: facebookEmail,
            isPrimaryOwner,
            facebookId,
            firstName,
            lastName,
            birthday,
          });
        }

        // Check user & its account
        if (!user?.account) throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.INTERNAL_SERVER_ERROR);

        // Logined successfully
        // Create user login details
        await createLoginDetails({
          ...loginDetails,
          status: LoginDetailsStatus.LOGGED_IN,
          platform: platformNames.FACEBOOK,
          account: user.account,
        });

        // Get user's scopes from Redis
        const scope = await redis.smembers(getRedisKey({ model: "User", id: user.id, scope: true }) as KeyType);
        const { token: refreshToken } = generateRefreshToken(user, "Facebook");
        const { token: accessToken } = await generateAccessToken(user, scope);
        // sendCookieToken(res, refreshToken.token, "refresh");
        // sendCookieToken(res, accessToken.token, "access");

        try {
          await redis.hset(getRedisKey({ model: "User", id: user.id }), "access_token", accessToken, "refresh_token", refreshToken);

          await prisma.user.update({
            where: { id: user.id },
            data: {
              facebookId,
              account: {
                update: {
                  isActive: true,
                  birthday: birthday && !user.account.birthday ? birthday : undefined,
                  imgUrl: pictureUrl && !user.account.imgUrl ? pictureUrl : undefined,
                },
              },
            },
          });
        } catch (err) {
          await createLoginDetails({
            ...loginDetails,
            status: LoginDetailsStatus.FAILED,
            platform: platformNames.BEACH_BAR,
            account: user.account,
          });
          throw new ApolloError(errors.SOMETHING_WENT_WRONG + ":" + err.message);
        }

        res.clearCookie("fbstate", { httpOnly: true });

        return { user, scope: [], accessToken, refreshToken, isNewUser };
      },
    });
    t.field("authorizeWithInstagram", {
      type: LoginAuthorizeType,
      description: "Authorize a user with Instagram",
      args: {
        email: arg({ type: EmailScalar.name, description: "Email address of user to authorize with Instagram" }),
        code: stringArg({ description: "The response code from Google's OAuth callback" }),
        state: stringArg({ description: "The response state, to check if everything went correct" }),
        loginDetails: nullable(arg({ type: UserLoginDetails, description: "User details in login" })),
        isPrimaryOwner: nullable(
          booleanArg({ default: false, description: "Set to true if you want to sign up an owner for a #beach_bar" })
        ),
      },
      resolve: async (
        _,
        { email, code, state, loginDetails: detailsArg, isPrimaryOwner },
        { prisma, req, res, uaParser, redis, ipAddr }
      ) => {
        if (!email || email.trim().length === 0) {
          throw new ApolloError("Please provide a valid email address", errors.INVALID_ARGUMENTS);
        }
        if (!code || code.trim().length === 0 || !state || state.trim().length === 0) {
          throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.INTERNAL_SERVER_ERROR);
        }
        if (state !== req.cookies.instastate) {
          throw new ApolloError(errors.SOMETHING_WENT_WRONG + ". Please try again.", errors.INTERNAL_SERVER_ERROR);
        }

        const requestBody = new URLSearchParams();
        requestBody.append("client_id", process.env.INSTAGRAM_APP_ID);
        requestBody.append("client_secret", process.env.INSTAGRAM_APP_SECRET);
        requestBody.append("code", code);
        requestBody.append("grant_type", "authorization_code");
        requestBody.append("redirect_uri", process.env.INSTAGRAM_REDIRECT_URI);

        let requestStatus: number | undefined = undefined,
          success = false,
          instagramAccessToken: string | undefined = undefined,
          instagramUserId: string | undefined = undefined;
        await fetch(`${process.env.INSTAGRAM_API_HOSTNAME}/oauth/access_token`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: requestBody,
        })
          .then(res => {
            requestStatus = res.status;
            return res.json();
          })
          .then((data: any) => {
            if (data.access_token && data.user_id && data.user_id !== ("" || " ") && requestStatus === 200) {
              success = true;
              instagramAccessToken = data.access_token;
              instagramUserId = data.user_id;
            } else success = false;
          })
          .catch(err => {
            throw new ApolloError(errors.SOMETHING_WENT_WRONG + `: ${err.message}`, errors.SOMETHING_WENT_WRONG);
          });

        if (!success || !instagramAccessToken || !instagramUserId)
          throw new ApolloError(errors.INTERNAL_SERVER_ERROR, errors.INTERNAL_SERVER_ERROR);

        let instagramId: string | undefined = undefined,
          instagramUsername: string | undefined = undefined;
        requestStatus = undefined;
        success = false;
        await fetch(
          `${process.env.INSTAGRAM_GRAPH_API_HOSTNAME}/${instagramUserId}?fields=id,username&access_token=${instagramAccessToken}`,
          { method: "GET" }
        )
          .then(res => {
            requestStatus = res.status;
            return res.json();
          })
          .then((data: any) => {
            if (!data || !data.id || data.id.trim().length === 0) success = false;
            else {
              success = true;
              instagramId = data.id;
              instagramUsername = data.username;
            }
          })
          .catch(err => {
            throw new ApolloError(errors.SOMETHING_WENT_WRONG + ":" + err.message, errors.SOMETHING_WENT_WRONG);
          });

        if (!success || !instagramId || String(instagramId) !== String(instagramUserId)) {
          throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.INTERNAL_SERVER_ERROR);
        }

        const loginDetails = { ...findLoginDetails({ details: detailsArg, uaParser }), ipAddr: ipAddr || null };

        // Search for user in DB
        let user = await prisma.user.findUnique({ where: { email }, include: { account: true } });
        const isNewUser = !!user;
        if (!user) user = await signUpUser({ ...loginDetails, email, isPrimaryOwner, instagramId, instagramUsername });

        // Check again user & its account
        if (!user?.account) throw new ApolloError(errors.INTERNAL_SERVER_ERROR, errors.SOMETHING_WENT_WRONG);

        // Logined successfully
        // Create user login details
        await createLoginDetails({
          ...loginDetails,
          status: LoginDetailsStatus.LOGGED_IN,
          platform: platformNames.INSTAGRAM,
          account: user.account,
        });

        // Get user's scopes from Redis
        const scope = await redis.smembers(getRedisKey({ model: "User", id: user.id, scope: true }));
        const { token: refreshToken } = generateRefreshToken(user, "Instagram");
        const { token: accessToken } = await generateAccessToken(user, scope);
        // sendCookieToken(res, refreshToken.token, "refresh");
        // sendCookieToken(res, accessToken.token, "access");

        try {
          await redis.hset(getRedisKey({ model: "User", id: user.id }), "access_token", accessToken, "refresh_token", refreshToken);

          await prisma.user.update({
            where: { id: user.id },
            data: { instagramId, instagramUsername, account: { update: { isActive: true } } },
          });
        } catch (err) {
          await createLoginDetails({
            ...loginDetails,
            status: LoginDetailsStatus.FAILED,
            platform: platformNames.BEACH_BAR,
            account: user.account,
          });
          throw new ApolloError(errors.SOMETHING_WENT_WRONG + ":" + err.message, errors.SOMETHING_WENT_WRONG);
        }

        res.clearCookie("instastate", { httpOnly: true });

        return { user, scope: [], accessToken, refreshToken, isNewUser };
      },
    });
  },
});
