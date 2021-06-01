import { INITIAL_SEARCH_VALUES, SearchContextProvider } from "@/utils/contexts/SearchContext";
import { checkSearchDate } from "@/utils/search";
import dayjs from "dayjs";
import { memo, useMemo, useReducer } from "react";
import { reducer } from "./reducer";

type Props = {
  initializer?: () => typeof INITIAL_SEARCH_VALUES;
};

export const Context: React.FC<Props> = memo(({ initializer, children }) => {
  const [{ date, ...state }, dispatch] = useReducer(reducer, INITIAL_SEARCH_VALUES, () => {
    let state = INITIAL_SEARCH_VALUES;
    if (initializer) state = { ...state, ...initializer() };
    return state;
  });

  const newDate = useMemo(() => checkSearchDate(date ?? dayjs()), [date]);

  return (
    <SearchContextProvider value={{ ...state, date: newDate, dispatch }}>
      {children}
    </SearchContextProvider>
  );
});

Context.displayName = "SearchContext";
