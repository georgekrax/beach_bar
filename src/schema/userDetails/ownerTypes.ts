import { objectType } from "@nexus/schema";

import { UserType } from "../user/types";

export const OwnerType = objectType({
  name: "Owner",
  description: "Represents a #beach_bar's owner",
  definition(t) {
    t.int("id", { nullable: false, description: "The ID value of the owner" });
    t.boolean("isPrimary", {
      nullable: false,
      description: "A boolean that indicates if the owner is the user that also created the #beach_bar & can make modifications",
    });
    t.field("user", {
      type: UserType,
      description: "The user (object) that is the owner or one of the owners of a #beach_bar",
      nullable: false,
      resolve: o => o.user,
    });
  },
});
