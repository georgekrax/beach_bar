import { resolve } from "@/utils/data";
import { objectType } from "nexus";
import { UserFavoriteBar } from "nexus-prisma";

export const UserFavoriteBarType = objectType({
  name: UserFavoriteBar.$name,
  description: "A user's favorite #beach_bar",
  definition(t) {
    // t.id("id");
    // t.field("user", { type: UserType, description: "The user object" });
    // t.field("beachBar", { type: BeachBarType, description: "One of user's favorite #beach_bar" });
    t.field(UserFavoriteBar.id);
    t.field(resolve(UserFavoriteBar.user));
    t.field(resolve(UserFavoriteBar.beachBar));
  },
});

// export const UpdateUserFavoriteBarType = objectType({
//   name: "UpdateUserFavoriteBar",
//   description: "Info to be returned when a user's #beach_bar favourite list is updated",
//   definition(t) {
//     t.field("favouriteBar", {
//       type: UserFavoriteBarType,
//       description: "The #beach_bar that is added / removed",
//       resolve: o => o.favouriteBar,
//     });
//     t.boolean("updated", {
//       description: "A boolean that indicates if the user's favorites #beach_bar list is updated",
//     });
//   },
// });

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
