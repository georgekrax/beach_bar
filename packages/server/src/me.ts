import verifyAccessTokenQuery from "@/graphql/VERIFY_ACCESS_TOKEN";
import { getRedisKey, middleware, softDelete, softDeleteFind, softDeleteUpdate } from "@/utils/db";
import { errors, verifyJwt } from "@beach_bar/common";
import { PrismaClient } from "@prisma/client";
import sgClient from "@sendgrid/client";
import sgMail from "@sendgrid/mail";
import { execute, makePromise } from "apollo-link";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { ApolloError, ApolloServer } from "apollo-server-express";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { GraphQLError } from "graphql";
import { graphqlUploadExpress } from "graphql-upload";
import Redis from "ioredis";
import "reflect-metadata";
import { Stripe } from "stripe";
import { MyContext } from "typings";
import { UAParser } from "ua-parser-js";
import { link } from "./config/apolloLink";
import { googleOAuth2Client } from "./config/googleOAuth";
import { router as oauthRouter } from "./routes/auth";
import { router as stripeRouter } from "./routes/stripeWebhooks";
import { schema } from "./schema";

export let redis: Redis.Redis;

export const prisma = new PrismaClient({ log: ["query", "info", "warn", "error"] });
export const stripe: Stripe = new Stripe(
  process.env.NODE_ENV === "production" ? process.env.STRIPE_SECRET_LIVE_KEY : process.env.STRIPE_SECRET_KEY,
  { apiVersion: "2020-08-27", typescript: true }
);

prisma.$use(softDeleteFind);
prisma.$use(softDeleteUpdate);
prisma.$use(softDelete);
prisma.$use(middleware);

(async (): Promise<void> => {
  try {
    redis = new Redis({
      password: "@George2016",
      db: 2,
      connectTimeout: 1000,
      reconnectOnError: (): boolean => true,
    });

    redis.on("error", (err: any) => {
      throw new Error(err.message);
    });
  } catch (err) {
    console.error(err);
    process.exit(0);
  }

  const app = express();

  // stripe = new Stripe(
  //   process.env.NODE_ENV === "production" ? process.env.STRIPE_SECRET_LIVE_KEY : process.env.STRIPE_SECRET_KEY,
  //   { apiVersion: "2020-08-27", typescript: true }
  // );

  app.use(
    cors({
      credentials: true,
      // origin: process.env.NODE_ENV === "production" ? String(process.env.TOKEN_AUDIENCE!) : "http://localhost:3000",
      origin: "http://localhost:3000",
    })
  );
  // Stripe webhooks routes have to use the "express.raw()", in order to work
  app.use((req, res, next) => {
    if (req.originalUrl.includes(process.env.STRIPE_WEBHOOK_ORIGIN_URL)) {
      express.raw({ type: "application/json" })(req, res, next);
    } else express.json()(req, res, next);
  });
  app.use(cookieParser());
  app.use(graphqlUploadExpress());
  app.use("/stripe", stripeRouter);
  app.use("/oauth", oauthRouter);

  sgClient.setApiKey(process.env.SENDGRID_API_KEY);
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  // const notIsProd = !(process.env.NODE_ENV === "production");

  const apolloServer = new ApolloServer({
    // tracing: notIsProd,
    schema: schema as any,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    formatError: (err): ApolloError | GraphQLError => {
      if (err.message.includes("Context creation failed: ")) {
        return new ApolloError(errors.NOT_AUTHENTICATED_MESSAGE, errors.JWT_EXPIRED, { messageCode: errors.NOT_AUTHENTICATED_CODE });
      }
      return err;
    },
    context: async ({ req, res }): Promise<MyContext> => {
      const authHeader = req.headers.authorization || "";
      const cookie = req.cookies[process.env.JWT_COOKIE_NAME];

      let accessToken: string | null = null;
      try {
        if (authHeader) accessToken = authHeader.split(" ")[1];
        else if (cookie) accessToken = ((await verifyJwt(cookie, process.env.JWT_SECRET)).payload?.accessToken as string) || null;
      } catch {
        // ! Leave space here
      }

      let payload: any = null;
      if (accessToken) {
        try {
          payload = (await verifyJwt(accessToken, process.env.ACCESS_TOKEN_SECRET)).payload;
          // payload = verify(accessToken, process.env.ACCESS_TOKEN_SECRET!, { issuer: process.env.TOKEN_ISSUER });
          if (payload?.sub && payload.sub.toString().trim().length !== 0) {
            const redisUser = await redis.hgetall(getRedisKey({ model: "User", id: payload.sub }));
            if (!redisUser) payload = null;
          } else if (payload.sub.toString().trim().length >= 0) payload = null;
        } catch (err) {
          if (err.message.toString() === "jwt expired") {
            // throw new ApolloError(errors.NOT_AUTHENTICATED_MESSAGE, errors.JWT_EXPIRED);
            // const refreshToken = req.cookies[process.env.REFETCH_TOKEN_COOKIE_NAME] || req.headers["x-refetch-token"];
            // console.log(refreshToken);
            // if (!refreshToken) throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.JWT_EXPIRED);
            // let refreshPayload: any = null;
            // refreshPayload = verify(refreshToken as string, process.env.REFRESH_TOKEN_SECRET!, {
            //   issuer: process.env.TOKEN_ISSUER,
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
            //       issuer: process.env.TOKEN_ISSUER,
            //     });
            //     console.log(payload);
          }
          // await fetch("http://localhost:4000/oauth/refresh_token", {
          //   method: "POST",
          //   headers: {
          //     Cookie: process.env.REFRESH_TOKEN_COOKIE_NAME + "=" + refreshToken.accessToken.token,
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
            const verifyAccessTokenOperation = { query: verifyAccessTokenQuery, variables: { token: accessToken } };

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
              hashtagAud !== process.env.HASHTAG_CLIENT_ID ||
              hashtagIss !== process.env.HASHTAG_TOKEN_ISSUER
            ) {
              throw new ApolloError(errorMessage.toString(), errorCode.toString());
            } else if (hashtagSub && (hashtagSub !== "" || " ")) {
              const user = await prisma.user.findFirst({ where: { hashtagId: hashtagSub } });
              if (!user) payload = null;
              else {
                payload = {
                  scope: hashtagScope,
                  iat: hashtagIat,
                  exp: hashtagExp,
                  aud: hashtagAud,
                  iss: hashtagIss,
                  jti: hashtagJti,
                  sub: user?.id.toString(),
                };
              }
            }
          } else payload = null;
        }
      } else if (!accessToken && req.cookies[process.env.REFRESH_TOKEN_COOKIE_NAME]) {
        throw new ApolloError(errors.NOT_AUTHENTICATED_MESSAGE, errors.JWT_EXPIRED);
      }

      if (payload?.sub) payload.sub = +payload.sub;
      const uaParser = new UAParser(req.headers["user-agent"]);

      type IpAddrType = string | undefined;
      const ipAddr: IpAddrType = (req.headers.ip_address as IpAddrType) || undefined;
      return { req, res, payload, prisma, redis, sgMail, sgClient, stripe, uaParser, googleOAuth2Client, ipAddr };
    },
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
    cors: false,
    // cors: {
    //   credentials: true,
    //   // origin: "https://studio.apollographql.com",
    //   origin: "http://localhost:3000",
    // },
  });

  // https
  //   .createServer({ key: fs.readFileSync("server.key"), cert: fs.readFileSync("server.crt") }, app)
  //   .listen(+process.env.PORT! || 4000, () => {
  //     console.log(`🚀 Server ready at http://localhost:4000${apolloServer.graphqlPath}`);
  //   });
  app.listen({ port: +process.env.PORT! || 4000 }, () => {
    console.log(`🚀 Server ready at http://localhost:4000${apolloServer.graphqlPath}`);
  });
})();
