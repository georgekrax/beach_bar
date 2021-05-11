<<<<<<< HEAD
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
=======
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
>>>>>>> 3c094b84c4b6a5e6c8400166ac60b7393b7ddcff
