import { extendType, idArg } from "nexus";
import { FoodType } from "./types";

export const FoodQuery = extendType({
  type: "Query",
  definition(t) {
    t.nullable.field("food", {
      type: FoodType,
      description: "Get information for a food or drink of a #beach_bar",
      args: { id: idArg() },
      resolve: async (_, { id }, { prisma }) => {
        if (id.toString().trim().length === 0) return null;
        return await prisma.food.findUnique({ where: { id: BigInt(id) } });
      },
    });
    t.list.field("foods", {
      type: FoodType,
      description: "Get all foods and drinks of a #beach_bar",
      args: { beachBarId: idArg() },
      resolve: async (_, { beachBarId }, { prisma }) => {
        if (beachBarId.toString().trim().length === 0) return [];
        return await prisma.food.findMany({ where: { beachBarId: +beachBarId } });
      },
    });
  },
});
