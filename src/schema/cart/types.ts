import { objectType } from "@nexus/schema";
import { UserType } from "../user/types";
import { CartProductType } from "./product/types";

export const CartType = objectType({
  name: "Cart",
  description: "Represents a shoppping cart",
  definition(t) {
    t.bigint("id", { nullable: false });
    t.float("total", { nullable: false });
    t.field("user", {
      type: UserType,
      description: "The use that has created this shopping cart",
      nullable: true,
      resolve: o => o.user,
    });
    t.list.field("products", {
      type: CartProductType,
      description: "A list with all the cart products",
      nullable: true,
      resolve: o => o.products,
    });
  },
});
