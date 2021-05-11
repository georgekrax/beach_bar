import { reducer } from "./reducer";
import { AuthContextProvider, INITIAL_AUTH_VALUES } from "@/utils/contexts/AuthContext";
import { memo, useReducer } from "react";

type Props = {
  initializer?: () => typeof INITIAL_AUTH_VALUES;
};

export const Context: React.FC<Props> = memo(({ initializer, children }) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_AUTH_VALUES, () => {
    let state = INITIAL_AUTH_VALUES;
    if (initializer) state = { ...state, ...initializer() };
    return state;
  });

  return <AuthContextProvider value={{ ...state, dispatch }}>{children}</AuthContextProvider>;
});

Context.displayName = "AuthContext";
