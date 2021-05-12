import { CartQuery } from "@/graphql/generated";
import {uniqBy} from "lodash";

type Products = NonNullable<CartQuery["cart"]>["products"];

export const calcCartTotal = (products: Products) =>
  (products || []).reduce((init, b) => init + b.product.price * b.quantity, 0);

export const calcCartTotalProducts = (products: Products) => (products || []).reduce((init, b) => init + b.quantity, 0);

export const getCartBeachBars = (cart?: CartQuery) =>
  cart && cart.cart && uniqBy(cart.cart.products, "product.beachBar.id").map(({ product: { beachBar } }) => beachBar);
