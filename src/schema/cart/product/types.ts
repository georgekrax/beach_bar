import { objectType, unionType } from "@nexus/schema";
import { ProductType } from "../../beach_bar/product/types";
import { CartType } from "../types";
import { DateTimeScalar } from "../../../common/dateTimeScalar";

export const CartProductType = objectType({
  name: "CartProduct",
  description: "Represents a shopping cart with its products",
  definition(t) {
    t.int("quantity", { nullable: false });
    t.field("timestamp", { type: DateTimeScalar, nullable: false });
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

export const AddCartProductType = objectType({
  name: "AddCartProduct",
  description: "Info to be returned when a product is added to a shopping cart",
  definition(t) {
    t.field("product", {
      type: CartProductType,
      description: "The product that is added to the cart",
      nullable: false,
      resolve: o => o.product,
    });
    t.boolean("added", {
      nullable: false,
      description: "A boolean that indicates if the product has been succefully added to the cart",
    });
  },
});

export const AddCartProductResult = unionType({
  name: "AddCartProductResult",
  definition(t) {
    t.members("AddCartProduct", "Error");
    t.resolveType(item => {
      if (item.error) {
        return "Error";
      } else {
        return "AddCartProduct";
      }
    });
  },
});

export const UpdateCartProductType = objectType({
  name: "UpdateCartProduct",
  description: "Info to be returned when a product of a shopping cart is updated",
  definition(t) {
    t.field("product", {
      type: CartProductType,
      description: "The product that is updated",
      nullable: false,
      resolve: o => o.product,
    });
    t.boolean("updated", {
      nullable: false,
      description: "A boolean that indicates if the product has been successfully updated",
    });
  },
});

export const UpdateCartProductResult = unionType({
  name: "UpdateCartProductResult",
  definition(t) {
    t.members("UpdateCartProduct", "Error");
    t.resolveType(item => {
      if (item.error) {
        return "Error";
      } else {
        return "UpdateCartProduct";
      }
    });
  },
});
