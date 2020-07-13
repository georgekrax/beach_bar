import { BigIntScalar, DateScalar, DateTimeScalar, JsonScalar } from "@beach_bar/common";
import { objectType } from "@nexus/schema";
import { BeachBarType } from "../beach_bar/types";
import { CityType } from "../details/cityTypes";
import { CountryType } from "../details/countryTypes";
import { RegionType } from "../details/regionTypes";
import { UserType } from "../user/types";

export const SearchInputValueType = objectType({
  name: "SearchInputValue",
  description: "Represents a potential input value of a user's search",
  definition(t) {
    t.field("id", { type: BigIntScalar, nullable: false });
    t.string("publicId", { nullable: false, description: "A unique identifier (ID) for public use" });
    t.field("country", {
      type: CountryType,
      description: "The country of the input value",
      nullable: true,
      resolve: o => o.country,
    });
    t.field("city", {
      type: CityType,
      description: "The city of the input value",
      nullable: true,
      resolve: o => o.city,
    });
    t.field("region", {
      type: RegionType,
      description: "The region of the input value",
      nullable: true,
      resolve: o => o.region,
    });
    t.field("beachBar", {
      type: BeachBarType,
      description: "The #beach_bar of the input value",
      nullable: true,
      resolve: o => o.beachBar,
    });
  },
});

export const FormattedSearchInputValueType = objectType({
  name: "FormattedSearchInputValue",
  description: "Represents a formatted search input value",
  definition(t) {
    t.field("inputValue", {
      type: SearchInputValueType,
      description: "The search input value",
      nullable: false,
      resolve: o => o.inputValue,
    });
    t.string("formattedValue", { nullable: false, description: "The search input value formatted into a string" });
  },
});

export const UserSearchType = objectType({
  name: "UserSearch",
  description: "Represents a user search",
  definition(t) {
    t.field("id", { type: BigIntScalar, nullable: false });
    t.field("searchDate", { type: DateScalar, nullable: true });
    t.int("searchAdults", { nullable: true });
    t.int("searchChildren", { nullable: true });
    t.field("extraFilters", { type: JsonScalar, nullable: true, description: "Extra filters added by the user during the search" });
    t.field("user", {
      type: UserType,
      description: "The user that made the search",
      nullable: true,
      resolve: o => o.user,
    });
    t.field("inputValue", {
      type: SearchInputValueType,
      description: "The input value that the user searched for",
      nullable: true,
      resolve: o => o.inputValue,
    });
    t.field("timestamp", { type: DateTimeScalar, nullable: false });
  },
});
