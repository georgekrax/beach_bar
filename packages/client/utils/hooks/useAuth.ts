import { useMeQuery } from "../../graphql/generated";

export const useAuth = (): ReturnType<typeof useMeQuery> => {
  const me = useMeQuery();

  return me;
};
