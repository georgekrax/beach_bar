import "reflect-metadata";
import Redis from "ioredis";
import * as express from "express";
import { verify } from "jsonwebtoken";
import { ApolloServer } from "apollo-server-express";

import "./config/passport";
import { schema } from "./schema";
import { router } from "./routes/authRoutes";
import { MyContext } from "./common/myContext";
import { createDBConnection } from "./utils/createDBConnection";

const startServer = async (): Promise<any> => {
  const redis = new Redis({
    password: "george2016",
  });

  const app = express();

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
      return { req, res, payload, redis };
    },
  });

  await createDBConnection();

  server.applyMiddleware({ app });

  app.listen({ port: process.env.PORT || 4000 }, () => console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`));
};

startServer();
