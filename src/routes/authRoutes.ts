/* eslint-disable @typescript-eslint/camelcase */
import * as express from "express";
import { KeyType } from "ioredis";
import { decode, verify } from "jsonwebtoken";
import { URL } from "url";
import { User } from "../entity/User";
import { redis } from "../index";
import { generateAccessToken, generateRefreshToken } from "../utils/auth/generateAuthTokens";
import { refreshTokenForHashtagUser } from "../utils/auth/refreshTokenForHashtagUser";
import { sendRefreshToken } from "../utils/auth/sendRefreshToken";

export const router = express.Router();

router.get("/google/callback", async (req: express.Request, res: express.Response) => {
  const qs = new URL(req.url, process.env.HOSTNAME_WITH_HTTP).searchParams;
  const code = qs.get("code");
  const state = qs.get("state");
  res.send(`<h2>Redirected from Google</h2><p>Code: ${code}</p><br><p>State:${state}</p>`);
});

router.get("/facebook/callback", async (req: express.Request, res: express.Response) => {
  const qs = new URL(req.url, process.env.HOSTNAME_WITH_HTTP).searchParams;
  const code = qs.get("code");
  const state = qs.get("state");
  res.send(`<h2>Redirected from Facebook</h2><p>Code: ${code}</p><br><p>State: ${state}</p>`);
});

router.get("/instagram/callback", async (req: express.Request, res: express.Response) => {
  const qs = new URL(req.url, process.env.HOSTNAME_WITH_HTTP).searchParams;
  const code = qs.get("code");
  const state = qs.get("state");
  res.send(`<h2>Redirected from Instagram</h2><p>Code: ${code}</p><br><p>State: ${state}</p>`);
});

router.post("/refresh_token", async (req: express.Request, res: express.Response) => {
  const refreshToken = req.cookies.me;
  if (!refreshToken) {
    return res.status(422).send({
      success: false,
      accessToken: null,
      error: "A refresh token should be provided in a cookie",
    });
  }

  let payload: any = null;
  try {
    payload = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, { issuer: process.env.TOKEN_ISSUER!.toString() });
  } catch (err) {
    if (err.name === "TokenExpiredError" || err.message === "jwt expired") {
      const decodedRefreshTokenPayload = decode(refreshToken);
      if (!decodedRefreshTokenPayload) {
        return res.status(500).send({
          success: false,
          accessToken: null,
          error: "Something went wrong",
        });
      }
      const user = await User.findOne({
        where: { id: decodedRefreshTokenPayload.sub },
        select: ["id", "email", "tokenVersion"],
      });
      if (!user) {
        return res.status(500).send({
          success: false,
          accessToken: null,
          error: "Something went wrong",
        });
      }
      if (user.tokenVersion !== payload.tokenVersion) {
        return res.status(422).send({
          success: false,
          accessToken: null,
          error: "Invalid refresh token",
        });
      }
      const userAccount = user.account;
      if (!userAccount) {
        return res.status(404).send({
          success: false,
          accessToken: null,
          error: "Something went wrong",
        });
      }
      if (user.hashtagId) {
        await refreshTokenForHashtagUser(res, user, redis);
      }
      const newRefreshToken = generateRefreshToken(user);
      await redis.hset(user.id.toString() as KeyType, "refresh_token", newRefreshToken.token);
      sendRefreshToken(res, newRefreshToken.token);
    } else {
      return res.send({
        success: false,
        accessToken: null,
        error: `Something went wrong. ${err.message.toString()}`,
      });
    }
  }

  if (!payload || payload.jti === null || payload.sub === "" || payload.sub === " ") {
    return res.send({
      success: false,
      accessToken: null,
      error: "Something went wrong. It is possible that the provided refresh token is invalid",
    });
  }

  const redisUser = await redis.hgetall(payload.sub.toString() as KeyType);
  if (!redisUser || !redisUser.refresh_token || redisUser.refresh_token !== refreshToken) {
    return res.status(422).send({
      success: false,
      accessToken: null,
      error: "Invalid refresh token",
    });
  }

  // refreshToken is valid
  //search for user with id === payload.sub
  const user = await User.findOne({ id: payload.sub });
  if (!user) {
    return res.send({
      success: false,
      accessToken: null,
      error: "Something went wrong",
    });
  }
  if (user.tokenVersion !== payload.tokenVersion) {
    return res.send({
      success: false,
      accessToken: null,
      error: "Invalid refresh token",
    });
  }
  if (user.hashtagId) {
    await refreshTokenForHashtagUser(res, user, redis);
  }

  // decode Redis user access_token to get its scopes
  const decodedAccessTokenPayload: any = decode(redisUser.access_token);
  if (!decodedAccessTokenPayload) {
    return res.status(500).send({
      success: false,
      accessToken: null,
      error: "Something went wrong",
    });
  }

  const newAccessToken = generateAccessToken(user, decodedAccessTokenPayload.scope);

  await redis.hset(user.id.toString() as KeyType, "access_token", newAccessToken.token);

  // send back a new accessToken
  return res.send({
    success: true,
    accessToken: {
      token: newAccessToken.token,
      expirationDate: newAccessToken.exp,
      expiresIn: newAccessToken.exp - Date.now(),
      type: "Bearer",
    },
    error: null,
  });
});
