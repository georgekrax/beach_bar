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
    t.boolean("publicInfo", {
      nullable: false,
      description: "A boolean that indicates if the owner info (contact details) are allowed to be presented to the public",
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
    t.datetime("timestamp", { nullable: false, description: "The date and time the owner was added (assigned) to the #beach_bar" });
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

export const UpdateBeachBarOwnerType = objectType({
  name: "UpdateBeachBarOwner",
  description: "Info to be returned when the info of owner of a #beach_bar, are updated",
  definition(t) {
    t.field("owner", {
      type: BeachBarOwnerType,
      description: "The owner being added & its info",
      nullable: false,
      resolve: o => o.owner,
    });
    t.boolean("updated", {
      nullable: false,
      description: "A boolean that indicates if the owner info have been successfully being updated",
    });
  },
});

export const UpdateBeachBarOwnerResult = unionType({
  name: "UpdateBeachBarOwnerResult",
  definition(t) {
    t.members("UpdateBeachBarOwner", "Error");
    t.resolveType(item => {
      if (item.error) {
        return "Error";
      } else {
        return "UpdateBeachBarOwner";
      }
    });
  },
});
