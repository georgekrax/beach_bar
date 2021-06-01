import { ApolloLink, fromPromise, HttpLink } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { errors as commonErrors } from "@beach_bar/common";
import { getAuthContext } from "../auth";
import { userIpAddr } from "./cache";

export const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT + "/graphql",
  credentials: "include",
  useGETForQueries: true,
  fetchOptions: {
    credentials: "include",
  },
});

export const ipMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers, ...context }) => ({
    ...context,
    headers: {
      ...headers,
      ip_address: userIpAddr().query,
    },
  }));

  return forward(operation);
});

export const authMiddleware = (headers?: ReturnType<typeof getAuthContext>["headers"]) =>
  new ApolloLink((operation, forward) => {
    operation.setContext(({ headers: operationHeaders, ...context }) => ({
      ...context,
      headers: {
        ...headers,
        ...operationHeaders,
      },
    }));

    return forward(operation);
  });

export const errorLink = (headers?: ReturnType<typeof getAuthContext>["headers"]) =>
  onError(({ operation, graphQLErrors, networkError, forward }) => {
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        switch (err.extensions?.code) {
          case commonErrors.JWT_EXPIRED: {
            // retry the request, returning the new observable
            let res;
            return fromPromise(
              fetch(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT + "/oauth/refresh_token", {
                method: "POST",
                mode: "cors",
                credentials: "include",
                headers: headers || undefined,
              })
                .then(async res => await res.json())
                .then(data => {
                  res = data;
                  if (data.success) console.clear();
                })
                .catch(err => {
                  if (err && process.env.NODE_ENV !== "production") console.error(err);
                  forward(operation);
                })
            ).flatMap(() => {
              operation.setContext({
                headers: { ...operation.getContext().headers, Authorization: "Bearer " + res.accessToken.token },
              });
              return forward(operation);
            });
          }
        }
      }
    }

    if (networkError && process.env.NODE_ENV !== "production") console.error(`[Network error]: ${networkError}`);
  });
