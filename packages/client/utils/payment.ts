<<<<<<< HEAD
import { CartQuery } from "@/graphql/generated";
import {uniqBy} from "lodash";

type Products = NonNullable<CartQuery["cart"]>["products"];

export const calcCartTotal = (products: Products) =>
  (products || []).reduce((init, b) => init + b.product.price * b.quantity, 0);

export const calcCartTotalProducts = (products: Products) => (products || []).reduce((init, b) => init + b.quantity, 0);

export const getCartBeachBars = (cart?: CartQuery) =>
  cart && cart.cart && uniqBy(cart.cart.products, "product.beachBar.id").map(({ product: { beachBar } }) => beachBar);
=======
import { CartQuery } from "@/graphql/generated";
import uniqBy from "lodash/uniqBy";

type Products = NonNullable<CartQuery["cart"]>["products"];

export const calcCartTotal = (products: Products) =>
  (products || []).reduce((init, b) => init + b.product.price * b.quantity, 0);

export const calcCartTotalProducts = (products: Products) => (products || []).reduce((init, b) => init + b.quantity, 0);

export const getCartBeachBars = (cart?: CartQuery) =>
  cart && cart.cart && uniqBy(cart.cart.products, "product.beachBar.id").map(({ product: { beachBar } }) => beachBar);
>>>>>>> 3c094b84c4b6a5e6c8400166ac60b7393b7ddcff
