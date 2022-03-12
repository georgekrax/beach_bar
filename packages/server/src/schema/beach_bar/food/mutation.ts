import { checkScopes, isAuth, throwScopesUnauthorized } from "@/utils/auth";
import { isOwner, IsOwnerInclude } from "@/utils/beachBar";
import { updateRedis } from "@/utils/db";
import { errors, TABLES } from "@beach_bar/common";
import { ApolloError, UserInputError } from "apollo-server-errors";
import { extendType, floatArg, idArg, intArg, nullable, stringArg } from "nexus";
import { FoodType } from "./types";

export const FoodCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addFood", {
      type: FoodType,
      description: "Add a food to a #beach_bar",
      args: {
        beachBarId: idArg(),
        categoryId: idArg({ description: "The ID value of the category of the food" }),
        name: stringArg({ description: "The name of the food" }),
        price: floatArg({ description: "The price of the food" }),
        ingredients: nullable(stringArg({ description: "The ingredients used to create the food" })),
        maxQuantity: nullable(intArg({ description: "The maximum number a user can buy a specific food" })),
      },
      resolve: async (_, { beachBarId, categoryId, maxQuantity, ...args }, { prisma, payload }) => {
        isAuth(payload);
        throwScopesUnauthorized(payload, "You are not allowed to add this food to a #beach_bar", ["beach_bar@crud:food"]);

        if (beachBarId.toString().trim().length === 0) throw new UserInputError("Please provide a valid beachBarId");
        if (args.name.trim().length === 0) throw new UserInputError("Please provide a valid name");
        if (categoryId.toString().trim().length === 0) throw new UserInputError("Please provide a valid food categoryId");
        if (args.price < 0) throw new UserInputError("Please provide a valid price");
        if (maxQuantity != null && maxQuantity <= 0) {
          throw new UserInputError("Please provide a valid number for maxQuantity, that can be purchased by a user");
        }

        const beachBar = await prisma.beachBar.findUnique({ where: { id: +beachBarId }, include: IsOwnerInclude });
        if (!beachBar) throw new ApolloError(errors.BEACH_BAR_DOES_NOT_EXIST, errors.NOT_FOUND);

        isOwner(beachBar, { userId: payload!.sub });

        const foodCategory = TABLES.FOOD_CATEGORY.find(({ id }) => id.toString() === categoryId.toString());
        if (!foodCategory) throw new ApolloError("Please provide a valid food category", errors.NOT_FOUND);

        try {
          const newFood = await prisma.food.create({
            data: {
              ...args,
              categoryId: foodCategory.id,
              beachBarId: beachBar.id,
              maxQuantity: maxQuantity || undefined,
            },
          });

          await updateRedis({ model: "BeachBar", id: beachBar.id });
          return newFood;
        } catch (err) {
          throw new ApolloError(errors.SOMETHING_WENT_WRONG + ": " + err.message);
        }
      },
    });
    t.field("updateFood", {
      type: FoodType,
      description: "Update a #beach_bar's food info",
      args: {
        id: idArg(),
        name: nullable(stringArg({ description: "The name of the food" })),
        categoryId: nullable(idArg({ description: "The ID value of the category of the food" })),
        ingredients: nullable(stringArg({ description: "The ingredients used to create the food" })),
        price: nullable(floatArg({ description: "The price of the food" })),
        maxQuantity: nullable(intArg({ description: "The maximum number a user can buy a specific food" })),
      },
      resolve: async (_, { id, name, categoryId, price, maxQuantity, ...args }, { prisma, payload }) => {
        isAuth(payload);
        throwScopesUnauthorized(payload, "You are not allowed to update a #beach_bar's food info", [
          "beach_bar@crud:food",
          "beach_bar@update:food",
        ]);

        if (id.toString().trim().length === 0) throw new UserInputError("Please provide a valid ID");

        const food = await prisma.food.findUnique({ where: { id: BigInt(id) }, include: { beachBar: { include: IsOwnerInclude } } });
        if (!food) throw new ApolloError("Specified food does not exist.", errors.NOT_FOUND);

        isOwner(food.beachBar, { userId: payload!.sub });

        try {
          const updatedFood = await prisma.food.update({
            where: { id: food.id },
            data: {
              ...args,
              name: name || undefined,
              maxQuantity: maxQuantity && maxQuantity > 0 ? maxQuantity : undefined,
              categoryId: categoryId && +categoryId >= 0 ? +categoryId : undefined,
              price: price != null && checkScopes(payload, ["beach_bar@crud:beach_bar", "beach_bar@crud:food"]) ? price : undefined,
            },
          });

          await updateRedis({ model: "BeachBar", id: food.beachBar.id });
          return updatedFood;
        } catch (err) {
          throw new ApolloError(errors.SOMETHING_WENT_WRONG + ": " + err.message);
        }
      },
    });
    t.boolean("deleteFood", {
      description: "Delete (remove) a food from a #beach_bar",
      args: { foodId: idArg() },
      resolve: async (_, { foodId }, { prisma, payload }) => {
        isAuth(payload);
        throwScopesUnauthorized(payload, "You are not allowed to delete (remove) a #beach_bar's food item", ["beach_bar@crud:food"]);

        if (foodId.toString().trim().length === 0) throw new UserInputError("Please provide a valid foodId");

        const food = await prisma.food.findUnique({ where: { id: BigInt(foodId) }, include: { beachBar: true } });
        // const food = await Food.findOne({ where: { id: foodId }, relations: ["beachBar"] });
        if (!food) throw new ApolloError("Specified food does not exist", errors.NOT_FOUND);

        try {
          // TODO: Fix
          // await food.softRemove();
        } catch (err) {
          throw new ApolloError(errors.SOMETHING_WENT_WRONG + ": " + err.messsage);
        }

        return true;
      },
    });
  },
});
