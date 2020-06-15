import { objectType, unionType } from "@nexus/schema";
import { UserAccountType } from "../user/accountTypes";
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

export const AddUserAccountContactDetailsType = objectType({
  name: "AddUserAccountContactDetails",
  description: "Info to be returned when added (assigned) contact details to a user",
  definition(t) {
    t.field("contactDetails", {
      type: UserAccountContactDetailsType,
      description: "The contact details of the user",
      nullable: false,
      resolve: o => o.contactDetails,
    });
    t.boolean("added", {
      nullable: false,
      description: "A boolean that indicates if the contact details have been successfully added (assigned) to the suer",
    });
  },
});

export const AddUserAccountContactDetailsResult = unionType({
  name: "AddUserAccountContactDetailsResult",
  definition(t) {
    t.members("AddUserAccountContactDetails", "Error");
    t.resolveType(item => {
      if (item.error) {
        return "Error";
      } else {
        return "AddUserAccountContactDetails";
      }
    });
  },
});
