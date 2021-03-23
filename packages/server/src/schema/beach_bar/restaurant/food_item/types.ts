import { BigIntScalar } from "@the_hashtag/common/dist/graphql";
import { objectType, unionType } from "nexus";

export const RestaurantMenuCategoryType = objectType({
  name: "RestaurantMenuCategory",
  description: "Represents a category of a #beach_bar's restaurant menu",
  definition(t) {
    t.id("id", { description: "The ID value of the menu category" });
    t.string("name", { description: "The name of the menu category" });
  },
});

export const RestaurantFoodItemType = objectType({
  name: "RestaurantFoodItem",
  description: "Represents a #beach_bar's restaurant food item (product) in its menu catalog",
  definition(t) {
    t.field("id", { type: BigIntScalar, description: "The ID value of the food item" });
    t.string("name", { description: "The name of the food item" });
    t.float("price", { description: "The price of the food item, in decimal format with precision of five (5) & scale of two (2)" });
    t.nullable.string("imgUrl", { description: "The URL value of the food item's picture" });
    t.field("menuCategory", {
      type: RestaurantMenuCategoryType,
      description: "The menu category this food item is associated to",
      resolve: o => o.menuCategory,
    });
  },
});

export const AddRestaurantFoodItemType = objectType({
  name: "AddRestaurantFoodItem",
  description: "Info to be returned when a food item is added to a #beach_bar's restaurant",
  definition(t) {
    t.field("foodItem", {
      type: RestaurantFoodItemType,
      description: "The food item being added & its info",
      resolve: o => o.foodItem,
    });
    t.boolean("added", { description: "A boolean that indicates if the food item has been successfully being added to a restaurant" });
  },
});

export const AddRestaurantFoodItemResult = unionType({
  name: "AddRestaurantFoodItemResult",
  definition(t) {
    t.members("AddRestaurantFoodItem", "Error");
  },
  resolveType: item => {
    if (item.error) {
      return "Error";
    } else {
      return "AddRestaurantFoodItem";
    }
  },
});

export const UpdateRestaurantFoodItemType = objectType({
  name: "UpdateRestaurantFoodItem",
  description: "Info to be returned when the food item of #beach_bar restaurant, is updated",
  definition(t) {
    t.field("foodItem", {
      type: RestaurantFoodItemType,
      description: "The food item being updated",
      resolve: o => o.foodItem,
    });
    t.boolean("updated", { description: "A boolean that indicates if the food item has been successfully updated" });
  },
});

export const UpdateRestaurantFoodItemResult = unionType({
  name: "UpdateRestaurantFoodItemResult",
  definition(t) {
    t.members("UpdateRestaurantFoodItem", "Error");
  },
  resolveType: item => {
    if (item.error) {
      return "Error";
    } else {
      return "UpdateRestaurantFoodItem";
    }
  },
});
