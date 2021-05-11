import { errors, MyContext } from "@beach_bar/common";
import { ApolloError, UserInputError } from "apollo-server-errors";
import { BeachBarRestaurant } from "entity/BeachBarRestaurant";
import { RestaurantFoodItem } from "entity/RestaurantFoodItem";
import { RestaurantMenuCategory } from "entity/RestaurantMenuCategory";
import { arg, extendType, floatArg, idArg, intArg, nullable, stringArg } from "nexus";
import { TDelete } from "typings/.index";
import { TAddRestaurantFoodItem, TUpdateRestaurantFoodItem } from "typings/beach_bar/restaurant/footItem";
import { isAuth, throwScopesUnauthorized } from "utils/auth/payload";
import { DeleteGraphQlType } from "../../../types";
import { UrlScalar } from "@the_hashtag/common/dist/graphql";
import { AddRestaurantFoodItemType, UpdateRestaurantFoodItemType } from "./types";

export const RestaurantFoodItemCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addRestaurantFoodItem", {
      type: AddRestaurantFoodItemType,
      description: "Add a food item to a #beach_bar restaurant",
      args: {
        restaurantId: idArg(),
        name: stringArg({ description: "The name of the food item" }),
        price: floatArg({ description: "The price of the food item in the menu catalogue" }),
        menuCategoryId: intArg({ description: "The ID value of the category of the gastronomic menu, the food item is assigned to" }),
        imgUrl: nullable(arg({ type: UrlScalar, description: "An image representing the food item product" })),
      },
      resolve: async (
        _,
        { restaurantId, name, price, menuCategoryId, imgUrl },
        { payload }: MyContext
      ): Promise<TAddRestaurantFoodItem> => {
        isAuth(payload);
        throwScopesUnauthorized(payload, "You are not allowed to add a food item to a #beach_bar's restaurant", [
          "beach_bar@crud:beach_bar",
          "beach_bar@crud:beach_bar_restaurant",
          "beach_bar@crud:restaurant_food_item",
        ]);

        if (!price || price <= 0) throw new UserInputError("Please provide a valid price, with a value greater than 0");

        const restaurant = await BeachBarRestaurant.findOne({ where: { id: restaurantId }, relations: ["beachBar"] });
        if (!restaurant) throw new ApolloError("Restaurant was not found", errors.NOT_FOUND);

        const menuCategory = await RestaurantMenuCategory.findOne(menuCategoryId);
        if (!menuCategory) throw new ApolloError("Menu category was not found", errors.NOT_FOUND);

        const newFoodItem = RestaurantFoodItem.create({ name, price, imgUrl: imgUrl.toString(), menuCategory, restaurant });

        try {
          await newFoodItem.save();
          await restaurant.beachBar.updateRedis();
        } catch (err) {
          if (err.message === 'duplicate key value violates unique constraint "restaurant_food_item_restaurant_id_name_key"')
            throw new ApolloError(`Food item with the name ${name}, already exists in the menu of the restaurant`, errors.CONFLICT);
          throw new ApolloError(errors.SOMETHING_WENT_WRONG + ": " + err.message);
        }

        return { foodItem: newFoodItem, added: true };
      },
    });
    t.field("updateRestaurantFoodItem", {
      type: UpdateRestaurantFoodItemType,
      description: "Update a #beach_bar's restaurant food item details",
      args: {
        foodItemId: idArg(),
        name: nullable(stringArg()),
        price: nullable(floatArg()),
        menuCategoryId: nullable(idArg()),
        imgUrl: nullable(stringArg()),
      },
      resolve: async (
        _,
        { foodItemId, name, price, menuCategoryId, imgUrl },
        { payload }: MyContext
      ): Promise<TUpdateRestaurantFoodItem> => {
        isAuth(payload);
        throwScopesUnauthorized(payload, "You are not allowed to update a food item of a #beach_bar's restaurant", [
          "beach_bar@crud:beach_bar",
          "beach_bar@crud:beach_bar_restaurant",
          "beach_bar@crud:restaurant_food_item",
          "beach_bar@update:restaurant_food_item",
        ]);

        if (price && price <= 0) throw new UserInputError("Please provid a valid price, with a value greater than 0");

        const foodItem = await RestaurantFoodItem.findOne({
          where: { id: foodItemId },
          relations: ["restaurant", "restaurant.beachBar", "menuCategory"],
        });
        if (!foodItem) throw new ApolloError("Food item does not exist", errors.NOT_FOUND);

        try {
          const updatedFoodItem = await foodItem.update(payload, name, price, menuCategoryId, imgUrl);
          if (!updatedFoodItem) throw new ApolloError(errors.SOMETHING_WENT_WRONG);
          return { foodItem: updatedFoodItem, updated: true };
        } catch (err) {
          throw new ApolloError(err.message);
        }
      },
    });
    t.field("deleteRestaurantFoodItem", {
      type: DeleteGraphQlType,
      description: "Delete (remove) a food item from a #beach_bar's restaurant",
      args: { foodItemId: idArg() },
      resolve: async (_, { foodItemId }, { payload }: MyContext): Promise<TDelete> => {
        isAuth(payload);
        throwScopesUnauthorized(payload, "You are not allowed to remove a food item from a #beach_bar's restaurant", [
          "beach_bar@crud:beach_bar",
          "beach_bar@crud:beach_bar_restaurant",
          "beach_bar@crud:restaurant_food_item",
        ]);

        const foodItem = await RestaurantFoodItem.findOne({
          where: { id: foodItemId },
          relations: ["restaurant", "restaurant.beachBar"],
        });
        if (!foodItem) throw new ApolloError("Food item was not found", errors.NOT_FOUND);

        try {
          await foodItem.softRemove();
        } catch (err) {
          throw new ApolloError(err.message);
        }

        return { deleted: true };
      },
    });
  },
});
