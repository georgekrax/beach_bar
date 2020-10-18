import { Product } from "entity/Product";
import { AddType, ErrorType, UpdateType } from "typings/.index";
import { HourTimeReturnType } from "typings/details/time";

export type ProductType = {
  product: Product;
};

export type AddProductType = (AddType & ProductType) | ErrorType;

export type UpdateProductType = (UpdateType & ProductType) | ErrorType;

export type ProductAvailabilityHourReturnType = HourTimeReturnType & {
  isAvailable: boolean;
};
