import { GraphQLClient } from "graphql-request";

export const graphqlClient = new GraphQLClient(process.env.HASHTAG_GRAPHQL_ENDPOINT, {
  credentials: "include",
  mode: "cors",
});
