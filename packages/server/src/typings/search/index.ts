import { BeachBar } from "entity/BeachBar";
import { SearchInputValue } from "entity/SearchInputValue";
import { UserSearch } from "entity/UserSearch";
import { BeachBarRecommendedProductsType } from "typings/beach_bar/product";

export type SearchInputValueReturnType = {
  inputValue: SearchInputValue;
};

export type FormattedSearchInputValueReturnType = SearchInputValueReturnType & {
  formattedValue: string;
  beachBarThumbnailUrl?: string;
};

export type SearchResultReturnType = {
  beachBar: BeachBar;
  isOpen: boolean;
  hasCapacity: boolean;
  recommendedProducts: BeachBarRecommendedProductsType;
};

export type RedisSearchReturnType = {
  results: SearchResultReturnType[];
  search: UserSearch;
};

export type TSearch = {
  results: SearchResultReturnType[];
  search: UserSearch;
};
