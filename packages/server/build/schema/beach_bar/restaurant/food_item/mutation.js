"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantFoodItemCrudMutation = void 0;
const common_1 = require("@beach_bar/common");
const graphql_1 = require("@the_hashtag/common/dist/graphql");
const BeachBarRestaurant_1 = require("entity/BeachBarRestaurant");
const RestaurantFoodItem_1 = require("entity/RestaurantFoodItem");
const RestaurantMenuCategory_1 = require("entity/RestaurantMenuCategory");
const nexus_1 = require("nexus");
const checkScopes_1 = require("utils/checkScopes");
const types_1 = require("../../../types");
const types_2 = require("./types");
exports.RestaurantFoodItemCrudMutation = nexus_1.extendType({
    type: "Mutation",
    definition(t) {
        t.field("addRestaurantFoodItem", {
            type: types_2.AddRestaurantFoodItemResult,
            description: "Add a food item to a #beach_bar restaurant",
            args: {
                restaurantId: nexus_1.intArg({ description: "The ID value of the #beach_bar restaurant" }),
                name: nexus_1.stringArg({ description: "The name of the food item" }),
                price: nexus_1.floatArg({ description: "The price of the food item in the menu catalogue" }),
                menuCategoryId: nexus_1.intArg({ description: "The ID value of the category of the gastronomic menu, the food item is assigned to" }),
                imgUrl: nexus_1.nullable(nexus_1.stringArg({
                    description: "An image representing the food item product",
                })),
            },
            resolve: (_, { restaurantId, name, price, menuCategoryId, imgUrl }, { payload }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload) {
                    return { error: { code: common_1.errors.NOT_AUTHENTICATED_CODE, message: common_1.errors.NOT_AUTHENTICATED_MESSAGE } };
                }
                if (!checkScopes_1.checkScopes(payload, [
                    "beach_bar@crud:beach_bar",
                    "beach_bar@crud:beach_bar_restaurant",
                    "beach_bar@crud:restaurant_food_item",
                ])) {
                    return {
                        error: {
                            code: common_1.errors.UNAUTHORIZED_CODE,
                            message: "You are not allowed to add a food item to to a #beach_bar's restaurant",
                        },
                    };
                }
                if (!restaurantId || restaurantId <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid #beach_bar restaurant" } };
                }
                if (!name || name.trim().length === 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid name" } };
                }
                if (!price || price <= 0) {
                    return {
                        error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid price, with a value greater than 0" },
                    };
                }
                if (!menuCategoryId || menuCategoryId <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid menu category" } };
                }
                if (imgUrl && imgUrl.trim().length === 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid image" } };
                }
                const restaurant = yield BeachBarRestaurant_1.BeachBarRestaurant.findOne({ where: { id: restaurantId }, relations: ["beachBar"] });
                if (!restaurant) {
                    return { error: { code: common_1.errors.CONFLICT, message: "Specified restaurant does not exist" } };
                }
                const menuCategory = yield RestaurantMenuCategory_1.RestaurantMenuCategory.findOne(menuCategoryId);
                if (!menuCategory) {
                    return { error: { code: common_1.errors.CONFLICT, message: common_1.errors.SOMETHING_WENT_WRONG } };
                }
                const newFoodItem = RestaurantFoodItem_1.RestaurantFoodItem.create({
                    name,
                    price,
                    imgUrl: imgUrl.toString(),
                    menuCategory,
                    restaurant,
                });
                try {
                    yield newFoodItem.save();
                    yield restaurant.beachBar.updateRedis();
                }
                catch (err) {
                    if (err.message === 'duplicate key value violates unique constraint "restaurant_food_item_restaurant_id_name_key"') {
                        return {
                            error: {
                                code: common_1.errors.CONFLICT,
                                message: `Food item with the name ${name}, already exists in the menu of the restaurant`,
                            },
                        };
                    }
                    return { error: { message: `${common_1.errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
                }
                return {
                    foodItem: newFoodItem,
                    added: true,
                };
            }),
        });
        t.field("updateRestaurantFoodItem", {
            type: types_2.UpdateRestaurantFoodItemResult,
            description: "Update a #beach_bar's restaurant food item details",
            args: {
                foodItemId: nexus_1.arg({
                    type: graphql_1.BigIntScalar,
                    description: "The ID value of the food item",
                }),
                name: nexus_1.nullable(nexus_1.stringArg({
                    description: "The name of the food item",
                })),
                price: nexus_1.nullable(nexus_1.floatArg({
                    description: "The price of the food item in the menu catalogue",
                })),
                menuCategoryId: nexus_1.nullable(nexus_1.intArg({
                    description: "The ID value of the category of the gastronomic menu, the food item is assigned to",
                })),
                imgUrl: nexus_1.nullable(nexus_1.stringArg({
                    description: "An image representing the food item product",
                })),
            },
            resolve: (_, { foodItemId, name, price, menuCategoryId, imgUrl }, { payload }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload) {
                    return { error: { code: common_1.errors.NOT_AUTHENTICATED_CODE, message: common_1.errors.NOT_AUTHENTICATED_MESSAGE } };
                }
                if (!checkScopes_1.checkScopes(payload, [
                    "beach_bar@crud:beach_bar",
                    "beach_bar@crud:beach_bar_restaurant",
                    "beach_bar@crud:restaurant_food_item",
                    "beach_bar@update:restaurant_food_item",
                ])) {
                    return {
                        error: {
                            code: common_1.errors.UNAUTHORIZED_CODE,
                            message: "You are not allowed to add a food item to to a #beach_bar's restaurant",
                        },
                    };
                }
                if (!foodItemId || foodItemId <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid food item" } };
                }
                if (name && name.trim().length === 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid name" } };
                }
                if (price && price <= 0) {
                    return {
                        error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid price, with a value greater than 0" },
                    };
                }
                if (menuCategoryId && menuCategoryId <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid menu category" } };
                }
                const foodItem = yield RestaurantFoodItem_1.RestaurantFoodItem.findOne({
                    where: { id: foodItemId },
                    relations: ["restaurant", "restaurant.beachBar", "menuCategory"],
                });
                if (!foodItem) {
                    return { error: { code: common_1.errors.CONFLICT, message: "Specified food item does not exist" } };
                }
                try {
                    const updatedFoodItem = yield foodItem.update(payload, name, price, menuCategoryId, imgUrl);
                    if (!updatedFoodItem) {
                        return { error: { message: common_1.errors.SOMETHING_WENT_WRONG } };
                    }
                    return {
                        foodItem: updatedFoodItem,
                        updated: true,
                    };
                }
                catch (err) {
                    return { error: { message: `${common_1.errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
                }
            }),
        });
        t.field("deleteRestaurantFoodItem", {
            type: types_1.DeleteResult,
            description: "Delete (remove) a food item from a #beach_bar's restaurant",
            args: {
                foodItemId: nexus_1.arg({
                    type: graphql_1.BigIntScalar,
                    description: "The ID value of the food item",
                }),
            },
            resolve: (_, { foodItemId }, { payload }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload) {
                    return { error: { code: common_1.errors.NOT_AUTHENTICATED_CODE, message: common_1.errors.NOT_AUTHENTICATED_MESSAGE } };
                }
                if (!checkScopes_1.checkScopes(payload, [
                    "beach_bar@crud:beach_bar",
                    "beach_bar@crud:beach_bar_restaurant",
                    "beach_bar@crud:restaurant_food_item",
                ])) {
                    return {
                        error: {
                            code: common_1.errors.UNAUTHORIZED_CODE,
                            message: "You are not allowed to add a food item to to a #beach_bar's restaurant",
                        },
                    };
                }
                if (!foodItemId || foodItemId <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid food item" } };
                }
                const foodItem = yield RestaurantFoodItem_1.RestaurantFoodItem.findOne({
                    where: { id: foodItemId },
                    relations: ["restaurant", "restaurant.beachBar"],
                });
                if (!foodItem) {
                    return { error: { code: common_1.errors.CONFLICT, message: "Specified food item does not exist" } };
                }
                try {
                    yield foodItem.softRemove();
                }
                catch (err) {
                    return { error: { message: `${common_1.errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
                }
                return {
                    deleted: true,
                };
            }),
        });
    },
});
