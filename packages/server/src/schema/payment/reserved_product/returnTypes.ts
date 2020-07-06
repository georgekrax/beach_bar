import { ReservedProduct } from "../../../entity/ReservedProduct";
import { AddType, UpdateType } from "../../returnTypes";

type ReservedProductType = {
  reservedProduct: ReservedProduct;
};

export type AddReservedProductType = AddType & ReservedProductType;

export type UpdateReservedProductType = UpdateType & ReservedProductType;