import { Dayjs } from "dayjs";
import { BeachBar } from "entity/BeachBar";
import { Redis } from "ioredis";
import { BeachBarAvailabilityReturnType } from "typings/beach_bar";
import { getReservationLimits } from "./getReservationLimits";
import { getReservedProducts } from "./getReservedProducts";

export const checkAvailability = async (
  redis: Redis,
  beachBar: BeachBar,
  date: Dayjs,
  timeId?: number,
  totalPeople?: number
): Promise<BeachBarAvailabilityReturnType> => {
  const reservedProducts = await getReservedProducts(redis, beachBar, date, timeId);
  const reservationLimits = getReservationLimits(beachBar, date, timeId);
  if (!reservationLimits || reservationLimits.length === 0) {
    return {
      hasAvailability: true,
      hasCapacity: true,
    };
  } else {
    const totalDateLimit = reservationLimits.reduce((sum, i) => {
      return sum + i.limitNumber;
    }, 0);
    const hasAvailability = reservedProducts.length < totalDateLimit;
    let hasCapacity: boolean | undefined = undefined;
    if (totalPeople) {
      const reservedProductsPeople = reservedProducts.reduce((sum, i) => sum + i.product.maxPeople, 0);
      const nonReservedProducts = totalDateLimit - reservedProducts.length;
      const reservationLimitsPeople = reservationLimits.reduce((sum, i) => sum + i.product.maxPeople, 0) * nonReservedProducts;
      hasCapacity = reservationLimitsPeople - reservedProductsPeople > totalPeople;
    }
    return {
      hasAvailability,
      hasCapacity,
    };
  }
};
