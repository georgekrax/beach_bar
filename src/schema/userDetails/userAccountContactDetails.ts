import { objectType } from "@nexus/schema";
import { UserAccountType } from "../user/userAccountTypes";
import { CityType } from "./cityTypes";
import { CountryType } from "./countryTypes";

export const UserAccountContactDetailsType = objectType({
  name: "UserAccountContactDetails",
  description: "Represents the contact details info of a user",
  definition(t) {
    t.int("id", { nullable: false, description: "The ID value of user's account contact details" });
    t.field("account", { type: UserAccountType, nullable: false, description: "The account of user", resolve: o => o.account });
    t.field("country", {
      type: CountryType,
      nullable: true,
      description: "The country origin of a user",
      resolve: o => o.country,
    });
    t.field("city", {
      type: CityType,
      nullable: true,
      description: "The city of the user",
      resolve: o => o.city,
    });
    t.string("phoneNumber", { nullable: true, description: "User's phone number" });
  },
});
