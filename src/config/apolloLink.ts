import { ApolloClient, InMemoryCache } from "apollo-boost";
import { HttpLink } from "apollo-link-http";
import fetch from "node-fetch";

export const link: any = new HttpLink({
  uri: "http://127.0.0.1:5000/graphql",
  fetch: fetch as any,
  credentials: "include",
});

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});
