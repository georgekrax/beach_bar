/* eslint-disable @typescript-eslint/camelcase */
import { Redis } from "ioredis";
import fetch from "node-fetch";
import errors from "../../constants/errors";
import { User } from "../../entity/User";

export const refreshTokenForHashtagUser = async (user: User, redis: Redis): Promise<void | Error> => {
  const redisUser = await redis.hgetall(user.id.toString() as KeyType);
  if (!redisUser || !redisUser.refresh_token) {
    throw new Error(errors.INVALID_REFRESH_TOKEN);
  }
  if (
    !redisUser ||
    !redisUser.hashtag_refresh_token ||
    redisUser.hashtag_refresh_token == "" ||
    redisUser.hashtag_refresh_token === ""
  ) {
    throw new Error(errors.SOMETHING_WENT_WRONG);
  }
  const { hashtag_refresh_token: hashtagRefreshToken } = redisUser;

  const requestBody = {
    grant_type: "refresh_token",
    client_id: process.env.HASHTAG_CLIENT_ID!.toString(),
    client_secret: process.env.HASHTAG_CLIENT_SECRET!.toString(),
    refresh_token: hashtagRefreshToken,
  };

  let success = false;

  await fetch(`${process.env.HASHTAG_API_HOSTNAME}/oauth/refresh_token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  })
    .then(res => {
      return res.json();
    })
    .then(async data => {
      if (data.success && data.accessToken.token && !data.refreshToken) {
        success = true;
        await redis.hset(user.id.toString(), "hashtag_access_token", data.accessToken.token);
      } else if (data.success && data.refreshToken && !data.accessToken) {
        await redis.hset(user.id.toString(), "hashtag_refresh_token", data.refreshToken);
        const newRequestBody = { ...requestBody, refresh_token: data.refreshToken };
        fetch(`${process.env.HASHTAG_API_HOSTNAME}/oauth/refresh_token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newRequestBody),
        })
          .then(res => {
            return res.json();
          })
          .then(async data => {
            if (data && data.accessToken && !data.refreshToken) {
              success = true;
              await redis.hset(user.id.toString(), "hashtag_access_token", data.accessToken.token);
            }
          })
          .catch(err => {
            throw new Error(`${errors.SOMETHING_WENT_WRONG}: ${err.message}`);
          });
      } else {
        success = false;
      }
    })
    .catch(err => {
      success = false;
      throw new Error(`${errors.SOMETHING_WENT_WRONG}: ${err.message}`);
    });

  if (!success) {
    throw new Error(errors.SOMETHING_WENT_WRONG);
  }
};
