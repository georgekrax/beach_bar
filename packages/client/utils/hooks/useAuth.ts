import { AUTH_ACTIONS } from "@/components/Auth/reducer";
import { useMeQuery } from "@/graphql/generated";
import { useAuthContext } from "@/utils/contexts";
import { useMemo } from "react";

type HandleLoginParams = {
  showAnyway?: boolean;
}

export const useAuth = (
  queryParams?: Parameters<typeof useMeQuery>["0"]
): ReturnType<typeof useMeQuery> & {
  isAuthed: boolean;
  handleLogin: (params?: HandleLoginParams) => void;
} => {
  const me = useMeQuery(queryParams);

  const { dispatch } = useAuthContext();
  const isAuthed = useMemo(() => !!me?.data?.me, [me]);

  const handleLogin = (params: HandleLoginParams | undefined) => {
    if (!isAuthed || queryParams?.skip || params?.showAnyway) {
      dispatch({ type: AUTH_ACTIONS.TOGGLE_LOGIN_DIALOG, payload: { bool: true } });
    };
  };

  return { ...me, isAuthed, handleLogin };
};
