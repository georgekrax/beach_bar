"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRestaurantFoodItemResult = exports.UpdateRestaurantFoodItemType = exports.AddRestaurantFoodItemResult = exports.AddRestaurantFoodItemType = exports.RestaurantFoodItemType = exports.RestaurantMenuCategoryType = void 0;
const graphql_1 = require("@the_hashtag/common/dist/graphql");
const nexus_1 = require("nexus");
exports.RestaurantMenuCategoryType = nexus_1.objectType({
    name: "RestaurantMenuCategory",
    description: "Represents a category of a #beach_bar's restaurant menu",
    definition(t) {
        t.id("id", { description: "The ID value of the menu category" });
        t.string("name", { description: "The name of the menu category" });
    },
});
exports.RestaurantFoodItemType = nexus_1.objectType({
    name: "RestaurantFoodItem",
    description: "Represents a #beach_bar's restaurant food item (product) in its menu catalog",
    definition(t) {
        t.field("id", { type: graphql_1.BigIntScalar, description: "The ID value of the food item" });
        t.string("name", { description: "The name of the food item" });
        t.float("price", { description: "The price of the food item, in decimal format with precision of five (5) & scale of two (2)" });
        t.nullable.string("imgUrl", { description: "The URL value of the food item's picture" });
        t.field("menuCategory", {
            type: exports.RestaurantMenuCategoryType,
            description: "The menu category this food item is associated to",
            resolve: o => o.menuCategory,
        });
    },
});
exports.AddRestaurantFoodItemType = nexus_1.objectType({
    name: "AddRestaurantFoodItem",
    description: "Info to be returned when a food item is added to a #beach_bar's restaurant",
    definition(t) {
        t.field("foodItem", {
            type: exports.RestaurantFoodItemType,
            description: "The food item being added & its info",
            resolve: o => o.foodItem,
        });
        t.boolean("added", { description: "A boolean that indicates if the food item has been successfully being added to a restaurant" });
    },
});
exports.AddRestaurantFoodItemResult = nexus_1.unionType({
    name: "AddRestaurantFoodItemResult",
    definition(t) {
        t.members("AddRestaurantFoodItem", "Error");
    },
    resolveType: item => {
        if (item.error) {
            return "Error";
        }
        else {
            return "AddRestaurantFoodItem";
        }
    },
});
exports.UpdateRestaurantFoodItemType = nexus_1.objectType({
    name: "UpdateRestaurantFoodItem",
    description: "Info to be returned when the food item of #beach_bar restaurant, is updated",
    definition(t) {
        t.field("foodItem", {
            type: exports.RestaurantFoodItemType,
            description: "The food item being updated",
            resolve: o => o.foodItem,
        });
        t.boolean("updated", { description: "A boolean that indicates if the food item has been successfully updated" });
    },
});
exports.UpdateRestaurantFoodItemResult = nexus_1.unionType({
    name: "UpdateRestaurantFoodItemResult",
    definition(t) {
        t.members("UpdateRestaurantFoodItem", "Error");
    },
    resolveType: item => {
        if (item.error) {
            return "Error";
        }
        else {
            return "UpdateRestaurantFoodItem";
        }
    },
});
