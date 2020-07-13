import { SearchInputValue } from "../../entity/SearchInputValue";

export type SearchInputValueReturnType = {
  inputValue: SearchInputValue;
};

export type FormattedSearchInputValueReturnType = SearchInputValueReturnType & {
  formattedValue: string;
};
