import { DateScalar } from "@the_hashtag/common/dist/graphql";
import { objectType } from "nexus";
import { CityType } from "../../details/cityTypes";
import { CountryType } from "../../details/countryTypes";
import { UserContactDetailsType } from "../contact_details.ts/types";
import { UserType } from "../types";

export const UserAccountType = objectType({
  name: "UserAccount",
  description: "Represents a user's account",
  definition(t) {
    t.id("id", { description: "The ID value of the user's account" });
    t.nullable.string("personTitle", {
      description: "The user's honorific title. Its value can be null or 'Mr', 'Mrs', 'Ms', 'Miss', 'Sr', 'Dr', 'Lady'",
    });
    t.nullable.string("imgUrl", { description: "The URL value of user's account profile picture" });
    t.nullable.field("birthday", { type: DateScalar, description: "User's birthday date" });
    t.nullable.int("age", { description: "User's age" });
    t.nullable.string("address", { description: "The house of office street address of the user" });
    t.nullable.string("zipCode", { description: "The zip code of the house or office street address of the user" });
    t.field("user", {
      type: UserType,
      description: "The user info of the particular account",
      resolve: o => o.user,
    });
    t.nullable.field("country", {
      type: CountryType,
      description: "The country of the user",
      resolve: o => o.country,
    });
    t.nullable.field("city", {
      type: CityType,
      description: "The city or hometown of the user",
      resolve: o => o.city,
    });
    t.boolean("trackHistory", { description: "Indicates if to track user's history " });
    t.nullable.list.field("contactDetails", {
      type: UserContactDetailsType,
      description: "User contact details",
      resolve: o => o.contactDetails,
    });
  },
});
