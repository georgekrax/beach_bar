import { Product } from "../../../entity/Product";
import { AddType, UpdateType } from "../../returnTypes";

export type ProductType = {
  product: Product;
};

export type AddProductType = AddType & ProductType;

export type UpdateProductType = UpdateType & ProductType;