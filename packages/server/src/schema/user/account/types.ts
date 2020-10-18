import { DateScalar } from "@georgekrax-hashtag/common";
import { objectType } from "@nexus/schema";
import { CityType } from "../../details/cityTypes";
import { CountryType } from "../../details/countryTypes";
import { UserContactDetailsType } from "../contact_details.ts/types";
import { UserType } from "../types";

export const UserAccountType = objectType({
  name: "UserAccount",
  description: "Represents a user's account",
  definition(t) {
    t.int("id", { nullable: false, description: "The ID value of the user's account" });
    t.string("personTitle", {
      nullable: true,
      description: "The user's honorific title. Its value can be null or 'Mr', 'Mrs', 'Ms', 'Miss', 'Sr', 'Dr', 'Lady'",
    });
    t.string("imgUrl", { nullable: true, description: "The URL value of user's account profile picture" });
    t.field("birthday", { type: DateScalar, nullable: true, description: "User's birthday date" });
    t.int("age", { nullable: true, description: "User's age" });
    t.string("address", { nullable: true, description: "The house of office street address of the user" });
    t.string("zipCode", { nullable: true, description: "The zip code of the house or office street address of the user" });
    t.field("user", {
      type: UserType,
      description: "The user info of the particular account",
      nullable: false,
      resolve: o => o.user,
    });
    t.field("country", {
      type: CountryType,
      description: "The country of the user",
      nullable: true,
      resolve: o => o.country,
    });
    t.field("city", {
      type: CityType,
      description: "The city or hometown of the user",
      nullable: true,
      resolve: o => o.city,
    });
    t.boolean("trackHistory", { nullable: false, description: "Indicates if to track user's history "});
    t.list.field("contactDetails", {
      type: UserContactDetailsType,
      description: "User contact details",
      nullable: true,
      resolve: o => o.contactDetails,
    });
  },
});