import { generateAccessToken, generateRefreshToken, refreshHashtagToken, sendCookieToken } from "@/utils/auth";
import { getRedisKey } from "@/utils/db";
import { errors } from "@beach_bar/common";
import { Request, Response, Router } from "express";
import { decode, verify } from "jsonwebtoken";
import { URL } from "url";
import { prisma, redis } from "..";

const getUnsuccessfulRes = (msg?: string) => ({
  ok: false,
  accessToken: null,
  error: msg,
});

const getTokenRes = ({ token, exp }: { token: string; exp: number }) => ({
  type: "Bearer",
  token,
  expirationDate: exp,
  expiresIn: exp - Date.now(),
});

export const router = Router();

router.get("/google/callback", async (req: Request, res: Response) => {
  const qs = new URL(req.url, process.env.HOSTNAME_WITH_HTTP).searchParams;
  const code = qs.get("code");
  const state = qs.get("state");
  return res.send(`<h2>Redirected from Google</h2><p>Code: ${code}</p><br><p>State: ${state}</p>`);
});

router.get("/facebook/callback", async (req: Request, res: Response) => {
  const qs = new URL(req.url, process.env.HOSTNAME_WITH_HTTP).searchParams;
  const code = qs.get("code");
  const state = qs.get("state");
  res.send(`<h2>Redirected from Facebook</h2><p>Code: ${code}</p><br><p>State: ${state}</p>`);
});

router.get("/instagram/callback", async (req: Request, res: Response) => {
  const qs = new URL(req.url, process.env.HOSTNAME_WITH_HTTP).searchParams;
  const code = qs.get("code");
  const state = qs.get("state");
  res.send(`<h2>Redirected from Instagram</h2><p>Code: ${code}</p><br><p>State: ${state}</p>`);
});

router.post("/refresh_token", async (req: Request, res: Response) => {
  const refreshToken = req.cookies[process.env.REFRESH_TOKEN_COOKIE_NAME] || req.headers["x-refetch-token"];
  if (!refreshToken) return res.status(422).send(getUnsuccessfulRes("A refresh token should be provided in a cookie"));

  let payload: any = null;
  try {
    payload = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, { issuer: process.env.TOKEN_ISSUER });
  } catch (err) {
    if (err.name === "TokenExpiredError" || err.message === "jwt expired") {
      const decodedRefreshTokenPayload = decode(refreshToken);
      if (!decodedRefreshTokenPayload) return res.status(500).send(getUnsuccessfulRes(errors.JWT_EXPIRED));
      const user = await prisma.user.findUnique({
        where: { id: +decodedRefreshTokenPayload.sub! },
        include: { account: true },
      });
      if (!user) return res.status(500).send(getUnsuccessfulRes(errors.USER_NOT_FOUND_MESSAGE));
      if (user.tokenVersion !== payload.tokenVersion) {
        return res.status(422).send(getUnsuccessfulRes("Invalid refresh token"));
      }
      if (!user.account) return res.status(404).send(getUnsuccessfulRes(errors.SOMETHING_WENT_WRONG));
      if (user.hashtagId) {
        try {
          await refreshHashtagToken(user);
        } catch (err) {
          return res.send(getUnsuccessfulRes(err.message));
        }
      }
      const newRefreshToken = generateRefreshToken(user, payload.oauth);
      await redis.hset(getRedisKey({ model: "User", id: user.id }), "refresh_token", newRefreshToken.token);
      sendCookieToken(res, newRefreshToken.token, "refresh");
      return res.send({
        ok: true,
        error: null,
        refreshToken: getTokenRes(newRefreshToken),
      });
    } else {
      return res.send(getUnsuccessfulRes(errors.SOMETHING_WENT_WRONG + ": " + err.message));
    }
  }
  if (!payload || !payload.sub || !payload.jti) {
    return res.send(getUnsuccessfulRes(errors.SOMETHING_WENT_WRONG + ". It is possible that the provided refresh token is invalid"));
  }

  const redisUser = await redis.hgetall(getRedisKey({ model: "User", id: +payload.sub }));
  if (!redisUser || !redisUser.refresh_token) {
    return res.status(422).send(getUnsuccessfulRes(errors.INVALID_REFRESH_TOKEN));
  }

  // refreshToken is valid
  // search for user with id === payload.sub
  const user = await prisma.user.findUnique({ where: { id: +payload.sub } });
  if (!user) return res.status(404).send(getUnsuccessfulRes(errors.USER_DOES_NOT_EXIST));
  if (user.tokenVersion !== payload.tokenVersion) {
    return res.status(422).send(getUnsuccessfulRes(errors.INVALID_REFRESH_TOKEN));
  }
  if (user.hashtagId && payload.oauth === "#beach_bar") {
    try {
      await refreshHashtagToken(user);
    } catch (err) {
      return res.send(getUnsuccessfulRes(err.message));
    }
  }

  // get user (new) scopes from Redis
  const scope = await redis.smembers(getRedisKey({ model: "User", id: user.id, scope: true }));
  const newAccessToken = await generateAccessToken(user, scope);

  try {
    await redis.hset(getRedisKey({ model: "User", id: user.id }), "access_token", newAccessToken.token);
  } catch (err) {
    return res.send(getUnsuccessfulRes(err.message));
  }

  sendCookieToken(res, newAccessToken.token, "access");

  // send back a new accessToken
  return res.send({
    ok: true,
    error: null,
    accessToken: getTokenRes(newAccessToken),
  });
});
