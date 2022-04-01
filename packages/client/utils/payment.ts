import { CartQuery } from "@/graphql/generated";
import { uniqBy } from "lodash";

type Cart = NonNullable<CartQuery["cart"]>;

export const calcCartTotal = ({ products, foods }: Pick<Cart, "products" | "foods">) => {
  const productsTotal = products.reduce((init, { quantity, product: { price } }) => init + price * quantity, 0);
  const foodsTotal = foods.reduce((init, { quantity, food: { price } }) => init + price * quantity, 0);
  return productsTotal + foodsTotal;
};

export const calcCartTotalItems = ({ products, foods }: Parameters<typeof calcCartTotal>["0"]) => {
  return (
    products.reduce((init, { quantity }) => init + quantity, 0) +
    foods.reduce((init, { quantity }) => init + quantity, 0)
  );
};

const sortByTimestamp = (arr: any[]) => {
  return arr.sort((a, b) => (new Date(a.timestamp).getTime() > new Date(b.timestamp).getTime() ? -1 : 1));
};

export const extractCartBeachBars = (cart?: CartQuery) => {
  if (!cart || !cart.cart) return undefined;
  const { products, foods, ...rest } = cart.cart;
  const uniqBeachBars = uniqBy(cart.cart.products, "product.beachBar.id").map(({ product: { beachBar } }) => beachBar);

  return uniqBeachBars.map(({ id, ...beachBar }) => ({
    ...rest,
    beachBar: { id, ...beachBar },
    products: sortByTimestamp(products.filter(({ product }) => product.beachBar.id === id)),
    foods: sortByTimestamp(foods.filter(({ food }) => food.beachBar.id === id)),
  }));
};
