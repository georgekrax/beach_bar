"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBeachBarRestaurantResult = exports.UpdateBeachBarRestaurantType = exports.AddBeachBarRestaurantResult = exports.AddBeachBarRestaurantType = exports.BeachBarRestaurantType = void 0;
const nexus_1 = require("nexus");
const types_1 = require("../types");
const types_2 = require("./food_item/types");
exports.BeachBarRestaurantType = nexus_1.objectType({
    name: "BeachBarRestaurant",
    description: "Represents a #beach_bar's restaurant",
    definition(t) {
        t.id("id", { description: "The ID value of the restaurant" });
        t.string("name", { description: "The name of the restaurant" });
        t.nullable.string("description", { description: "A short description (info) about the restaurant" });
        t.boolean("isActive", {
            description: "A boolean that indicates if the restaurant is active. It can be changed by the primary owner of the #beach_bar",
        });
        t.field("beachBar", {
            type: types_1.BeachBarType,
            description: "The #beach_bar this restaurant is owned by",
            resolve: o => o.beachBar,
        });
        t.nullable.list.field("foodItems", {
            type: types_2.RestaurantFoodItemType,
            description: "A list of food items (products) in the menu of the restaurant",
            resolve: o => o.foodItems,
        });
    },
});
exports.AddBeachBarRestaurantType = nexus_1.objectType({
    name: "AddBeachBarRestaurant",
    description: "Info to be returned when a restaurant is added to a #beach_bar",
    definition(t) {
        t.field("restaurant", {
            type: exports.BeachBarRestaurantType,
            description: "The restaurant that is added & its info",
            resolve: o => o.restaurant,
        });
        t.boolean("added", {
            description: "A boolean that indicates if the restaurant has been successfully being added to the #beach_bar",
        });
    },
});
exports.AddBeachBarRestaurantResult = nexus_1.unionType({
    name: "AddBeachBarRestaurantResult",
    definition(t) {
        t.members("AddBeachBarRestaurant", "Error");
    },
    resolveType: item => {
        if (item.error) {
            return "Error";
        }
        else {
            return "AddBeachBarRestaurant";
        }
    },
});
exports.UpdateBeachBarRestaurantType = nexus_1.objectType({
    name: "UpdateBeachBarRestaurant",
    description: "Info to be returned when the details of #beach_bar restaurant, are updated",
    definition(t) {
        t.field("restaurant", {
            type: exports.BeachBarRestaurantType,
            description: "The restaurant that is updated",
            resolve: o => o.restaurant,
        });
        t.boolean("updated", {
            description: "A boolean that indicates if the restaurant details have been successfully updated",
        });
    },
});
exports.UpdateBeachBarRestaurantResult = nexus_1.unionType({
    name: "UpdateBeachBarRestaurantResult",
    definition(t) {
        t.members("UpdateBeachBarRestaurant", "Error");
    },
    resolveType: item => {
        if (item.error) {
            return "Error";
        }
        else {
            return "UpdateBeachBarRestaurant";
        }
    },
});
