import { checkScopes, isAuth, throwScopesUnauthorized } from "@/utils/auth";
import { updateRedis } from "@/utils/db";
import { errors } from "@beach_bar/common";
import { UrlScalar } from "@the_hashtag/common/dist/graphql";
import { ApolloError, UserInputError } from "apollo-server-errors";
import { arg, extendType, floatArg, idArg, intArg, nullable, stringArg } from "nexus";
import { RestaurantFoodItemType } from "./types";

export const RestaurantFoodItemCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addRestaurantFoodItem", {
      type: RestaurantFoodItemType,
      description: "Add a food item to a #beach_bar restaurant",
      args: {
        restaurantId: idArg(),
        name: stringArg({ description: "The name of the food item" }),
        price: floatArg({ description: "The price of the food item in the menu catalogue" }),
        menuCategoryId: intArg({ description: "The ID value of the category of the gastronomic menu, the food item is assigned to" }),
        imgUrl: nullable(arg({ type: UrlScalar.name, description: "An image representing the food item product" })),
      },
      resolve: async (_, args, { prisma, payload }) => {
        isAuth(payload);
        throwScopesUnauthorized(payload, "You are not allowed to add a food item to a #beach_bar's restaurant", [
          "beach_bar@crud:beach_bar",
          "beach_bar@crud:beach_bar_restaurant",
          "beach_bar@crud:restaurant_food_item",
        ]);

        if (args.price <= 0) throw new UserInputError("Please provide a valid price, with a value greater than 0");

        const restaurant = await prisma.beachBarRestaurant.findUnique({ where: { id: +args.restaurantId } });
        if (!restaurant) throw new ApolloError("Restaurant was not found", errors.NOT_FOUND);

        const menuCategory = await prisma.restaurantMenuCategory.findUnique({ where: { id: +args.menuCategoryId } });
        if (!menuCategory) throw new ApolloError("Menu category was not found", errors.NOT_FOUND);

        try {
          const newFood = await prisma.restaurantFoodItem.create({
            include: {restaurant: true},
            data: { ...args, restaurantId: restaurant.id, menuCategoryId: menuCategory.id },
          });

          await updateRedis({ model: "BeachBar", id: newFood.restaurant.beachBarId });
          return newFood;
        } catch (err) {
          if (err.message === 'duplicate key value violates unique constraint "restaurant_food_item_restaurant_id_name_key"') {
            throw new ApolloError(
              `Food item with the name ${args.name}, already exists in the menu of the restaurant`,
              errors.CONFLICT
            );
          }
          throw new ApolloError(errors.SOMETHING_WENT_WRONG + ": " + err.message);
        }
      },
    });
    t.field("updateRestaurantFoodItem", {
      type: RestaurantFoodItemType,
      description: "Update a #beach_bar's restaurant food item details",
      args: {
        foodItemId: idArg(),
        name: nullable(stringArg()),
        price: nullable(floatArg()),
        menuCategoryId: nullable(idArg()),
        imgUrl: nullable(arg({ type: UrlScalar.name })),
      },
      resolve: async (_, { foodItemId, price, menuCategoryId, ...args }, { prisma, payload }) => {
        isAuth(payload);
        throwScopesUnauthorized(payload, "You are not allowed to update a food item of a #beach_bar's restaurant", [
          "beach_bar@crud:beach_bar",
          "beach_bar@crud:beach_bar_restaurant",
          "beach_bar@crud:restaurant_food_item",
          "beach_bar@update:restaurant_food_item",
        ]);

        if (price && price <= 0) throw new UserInputError("Please provid a valid price, with a value greater than 0");

        try {
          if (price != null && checkScopes(payload, ["beach_bar@update:restaurant_food_item"])) {
            throw new Error("You are not allowed to modify the price of the food item product");
          }
          if (menuCategoryId && menuCategoryId !== this.menuCategoryId) {
            const menuCategory = await prisma.restaurantMenuCategory.findUnique({ where: { id: +menuCategoryId } });
            if (!menuCategory) throw new Error("Please provide a valid menu category");
          }

          const updatedFood = await prisma.restaurantFoodItem.update({
            where: { id: +foodItemId },
            include: { restaurant: true },
            data: {
              ...args,
              name: args.name || undefined,
              menuCategoryId: menuCategoryId ? +menuCategoryId : undefined,
            },
          });

          await updateRedis({ model: "BeachBar", id: updatedFood.restaurant.beachBarId });
          return updatedFood;
        } catch (err) {
          throw new ApolloError(err.message);
        }
      },
    });
    t.boolean("deleteRestaurantFoodItem", {
      description: "Delete (remove) a food item from a #beach_bar's restaurant",
      args: { id: idArg() },
      resolve: async (_, __, { payload }) => {
        isAuth(payload);
        throwScopesUnauthorized(payload, "You are not allowed to remove a food item from a #beach_bar's restaurant", [
          "beach_bar@crud:beach_bar",
          "beach_bar@crud:beach_bar_restaurant",
          "beach_bar@crud:restaurant_food_item",
        ]);

        // const foodItem = await RestaurantFoodItem.findOne({
        //   where: { id: foodItemId },
        //   relations: ["restaurant", "restaurant.beachBar"],
        // });
        // if (!foodItem) throw new ApolloError("Food item was not found", errors.NOT_FOUND);

        // try {
        //   await foodItem.softRemove();
        // } catch (err) {
        //   throw new ApolloError(err.message);
        // }

        return true;
      },
    });
  },
});
