import { AuthContextType } from "@/utils/contexts";

export const AUTH_ACTIONS = {
  TOGGLE_LOGIN_DIALOG: "toggle:login_dialog",
} as const;

export type AUTH_REDUCER_INITIAL_STATE_TYPE = Omit<AuthContextType, "dispatch">;

export type AUTH_ACTIONTYPE = {
  type: typeof AUTH_ACTIONS.TOGGLE_LOGIN_DIALOG;
  payload?: { bool?: boolean };
};

export const reducer = (
  state: AUTH_REDUCER_INITIAL_STATE_TYPE,
  action: AUTH_ACTIONTYPE
): AUTH_REDUCER_INITIAL_STATE_TYPE => {
  const { isLoginDialogShown } = state;

  switch (action.type) {
    case AUTH_ACTIONS.TOGGLE_LOGIN_DIALOG: {
      return { ...state, isLoginDialogShown: action.payload?.bool ?? !isLoginDialogShown };
    }

    default:
      return state;
  }
};
