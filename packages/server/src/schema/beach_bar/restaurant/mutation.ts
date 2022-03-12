import { isAuth, throwScopesUnauthorized } from "@/utils/auth";
import { updateRedis } from "@/utils/db";
import { errors } from "@beach_bar/common";
import { ApolloError } from "apollo-server-errors";
import { booleanArg, extendType, idArg, nullable, stringArg } from "nexus";
import { BeachBarRestaurantType } from "./types";

export const BeachBarRestaurantCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addBeachBarRestaurant", {
      type: BeachBarRestaurantType,
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
      resolve: async (_, { beachBarId, name, isActive = false, ...args }, { prisma, payload }) => {
        isAuth(payload);
        throwScopesUnauthorized(payload, 'You are not allowed to add "this" a restaurant to a #beach_bar', [
          "beach_bar@crud:beach_bar",
          "beach_bar@crud:beach_bar_restaurant",
        ]);

        try {
          const newRestaurant = await prisma.beachBarRestaurant.create({
            data: { ...args, beachBarId: +beachBarId, name, isActive: isActive || undefined },
          });

          await updateRedis({ model: "BeachBar", id: newRestaurant.beachBarId });
          return newRestaurant;
        } catch (err) {
          if (err.message === 'duplicate key value violates unique constraint "beach_bar_restaurant_beach_bar_id_name_key"') {
            throw new ApolloError(`Specified restaurant with name "${name}" already exists in this #beach_bar`, errors.CONFLICT);
          }
          throw new ApolloError(errors.SOMETHING_WENT_WRONG + ": " + err.message);
        }
      },
    });
    t.field("updateBeachBarRestaurant", {
      type: BeachBarRestaurantType,
      description: "Update the restaurant details of a #beach_bar",
      args: {
        restaurantId: idArg(),
        name: nullable(stringArg()),
        description: nullable(stringArg()),
        isActive: nullable(booleanArg()),
      },
      resolve: async (_, { restaurantId, name, isActive, ...args }, { prisma, payload }) => {
        isAuth(payload);
        throwScopesUnauthorized(payload, "You are not allowed to update 'this' restaurant's info", [
          "beach_bar@crud:beach_bar",
          "beach_bar@crud:beach_bar_restaurant",
          "beach_bar@update:beach_bar_restaurant",
        ]);

        const restaurant = await prisma.beachBarRestaurant.findUnique({ where: { id: +restaurantId } });
        if (!restaurant) throw new ApolloError("Restaurant was not found", errors.NOT_FOUND);
        // restaurant.foodItems = restaurant.foodItems.filter(item => !item.deletedAt);

        try {
          const updatedRestaurant = await prisma.beachBarRestaurant.update({
            where: { id: +restaurantId },
            data: { ...args, name: name || undefined, isActive: isActive || undefined },
          });

          await updateRedis({ model: "BeachBar", id: updatedRestaurant.beachBarId });
          return updatedRestaurant;
        } catch (err) {
          throw new ApolloError(errors.SOMETHING_WENT_WRONG + ": " + err.message);
        }
      },
    });
    t.boolean("deleteBeachBarRestaurant", {
      description: "Delete (remove) a restaurant from a #beach_bar",
      args: { id: idArg() },
      resolve: async (_, __, { payload }) => {
        isAuth(payload);
        throwScopesUnauthorized(payload, "You are not allowed to delete a restaurant from a #beach_bar", [
          "beach_bar@crud:beach_bar",
          "beach_bar@crud:beach_bar_restaurant",
        ]);

        // const restaurant = await BeachBarRestaurant.findOne({ where: { id: id }, relations: ["beachBar"] });
        // if (!restaurant) throw new ApolloError("Restaurant was not found", errors.NOT_FOUND);

        // try {
        //   await restaurant.softRemove();
        // } catch (err) {
        //   throw new ApolloError(errors.SOMETHING_WENT_WRONG + ": " + err.message);
        // }

        return true;
      },
    });
  },
});
