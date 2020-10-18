import { ProductReservationLimit } from "entity/ProductReservationLimit";
import { HourTime } from "entity/Time";
import { AddType, ErrorType, UpdateType } from "typings/.index";

type ProductReservationLimitType = {
  reservationLimit: ProductReservationLimit[];
};

export type AddProductReservationLimitType = (AddType & ProductReservationLimitType) | ErrorType;

export type UpdateProductReservationLimitType = (UpdateType & ProductReservationLimitType) | ErrorType;

export type AvailableProductReturnType = {
  hourTime: HourTime;
  isAvailable: boolean;
}[];
