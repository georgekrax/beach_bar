import { objectType, unionType } from "@nexus/schema";
import { BeachBarType } from "schema/beach_bar/types";
import { UserType } from "../types";

export const UserFavoriteBarType = objectType({
  name: "UserFavoriteBar",
  description: "A user's favorite #beach_bar",
  definition(t) {
    t.field("user", {
      type: UserType,
      description: "The user object",
      nullable: false,
      resolve: o => o.user,
    });
    t.field("beachBar", {
      type: BeachBarType,
      description: "One of user's favorite #beach_bar",
      nullable: false,
      resolve: o => o.beachBar,
    });
  },
});

export const AddUserFavoriteBarType = objectType({
  name: "AddUserFavoriteBar",
  description: "Info to be returned when a user add #beach_bar to his / her favorite list",
  definition(t) {
    t.field("beachBar", {
      type: UserFavoriteBarType,
      description: "The #beach_bar that is added",
      nullable: false,
      resolve: o => o.beachBar,
    });
    t.boolean("added", {
      nullable: false,
      description: "A boolean that indicates if the #beach_bar has been successfully being added to the user's favorites",
    });
  },
});

export const AddUserFavoriteBarResult = unionType({
  name: "AddUserFavoriteBarResult",
  definition(t) {
    t.members("AddUserFavoriteBar", "Error");
    t.resolveType(item => {
      if (item.error) {
        return "Error";
      } else {
        return "AddUserFavoriteBar";
      }
    });
  },
});
