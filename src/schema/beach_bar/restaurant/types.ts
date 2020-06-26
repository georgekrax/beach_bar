import { objectType } from "@nexus/schema";
import { BeachBarType } from "../types";
import { BigIntScalar } from "../../../common/bigIntScalar";

export const RestaurantMenuCategoryType = objectType({
  name: "RestaurantMenuCategory",
  description: "Represents a category of a #beach_bar's restaurant menu",
  definition(t) {
    t.int("id", { nullable: false, description: "The ID value of the menu category" });
    t.string("name", { nullable: false, description: "The name of the menu category" });
  },
});

export const RestaurantFoodItemType = objectType({
  name: "RestaurantFoodItem",
  description: "Represents 2 #beach_bar's restaurant food item (product) in its menu catalog",
  definition(t) {
    t.field("id", { type: BigIntScalar, nullable: false, description: "The ID value of the food item" });
    t.string("name", { nullable: false, description: "The name of the food item" });
    t.float("price", {
      nullable: false,
      description: "The price of the food item, in decimal format with precision of five (5) & sclae of two (2)",
    });
    t.string("imgUrl", { nullable: true, description: "The URL value of the food item's picture" });
    t.field("menuCategory", {
      type: RestaurantMenuCategoryType,
      description: "The menu category this food item is associated to",
      nullable: false,
      resolve: o => o.menuCategory,
    });
  },
});

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
