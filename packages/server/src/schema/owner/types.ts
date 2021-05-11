import { DateTimeScalar } from "@the_hashtag/common/dist/graphql";
import { objectType } from "nexus";
import { BeachBarType } from "../beach_bar/types";
import { UserType } from "../user/types";

export const OwnerType = objectType({
  name: "Owner",
  description: "Represents a user that is an owner of a #beach_bar",
  definition(t) {
    t.id("id");
    t.field("user", { type: UserType, description: "The user that is the owner or one of the owners of the #beach_bar" });
  },
});

export const BeachBarOwnerType = objectType({
  name: "BeachBarOwner",
  description: "Represents a #beach_bar's owner",
  definition(t) {
    t.boolean("isPrimary", {
      description: "A boolean that indicates if the owner is the user that also created the #beach_bar & can make modifications",
    });
    t.boolean("publicInfo", {
      description: "A boolean that indicates if the owner info (contact details) are allowed to be presented to the public",
    });
    t.field("beachBar", {
      type: BeachBarType,
      description: "The #beach_bar the user is assigned to as an owner, either as a primary one or not",
    });
    t.field("owner", { type: OwnerType, description: "The owner of the #beach_bar" });
    t.field("timestamp", { type: DateTimeScalar, description: "The date and time the owner was added (assigned) to the #beach_bar" });
  },
});

export const AddBeachBarOwnerType = objectType({
  name: "AddBeachBarOwner",
  description: "Info to be returned when an owner is added (assigned) to a #beach_bar",
  definition(t) {
    t.nullable.field("owner", { type: BeachBarOwnerType, description: "The owner being added & its info" });
    t.nullable.boolean("added", {
      description: "A boolean that indicates if the owner has been successfully being added (assigned) to a #beach_bar",
    });
  },
});

// export const AddBeachBarOwnerResult = unionType({
//   name: "AddBeachBarOwnerResult",
//   definition(t) {
//     t.members("AddBeachBarOwner", "Error");
//   },
//   resolveType: item => {
//     if (item.error) return "Error";
//     else return "AddBeachBarOwner";
//   },
// });

export const UpdateBeachBarOwnerType = objectType({
  name: "UpdateBeachBarOwner",
  description: "Info to be returned when the info of a #beach_bar owner, are updated",
  definition(t) {
    t.field("owner", { type: BeachBarOwnerType, description: "The owner being added & its info" });
    t.boolean("updated", { description: "A boolean that indicates if the owner info have been successfully updated" });
  },
});

// export const UpdateBeachBarOwnerResult = unionType({
//   name: "UpdateBeachBarOwnerResult",
//   definition(t) {
//     t.members("UpdateBeachBarOwner", "Error");
//   },
//   resolveType: item => {
//     if (item.error) return "Error";
//     else return "UpdateBeachBarOwner";
//   },
// });
