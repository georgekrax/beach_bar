<<<<<<< HEAD
import { SearchContextProvider, INITIAL_SEARCH_VALUES } from "@/utils/contexts/SearchContext";
import { useReducer, memo } from "react";
import { reducer } from "./reducer";

type Props = {
  initializer?: () => typeof INITIAL_SEARCH_VALUES;
};

export const Context: React.FC<Props> = memo(({ initializer, children }) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_SEARCH_VALUES, () => {
    let state = INITIAL_SEARCH_VALUES;
    if (initializer) state = { ...state, ...initializer() };
    return state;
  });

  return <SearchContextProvider value={{ ...state, dispatch }}>{children}</SearchContextProvider>;
});

Context.displayName = "SearchContext";
=======
import { SearchContextProvider, INITIAL_SEARCH_VALUES } from "@/utils/contexts/SearchContext";
import { useReducer, memo } from "react";
import { reducer } from "./reducer";

type Props = {
  initializer?: () => typeof INITIAL_SEARCH_VALUES;
};

export const Context: React.FC<Props> = memo(({ initializer, children }) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_SEARCH_VALUES, () => {
    let state = INITIAL_SEARCH_VALUES;
    if (initializer) state = { ...state, ...initializer() };
    return state;
  });

  return <SearchContextProvider value={{ ...state, dispatch }}>{children}</SearchContextProvider>;
});

Context.displayName = "SearchContext";
>>>>>>> 3c094b84c4b6a5e6c8400166ac60b7393b7ddcff
