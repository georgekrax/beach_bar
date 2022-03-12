import { resolve } from "@/utils/data";
import { objectType } from "nexus";
import { Food, FoodCategory } from "nexus-prisma";

export const FoodCategoryType = objectType({
  name: FoodCategory.$name,
  description: "Represents a category of a food a #beach_bar provides",
  definition(t) {
    // t.id("id");
    // t.string("name");
    // t.field("icon", { type: IconType, description: "Details about which icon to be used in the front-end" });
    t.field(FoodCategory.id);
    t.field(FoodCategory.name);
    t.field(resolve(FoodCategory.icon));
  },
});

export const FoodType = objectType({
  name: Food.$name,
  description: "Represents a food item - product of a #beach_bar",
  definition(t) {
    // t.id("id");
    // t.string("name");
    // t.nullable.string("ingredients");
    // t.float("price");
    // t.int("maxQuantity");
    // t.field("category", { type: FoodCategoryType, description: "The category of the food item" });
    // t.field("beachBar", { type: BeachBarType, description: "The #beach_bar that sells the food item" });
    // t.field("updatedAt", { type: DateTime.name });
    // t.field("timestamp", { type: DateTime.name });
    // t.nullable.field("deletedAt", { type: DateTime.name });
    t.field(Food.id);
    t.field(Food.name);
    t.field(Food.ingredients);
    t.field(Food.price.name, { ...Food.price, type: "Float"  });
    t.field(Food.maxQuantity);
    t.field(resolve(Food.category));
    t.field(resolve(Food.beachBar));
    t.field(Food.timestamp);
    t.field(Food.updatedAt);
    t.field(Food.deletedAt);
  },
});
