import { BeachBar } from "@entity/BeachBar";
import { SearchInputValue } from "@entity/SearchInputValue";
import { UserSearch } from "@entity/UserSearch";
import { ErrorType } from "@typings/.index";
import { BeachBarAvailabilityReturnType } from "@typings/beach_bar";

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

export type RedisSearchReturnType = {
  results: SearchResultReturnType[];
  search: UserSearch;
};

export type SearchReturnType =
  | {
      results: SearchResultReturnType[];
      search: UserSearch;
    }
  | ErrorType;
