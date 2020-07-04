import { ProductReservationLimit } from "../../../../entity/ProductReservationLimit";
import { HourTime } from "../../../../entity/HourTime";
import { AddType, UpdateType } from "../../../returnTypes";

type ProductReservationLimitType = {
  reservationLimit: ProductReservationLimit[];
};

export type AddProductReservationLimitType = AddType & ProductReservationLimitType;

export type UpdateProductReservationLimitType = UpdateType & ProductReservationLimitType;

export type AvailableProductReturnType = {
  hourTime: HourTime;
  isAvailable: boolean;
}[];
