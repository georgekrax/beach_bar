import { resolve } from "@/utils/data";
import { objectType } from "nexus";
import { RestaurantFoodItem, RestaurantMenuCategory } from "nexus-prisma";

export const RestaurantMenuCategoryType = objectType({
  name: RestaurantMenuCategory.$name,
  description: "Represents a category of a #beach_bar's restaurant menu",
  definition(t) {
    // t.id("id");
    // t.string("name");
    t.field(RestaurantMenuCategory.id);
    t.field(RestaurantMenuCategory.name);
  },
});

export const RestaurantFoodItemType = objectType({
  name: RestaurantFoodItem.$name,
  description: "Represents a #beach_bar's restaurant food item (product) in its menu catalog",
  definition(t) {
    // t.id("id");
    // t.string("name");
    // t.float("price");
    // t.nullable.field("imgUrl", { type: UrlScalar, description: "The URL value of the food item's picture" });
    // t.field("menuCategory", { type: RestaurantMenuCategoryType, description: "The menu category this food item is associated to" });
    t.field(RestaurantFoodItem.id);
    t.field(RestaurantFoodItem.name);
    t.field(RestaurantFoodItem.price);
    t.field(RestaurantFoodItem.imgUrl);
    t.field(resolve(RestaurantFoodItem.menuCategory));
  },
});

// export const AddRestaurantFoodItemType = objectType({
//   name: "AddRestaurantFoodItem",
//   description: "Info to be returned when a food item is added to a #beach_bar's restaurant",
//   definition(t) {
//     t.field("foodItem", { type: RestaurantFoodItemType, description: "The food item being added & its info" });
//     t.boolean("added", { description: "A boolean that indicates if the food item has been successfully being added to a restaurant" });
//   },
// });

// export const AddRestaurantFoodItemResult = unionType({
//   name: "AddRestaurantFoodItemResult",
//   definition(t) {
//     t.members("AddRestaurantFoodItem", "Error");
//   },
//   resolveType: item => {
//     if (item.error) return "Error";
//     else return "AddRestaurantFoodItem";
//   },
// });

// export const UpdateRestaurantFoodItemType = objectType({
//   name: "UpdateRestaurantFoodItem",
//   description: "Info to be returned when the food item of #beach_bar restaurant, is updated",
//   definition(t) {
//     t.field("foodItem", { type: RestaurantFoodItemType, description: "The food item being updated" });
//     t.boolean("updated", { description: "A boolean that indicates if the food item has been successfully updated" });
//   },
// });

// export const UpdateRestaurantFoodItemResult = unionType({
//   name: "UpdateRestaurantFoodItemResult",
//   definition(t) {
//     t.members("UpdateRestaurantFoodItem", "Error");
//   },
//   resolveType: item => {
//     if (item.error) return "Error";
//     else return "UpdateRestaurantFoodItem";
//   },
// });
