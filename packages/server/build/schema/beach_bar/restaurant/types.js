"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBeachBarRestaurantResult = exports.UpdateBeachBarRestaurantType = exports.AddBeachBarRestaurantResult = exports.AddBeachBarRestaurantType = exports.BeachBarRestaurantType = void 0;
const schema_1 = require("@nexus/schema");
const types_1 = require("../types");
const types_2 = require("./food_item/types");
exports.BeachBarRestaurantType = schema_1.objectType({
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
            type: types_1.BeachBarType,
            description: "The #beach_bar this restaurant is owned by",
            nullable: false,
            resolve: o => o.beachBar,
        });
        t.list.field("foodItems", {
            type: types_2.RestaurantFoodItemType,
            description: "A list of food items (products) in the menu of the restaurant",
            nullable: true,
            resolve: o => o.foodItems,
        });
    },
});
exports.AddBeachBarRestaurantType = schema_1.objectType({
    name: "AddBeachBarRestaurant",
    description: "Info to be returned when a restaurant is added to a #beach_bar",
    definition(t) {
        t.field("restaurant", {
            type: exports.BeachBarRestaurantType,
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
exports.AddBeachBarRestaurantResult = schema_1.unionType({
    name: "AddBeachBarRestaurantResult",
    definition(t) {
        t.members("AddBeachBarRestaurant", "Error");
        t.resolveType(item => {
            if (item.error) {
                return "Error";
            }
            else {
                return "AddBeachBarRestaurant";
            }
        });
    },
});
exports.UpdateBeachBarRestaurantType = schema_1.objectType({
    name: "UpdateBeachBarRestaurant",
    description: "Info to be returned when the details of #beach_bar restaurant, are updated",
    definition(t) {
        t.field("restaurant", {
            type: exports.BeachBarRestaurantType,
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
exports.UpdateBeachBarRestaurantResult = schema_1.unionType({
    name: "UpdateBeachBarRestaurantResult",
    definition(t) {
        t.members("UpdateBeachBarRestaurant", "Error");
        t.resolveType(item => {
            if (item.error) {
                return "Error";
            }
            else {
                return "UpdateBeachBarRestaurant";
            }
        });
    },
});
//# sourceMappingURL=types.js.map