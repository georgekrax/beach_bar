import { ProductReservationLimit } from "entity/ProductReservationLimit";
import { HourTime } from "entity/Time";
import { AddType, UpdateType } from "typings/.index";

type ProductReservationLimitType = {
  reservationLimit: ProductReservationLimit[];
};

export type TAddProductReservationLimit = AddType & ProductReservationLimitType;

export type TUpdateProductReservationLimit = UpdateType & ProductReservationLimitType;

export type AvailableProductReturnType = {
  hourTime: HourTime;
  isAvailable: boolean;
}[];
