import { objectType, unionType } from "@nexus/schema";
import { UserAccountType } from "../user/account/types";
import { CountryType } from "../details/countryTypes";

export const UserContactDetailsType = objectType({
  name: "UserContactDetails",
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
    // @ts-ignore
    t.email("secondaryEmail", { nullable: true, description: "A secondary email address to contact the user" });
    t.string("phoneNumber", { nullable: true, description: "User's phone number" });
  },
});

export const AddUserContactDetailsType = objectType({
  name: "AddUserContactDetails",
  description: "Info to be returned when contact details are added (assigned) to a user",
  definition(t) {
    t.field("contactDetails", {
      type: UserContactDetailsType,
      description: "The contact details of the user",
      nullable: false,
      resolve: o => o.contactDetails,
    });
    t.boolean("added", {
      nullable: false,
      description: "A boolean that indicates if the contact details have been successfully added (assigned) to the user",
    });
  },
});

export const AddUserContactDetailsResult = unionType({
  name: "AddUserContactDetailsResult",
  definition(t) {
    t.members("AddUserContactDetails", "Error");
    t.resolveType(item => {
      if (item.error) {
        return "Error";
      } else {
        return "AddUserContactDetails";
      }
    });
  },
});

export const UpdateUserContactDetailsType = objectType({
  name: "UpdateUserContactDetails",
  description: "Info to be returned when contact details of a user are updated",
  definition(t) {
    t.field("contactDetails", {
      type: UserContactDetailsType,
      description: "The contact details of the user",
      nullable: false,
      resolve: o => o.contactDetails,
    });
    t.boolean("updated", {
      nullable: false,
      description: "A boolean that indicates if the contact details of the user have been successfully updated",
    });
  },
});

export const UpdateUserContactDetailsResult = unionType({
  name: "UpdateUserContactDetailsResult",
  definition(t) {
    t.members("UpdateUserContactDetails", "Error");
    t.resolveType(item => {
      if (item.error) {
        return "Error";
      } else {
        return "UpdateUserContactDetails";
      }
    });
  },
});
