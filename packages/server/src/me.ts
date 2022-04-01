import { PrismaClient } from "@prisma/client";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core/dist/plugin";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import Redis from "ioredis";
import { schema } from "./schema";

// const inspector = require('inspector');
// const fs = require('fs');
// const session = new inspector.Session();
// session.connect();

// session.post('Profiler.enable', () => {
//   session.post('Profiler.start', () => {
//     // Invoke business logic under measurement here...

//     // some time later...
//     session.post('Profiler.stop', (err, { profile }) => {
//       // Write profile to disk, upload, etc.
//       if (!err) {
//         fs.writeFileSync('./profile.cpuprofile', JSON.stringify(profile));
//       }
//     });
//   });
// });

export let redis: Redis.Redis;

export const prisma = new PrismaClient({ log: ["query", "info", "warn", "error"] });
// export const stripe: Stripe = new Stripe(
//   process.env.NODE_ENV === "production" ? process.env.STRIPE_SECRET_LIVE_KEY : process.env.STRIPE_SECRET_KEY,
//   { apiVersion: "2020-08-27", typescript: true }
// );

// prisma.$use(softDeleteFind);
// prisma.$use(softDeleteUpdate);
// prisma.$use(softDelete);
// prisma.$use(middleware);

(async (): Promise<void> => {
  try {
    redis = new Redis({ password: "@George2016", db: 2, connectTimeout: 1000, reconnectOnError: (): boolean => true });

    redis.on("error", (err: any) => {
      throw new Error(err.message);
    });
  } catch (err) {
    console.error(err);
    process.exit(0);
  }

  const app = express();

  // app.use(
  //   cors({
  //     credentials: true,
  //     // origin: process.env.NODE_ENV === "production" ? String(process.env.TOKEN_AUDIENCE!) : "http://localhost:3000",
  //     origin: "http://localhost:3000",
  //   })
  // );
  // // Stripe webhooks routes have to use the "express.raw()", in order to work
  // app.use((req, res, next) => {
  //   if (req.originalUrl.includes(process.env.STRIPE_WEBHOOK_ORIGIN_URL)) {
  //     express.raw({ type: "application/json" })(req, res, next);
  //   } else express.json()(req, res, next);
  // });
  // app.use(cookieParser());
  // app.use(graphqlUploadExpress());
  // app.use("/stripe", stripeRouter);
  // app.use("/oauth", oauthRouter);

  // sgClient.setApiKey(process.env.SENDGRID_API_KEY);
  // sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const apolloServer = new ApolloServer({
    schema: schema as any,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    // formatError: (err): ApolloError | GraphQLError => {
    //   if (err.message.includes("Context creation failed: ")) {
    //     return new ApolloError(errors.NOT_AUTHENTICATED_MESSAGE, errors.JWT_EXPIRED, { messageCode: errors.NOT_AUTHENTICATED_CODE });
    //   }
    //   return err;
    // },
  });

  // await apolloServer.start();

  // apolloServer.applyMiddleware({ app, cors: false });

  // app.listen({ port: +process.env.PORT! || 4000 }, () => {
  //   console.log(`🚀 Server ready at http://localhost:4000${apolloServer.graphqlPath}`);
  // });
  // await new Promise<void>(resolve => httpServer.listen({ port: 4000 }, resolve));
  // console.log(`🚀 Server ready at http://localhost:4000/graphql`);
  app.listen({ port: +process.env.PORT! || 4000 }, () => {
    console.log(`🚀 Server ready at http://localhost:4000/graphql`);
  });
})();
