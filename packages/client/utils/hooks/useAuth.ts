<<<<<<< HEAD
import { useMeQuery } from "@/graphql/generated";

export const useAuth = (params?: Parameters<typeof useMeQuery>["0"]): ReturnType<typeof useMeQuery> => {
  const me = useMeQuery(params);
  return me;
};
=======
import { useMeQuery } from "@/graphql/generated";

export const useAuth = (params?: Parameters<typeof useMeQuery>["0"]): ReturnType<typeof useMeQuery> => {
  const me = useMeQuery(params);
  return me;
};
>>>>>>> 3c094b84c4b6a5e6c8400166ac60b7393b7ddcff
