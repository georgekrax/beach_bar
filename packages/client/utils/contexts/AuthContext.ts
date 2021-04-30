import { createCtx } from "@hashtag-design-system/components";
import { AUTH_ACTIONTYPE } from "@/components/Auth/reducer";

export type AuthContextType = {
  isLoginDialogShown: boolean;
  dispatch: React.Dispatch<AUTH_ACTIONTYPE>;
};

export const INITIAL_AUTH_VALUES: AuthContextType = {
  isLoginDialogShown: false,
  dispatch: () => {},
};

export const [AuthContextProvider, useAuthContext] = createCtx<AuthContextType>();
