import { DateScalar } from "@beach_bar/common";
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
    t.list.field("preferences", {
      type: AccountPreferenceTypeGraphQL,
      description: "The user's account preferences",
      nullable: true,
      resolve: o => o.preferences.preference,
    });
    t.list.field("contactDetails", {
      type: UserContactDetailsType,
      description: "User contact details",
      nullable: true,
      resolve: o => o.contactDetails,
    });
  },
});

export const AccountPreferenceTypeGraphQL = objectType({
  name: "AccountPreferenceType",
  description: "Represents a user's preferences type",
  definition(t) {
    t.id("id", { nullable: false });
    t.string("name", { nullable: false });
    t.string("description", { nullable: true });
  },
});

// export const AccountPreferenceType = objectType({
//   name: "AccountPreference",
//   description: "Represents a user's preferences",
//   definition(t) {
//     t.field("account", {
//       type: UserAccountType,
//       description: "The user's account",
//       nullable: false,
//       resolve: o => o.account,
//     });
//     t.field("preference", {
//       type: AccountPreferenceTypeGraphQL,
//       description: "The account preference type",
//       nullable: false,
//       resolve: o => o.preference,
//     });
//   },
// });
