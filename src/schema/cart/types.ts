import { objectType } from "@nexus/schema";
import { ProductType } from "../beach_bar/product/types";
import { UserType } from "../user/types";

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
  },
});

export const CartProductType = objectType({
  name: "CartProduct",
  description: "Represents a shopping cart with its products",
  definition(t) {
    t.int("quantity", { nullable: false });
    t.field("cart", {
      type: CartType,
      description: "The shopping cart the product is added to",
      nullable: false,
      resolve: o => o.cart,
    });
    t.field("product", {
      type: ProductType,
      description: "The product that is added to the shopping cart",
      nullable: false,
      resolve: o => o.poduct,
    });
  },
});
