import { objectType } from "@nexus/schema";

import { UserType } from "../user/types";

export const OwnerType = objectType({
  name: "Owner",
  description: "Represents a #beach_bar's owner",
  definition(t) {
    t.int("id", { nullable: false, description: "The ID value of the owner" });
    t.field("user", {
      type: UserType,
      description: "The user (object) that is the owner or one of the owners of a #beach_bar",
      nullable: false,
      resolve: o => o.user,
    });
  },
});
