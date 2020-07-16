import { BeachBar } from "../../entity/BeachBar";
import { SearchInputValue } from "../../entity/SearchInputValue";
import { UserSearch } from "../../entity/UserSearch";

export type SearchInputValueReturnType = {
  inputValue: SearchInputValue;
};

export type FormattedSearchInputValueReturnType = SearchInputValueReturnType & {
  formattedValue: string;
  beachBarThumbnailUrl?: string;
};

export type SearchResultReturnType = {
  beachBar: BeachBar;
  hasAvailability?: boolean;
  hasCapacity?: boolean;
};

export type SearchReturnType = {
  results: SearchResultReturnType[];
  search: UserSearch;
};
