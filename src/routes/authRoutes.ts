import * as express from "express";
import * as passport from "passport";
import { verify } from "jsonwebtoken";

import { redis } from "../index";
import { User } from "../entity/User";
import { generateAccessToken, generateRefreshToken } from "../utils/auth/generateAuthTokens";
import { sendRefreshToken } from "../utils/auth/sendRefreshToken";

export const router = express.Router();

router.get("/google", passport.authenticate("google", { scope: ["profile"], session: false }), res => {
  // handle with passport
  console.log(res.url);
});

router.get("/google/callback", passport.authenticate("google", { session: false }), (_, res) => {
  res.send("you reached the redirect URI");
});

router.post("/refresh_token", async (req, res) => {
  const refreshToken = req.cookies.jid;
  if (!refreshToken) {
    return res.send({
      success: false,
      accessToken: null,
      error: "A refresh token should be provided in a cookie",
    });
  }

  let payload: any = null;
  try {
    payload = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, {
      issuer: "www.beach_bar.com",
    });
  } catch (err) {
    res.send({
      success: false,
      accessToken: null,
      error: err.message,
    });
  }

  if (payload.jti === null) {
    return res.send({
      success: false,
      accessToken: null,
      error: "Something went wrong. It is possible that the provided refresh token is invalid",
    });
  }

  const tokenId = `${payload.iat}-${payload.jti}`;

  const redisToken = await redis.get(tokenId);

  if (!redisToken) {
    return res.send({
      success: false,
      accessToken: null,
      error: "Invalid refresh token",
    });
  }

  // refreshToken is valid
  //search for user with id === payload.userId
  const user = await User.findOne({ where: { id: payload.userId }, select: ["id", "tokenVersion"] });

  if (!user) {
    return res.send({
      success: false,
      accessToken: null,
      error: "Something went wrong",
    });
  }

  try {
    if (user.tokenVersion !== payload.tokenVersion) {
      return res.send({
        success: false,
        accessToken: null,
        error: "Invalid refresh token",
      });
    }
  } catch (err) {
    throw new Error(err);
  }

  // send back a new accessToken & a new refreshToken
  sendRefreshToken(res, generateRefreshToken(user).token);
  return res.send({
    success: true,
    accessToken: generateAccessToken(user).token,
    error: null,
  });
});
