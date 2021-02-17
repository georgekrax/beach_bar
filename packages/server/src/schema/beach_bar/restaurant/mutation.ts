import { errors, MyContext } from "@beach_bar/common";
import { BeachBar } from "entity/BeachBar";
import { BeachBarRestaurant } from "entity/BeachBarRestaurant";
import { booleanArg, extendType, intArg, nullable, stringArg } from "nexus";
import { DeleteType } from "typings/.index";
import { AddBeachBarRestaurantType, UpdateBeachBarRestaurantType } from "typings/beach_bar/restaurant";
import { DeleteResult } from "../../types";
import { AddBeachBarRestaurantResult, UpdateBeachBarRestaurantResult } from "./types";

export const BeachBarRestaurantCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addBeachBarRestaurant", {
      type: AddBeachBarRestaurantResult,
      description: "Add a restaurant of a #beach_bar",
      args: {
        beachBarId: intArg({ description: "The ID value of the #beach_bar the restaurant will be added to" }),
        name: stringArg({ description: "The name of the restaurant" }),
        description: nullable(stringArg({ description: "A short description, info text, about the restaurant itself" })),
        isActive: nullable(
          booleanArg({
            description: "A boolean that indicates if the restaurant is active or not. Its default value is false",
            default: false,
          })
        ),
      },
      resolve: async (_, { beachBarId, name, description, isActive }, { payload }: MyContext): Promise<AddBeachBarRestaurantType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (!payload.scope.some(scope => ["beach_bar@crud:beach_bar", "beach_bar@crud:beach_bar_restaurant"].includes(scope))) {
          return {
            error: {
              code: errors.UNAUTHORIZED_CODE,
              message: "You are not allowed to add 'this' a restaurant to a #beach_bar",
            },
          };
        }

        if (!beachBarId || beachBarId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid #beach_bar" } };
        }
        if (!name || name.trim().length === 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid name" } };
        }
        if (description && description.trim().length === 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid description text" } };
        }

        const beachBar = await BeachBar.findOne(beachBarId);
        if (!beachBar) {
          return { error: { code: errors.CONFLICT, message: errors.BEACH_BAR_DOES_NOT_EXIST } };
        }

        const newRestaurant = BeachBarRestaurant.create({
          name,
          description,
          beachBar,
          isActive,
        });

        try {
          await newRestaurant.save();
          await beachBar.updateRedis();
        } catch (err) {
          if (err.message === 'duplicate key value violates unique constraint "beach_bar_restaurant_beach_bar_id_name_key"') {
            return {
              error: { code: errors.CONFLICT, message: `Specified restaurant with name '${name}' already exists in this #beach_bar` },
            };
          }
          return { error: { message: `${errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
        }

        return {
          restaurant: newRestaurant,
          added: true,
        };
      },
    });
    t.field("updateBeachBarRestaurant", {
      type: UpdateBeachBarRestaurantResult,
      description: "Update the restaurant details of a #beach_bar",
      args: {
        restaurantId: intArg({ description: "The ID value of the restaurant" }),
        name: nullable(stringArg({ description: "The name of the restaurant" })),
        description: nullable(stringArg({ description: "A short description, info text, about the restaurant itself" })),
        isActive: nullable(booleanArg({ description: "A boolean that indicates if the restaurant is active or not" })),
      },
      resolve: async (
        _,
        { restaurantId, name, description, isActive },
        { payload }: MyContext
      ): Promise<UpdateBeachBarRestaurantType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (
          !payload.scope.some(scope =>
            ["beach_bar@crud:beach_bar", "beach_bar@crud:beach_bar_restaurant", "beach_bar@update:beach_bar_restaurant"].includes(
              scope
            )
          )
        ) {
          return {
            error: {
              code: errors.UNAUTHORIZED_CODE,
              message: "You are not allowed to update 'this' restaurant's info",
            },
          };
        }

        if (!restaurantId || restaurantId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid #beach_bar restaurant" } };
        }

        const restaurant = await BeachBarRestaurant.findOne({ where: { id: restaurantId }, relations: ["beachBar", "foodItems"] });
        if (!restaurant) {
          return { error: { code: errors.CONFLICT, message: "Specified restaurant does not exist" } };
        }
        restaurant.foodItems = restaurant.foodItems.filter(item => !item.deletedAt);

        try {
          const updatedRestaurant = await restaurant.update(name, description, isActive);
          if (!updatedRestaurant) {
            return { error: { message: errors.SOMETHING_WENT_WRONG } };
          }
          return {
            restaurant: updatedRestaurant,
            updated: true,
          };
        } catch (err) {
          return { error: { message: `${errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
        }
      },
    });
    t.field("deleteBeachBarRestaurant", {
      type: DeleteResult,
      description: "Delete (remove) a restaurant from a #beach_bar",
      args: {
        restaurantId: intArg({ description: "The ID value of the #beach_bar restaurant" }),
      },
      resolve: async (_, { restaurantId }, { payload }: MyContext): Promise<DeleteType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (!payload.scope.some(scope => ["beach_bar@crud:beach_bar", "beach_bar@crud:beach_bar_restaurant"].includes(scope))) {
          return {
            error: {
              code: errors.UNAUTHORIZED_CODE,
              message: "You are not allowed to delete a restaurant from a #beach_bar",
            },
          };
        }

        if (!restaurantId || restaurantId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid #beach_bar restaurant" } };
        }

        const restaurant = await BeachBarRestaurant.findOne({ where: { id: restaurantId }, relations: ["beachBar"] });
        if (!restaurant) {
          return { error: { code: errors.CONFLICT, message: "Specified restaurant does not exist" } };
        }

        try {
          await restaurant.softRemove();
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
