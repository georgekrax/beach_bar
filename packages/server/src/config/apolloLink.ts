import { HttpLink } from "apollo-link-http";

const fetch = (...args) => import("node-fetch").then(module => module.default([...args] as any));

export const link: any = new HttpLink({
  uri: process.env.HASHTAG_API_HOSTNAME + "/graphql",
  fetch: fetch as any,
  credentials: "include",
});
