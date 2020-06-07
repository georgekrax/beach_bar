import { objectType } from "@nexus/schema";
import { OwnerType } from "../userDetails/ownerTypes";
import { BeachBarRestaurantType } from "./restaurantTypes";
import { BeachBarReviewType } from "./reviewTypes";
import { BeachBarFeatureType } from "./serviceTypes";

export const BeachBarType = objectType({
  name: "BeachBar",
  description: "Represents a #beach_bar",
  definition(t) {
    t.int("id", { nullable: false, description: "The ID value of the #beach_bar" });
    t.string("name", { nullable: false, description: "The name of the #beach_bar" });
    t.string("description", { nullable: true, description: "A description text about the #beach_bar" });
    t.float("avgRating", { nullable: true, description: "The average rating of all the user reviews for this #beach_bar" });
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
    t.list.field("owners", {
      type: OwnerType,
      description: "A list of all the owners of the #beach_bar",
      nullable: false,
      resolve: o => o.owners,
    });
    t.list.field("reviews", {
      type: BeachBarReviewType,
      description: "A list of all the reviews of the #beach_bar",
      nullable: true,
      resolve: o => o.reviews,
    });
    t.list.field("services", {
      type: BeachBarFeatureType,
      description: "A list of all the #beach_bar's features",
      nullable: true,
      resolve: o => o.serviceBeachBar,
    });
    t.list.field("restaurants", {
      type: BeachBarRestaurantType,
      description: "A list of all the restaurants of a #beach_bar",
      nullable: true,
      resolve: o => o.restaurants,
    });
  },
});
