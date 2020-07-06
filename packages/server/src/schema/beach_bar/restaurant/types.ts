import { objectType, unionType } from "@nexus/schema";
import { BeachBarType } from "../types";
import { RestaurantFoodItemType } from "./food_item/types";

export const BeachBarRestaurantType = objectType({
  name: "BeachBarRestaurant",
  description: "Represents a #beach_bar's restaurant",
  definition(t) {
    t.int("id", { nullable: false, description: "The ID value of the restaurant" });
    t.string("name", { nullable: false, description: "The name of the restaurant" });
    t.string("description", { nullable: true, description: "A short description (info) about the restaurant" });
    t.boolean("isActive", {
      nullable: false,
      description: "A boolean that indicates if the restaurant is active. It can be changed by the primary owner of the #beach_bar",
    });
    t.field("beachBar", {
      type: BeachBarType,
      description: "The #beach_bar this restaurant is owned by",
      nullable: false,
      resolve: o => o.beachBar,
    });
    t.list.field("foodItems", {
      type: RestaurantFoodItemType,
      description: "A list of food items (products) in the menu of the restaurant",
      nullable: true,
      resolve: o => o.foodItems,
    });
  },
});

export const AddBeachBarRestaurantType = objectType({
  name: "AddBeachBarRestaurant",
  description: "Info to be returned when a restaurant is added to a #beach_bar",
  definition(t) {
    t.field("restaurant", {
      type: BeachBarRestaurantType,
      description: "The restaurant that is added & its info",
      nullable: false,
      resolve: o => o.restaurant,
    });
    t.boolean("added", {
      nullable: false,
      description: "A boolean that indicates if the restaurant has been successfully being added to the #beach_bar",
    });
  },
});

export const AddBeachBarRestaurantResult = unionType({
  name: "AddBeachBarRestaurantResult",
  definition(t) {
    t.members("AddBeachBarRestaurant", "Error");
    t.resolveType(item => {
      if (item.error) {
        return "Error";
      } else {
        return "AddBeachBarRestaurant";
      }
    });
  },
});

export const UpdateBeachBarRestaurantType = objectType({
  name: "UpdateBeachBarRestaurant",
  description: "Info to be returned when the details of #beach_bar restaurant, are updated",
  definition(t) {
    t.field("restaurant", {
      type: BeachBarRestaurantType,
      description: "The restaurant that is updated",
      nullable: false,
      resolve: o => o.restaurant,
    });
    t.boolean("updated", {
      nullable: false,
      description: "A boolean that indicates if the restaurant details have been successfully updated",
    });
  },
});

export const UpdateBeachBarRestaurantResult = unionType({
  name: "UpdateBeachBarRestaurantResult",
  definition(t) {
    t.members("UpdateBeachBarRestaurant", "Error");
    t.resolveType(item => {
      if (item.error) {
        return "Error";
      } else {
        return "UpdateBeachBarRestaurant";
      }
    });
  },
});
