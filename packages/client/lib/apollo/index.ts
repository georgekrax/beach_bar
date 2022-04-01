import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { GetServerSidePropsContext } from "next";
import { useMemo } from "react";
import { createApolloClient } from "./client";

let apolloClient: ApolloClient<NormalizedCacheObject>;

type InitialStateType = Record<string, any>;

export const INITIAL_APOLLO_STATE = "initialApolloState";

export const initializeApollo = (ctx?: GetServerSidePropsContext, initialState: InitialStateType = {}) => {
  const _apolloClient = apolloClient ?? createApolloClient(ctx);

  if (initialState) {
    const existingCache = _apolloClient.extract();

    _apolloClient.cache.restore({ ...existingCache, ...initialState });
  }

  if (typeof window === "undefined") return _apolloClient;

  if (!apolloClient) apolloClient = _apolloClient;
  return _apolloClient;
};

export const useApollo = (ctx?: GetServerSidePropsContext, initialState?: InitialStateType) => {
  const store = useMemo(() => initializeApollo(ctx, initialState), [initialState]);
  return store;
};
