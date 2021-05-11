import { errors, MyContext } from "@beach_bar/common";
import { ApolloError } from "apollo-server-errors";
import { BeachBar } from "entity/BeachBar";
import { BeachBarRestaurant } from "entity/BeachBarRestaurant";
import { booleanArg, extendType, idArg, nullable, stringArg } from "nexus";
import { TDelete } from "typings/.index";
import { TAddBeachBarRestaurant, TUpdateBeachBarRestaurant } from "typings/beach_bar/restaurant";
import { isAuth, throwScopesUnauthorized } from "utils/auth/payload";
import { DeleteGraphQlType } from "../../types";
import { AddBeachBarRestaurantType, UpdateBeachBarRestaurantType } from "./types";

export const BeachBarRestaurantCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addBeachBarRestaurant", {
      type: AddBeachBarRestaurantType,
      description: "Add a restaurant of a #beach_bar",
      args: {
        beachBarId: idArg(),
        name: stringArg({ description: "The name of the restaurant" }),
        description: nullable(stringArg({ description: "A short description, info text, about the restaurant itself" })),
        isActive: nullable(
          booleanArg({
            description: "A boolean that indicates if the restaurant is active or not. Its default value is false",
            default: false,
          })
        ),
      },
      resolve: async (_, { beachBarId, name, description, isActive }, { payload }: MyContext): Promise<TAddBeachBarRestaurant> => {
        isAuth(payload);
        throwScopesUnauthorized(payload, 'You are not allowed to add "this" a restaurant to a #beach_bar', [
          "beach_bar@crud:beach_bar",
          "beach_bar@crud:beach_bar_restaurant",
        ]);

        const beachBar = await BeachBar.findOne(beachBarId);
        if (!beachBar) throw new ApolloError(errors.BEACH_BAR_DOES_NOT_EXIST, errors.NOT_FOUND);

        const newRestaurant = BeachBarRestaurant.create({ name, description, beachBar, isActive });

        try {
          await newRestaurant.save();
          await beachBar.updateRedis();
        } catch (err) {
          if (err.message === 'duplicate key value violates unique constraint "beach_bar_restaurant_beach_bar_id_name_key"')
            throw new ApolloError(`Specified restaurant with name "${name}" already exists in this #beach_bar`, errors.CONFLICT);
          throw new ApolloError(errors.SOMETHING_WENT_WRONG + ": " + err.message);
        }

        return { restaurant: newRestaurant, added: true };
      },
    });
    t.field("updateBeachBarRestaurant", {
      type: UpdateBeachBarRestaurantType,
      description: "Update the restaurant details of a #beach_bar",
      args: {
        restaurantId: idArg(),
        name: nullable(stringArg()),
        description: nullable(stringArg()),
        isActive: nullable(booleanArg()),
      },
      resolve: async (
        _,
        { restaurantId, name, description, isActive },
        { payload }: MyContext
      ): Promise<TUpdateBeachBarRestaurant> => {
        isAuth(payload);
        throwScopesUnauthorized(payload, "You are not allowed to update 'this' restaurant's info", [
          "beach_bar@crud:beach_bar",
          "beach_bar@crud:beach_bar_restaurant",
          "beach_bar@update:beach_bar_restaurant",
        ]);

        const restaurant = await BeachBarRestaurant.findOne({ where: { id: restaurantId }, relations: ["beachBar", "foodItems"] });
        if (!restaurant) throw new ApolloError("Restaurant was not found", errors.NOT_FOUND);
        restaurant.foodItems = restaurant.foodItems.filter(item => !item.deletedAt);

        try {
          const updatedRestaurant = await restaurant.update(name, description, isActive);
          if (!updatedRestaurant) throw new ApolloError(errors.SOMETHING_WENT_WRONG);
          return { restaurant: updatedRestaurant, updated: true };
        } catch (err) {
          throw new ApolloError(errors.SOMETHING_WENT_WRONG + ": " + err.message);
        }
      },
    });
    t.field("deleteBeachBarRestaurant", {
      type: DeleteGraphQlType,
      description: "Delete (remove) a restaurant from a #beach_bar",
      args: { restaurantId: idArg() },
      resolve: async (_, { restaurantId }, { payload }: MyContext): Promise<TDelete> => {
        isAuth(payload);
        throwScopesUnauthorized(payload, "You are not allowed to delete a restaurant from a #beach_bar", [
          "beach_bar@crud:beach_bar",
          "beach_bar@crud:beach_bar_restaurant",
        ]);

        const restaurant = await BeachBarRestaurant.findOne({ where: { id: restaurantId }, relations: ["beachBar"] });
        if (!restaurant) throw new ApolloError("Restaurant was not found", errors.NOT_FOUND);

        try {
          await restaurant.softRemove();
        } catch (err) {
          throw new ApolloError(errors.SOMETHING_WENT_WRONG + ": " + err.message);
        }

        return { deleted: true };
      },
    });
  },
});
