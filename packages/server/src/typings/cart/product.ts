import { CartProduct } from "entity/CartProduct";
import { AddType, UpdateType } from "typings/.index";

type CartProductType = {
  product: CartProduct;
};

export type AddCartProductType = AddType & CartProductType;

export type UpdateCartProductType = UpdateType & CartProductType;
