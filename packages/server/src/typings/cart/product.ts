import { CartProduct } from "entity/CartProduct";
import { AddType, ErrorType, UpdateType } from "typings/.index";

type CartProductType = {
  product: CartProduct;
};

export type AddCartProductType = (AddType & CartProductType) | ErrorType;

export type UpdateCartProductType = (UpdateType & CartProductType) | ErrorType;
