import { DateScalar, DateTimeScalar } from "@the_hashtag/common/dist/graphql";
import { objectType } from "nexus";
import { ProductType } from "../../beach_bar/product/types";
import { HourTimeType } from "../../details/time/types";
import { CartType } from "../types";

export const CartProduct = objectType({
  name: "CartProduct",
  description: "Represents a shopping cart with its products",
  definition(t) {
    t.id("id");
    t.int("quantity");
    t.field("date", { type: DateScalar, description: "The date of purchase of the product" });
    t.field("timestamp", { type: DateTimeScalar });
    t.field("cart", { type: CartType, description: "The shopping cart the product is added to" });
    t.field("product", { type: ProductType, description: "The product that is added to the shopping cart" });
    t.field("time", { type: HourTimeType, description: "The hour of use of the product" });
  },
});

export const AddCartProduct = objectType({
  name: "AddCartProduct",
  description: "Info to be returned when a product is added to a shopping cart",
  definition(t) {
    t.field("product", { type: CartProduct, description: "The product that is added to the cart" });
    t.boolean("added");
  },
});

// export const AddCartProductResult = unionType({
//   name: "AddCartProductResult",
//   definition(t) {
//     t.members("AddCartProduct", "Error");
//   },
//   resolveType: item => {
//     if (item.error) {
//       return "Error";
//     } else {
//       return "AddCartProduct";
//     }
//   },
// });

export const UpdateCartProduct = objectType({
  name: "UpdateCartProduct",
  description: "Info to be returned when a product of a shopping cart is updated",
  definition(t) {
    t.field("product", {
      type: CartProduct,
      description: "The product that is updated",
    });
    t.boolean("updated");
  },
});

// export const UpdateCartProductResult = unionType({
//   name: "UpdateCartProductResult",
//   definition(t) {
//     t.members("UpdateCartProduct", "Error");
//   },
//   resolveType: item => {
//     if (item.error) {
//       return "Error";
//     } else {
//       return "UpdateCartProduct";
//     }
//   },
// });
