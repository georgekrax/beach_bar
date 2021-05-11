import { ApolloClient, ApolloLink } from "@apollo/client";
import { GetServerSidePropsContext } from "next";
import { getAuthContext } from "../auth";
import { cache } from "./cache";
import { authMiddleware, errorLink, httpLink, ipMiddleware } from "./links";

export const createApolloClient = (ctx?: GetServerSidePropsContext) => {
  const authHeaders = ctx && ctx.req && getAuthContext({ req: ctx.req }).headers;
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: ApolloLink.from([ipMiddleware, errorLink(authHeaders), authMiddleware(authHeaders), httpLink]),
    cache,
    connectToDevTools: process.env.NODE_ENV !== "production" && process.browser,
    defaultOptions: {
      mutate: {
        errorPolicy: "all",
      },
      query: {
        errorPolicy: "all",
      },
    },
  });
};
