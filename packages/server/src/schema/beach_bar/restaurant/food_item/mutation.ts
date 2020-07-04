import { BigIntScalar, MyContext } from "@beach_bar/common";
import { arg, extendType, floatArg, intArg, stringArg } from "@nexus/schema";
import { IsNull } from "typeorm";
import errors from "../../../../constants/errors";
import { BeachBarRestaurant } from "../../../../entity/BeachBarRestaurant";
import { RestaurantFoodItem } from "../../../../entity/RestaurantFoodItem";
import { RestaurantMenuCategory } from "../../../../entity/RestaurantMenuCategory";
import { checkScopes } from "../../../../utils/checkScopes";
import { DeleteType, ErrorType } from "../../../returnTypes";
import { DeleteResult } from "../../../types";
import { AddRestaurantFoodItemType, UpdateRestaurantFoodItemType } from "./returnTypes";
import { AddRestaurantFoodItemResult, UpdateRestaurantFoodItemResult } from "./types";

export const RestaurantFoodItemCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addRestaurantFoodItem", {
      type: AddRestaurantFoodItemResult,
      description: "Add a food item to a #beach_bar restaurant",
      nullable: false,
      args: {
        restaurantId: intArg({
          required: true,
          description: "The ID value of the #beach_bar restaurant",
        }),
        name: stringArg({
          required: true,
          description: "The name of the food item",
        }),
        price: floatArg({
          required: true,
          description: "The price of the food item in the menu catalogue",
        }),
        menuCategoryId: intArg({
          required: true,
          description: "The ID value of the category of the gastronomic menu, the food item is assigned to",
        }),
        imgUrl: stringArg({
          required: false,
          description: "An image representing the food item product",
        }),
      },
      resolve: async (
        _,
        { restaurantId, name, price, menuCategoryId, imgUrl },
        { payload }: MyContext,
      ): Promise<AddRestaurantFoodItemType | ErrorType> => {
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

        const restaurant = await BeachBarRestaurant.findOne(restaurantId);
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
          imgUrl,
          menuCategory,
          restaurant,
        });

        try {
          await newFoodItem.save();
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
      nullable: false,
      args: {
        foodItemId: arg({
          type: BigIntScalar,
          required: true,
          description: "The ID value of the food item",
        }),
        name: stringArg({
          required: false,
          description: "The name of the food item",
        }),
        price: floatArg({
          required: false,
          description: "The price of the food item in the menu catalogue",
        }),
        menuCategoryId: intArg({
          required: false,
          description: "The ID value of the category of the gastronomic menu, the food item is assigned to",
        }),
        imgUrl: stringArg({
          required: false,
          description: "An image representing the food item product",
        }),
      },
      resolve: async (
        _,
        { foodItemId, name, price, menuCategoryId, imgUrl },
        { payload }: MyContext,
      ): Promise<UpdateRestaurantFoodItemType | ErrorType> => {
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
        if (imgUrl && imgUrl.trim().length === 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid image" } };
        }

        const foodItem = await RestaurantFoodItem.findOne({
          where: { id: foodItemId, deletedAt: IsNull() },
          relations: ["restaurant", "menuCategory"],
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
          required: true,
          description: "The ID value of the food item",
        }),
      },
      resolve: async (_, { foodItemId }, { payload }: MyContext): Promise<DeleteType | ErrorType> => {
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

        const foodItem = await RestaurantFoodItem.findOne({ id: foodItemId, deletedAt: IsNull() });
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
