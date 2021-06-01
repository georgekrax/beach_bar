import { BeachBar } from "entity/BeachBar";
import { ProductReservationLimit } from "entity/ProductReservationLimit";

export const getReservationLimits = (beachBar: BeachBar, date?: string, timeId?: string): ProductReservationLimit[] => {
  let reservationLimits: ProductReservationLimit[] = beachBar.products
    .filter(product => product !== undefined && product !== null)
    .flatMap(product => product.reservationLimits || [])
    .flat();

  if (date) reservationLimits = reservationLimits.filter(limit => limit.date === date);
  if (timeId) {
    const parsed = parseInt(timeId);
    reservationLimits = reservationLimits.filter(limit => limit.startTimeId <= parsed && limit.endTimeId >= parsed);
  }
  return reservationLimits;
};

