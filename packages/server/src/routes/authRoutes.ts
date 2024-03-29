import { errors } from "@beach_bar/common";
import redisKeys from "constants/redisKeys";
import { User } from "entity/User";
import * as express from "express";
import { KeyType } from "ioredis";
import { decode, verify } from "jsonwebtoken";
import { URL } from "url";
import { generateAccessToken, generateRefreshToken } from "utils/auth/generateAuthTokens";
import { refreshTokenForHashtagUser } from "utils/auth/refreshTokenForHashtagUser";
import { sendCookieToken } from "utils/auth/sendCookieToken";
import { redis } from "../index";

export const router = express.Router();

router.get("/google/callback", async (req: express.Request, res: express.Response) => {
  const qs = new URL(req.url, process.env.HOSTNAME_WITH_HTTP).searchParams;
  const code = qs.get("code");
  const state = qs.get("state");
  return res.send(`<h2>Redirected from Google</h2><p>Code: ${code}</p><br><p>State: ${state}</p>`);
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
  const refreshToken = req.cookies[process.env.REFRESH_TOKEN_COOKIE_NAME!.toString()] || req.headers["x-refetch-token"];
  if (!refreshToken)
    return res.status(422).send({ success: false, accessToken: null, error: "A refresh token should be provided in a cookie" });

  let payload: any = null;
  try {
    payload = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, { issuer: process.env.TOKEN_ISSUER!.toString() });
  } catch (err) {
    if (err.name === "TokenExpiredError" || err.message === "jwt expired") {
      const decodedRefreshTokenPayload = decode(refreshToken);
      if (!decodedRefreshTokenPayload) return res.status(500).send({ success: false, accessToken: null, error: errors.JWT_EXPIRED });
      const user = await User.findOne({
        where: { id: decodedRefreshTokenPayload.sub },
        select: ["id", "email", "tokenVersion"],
        relations: ["account"],
      });
      if (!user) return res.status(500).send({ success: false, accessToken: null, error: errors.USER_NOT_FOUND_MESSAGE });
      if (user.tokenVersion !== payload.tokenVersion)
        return res.status(422).send({ success: false, accessToken: null, error: "Invalid refresh token" });
      const userAccount = user.account;
      if (!userAccount) return res.status(404).send({ success: false, accessToken: null, error: errors.SOMETHING_WENT_WRONG });
      if (user.hashtagId)
        try {
          await refreshTokenForHashtagUser(user, redis);
        } catch (err) {
          return res.send({ success: false, accessToken: null, error: err.message });
        }
      const newRefreshToken = generateRefreshToken(user, payload.oauth);
      await redis.hset(user.getRedisKey() as KeyType, "refresh_token", newRefreshToken.token);
      sendCookieToken(res, newRefreshToken.token, "refresh");
    } else {
      return res.send({ success: false, accessToken: null, error: errors.SOMETHING_WENT_WRONG + ": " + err.message });
    }
  }
  if (!payload || !payload.sub || !payload.jti)
    return res.send({
      success: false,
      accessToken: null,
      error: errors.SOMETHING_WENT_WRONG + ". It is possible that the provided refresh token is invalid",
    });

  const redisUser = await redis.hgetall((redisKeys.USER + ":" + payload.sub) as KeyType);
  if (!redisUser || !redisUser.refresh_token)
    return res.status(422).send({ success: false, accessToken: null, error: errors.INVALID_REFRESH_TOKEN });

  // refreshToken is valid
  // search for user with id === payload.sub
  const user = await User.findOne(payload.sub);
  if (!user) return res.status(404).send({ success: false, accessToken: null, error: errors.USER_DOES_NOT_EXIST });
  if (user.tokenVersion !== payload.tokenVersion)
    return res.status(422).send({ success: false, accessToken: null, error: errors.INVALID_REFRESH_TOKEN });
  // if (user.hashtagId && payload.oauth === "#beach_bar")
  //   try {
  //     await refreshTokenForHashtagUser(user, redis);
  //   } catch (err) {
  //     return res.send({ success: false, accessToken: null, error: err.message });
  //   }

  // get user (new) scopes from Redis
  const scope = await redis.smembers(user.getRedisKey(true) as KeyType);
  const newAccessToken = generateAccessToken(user, scope);

  try {
    await redis.hset(user.getRedisKey() as KeyType, "access_token", newAccessToken.token);
  } catch (err) {
    return res.send({ success: false, accessToken: null, error: err.message });
  }

  sendCookieToken(res, newAccessToken.token, "access");

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
