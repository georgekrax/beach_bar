import { resolve } from "@/utils/data";
import { objectType } from "nexus";
import { CartProduct } from "nexus-prisma";

export const CartProductType = objectType({
  name: CartProduct.$name,
  description: "Represents a shopping cart with its products",
  definition(t) {
    // t.id("id");
    // t.int("quantity");
    // t.field("date", { type: DateScalar, description: "The date of purchase of the product" });
    // t.int("people", { description: "The number of people that are going to use the product" });
    // t.field("timestamp", { type: DateTime.name });
    // t.field("cart", { type: CartType, description: "The shopping cart the product is added to" });
    // t.field("product", { type: ProductType, description: "The product that is added to the shopping cart" });
    // t.field("startTime", { type: HourTimeType, description: "The starting hour of use of the product" });
    // t.field("endTime", { type: HourTimeType, description: "The ending hour of use of the product" });
    t.field(CartProduct.id);
    t.field(CartProduct.quantity);
    t.field(CartProduct.date);
    t.field(CartProduct.people);
    t.field(resolve(CartProduct.cart));
    t.field(resolve(CartProduct.product));
    t.field(resolve(CartProduct.startTime));
    t.field(resolve(CartProduct.endTime));
    t.field(CartProduct.timestamp);
    t.nullable.float("total", {
      resolve: ({ quantity, ...o }): number | null => (o["product"] ? quantity * o["product"]["price"] : null),
    });
  },
});

// export const AddCartProduct = objectType({
//   name: "AddCartProduct",
//   description: "Info to be returned when a product is added to a shopping cart",
//   definition(t) {
//     t.field("product", { type: CartProductType, description: "The product that is added to the cart" });
//     t.boolean("added");
//   },
// });

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

// export const UpdateCartProduct = objectType({
//   name: "UpdateCartProduct",
//   description: "Info to be returned when a product of a shopping cart is updated",
//   definition(t) {
//     t.field("product", {
//       type: CartProductType,
//       description: "The product that is updated",
//     });
//     t.boolean("updated");
//   },
// });

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
