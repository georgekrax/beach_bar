import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core/dist/plugin";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import Redis from "ioredis";
import { schema } from "./schema";

export let redis: Redis.Redis;

// export const prisma = new PrismaClient({ log: ["query", "info", "warn", "error"] });
// export const stripe: Stripe = new Stripe(
//   process.env.NODE_ENV === "production" ? process.env.STRIPE_SECRET_LIVE_KEY : process.env.STRIPE_SECRET_KEY,
//   { apiVersion: "2020-08-27", typescript: true }
// );

// prisma.$use(softDeleteFind);
// prisma.$use(softDeleteUpdate);
// prisma.$use(softDelete);
// prisma.$use(middleware);

(async (): Promise<void> => {
  // try {
  //   redis = new Redis({ password: "@George2016", db: 2, connectTimeout: 1000, reconnectOnError: (): boolean => true });

  //   redis.on("error", (err: any) => {
  //     throw new Error(err.message);
  //   });
  // } catch (err) {
  //   console.error(err);
  //   process.exit(0);
  // }

  const app = express();

  // app.use(
  //   cors({
  //     credentials: true,
  //     // origin: process.env.NODE_ENV === "production" ? String(process.env.TOKEN_AUDIENCE!) : "http://localhost:3000",
  //     origin: "http://localhost:3000",
  //   })
  // );
  // app.use(cookieParser());
  // app.use(graphqlUploadExpress());
  // app.use("/stripe", stripeRouter);
  // app.use("/oauth", oauthRouter);

  const apolloServer = new ApolloServer({
    schema: schema as any,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  });

  // await apolloServer.start();

  // apolloServer.applyMiddleware({ app, cors: false });

  app.listen({ port: 4000 }, () => {
    console.log(`🚀 Server ready at http://localhost:4000/graphql`);
  });
})();
