import { BigIntScalar } from "@the_hashtag/common/dist/graphql";
import { objectType } from "nexus";
import { UserType } from "../user/types";
import { CartProductType } from "./product/types";

export const CartType = objectType({
  name: "Cart",
  description: "Represents a shopping cart",
  definition(t) {
    t.field("id", { type: BigIntScalar });
    t.float("total");
    t.nullable.field("user", {
      type: UserType,
      description: "The use that has created this shopping cart",
      resolve: o => o.user,
    });
    t.nullable.list.field("products", {
      type: CartProductType,
      description: "A list with all the cart products",
      resolve: o => o.products,
    });
  },
});
