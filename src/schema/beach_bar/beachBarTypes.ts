import { objectType } from "@nexus/schema";

export const BeachBarType = objectType({
  name: "BeachBar",
  description: "Represents a #beach_bar",
  definition(t) {
    t.int("id", { nullable: false, description: "The ID value of the #beach_bar" });
    t.string("name", { nullable: false, description: "The name of the #beach_bar" });
    t.string("description", { nullable: true, description: "A description text about the #beach_bar" });
    t.int("avgRating", { nullable: true, description: "The average rating of all the user reviews for this #beach_bar" });
    t.boolean("isActive", {
      nullable: false,
      description: "A boolean that indicates if the #beach_bar is active or not, setted by its owner",
    });
    // @ts-ignore
    t.datetime("updatedAt", {
      nullable: false,
      description: "The last time the #beach_bar was updated, in the format of a timestamp",
    });
    // @ts-ignore
    t.datetime("timestamp", {
      nullable: false,
      description: "The timestamp recorded, when the #beach_bar was created",
    });
  },
});
