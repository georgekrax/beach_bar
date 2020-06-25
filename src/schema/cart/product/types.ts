import { objectType } from "@nexus/schema";
import { ProductType } from "../../beach_bar/product/types";
import { CartType } from "../types";

export const CartProductType = objectType({
  name: "CartProduct",
  description: "Represents a shopping cart with its products",
  definition(t) {
    t.int("quantity", { nullable: false });
    t.datetime("timestamp", { nullable: false });
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
      resolve: o => o.product,
    });
  },
});
