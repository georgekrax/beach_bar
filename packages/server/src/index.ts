import { errors, MyContext } from "@beach_bar/common";
import sgClient from "@sendgrid/client";
import sgMail from "@sendgrid/mail";
import { execute, makePromise } from "apollo-link";
import { ApolloError, ApolloServer } from "apollo-server-express";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import Redis from "ioredis";
import { verify } from "jsonwebtoken";
import "reflect-metadata";
import { Stripe } from "stripe";
import { UAParser } from "ua-parser-js";
import { createDBConnection } from "utils/createDBConnection";
import { link } from "./config/apolloLink";
import { googleOAuth2Client } from "./config/googleOAuth";
import redisKeys from "./constants/redisKeys";
import { User } from "./entity/User";
import verifyAccessTokenQuery from "./graphql/VERIFY_ACCESS_TOKEN";
import { router as oauthRouter } from "./routes/authRoutes";
import { router as stripeRouter } from "./routes/stripeWebhooks";
import { schema } from "./schema";

export let redis;
export let stripe: Stripe;

(async (): Promise<any> => {
  try {
    redis = new Redis({
      password: "@George2016",
      db: 2,
      connectTimeout: 10000,
      reconnectOnError: (): boolean => true,
    });

    redis.on("error", (err: any) => {
      throw new Error(err.message);
    });

    await createDBConnection();
  } catch (err) {
    console.error(err);
    process.exit(0);
  }

  const app = express();

  stripe = new Stripe(
    process.env.NODE_ENV === "production" ? process.env.STRIPE_SECRET_LIVE_KEY!.toString() : process.env.STRIPE_SECRET_KEY!.toString(),
    { apiVersion: "2020-08-27", typescript: true }
  );

  // Stripe webhooks routes have to use the "express.raw()", in order to work
  app.use(
    cors({
      credentials: true,
      // origin: process.env.NODE_ENV === "production" ? String(process.env.TOKEN_AUDIENCE!) : "http://192.168.1.8:3000",
      origin: "http://192.168.1.8:3000",
    })
  );
  app.use((req, res, next) => {
    if (req.originalUrl.includes(process.env.STRIPE_WEBHOOK_ORIGIN_URL!.toString()))
      express.raw({ type: "application/json" })(req, res, next);
    else express.json()(req, res, next);
  });
  app.use(cookieParser());
  app.use("/stripe", stripeRouter);
  app.use("/oauth", oauthRouter);

  sgClient.setApiKey(process.env.SENDGRID_API_KEY!.toString());
  sgMail.setApiKey(process.env.SENDGRID_API_KEY!.toString());

  const notIsProd = !(process.env.NODE_ENV === "production");
  const apolloServer = new ApolloServer({
    // tracing: notIsProd,
    playground: notIsProd,
    // engine: {
    //   reportSchema: true,
    //   graphVariant: "current",
    // },
    schema,
    uploads: true,
    formatError: (err): any => {
      if (err.message.includes("Context creation failed: "))
        return new ApolloError(errors.NOT_AUTHENTICATED_MESSAGE, errors.JWT_EXPIRED, { messageCode: errors.NOT_AUTHENTICATED_CODE });
      return err;
    },
    context: async ({ req, res }): Promise<MyContext> => {
      const authHeader = req.headers.authorization || "";
      const cookie = req.cookies[process.env.ACCESS_TOKEN_COOKIE_NAME!.toString()];
      const accessToken = authHeader ? authHeader.split(" ")[1] : cookie;

      let payload: any = null;
      if (accessToken) {
        try {
          payload = verify(accessToken, process.env.ACCESS_TOKEN_SECRET!, { issuer: process.env.TOKEN_ISSUER!.toString() });
          if (payload && payload.sub && payload.sub.trim().length !== 0) {
            const redisUser = await redis.hgetall(`${redisKeys.USER}:${payload.sub.toString()}`);
            if (!redisUser) payload = null;
          } else if (payload.sub.trim().length >= 0) payload = null;
        } catch (err) {
          if (err.message.toString() === "jwt expired") {
            throw new ApolloError(errors.NOT_AUTHENTICATED_MESSAGE, errors.JWT_EXPIRED);
            // const refreshToken = req.cookies[process.env.REFETCH_TOKEN_COOKIE_NAME!.toString()] || req.headers["x-refetch-token"];
            // console.log(refreshToken);

            // if (!refreshToken) throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.JWT_EXPIRED);

            // let refreshPayload: any = null;
            // refreshPayload = verify(refreshToken as string, process.env.REFRESH_TOKEN_SECRET!, {
            //   issuer: process.env.TOKEN_ISSUER!.toString(),
            // });
            // const user = await User.findOne(refreshPayload.sub);
            // if (user) {
            //   // get user (new) scopes from Redis
            //   const scope = await redis.smembers(user.getRedisKey(true) as KeyType);

            //   const newAccessToken = generateAccessToken(user, scope);
            //   console.log(newAccessToken);

            //   await redis.hset(user.getRedisKey() as KeyType, "access_token", newAccessToken.token);

            //   sendCookieToken(res, newAccessToken.token, "access");
            //   res.cookie("hey", newAccessToken.token, {
            //     httpOnly: true,
            //   })

            //     payload = verify(newAccessToken.token, process.env.ACCESS_TOKEN_SECRET!, {
            //       issuer: process.env.TOKEN_ISSUER!.toString(),
            //     });
            //     console.log(payload);
          }
          // await fetch("http://192.168.1.8:4000/oauth/refresh_token", {
          //   method: "POST",
          //   headers: {
          //     Cookie: process.env.REFRESH_TOKEN_COOKIE_NAME!.toString() + "=" + refreshToken.accessToken.token,
          //   },
          // })
          //   .then(res => res.json())
          //   .then(data => {
          //     console.log(data);
          //     console.log("HEY");
          //   })
          //   .catch(err => console.error(err));
          // check with the 'verifyAccessToken' query
          if (err.message.toString() === "invalid signature") {
            const verifyAccessTokenOperation = {
              query: verifyAccessTokenQuery,
              variables: {
                token: accessToken,
              },
            };

            let hashtagSub,
              hashtagAud,
              hashtagIss,
              hashtagScope: string[] | any,
              hashtagIat,
              hashtagExp,
              hashtagJti,
              errorCode,
              errorMessage;

            await makePromise(execute(link, verifyAccessTokenOperation))
              .then(res => res.data?.verifyAccessToken)
              .then(data => {
                if (data.error) {
                  errorCode = data.error.code;
                  errorMessage = data.error.message;
                }
                hashtagSub = data.sub;
                hashtagAud = data.aud;
                hashtagIss = data.iss;
                hashtagScope = data.scope;
                hashtagIat = data.iat;
                hashtagExp = data.exp;
                hashtagJti = data.jti;
              })
              .catch(err => {
                throw new Error(`Something went wrong. ${err}`);
              });

            if (
              errorCode ||
              errorMessage ||
              hashtagAud !== process.env.HASHTAG_CLIENT_ID!.toString() ||
              hashtagIss !== process.env.HASHTAG_TOKEN_ISSUER!.toString()
            ) {
              throw new ApolloError(errorMessage.toString(), errorCode.toString());
            } else if (hashtagSub && (hashtagSub !== "" || " ")) {
              const user = await User.findOne({ where: { hashtagId: hashtagSub } });
              if (!user) {
                payload = null;
              } else {
                payload = {
                  scope: hashtagScope,
                  sub: user?.id.toString(),
                  iat: hashtagIat,
                  exp: hashtagExp,
                  aud: hashtagAud,
                  iss: hashtagIss,
                  jti: hashtagJti,
                };
              }
            }
          } else {
            payload = null;
          }
        }
      } else if (!accessToken && req.cookies[process.env.REFRESH_TOKEN_COOKIE_NAME!.toString()])
        throw new ApolloError(errors.NOT_AUTHENTICATED_MESSAGE, errors.JWT_EXPIRED);
      if (payload && payload.sub) payload.sub = parseInt(payload.sub);
      const uaParser = new UAParser(req.headers["user-agent"]);

      type IpAddrType = string | undefined;
      const ipAddr: IpAddrType = (req.headers.ip_address as IpAddrType) || undefined;
      return { req, res, payload, redis, sgMail, sgClient, stripe, uaParser, googleOAuth2Client, ipAddr };
    },
  });

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen({ port: parseInt(process.env.PORT!) || 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${apolloServer.graphqlPath}`)
  );
})();
