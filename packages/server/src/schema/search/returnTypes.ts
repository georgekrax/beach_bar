import { BeachBar } from "../../entity/BeachBar";
import { SearchInputValue } from "../../entity/SearchInputValue";
import { UserSearch } from "../../entity/UserSearch";
import { BeachBarAvailabilityReturnType } from "../beach_bar/returnTypes";

export type SearchInputValueReturnType = {
  inputValue: SearchInputValue;
};

export type FormattedSearchInputValueReturnType = SearchInputValueReturnType & {
  formattedValue: string;
  beachBarThumbnailUrl?: string;
};

export type SearchResultReturnType = {
  beachBar: BeachBar;
  availability: BeachBarAvailabilityReturnType;
};

export type SearchReturnType = {
  results: SearchResultReturnType[];
  search: UserSearch;
};
