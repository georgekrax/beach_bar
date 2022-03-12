import { resolve } from "@/utils/data";
import { objectType } from "nexus";
import { CartFood } from "nexus-prisma";

export const CartFoodType = objectType({
  name: CartFood.$name,
  description: "Represents a food listed in a shoppingcart",
  definition(t) {
    // t.id("id");
    // t.int("quantity");
    // t.field("cart", { type: CartType, description: "The shopping cart the food is added" });
    // t.field("food", { type: FoodType, description: "The food that is added to the shopping cart" });
    // t.field("date", { type: DateScalar, description: "The date the food is going to be used" });
    // t.field("updatedAt", { type: DateTime.name });
    // t.field("timestamp", { type: DateTime.name });
    // t.nullable.field("deletedAt", { type: DateTime.name });
    t.field(CartFood.id);
    t.field(CartFood.quantity);
    t.field(CartFood.date);
    t.field(resolve(CartFood.cart));
    t.field(resolve(CartFood.food));
    t.field(CartFood.updatedAt);
    t.field(CartFood.timestamp);
    t.field(CartFood.deletedAt);
    t.nullable.float("total", {
      resolve: ({ quantity, ...o }): number | null => (o["food"] ? quantity * o["food"].price : null),
    });
  },
});
