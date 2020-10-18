import { ReservedProduct } from "entity/ReservedProduct";
import { AddType, ErrorType, UpdateType } from "typings/.index";

type ReservedProductType = {
  reservedProduct: ReservedProduct;
};

export type AddReservedProductType = (AddType & ReservedProductType) | ErrorType;

export type UpdateReservedProductType = (UpdateType & ReservedProductType) | ErrorType;
