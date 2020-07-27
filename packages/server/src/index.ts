import { errors, MyContext } from "@beach_bar/common";
import sgClient from "@sendgrid/client";
import sgMail from "@sendgrid/mail";
import { execute, makePromise } from "apollo-link";
import { ApolloServer } from "apollo-server-express";
import cookieParser from "cookie-parser";
import express from "express";
import Redis from "ioredis";
import { verify } from "jsonwebtoken";
import path from "path";
import "reflect-metadata";
import { Stripe } from "stripe";
import { UAParser } from "ua-parser-js";
import { link } from "./config/apolloLink";
import { googleOAuth2Client } from "./config/googleOAuth";
import redisKeys from "@constants/redisKeys";
import verifyAccessTokenQuery from "./graphql/VERIFY_ACCESS_TOKEN";
import { router as oauthRouter } from "./routes/authRoutes";
import { router as stripeRouter } from "./routes/stripeWebhooks";
import { schema } from "./schema";
import { User } from "@entity/User";
import { createDBConnection } from "@utils/createDBConnection";

export let redis;
export let stripe: Stripe;

(async (): Promise<any> => {
  try {
    redis = new Redis({
      password: "george2016",
      db: 2,
      connectTimeout: 10000,
      reconnectOnError: (): boolean => true,
    });

    redis.on("error", (err: any) => {
      throw new Error(err.message);
    });

    await createDBConnection();

    // await mongoose.connect(process.env.MONGO_DB_URL!.toString(), {
    //   useCreateIndex: true,
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    //   auth: { user: process.env.MONGO_DB_USERNAME!.toString(), password: process.env.MONGO_DB_PASSWORD!.toString() },
    //   dbName: process.env.MONGO_DB_NAME!.toString(),
    // });
    // const mongoDb = mongoose.connection;
    // mongoDb.on("error", (err: any) => {
    //   throw new Error(err.message);
    // });
  } catch (err) {
    console.log(err);
    process.exit(0);
  }

  const app = express();

  stripe = new Stripe(
    process.env.NODE_ENV === "production" ? process.env.STRIPE_SECRET_LIVE_KEY!.toString() : process.env.STRIPE_SECRET_KEY!.toString(),
    { apiVersion: "2020-03-02", typescript: true }
  );

  // Stripe webhooks routes have to use the "express.raw()", in order to work
  app.use((req, res, next) => {
    if (req.originalUrl.includes(process.env.STRIPE_WEBHOOK_ORIGIN_URL!.toString())) {
      express.raw({ type: "application/json" })(req, res, next);
    } else {
      express.json()(req, res, next);
    }
  });
  app.use("/images", express.static(path.join(__dirname, "../images")));
  app.use(cookieParser());
  app.use("/stripe", stripeRouter);
  app.use("/oauth", oauthRouter);

  sgClient.setApiKey(process.env.SENDGRID_API_KEY!.toString());
  sgMail.setApiKey(process.env.SENDGRID_API_KEY!.toString());
  const server = new ApolloServer({
    tracing: !(process.env.NODE_ENV === "production"),
    engine: {
      reportSchema: true,
      graphVariant: "current",
    },
    schema,
    uploads: true,
    formatError: (err): any => {
      if (
        err.message == "Context creation failed: jwt expired" ||
        err.message == "Context creation failed: Something went wrong. jwt expired"
      ) {
        return new Error(errors.JWT_EXPIRED);
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
          if (payload && payload.sub && payload.sub.trim().length !== 0) {
            const redisUser = await redis.hgetall(`${redisKeys.USER}:${payload.sub.toString()}`);
            if (!redisUser) {
              payload = null;
            }
          } else if (payload.sub.trim().length >= 0) {
            payload = null;
          }
        } catch (err) {
          if (err.message.toString() === "jwt expired") {
            throw new Error(errors.JWT_EXPIRED);
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
      // @ts-ignore
      const ipAddr: string | undefined = req.ipAddr;
      return { req, res, payload, redis, sgMail, sgClient, stripe, uaParser, googleOAuth2Client, ipAddr };
    },
  });
  server.applyMiddleware({ app, cors: true });

  app.listen({ port: parseInt(process.env.PORT!) || 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
})();
