import { MeDocument, MeQuery } from "@/graphql/generated";
import { ApolloClient, ApolloQueryResult, NormalizedCacheObject, QueryOptions } from "@apollo/client";
import { GetServerSidePropsContext } from "next";

type GetAuthOptions = { apolloClient: ApolloClient<NormalizedCacheObject> } & Omit<QueryOptions, "query">;

export const getAuth = async ({ apolloClient, ...queryOptions }: GetAuthOptions): Promise<ApolloQueryResult<MeQuery>> => {
  const data = await apolloClient.query<MeQuery>({
    ...queryOptions,
    query: MeDocument,
  });

  return data;
};

export type GetAuthContextOptions = Pick<QueryOptions, "context"> & Partial<Pick<GetServerSidePropsContext, "req">>;

export const getAuthContext = ({
  context,
  req,
}: GetAuthContextOptions): Record<string, string> & {
  headers: null | (Record<string, string> & { Authorization: string });
} => ({
  ...context,
  headers:
    req?.cookies && req.cookies["user_auth"]
      ? {
          ...context?.headers,
          Authorization: "Bearer " + req.cookies["user_auth"],
          "x-refetch-token": req.cookies["me"],
        }
      : null,
});
