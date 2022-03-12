import { MyContext } from "@/typings/index";
import { getRedisKey } from "@/utils/db";
import { errors, signJwt } from "@beach_bar/common";
import { Prisma, User } from "@prisma/client";
import { ApolloError } from "apollo-server-express";
import axios from "axios";
import { Response } from "express";
import { decode, sign } from "jsonwebtoken";
import ms from "ms";
import { nanoid } from "nanoid";
import { redis } from "..";

type GeneratedTokenType = {
  token: string;
  exp: number;
  iat: number;
  jti: string;
  aud: string | null;
  iss: string;
};

type Payload = MyContext["payload"];

// isAuth()
export const isAuth = (payload: Payload) => {
  if (!payload) throw new ApolloError(errors.NOT_AUTHENTICATED_MESSAGE, errors.NOT_AUTHENTICATED_CODE);
};

// checkScopes()
export const checkScopes = (payload: any, scopes: string[]): boolean => {
  return payload!.scope.some((scope: string) => scopes.includes(scope));
};

// throwScopesUnauthorized()
export const throwScopesUnauthorized = (payload: Payload, msg: string, scopes: string[]) => {
  if (!checkScopes(payload, scopes)) throw new ApolloError(msg, errors.UNAUTHORIZED_CODE);
};

// sendCookieToken()
export const sendCookieToken = (res: Response, token: string, type: "access" | "refresh") => {
  const cookie = res.cookie(process.env[type === "access" ? "ACCESS_TOKEN_COOKIE_NAME" : "REFRESH_TOKEN_COOKIE_NAME"], token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: ms(process.env.REFRESH_TOKEN_EXPIRATION!),
    // sameSite: "strict",
  });
  const formattedCookie = cookie.getHeader("Set-Cookie") || "";
  res.setHeader("Set-Cookie", formattedCookie);
  return formattedCookie;
};

// generateAccessToken()
export const generateAccessToken = async (user: User, scope: string[]): Promise<GeneratedTokenType> => {
  const { jwt, signed } = await signJwt({ scope }, process.env.ACCESS_TOKEN_SECRET!, token => {
    return token
      .setAudience(process.env.TOKEN_AUDIENCE)
      .setIssuer(process.env.TOKEN_ISSUER)
      .setExpirationTime(process.env.ACCESS_TOKEN_EXPIRATION)
      .setSubject(user.id.toString())
      .setJti(nanoid());
  });

  const tokenPayload: any = decode(signed);
  if (tokenPayload === null) throw new Error(errors.SOMETHING_WENT_WRONG);
  return { ...tokenPayload, iat: tokenPayload.iat * 1000, exp: tokenPayload.exp * 1000, token: jwt };
};

// generateRefreshToken()
export const generateRefreshToken = (
  user: User,
  oauthProvider: "#beach_bar" | "Google" | "Facebook" | "Instagram"
): GeneratedTokenType => {
  const token = sign(
    {
      tokenVersion: user.tokenVersion,
      oauth: oauthProvider,
    },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      audience: process.env.TOKEN_AUDIENCE,
      issuer: process.env.TOKEN_ISSUER,
      subject: user.id.toString(),
      expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
      jwtid: nanoid(),
    }
  );

  const tokenPayload: any = decode(token);
  if (tokenPayload === null) throw new Error(errors.SOMETHING_WENT_WRONG);
  const { exp, iat, jti, aud, iss } = tokenPayload;
  return { token, jti, aud, iss, exp: exp * 1000, iat: iat * 1000 };
};

// refreshHashtagToken()

export const refreshHashtagToken = async (user: Prisma.UserGetPayload<{ select: { id: true } }>): Promise<void | Error> => {
  const redisKey = getRedisKey({ model: "User", id: user.id });
  const redisUser = await redis.hgetall(redisKey);
  if (!redisUser || !redisUser.refresh_token) throw new Error(errors.INVALID_REFRESH_TOKEN);
  if (!redisUser || !redisUser.hashtag_refresh_token || redisUser.hashtag_refresh_token.trim().length === 0) {
    throw new Error(errors.SOMETHING_WENT_WRONG);
  }
  const { hashtag_refresh_token: hashtagRefreshToken } = redisUser;

  const requestBody = {
    grant_type: "refresh_token",
    client_id: process.env.HASHTAG_CLIENT_ID,
    client_secret: process.env.HASHTAG_CLIENT_SECRET,
    refresh_token: hashtagRefreshToken,
  };

  let success = false;

  await axios
    .post(process.env.HASHTAG_API_HOSTNAME + "/oauth/refresh_token", requestBody, { withCredentials: true })
    .then(async ({ data }) => {
      if (data.success && data.accessToken.token && !data.refreshToken) {
        success = true;
        await redis.hset(redisKey, "hashtag_access_token", data.accessToken.token);
      } else if (data.success && data.refreshToken && !data.accessToken) {
        await redis.hset(redisKey, "hashtag_refresh_token", data.refreshToken);
        const newRequestBody = { ...requestBody, refresh_token: data.refreshToken };
        fetch(`${process.env.HASHTAG_API_HOSTNAME}/oauth/refresh_token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newRequestBody),
        })
          .then(res => res.json())
          .then(async (data: any) => {
            if (data && data.accessToken && !data.refreshToken) {
              success = true;
              await redis.hset(redisKey, "hashtag_access_token", data.accessToken.token);
            }
          })
          .catch(err => {
            throw new Error(`${errors.SOMETHING_WENT_WRONG}: ${err.message}`);
          });
      } else success = false;
    })
    .catch(err => {
      success = false;
      if (
        err.message ===
        `request to ${process.env.HASHTAG_API_HOSTNAME}/oauth/refresh_token failed, reason: connect ECONNREFUSED ${process.env
          .HASHTAG_API_HOSTNAME!.replace("https://", "")
          .replace("http://", "")}`
      ) {
        throw new Error(errors.SOMETHING_WENT_WRONG);
      }
      throw new Error(errors.SOMETHING_WENT_WRONG + ": " + err.message);
    });

  if (!success) throw new Error(errors.SOMETHING_WENT_WRONG);
};
