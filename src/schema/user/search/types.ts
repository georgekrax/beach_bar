import { objectType } from "@nexus/schema";
import { CityType } from "../../details/cityTypes";
import { CountryType } from "../../details/countryTypes";
import { RegionType } from "../../details/regionTypes";
import { UserType } from "../types";

export const UserSearchType = objectType({
  name: "UserSearch",
  description: "Represents a user search",
  definition(t) {
    // @ts-ignore
    t.bigint("id", { nullable: false });
    t.string("searchValue", { nullable: false });
    // @ts-ignore
    t.date("searchDate", { nullable: true });
    t.int("searchAdults", { nullable: true });
    t.int("searchChildren", { nullable: true });
    // @ts-ignore
    t.json("extraFilters", { nullable: true, description: "Extra filters added by the user during the search" });
    t.field("user", {
      type: UserType,
      description: "The user that made the search",
      nullable: false,
      resolve: o => o.user,
    });
    t.field("country", {
      type: CountryType,
      description: "The country that the user searched for",
      nullable: true,
      resolve: o => o.country,
    });
    t.field("city", {
      type: CityType,
      description: "The city that the user searched for",
      nullable: true,
      resolve: o => o.city,
    });
    t.field("region", {
      type: RegionType,
      description: "The region that the user searched for, of a country",
      nullable: true,
      resolve: o => o.region,
    });
    // @ts-ignore
    t.datetime("timestamp", { nullable: false });
  },
});
