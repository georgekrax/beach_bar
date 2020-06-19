/* eslint-disable @typescript-eslint/camelcase */
import { Response } from "express";
import { Redis } from "ioredis";
import fetch from "node-fetch";
import { User } from "../../entity/User";

export const refreshTokenForHashtagUser = async (res: Response, user: User, redis: Redis): Promise<void | Response> => {
  const redisUser = await redis.hgetall(user.id.toString() as KeyType);
  if (!redisUser || !redisUser.refresh_token) {
    return res.status(422).send({
      success: false,
      accessToken: null,
      error: "Invalid refresh token",
    });
  }
  if (
    !redisUser ||
    !redisUser.hashtag_refresh_token ||
    redisUser.hashtag_refresh_token == "" ||
    redisUser.hashtag_refresh_token === ""
  ) {
    return res.status(404).send({
      success: false,
      accessToken: null,
      error: "Something went wrong",
    });
  }
  const { hashtag_refresh_token: hashtagRefreshToken } = redisUser;

  const requestBody = {
    grant_type: "refresh_token",
    client_id: process.env.HASHTAG_CLIENT_ID!.toString(),
    client_secret: process.env.HASHTAG_CLIENT_SECRET!.toString(),
    refresh_token: hashtagRefreshToken,
  };
  let requestStatus: number | undefined = undefined,
    success = false;

  await fetch(`${process.env.HASHTAG_HOSTNAME}/oauth/refresh_token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  })
    .then(res => {
      requestStatus = res.status;
      return res.json();
    })
    .then(async data => {
      if (data.success && data.accessToken.token && !data.refreshToken) {
        success = true;
        await redis.hset(user.id.toString(), "hashtag_access_token", data.accessToken.token);
      } else if (data.success && data.refreshToken && !data.accessToken) {
        await redis.hset(user.id.toString(), "hashtag_refresh_token", data.refreshToken);
        const newRequestBody = { ...requestBody, refresh_token: data.refreshToken };
        fetch(`${process.env.HASHTAG_HOSTNAME}/oauth/refresh_token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newRequestBody),
        })
          .then(res => {
            requestStatus = res.status;
            return res.json();
          })
          .then(async data => {
            if (data && data.accessToken && !data.refreshToken) {
              success = true;
              await redis.hset(user.id.toString(), "hashtag_access_token", data.accessToken.token);
            }
          })
          .catch(err => {
            return res.status(requestStatus as number).send({
              success: false,
              accessToken: null,
              error: `Something went wrong. ${err.message.toString()}`,
            });
          });
      } else {
        success = false;
      }
    })
    .catch(err => {
      success = false;
      if (requestStatus) {
        return res.status(requestStatus).send({
          success: false,
          accessToken: null,
          error: `Something went wrong. ${err.message.toString()}`,
        });
      } else {
        return res.send({
          success: false,
          accessToken: null,
          error: `Something went wrong. ${err.message.toString()}`,
        });
      }
    });

  if (!success) {
    return res.status(500).send({
      success: false,
      accessToken: null,
      error: "Something went wrong",
    });
  }
};
