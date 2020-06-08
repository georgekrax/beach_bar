import { ApolloServer } from "apollo-server-express";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import Redis from "ioredis";
import { verify } from "jsonwebtoken";
import "reflect-metadata";
import { UAParser } from "ua-parser-js";
import { MyContext } from "./common/myContext";
import { googleOAuth2Client } from "./config/googleOAuth";
import { router } from "./routes/authRoutes";
import { schema } from "./schema";
import { createDBConnection } from "./utils/createDBConnection";

export let redis;

const startServer = async (): Promise<any> => {
  redis = new Redis({
    password: "george2016",
    db: 2,
  });

  redis.on("error", (err: any) => {
    console.log(err);
    process.exit(0);
  });

  const app = express();

  app.use(express.json());
  app.use(cookieParser());
  app.use("/oauth", router);

  const server = new ApolloServer({
    schema,
    context: ({ req, res }): MyContext => {
      const authHeader = req.headers.authorization || "";
      const accessToken = authHeader.split(" ")[1];

      let payload: any = null;
      if (accessToken) {
        try {
          payload = verify(accessToken, process.env.ACCESS_TOKEN_SECRET!);
        } catch (err) {
          throw new Error(err);
        }
      }

      const uaParser = new UAParser(req.headers["user-agent"]);
      return { req, res, payload, redis, uaParser, googleOAuth2Client };
    },
  });

  await createDBConnection().catch(err => {
    throw new Error(err);
  });

  server.applyMiddleware({ app });

  app.listen({ port: process.env.PORT || 4000 }, () => console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`));
};

startServer();
