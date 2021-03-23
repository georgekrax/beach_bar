import { objectType } from "nexus";
import { BeachBarType } from "schema/beach_bar/types";
import { UserType } from "../types";

export const UserFavoriteBarType = objectType({
  name: "UserFavoriteBar",
  description: "A user's favorite #beach_bar",
  definition(t) {
    t.field("user", {
      type: UserType,
      description: "The user object",
      resolve: o => o.user,
    });
    t.field("beachBar", {
      type: BeachBarType,
      description: "One of user's favorite #beach_bar",
      resolve: o => o.beachBar,
    });
  },
});

export const UpdateUserFavoriteBarType = objectType({
  name: "UpdateUserFavoriteBar",
  description: "Info to be returned when a user's #beach_bar favourite list is updated",
  definition(t) {
    t.field("favouriteBar", {
      type: UserFavoriteBarType,
      description: "The #beach_bar that is added / removed",
      resolve: o => o.favouriteBar,
    });
    t.boolean("updated", {
      description: "A boolean that indicates if the user's favorites #beach_bar list is updated",
    });
  },
});

// export const AddUserFavoriteBarResult = unionType({
//   name: "AddUserFavoriteBarResult",
//   definition(t) {
//     t.members("AddUserFavoriteBar", "Error");
//   },
//   resolveType: item => {
//     if (item.error) {
//       return "Error";
//     } else {
//       return "AddUserFavoriteBar";
//     }
//   },
// });
