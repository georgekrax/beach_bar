import { HttpLink } from "apollo-link-http";
import fetch from "node-fetch";

export const link: any = new HttpLink({
  uri: `${process.env.HASHTAG_API_HOSTNAME!.toString()}/graphql`,
  fetch: fetch as any,
  credentials: "include",
});

// export const client = new ApolloClient({
//   link,
//   cache: new InMemoryCache(),
// });
