import { Product } from "entity/Product";
import { AddType, UpdateType } from "typings/.index";
import { HourTimeReturnType } from "typings/details/time";

export type ProductType = {
  product: Product;
};

export type TAddProduct = AddType & ProductType;

export type TUpdateProduct = UpdateType & ProductType;

export type ProductAvailabilityHourReturnType = HourTimeReturnType & {
  isAvailable: boolean;
};

export type TProductAvailability = ProductType & { quantity: number }

