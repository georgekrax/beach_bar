import { ErrorType, AddType, UpdateType } from "@typings/.index";
import { Product } from "@entity/Product";
import { HourTimeReturnType } from "@typings/details/time";

export type ProductType = {
  product: Product;
};

export type AddProductType = (AddType & ProductType) | ErrorType;

export type UpdateProductType = (UpdateType & ProductType) | ErrorType;

export type ProductAvailabilityHourReturnType = HourTimeReturnType & {
  isAvailable: boolean;
};