import { BeachBar } from "entity/BeachBar";
import { BeachBarAvailabilityReturnType } from "typings/beach_bar";
import { getReservationLimits } from "./getReservationLimits";
import { getReservedProducts } from "./getReservedProducts";

export const checkAvailability = (
  beachBar: BeachBar,
  date: string,
  timeId?: string,
  totalPeople?: number
): BeachBarAvailabilityReturnType => {
  const reservedProducts = getReservedProducts(beachBar, date, timeId);
  const reservationLimits = getReservationLimits(beachBar, date, timeId);
  if (reservationLimits.length === 0) return { isOpen: true, hasCapacity: true };

  const totalLimit = reservationLimits.reduce((sum, i) => sum + i.limitNumber, 0);
  const isAvailable = reservedProducts.length < totalLimit;
  let hasCapacity: boolean | undefined = undefined;
  if (totalPeople) {
    const reservedProductsPeople = reservedProducts.reduce((sum, i) => sum + i.product.maxPeople, 0);
    const nonReservedProducts = totalLimit - reservedProducts.length;
    const reservationLimitsPeople = reservationLimits.reduce((sum, i) => sum + i.product.maxPeople, 0) * nonReservedProducts;
    hasCapacity = reservationLimitsPeople - reservedProductsPeople > totalPeople;
  }
  return { isOpen: isAvailable, hasCapacity };
};

// export const checkProductAvailable = (
//   product: Product,
//   date: string,
//   timeId?: string,
//   totalPeople: number = 0,
//   elevator: number = 0
// ) => {
//   const totalLimit = product.getReservationLimit(date, timeId);
//   if (!totalLimit || isNaN(totalLimit)) return { quantity: 21 };
//   let { length } = product.getReservedProducts(date, timeId);
//   length = length + elevator;
//   const available = length < totalLimit && product.maxPeople >= totalPeople;
//   if (!available) return { quantity: 0 };
//   return { quantity: available ? totalLimit - length : 0 };
// };

// export const isProductAvailable = async (productId: string | number, date: Dayjs, timeId: string): Promise<boolean> => {
//   const res = await redis.get(`available_products:${productId.toString()}:${date.format(dayjsFormat.ISO_STRING)}:${timeId}`);
//   return !res ? false : parseInt(res) > 0;
// };
