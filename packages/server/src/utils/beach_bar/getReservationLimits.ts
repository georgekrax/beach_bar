import dayjs, { Dayjs } from "dayjs";
import { dayjsFormat } from "../../constants/dayjs";
import { BeachBar } from "../../entity/BeachBar";
import { ProductReservationLimit } from "../../entity/ProductReservationLimit";

export const getReservationLimits = (beachBar: BeachBar, date?: Dayjs, timeId?: number): ProductReservationLimit[] | undefined => {
  if (beachBar.products.some(product => product.reservationLimits && product.reservationLimits.length > 0)) {
    let reservationLimits: any = beachBar.products
      .filter(product => product !== undefined && product !== null)
      .flatMap(product => product.reservationLimits);

    if (reservationLimits.length === 0) {
      return [];
    }

    if (date) {
      reservationLimits = reservationLimits.filter(
        (limit: any) => dayjs(limit.date).format(dayjsFormat.ISO_STRING) === date.format(dayjsFormat.ISO_STRING),
      );
    }
    if (timeId) {
      reservationLimits = reservationLimits.filter(limit => limit.startTimeId >= timeId && limit.endTimeId <= timeId);
    }
    return reservationLimits;
  }
  return undefined;
};
