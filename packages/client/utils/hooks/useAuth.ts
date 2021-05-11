import { useMeQuery } from "@/graphql/generated";

export const useAuth = (params?: Parameters<typeof useMeQuery>["0"]): ReturnType<typeof useMeQuery> => {
  const me = useMeQuery(params);
  return me;
};
