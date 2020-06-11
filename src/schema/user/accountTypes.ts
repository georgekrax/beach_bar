import { objectType } from "@nexus/schema";
import { UserAccountContactDetailsType } from "../userDetails/contactDetails";
import { UserType } from "./types";

export const UserAccountType = objectType({
  name: "UserAccount",
  description: "Represents a user's account",
  definition(t) {
    t.int("id", { nullable: false, description: "The ID value of the user's account" }),
      t.string("personTitle", {
        nullable: true,
        description: "The user's honorific title. Its value can be null or 'Mr', 'Mrs', 'Ms', 'Miss', 'Sr', 'Dr', 'Lady'",
      }),
      t.string("imgUrl", { nullable: true, description: "The URL value of user's account profile picture" }),
      // @ts-ignore
      t.date("birthday", { nullable: true, description: "User's birthday date" }),
      t.int("age", { nullable: true, description: "User's age" }),
      t.boolean("isActive", { nullable: false });
    // @ts-ignore
    t.datetime("updatedAt", {
      nullable: false,
      description: "The last time user's account was updated, in the format of a timestamp",
    });
    // @ts-ignore
    t.datetime("timestamp", { nullable: false, description: "The timestamp recorded, when the user's account was created" });
    t.field("user", {
      type: UserType,
      description: "The user info of the particular account",
      nullable: false,
      resolve: o => o.user,
    });
    t.list.field("contactDetails", {
      type: UserAccountContactDetailsType,
      description: "User contact details",
      nullable: true,
      resolve: o => o.contactDetails,
    });
  },
});
