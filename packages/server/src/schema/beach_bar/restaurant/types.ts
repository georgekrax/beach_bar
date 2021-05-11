import { objectType } from "nexus";
import { BeachBarType } from "../types";
import { RestaurantFoodItemType } from "./food_item/types";

export const BeachBarRestaurantType = objectType({
  name: "BeachBarRestaurant",
  description: "Represents a #beach_bar's restaurant",
  definition(t) {
    t.id("id", { description: "The ID value of the restaurant" });
    t.string("name", { description: "The name of the restaurant" });
    t.nullable.string("description", { description: "A short description (info) about the restaurant" });
    t.boolean("isActive", {
      description: "A boolean that indicates if the restaurant is active. It can be changed by the primary owner of the #beach_bar",
    });
    t.field("beachBar", { type: BeachBarType, description: "The #beach_bar this restaurant is owned by" });
    t.list.field("foodItems", {
      type: RestaurantFoodItemType,
      description: "A list of food items (products) in the menu of the restaurant",
    });
  },
});

export const AddBeachBarRestaurantType = objectType({
  name: "AddBeachBarRestaurant",
  description: "Info to be returned when a restaurant is added to a #beach_bar",
  definition(t) {
    t.field("restaurant", { type: BeachBarRestaurantType, description: "The restaurant that is added & its info" });
    t.boolean("added", {
      description: "A boolean that indicates if the restaurant has been successfully being added to the #beach_bar",
    });
  },
});

// export const AddBeachBarRestaurantResult = unionType({
//   name: "AddBeachBarRestaurantResult",
//   definition(t) {
//     t.members("AddBeachBarRestaurant", "Error");
//   },
//   resolveType: item => {
//     if (item.error) return "Error";
//     else return "AddBeachBarRestaurant";
//   },
// });

export const UpdateBeachBarRestaurantType = objectType({
  name: "UpdateBeachBarRestaurant",
  description: "Info to be returned when the details of #beach_bar restaurant, are updated",
  definition(t) {
    t.field("restaurant", { type: BeachBarRestaurantType, description: "The restaurant that is updated" });
    t.boolean("updated", { description: "A boolean that indicates if the restaurant details have been successfully updated" });
  },
});

// export const UpdateBeachBarRestaurantResult = unionType({
//   name: "UpdateBeachBarRestaurantResult",
//   definition(t) {
//     t.members("UpdateBeachBarRestaurant", "Error");
//   },
//   resolveType: item => {
//     if (item.error) return "Error";
//     else return "UpdateBeachBarRestaurant";
//   },
// });
