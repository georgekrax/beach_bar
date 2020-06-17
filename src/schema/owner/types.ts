import { objectType, unionType } from "@nexus/schema";
import { BeachBarType } from "../beach_bar/types";
import { UserType } from "../user/types";

export const BeachBarOwnerType = objectType({
  name: "BeachBarOwner",
  description: "Represents a #beach_bar's owner",
  definition(t) {
    t.boolean("isPrimary", {
      nullable: false,
      description: "A boolean that indicates if the owner is the user that also created the #beach_bar & can make modifications",
    });
    t.field("beachBar", {
      type: BeachBarType,
      description: "The #beach_bar the user is assigned to as an owner, either as a primary one or not",
      nullable: false,
      resolve: o => o.beachBar,
    });
    t.field("user", {
      type: UserType,
      description: "The user (object) that is the owner or one of the owners of a #beach_bar",
      nullable: false,
      resolve: o => o.user,
    });
  },
});

export const AddBeachBarOwnerType = objectType({
  name: "AddBeachBarOwner",
  description: "Info to be returned when an owner is added (assigned) to a #beach_bar",
  definition(t) {
    t.field("owner", {
      type: BeachBarOwnerType,
      description: "The owner being added & its info",
      nullable: false,
      resolve: o => o.owner,
    });
    t.boolean("added", {
      nullable: false,
      description: "A boolean that indicates if the owner has been successfully being added (assigned) to a #beach_bar",
    });
  },
});

export const AddBeachBarOwnerResult = unionType({
  name: "AddBeachBarOwnerResult",
  definition(t) {
    t.members("AddBeachBarOwner", "Error");
    t.resolveType(item => {
      if (item.error) {
        return "Error";
      } else {
        return "AddBeachBarOwner";
      }
    });
  },
});
