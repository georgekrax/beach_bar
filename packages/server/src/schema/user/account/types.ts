import { resolve } from "@/utils/data";
import { nullable, objectType } from "nexus";
import { Account, UserHistory, UserHistoryActivity } from "nexus-prisma";
import { BeachBarType } from "../../beach_bar/types";
import { UserSearchType } from "../../search/types";

export const UserAccountType = objectType({
  name: Account.$name,
  description: "Represents a user's account",
  definition(t) {
    // t.id("id", { description: "The ID value of the user's account" });
    // t.nullable.string("honorificTitle", {
    //   description: "The user's honorific title. Its value can be 'Mr', 'Mrs', 'Ms', 'Miss', 'Sr', 'Dr', 'Lady'",
    // });
    // t.nullable.string("imgUrl", { description: "The URL value of user's account profile picture" });
    // t.nullable.field("birthday", { type: DateScalar, description: "User's birthday date" });
    // t.nullable.int("age", { description: "User's age" });
    // t.nullable.string("address", { description: "The house of office street address of the user" });
    // t.nullable.string("zipCode", { description: "The zip code of the house or office street address of the user" });
    // t.nullable.string("city", { description: "The city of the user" });
    // t.nullable.string("phoneNumber", { description: "The phone number of the user" });
    // t.field("user", { type: UserType, description: "The user info of the particular account" });
    // t.nullable.field("country", { type: CountryType, description: "The country of the user" });
    // t.nullable.field("telCountry", { type: CountryType, description: "The country of the user's phone number" });
    // t.boolean("trackHistory", { description: "Indicates if to track some of user's actions" });
    t.field(Account.id);
    t.field({ ...Account.honorificTitle, type: nullable("String") });
    t.field(Account.imgUrl);
    t.field(Account.birthday);
    t.field(Account.age);
    t.field(Account.address);
    t.field(Account.zipCode);
    t.field(Account.city);
    t.field(Account.phoneNumber);
    t.field(Account.trackHistory);
    t.field(resolve(Account.user));
    t.field(resolve(Account.country));
    t.field(resolve(Account.telCountry));
  },
});

export const UserHistoryActivityType = objectType({
  name: UserHistoryActivity.$name,
  description: "Represents the type of action a user made",
  definition(t) {
    t.field(UserHistoryActivity.id);
    t.field(UserHistoryActivity.name);
  },
});

export const UserHistoryType = objectType({
  name: UserHistory.$name,
  description: "Represents a user's recorded / saved action",
  definition(t) {
    // t.id("id");
    // t.id("objectId", { description: "The ID of what the user accessed" });
    // t.field("activity", { type: UserHistoryActivityType, description: "The action type of the user" });
    // t.field("user", { type: UserType, description: "The user that made the recorded / saved action" });
    // t.implements(TimestampGraphQLType);
    t.field(UserHistory.id);
    t.field(UserHistory.objectId);
    t.field(UserHistory.activity);
    t.field(resolve(UserHistory.user));
    t.field(UserHistory.timestamp);
  },
});

export const UserHistoryExtendedType = objectType({
  name: "UserHistoryExtended",
  description: "Represents a user's action, with details about the objectId",
  definition(t) {
    t.field("userHistory", { type: UserHistoryType, description: "The info of the recorded / saved action of the user" });
    t.nullable.field("beachBar", { type: BeachBarType, description: "Details about the #beach_bar the user may have visited" });
    t.nullable.field("search", { type: UserSearchType, description: "Details about what the user searched" });
  },
});
