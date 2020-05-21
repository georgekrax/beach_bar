import "reflect-metadata";
import Redis from "ioredis";
import * as express from "express";
import { verify } from "jsonwebtoken";
import * as cookieParser from "cookie-parser";
import { ApolloServer } from "apollo-server-express";
import { UAParser } from "ua-parser-js";

import "./config/passport";
import { schema } from "./schema";
import { router } from "./routes/authRoutes";
import { MyContext } from "./common/myContext";
import { createDBConnection } from "./utils/createDBConnection";

export let redis;

const startServer = async (): Promise<any> => {
  redis = new Redis({
    password: "george2016",
  });

  const app = express();

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
      return { req, res, payload, redis, uaParser };
    },
  });

  await createDBConnection();

  server.applyMiddleware({ app });

  app.listen({ port: process.env.PORT || 4000 }, () => console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`));
};

startServer();
