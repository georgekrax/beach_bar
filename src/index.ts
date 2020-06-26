/* eslint-disable @typescript-eslint/camelcase */
import * as sgClient from "@sendgrid/client";
import * as sgMail from "@sendgrid/mail";
import { execute, makePromise } from "apollo-link";
import { ApolloServer } from "apollo-server-express";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import Redis from "ioredis";
import { verify } from "jsonwebtoken";
import "reflect-metadata";
import Stripe from "stripe";
import { UAParser } from "ua-parser-js";
import { MyContext } from "./common/myContext";
import { link } from "./config/apolloLink";
import { googleOAuth2Client } from "./config/googleOAuth";
import { User } from "./entity/User";
import verifyAccessTokenQuery from "./graphql/VERIFY_ACCESS_TOKEN";
import { router } from "./routes/authRoutes";
import { schema } from "./schema";
import { createDBConnection } from "./utils/createDBConnection";

export let redis;

const startServer = async (): Promise<any> => {
  redis = new Redis({
    password: "george2016",
    db: 2,
    connectTimeout: 10000,
    reconnectOnError: (): boolean => true,
  });

  redis.on("error", (err: any) => {
    console.log(err);
    process.exit(0);
  });

  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use("/oauth", router);

  sgClient.setApiKey(process.env.SENDGRID_API_KEY!.toString());
  sgMail.setApiKey(process.env.SENDGRID_API_KEY!.toString());

  // sgClient
  //   .request({
  //     method: "POST",
  //     url: "v3/asm/suppressions/global",
  //     headers: {
  //       "Content-Type": "application/json",
  //       authorization: `Bearer ${process.env.SENDGRID_API_KEY!.toString()}`,
  //     },
  //     body: { recipient_emails: ["me@example.com"] },
  //   })
  //   .then(([res, body]) => {
  //     console.log(body);
  //   });

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!.toString(), { apiVersion: "2020-03-02", typescript: true });

  const server = new ApolloServer({
    schema,
    formatError: (err): any => {
      if (
        err.message == "Context creation failed: jwt expired" ||
        err.message == "Context creation failed: Something went wrong. jwt expired"
      ) {
        return new Error("jwt expired");
      } else if (err.message.startsWith("Context creation failed: ")) {
        return new Error(err.message.replace("Context creation failed: ", ""));
      } else if (err.message.startsWith("Something went wrong. ")) {
        return new Error(err.message.replace("Something went wrong. ", ""));
      }
      return err;
    },
    context: async ({ req, res }): Promise<MyContext> => {
      const authHeader = req.headers.authorization || "";
      const accessToken = authHeader.split(" ")[1];

      let payload: any = null;
      if (accessToken) {
        try {
          payload = verify(accessToken, process.env.ACCESS_TOKEN_SECRET!, { issuer: process.env.TOKEN_ISSUER!.toString() });
          if (payload && payload.sub && (payload.sub !== "" || " ")) {
            const redisUser = await redis.hgetall(payload.sub.toString());
            if (!redisUser) {
              payload = null;
            }
          } else if (payload.sub === "" || payload.sub === " ") {
            payload = null;
          }
        } catch (err) {
          if (err.message.toString() === "jwt expired") {
            throw new Error("jwt expired");
          }
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
              throw new Error(errorMessage.toString());
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
      }

      if (payload && payload.sub) {
        payload.sub = parseInt(payload.sub);
      }

      const uaParser = new UAParser(req.headers["user-agent"]);
      return { req, res, payload, redis, sgMail, sgClient, stripe, uaParser, googleOAuth2Client };
    },
  });

  await createDBConnection().catch(err => {
    throw new Error(err);
  });

  server.applyMiddleware({ app });

  app.listen({ port: parseInt(process.env.PORT!) || 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`),
  );
};

startServer();
