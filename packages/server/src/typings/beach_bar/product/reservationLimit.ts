import { HourTime } from "@entity/Time";
import { ErrorType, AddType, UpdateType } from "@typings/.index";
import { ProductReservationLimit } from "@entity/ProductReservationLimit";

type ProductReservationLimitType = {
  reservationLimit: ProductReservationLimit[];
};

export type AddProductReservationLimitType = (AddType & ProductReservationLimitType) | ErrorType;

export type UpdateProductReservationLimitType = (UpdateType & ProductReservationLimitType) | ErrorType;

export type AvailableProductReturnType = {
  hourTime: HourTime;
  isAvailable: boolean;
}[];
