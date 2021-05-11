import { objectType } from "nexus";
import { UserType } from "../user/types";
import { CartProduct } from "./product/types";
import { Node } from "../types";

export const CartType = objectType({
  name: "Cart",
  description: "Represents a shopping cart",
  definition(t) {
    t.implements(Node);
    t.float("total");
    t.nullable.field("user", { type: UserType, description: "The use that has created this shopping cart" });
    t.nullable.list.field("products", { type: CartProduct, description: "A list with all the cart products" });
  },
});
