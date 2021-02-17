import { errors, MyContext } from "@beach_bar/common";
import { BigIntScalar } from "@the_hashtag/common/dist/graphql";
import { BeachBarRestaurant } from "entity/BeachBarRestaurant";
import { RestaurantFoodItem } from "entity/RestaurantFoodItem";
import { RestaurantMenuCategory } from "entity/RestaurantMenuCategory";
import { arg, extendType, floatArg, intArg, nullable, stringArg } from "nexus";
import { DeleteType } from "typings/.index";
import { AddRestaurantFoodItemType, UpdateRestaurantFoodItemType } from "typings/beach_bar/restaurant/footItem";
import { checkScopes } from "utils/checkScopes";
import { DeleteResult } from "../../../types";
import { AddRestaurantFoodItemResult, UpdateRestaurantFoodItemResult } from "./types";

export const RestaurantFoodItemCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addRestaurantFoodItem", {
      type: AddRestaurantFoodItemResult,
      description: "Add a food item to a #beach_bar restaurant",
      args: {
        restaurantId: intArg({ description: "The ID value of the #beach_bar restaurant" }),
        name: stringArg({ description: "The name of the food item" }),
        price: floatArg({ description: "The price of the food item in the menu catalogue" }),
        menuCategoryId: intArg({ description: "The ID value of the category of the gastronomic menu, the food item is assigned to" }),
        imgUrl: nullable(
          stringArg({
            description: "An image representing the food item product",
          })
        ),
      },
      resolve: async (
        _,
        { restaurantId, name, price, menuCategoryId, imgUrl },
        { payload }: MyContext
      ): Promise<AddRestaurantFoodItemType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (
          !checkScopes(payload, [
            "beach_bar@crud:beach_bar",
            "beach_bar@crud:beach_bar_restaurant",
            "beach_bar@crud:restaurant_food_item",
          ])
        ) {
          return {
            error: {
              code: errors.UNAUTHORIZED_CODE,
              message: "You are not allowed to add a food item to to a #beach_bar's restaurant",
            },
          };
        }

        if (!restaurantId || restaurantId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid #beach_bar restaurant" } };
        }
        if (!name || name.trim().length === 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid name" } };
        }
        if (!price || price <= 0) {
          return {
            error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid price, with a value greater than 0" },
          };
        }
        if (!menuCategoryId || menuCategoryId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid menu category" } };
        }
        if (imgUrl && imgUrl.trim().length === 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid image" } };
        }

        const restaurant = await BeachBarRestaurant.findOne({ where: { id: restaurantId }, relations: ["beachBar"] });
        if (!restaurant) {
          return { error: { code: errors.CONFLICT, message: "Specified restaurant does not exist" } };
        }

        const menuCategory = await RestaurantMenuCategory.findOne(menuCategoryId);
        if (!menuCategory) {
          return { error: { code: errors.CONFLICT, message: errors.SOMETHING_WENT_WRONG } };
        }

        const newFoodItem = RestaurantFoodItem.create({
          name,
          price,
          imgUrl: imgUrl.toString(),
          menuCategory,
          restaurant,
        });

        try {
          await newFoodItem.save();
          await restaurant.beachBar.updateRedis();
        } catch (err) {
          if (err.message === 'duplicate key value violates unique constraint "restaurant_food_item_restaurant_id_name_key"') {
            return {
              error: {
                code: errors.CONFLICT,
                message: `Food item with the name ${name}, already exists in the menu of the restaurant`,
              },
            };
          }
          return { error: { message: `${errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
        }

        return {
          foodItem: newFoodItem,
          added: true,
        };
      },
    });
    t.field("updateRestaurantFoodItem", {
      type: UpdateRestaurantFoodItemResult,
      description: "Update a #beach_bar's restaurant food item details",
      args: {
        foodItemId: arg({
          type: BigIntScalar,
          description: "The ID value of the food item",
        }),
        name: nullable(
          stringArg({
            description: "The name of the food item",
          })
        ),
        price: nullable(
          floatArg({
            description: "The price of the food item in the menu catalogue",
          })
        ),
        menuCategoryId: nullable(
          intArg({
            description: "The ID value of the category of the gastronomic menu, the food item is assigned to",
          })
        ),
        imgUrl: nullable(
          stringArg({
            description: "An image representing the food item product",
          })
        ),
      },
      resolve: async (
        _,
        { foodItemId, name, price, menuCategoryId, imgUrl },
        { payload }: MyContext
      ): Promise<UpdateRestaurantFoodItemType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (
          !checkScopes(payload, [
            "beach_bar@crud:beach_bar",
            "beach_bar@crud:beach_bar_restaurant",
            "beach_bar@crud:restaurant_food_item",
            "beach_bar@update:restaurant_food_item",
          ])
        ) {
          return {
            error: {
              code: errors.UNAUTHORIZED_CODE,
              message: "You are not allowed to add a food item to to a #beach_bar's restaurant",
            },
          };
        }

        if (!foodItemId || foodItemId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid food item" } };
        }
        if (name && name.trim().length === 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid name" } };
        }
        if (price && price <= 0) {
          return {
            error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid price, with a value greater than 0" },
          };
        }
        if (menuCategoryId && menuCategoryId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid menu category" } };
        }

        const foodItem = await RestaurantFoodItem.findOne({
          where: { id: foodItemId },
          relations: ["restaurant", "restaurant.beachBar", "menuCategory"],
        });
        if (!foodItem) {
          return { error: { code: errors.CONFLICT, message: "Specified food item does not exist" } };
        }

        try {
          const updatedFoodItem = await foodItem.update(payload, name, price, menuCategoryId, imgUrl);
          if (!updatedFoodItem) {
            return { error: { message: errors.SOMETHING_WENT_WRONG } };
          }
          return {
            foodItem: updatedFoodItem,
            updated: true,
          };
        } catch (err) {
          return { error: { message: `${errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
        }
      },
    });
    t.field("deleteRestaurantFoodItem", {
      type: DeleteResult,
      description: "Delete (remove) a food item from a #beach_bar's restaurant",
      args: {
        foodItemId: arg({
          type: BigIntScalar,
          description: "The ID value of the food item",
        }),
      },
      resolve: async (_, { foodItemId }, { payload }: MyContext): Promise<DeleteType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (
          !checkScopes(payload, [
            "beach_bar@crud:beach_bar",
            "beach_bar@crud:beach_bar_restaurant",
            "beach_bar@crud:restaurant_food_item",
          ])
        ) {
          return {
            error: {
              code: errors.UNAUTHORIZED_CODE,
              message: "You are not allowed to add a food item to to a #beach_bar's restaurant",
            },
          };
        }

        if (!foodItemId || foodItemId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid food item" } };
        }

        const foodItem = await RestaurantFoodItem.findOne({
          where: { id: foodItemId },
          relations: ["restaurant", "restaurant.beachBar"],
        });
        if (!foodItem) {
          return { error: { code: errors.CONFLICT, message: "Specified food item does not exist" } };
        }

        try {
          await foodItem.softRemove();
        } catch (err) {
          return { error: { message: `${errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
        }

        return {
          deleted: true,
        };
      },
    });
  },
});
