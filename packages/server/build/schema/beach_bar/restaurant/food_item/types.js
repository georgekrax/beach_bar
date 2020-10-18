"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRestaurantFoodItemResult = exports.UpdateRestaurantFoodItemType = exports.AddRestaurantFoodItemResult = exports.AddRestaurantFoodItemType = exports.RestaurantFoodItemType = exports.RestaurantMenuCategoryType = void 0;
const common_1 = require("@georgekrax-hashtag/common");
const schema_1 = require("@nexus/schema");
exports.RestaurantMenuCategoryType = schema_1.objectType({
    name: "RestaurantMenuCategory",
    description: "Represents a category of a #beach_bar's restaurant menu",
    definition(t) {
        t.int("id", { nullable: false, description: "The ID value of the menu category" });
        t.string("name", { nullable: false, description: "The name of the menu category" });
    },
});
exports.RestaurantFoodItemType = schema_1.objectType({
    name: "RestaurantFoodItem",
    description: "Represents a #beach_bar's restaurant food item (product) in its menu catalog",
    definition(t) {
        t.field("id", { type: common_1.BigIntScalar, nullable: false, description: "The ID value of the food item" });
        t.string("name", { nullable: false, description: "The name of the food item" });
        t.float("price", {
            nullable: false,
            description: "The price of the food item, in decimal format with precision of five (5) & scale of two (2)",
        });
        t.string("imgUrl", { nullable: true, description: "The URL value of the food item's picture" });
        t.field("menuCategory", {
            type: exports.RestaurantMenuCategoryType,
            description: "The menu category this food item is associated to",
            nullable: false,
            resolve: o => o.menuCategory,
        });
    },
});
exports.AddRestaurantFoodItemType = schema_1.objectType({
    name: "AddRestaurantFoodItem",
    description: "Info to be returned when a food item is added to a #beach_bar's restaurant",
    definition(t) {
        t.field("foodItem", {
            type: exports.RestaurantFoodItemType,
            description: "The food item being added & its info",
            nullable: false,
            resolve: o => o.foodItem,
        });
        t.boolean("added", {
            nullable: false,
            description: "A boolean that indicates if the food item has been successfully being added to a restaurant",
        });
    },
});
exports.AddRestaurantFoodItemResult = schema_1.unionType({
    name: "AddRestaurantFoodItemResult",
    definition(t) {
        t.members("AddRestaurantFoodItem", "Error");
        t.resolveType(item => {
            if (item.error) {
                return "Error";
            }
            else {
                return "AddRestaurantFoodItem";
            }
        });
    },
});
exports.UpdateRestaurantFoodItemType = schema_1.objectType({
    name: "UpdateRestaurantFoodItem",
    description: "Info to be returned when the food item of #beach_bar restaurant, is updated",
    definition(t) {
        t.field("foodItem", {
            type: exports.RestaurantFoodItemType,
            description: "The food item being updated",
            nullable: false,
            resolve: o => o.foodItem,
        });
        t.boolean("updated", {
            nullable: false,
            description: "A boolean that indicates if the food item has been successfully updated",
        });
    },
});
exports.UpdateRestaurantFoodItemResult = schema_1.unionType({
    name: "UpdateRestaurantFoodItemResult",
    definition(t) {
        t.members("UpdateRestaurantFoodItem", "Error");
        t.resolveType(item => {
            if (item.error) {
                return "Error";
            }
            else {
                return "UpdateRestaurantFoodItem";
            }
        });
    },
});
//# sourceMappingURL=types.js.map