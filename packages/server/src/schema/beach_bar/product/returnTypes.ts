import { Product } from "../../../entity/Product";
import { HourTimeReturnType } from "../../details/time/returnTypes";
import { AddType, UpdateType } from "../../returnTypes";

export type ProductType = {
  product: Product;
};

export type AddProductType = AddType & ProductType;

export type UpdateProductType = UpdateType & ProductType;

export type ProductAvailabilityHourReturnType = HourTimeReturnType & {
  isAvailable: boolean;
};
