import { NexusGenScalars } from "@/graphql/generated/nexusTypes";
import { BeachBarCapacity } from "@/typings/search";
import { getAvailableProducts, GetAvailableProductsInclude } from "@/utils/beachBar";
import { genDatesArr } from "@/utils/data";
import { dayjsFormat, errors, TABLES } from "@beach_bar/common";
import { HourTime, Prisma, ReservedProduct } from "@prisma/client";
import { ApolloError } from "apollo-server-express";
import dayjs from "dayjs";
import { redis } from "..";

type CapacityInfo = Pick<BeachBarCapacity, "date"> & Pick<Partial<BeachBarCapacity>, "startTimeId" | "endTimeId">;

// isAvailable()
export const IsAvailableProductInclude = Prisma.validator<Prisma.ProductInclude>()({
  beachBar: { include: GetAvailableProductsInclude },
});
type IsAvailableProduct = Prisma.ProductGetPayload<{ include: typeof IsAvailableProductInclude }>;
type IsAvailableOptions = Required<CapacityInfo> & { elevator?: number | null };

export const isAvailable = async (
  { id, beachBar }: IsAvailableProduct,
  { elevator, ...capacity }: IsAvailableOptions
): Promise<boolean> => {
  const availableProducts = await getAvailableProducts(beachBar, capacity);
  if (availableProducts.length === 0) return false;
  return (availableProducts.find(({ product }) => product.id === id)?.remainingAvailable || 0) - (elevator || 0) > 0;
};

// getReservationLimit()
export const GetReservationLimitInclude = Prisma.validator<Prisma.ProductInclude>()({ reservationLimits: true });
type GetReservationLimitProduct = Prisma.ProductGetPayload<{ include: typeof GetReservationLimitInclude }>;

export const getReservationLimit = (
  { reservationLimits }: GetReservationLimitProduct,
  { date, startTimeId, endTimeId }: CapacityInfo
) => {
  // const barLimits = this.beachBar.getReservationLimits(date, timeId);
  let limits = reservationLimits;
  if (!limits) return undefined;
  if (date) limits = limits.filter(({ from, to }) => dayjs(date).isBetween(from, to, undefined, "[]"));
  if (startTimeId && endTimeId) {
    limits = limits.filter(limit => (limit.startTimeId || 0) <= endTimeId && (limit.endTimeId || 0) >= startTimeId);
  }
  // if (limits.length > 0 && timeId) {
  //   const parsed = parseInt(timeId);
  //   const limitNumbers = limits.filter(limit => parsed >= limit.startTimeId && parsed <= limit.endTimeId);
  //   if (limitNumbers) return limitNumbers.reduce((sum, i) => sum + i.limitNumber, 0);
  //   else return undefined;
  // } else return Math.floor(limits.reduce((sum, i) => sum + i.limitNumber, 0) / limits.length);
  // return Math.floor(limits.reduce((sum, i) => sum + i.limitNumber, 0) / limits.length);
  return limits.reduce((sum, i) => sum + i.limitNumber, 0);
};

// getReservedProducts()
export const GetReservedProductInclude = Prisma.validator<Prisma.ProductInclude>()({ reservedProducts: true });
type GetReservedProduct = Prisma.ProductGetPayload<{ include: typeof GetReservedProductInclude }>;

export const getReservedProducts = (
  { reservedProducts }: GetReservedProduct,
  { date, startTimeId, endTimeId }: CapacityInfo
): ReservedProduct[] => {
  let reserved = reservedProducts;
  if (!reserved) throw new ApolloError("`reservedProducts` are not fetched with the `Product` entity");
  if (date) reserved = reserved.filter(product => dayjs(product.date).isSame(date));
  if (startTimeId) reserved = reserved.filter(product => parseInt(product.startTimeId.toString()) >= startTimeId);
  if (endTimeId) reserved = reserved.filter(product => parseInt(product.endTimeId.toString()) <= endTimeId);
  return reserved;
  // return this.beachBar
  //   .getReservedProducts(date, timeId)
  // .filter(reservedProduct => reservedProduct.productId.toString() === this.id.toString());
};

// getQuantityAvailability()
export const GetQuantityAvailabilityInclude = {
  ...GetReservationLimitInclude,
  ...GetReservedProductInclude,
};
type GetQuantityAvailabilityProduct = Prisma.ProductGetPayload<{ include: typeof GetQuantityAvailabilityInclude }>;

export const getQuantityAvailability = (product: GetQuantityAvailabilityProduct, info: CapacityInfo): number => {
  const limit = getReservationLimit(product, info);
  if (!limit) return 0;
  const { length } = getReservedProducts(product, info);
  const subtract = limit - length;

  if (limit !== 0 && length !== 0 && limit === length) throw new ApolloError(errors.SOMETHING_WENT_WRONG);
  else if (subtract === 0 || subtract >= +process.env.MAX_PRODUCT_QUANTITY!) return 0;
  return subtract;
};

// getHoursAvailability()
export const GetHoursAvailabilityInclude = Prisma.validator<Prisma.ProductInclude>()({
  ...IsAvailableProductInclude,
});
type GetHoursAvailability = Prisma.ProductGetPayload<{ include: typeof GetHoursAvailabilityInclude }>;
type GetHoursAvailabilityReturn = {
  hourTime: Omit<HourTime, "value"> & { value: string };
  isAvailable: boolean;
};

export const getHoursAvailability = async (
  product: GetHoursAvailability,
  date: NexusGenScalars["Date"]
): Promise<GetHoursAvailabilityReturn[]> => {
  const { beachBar } = product;
  // const openingTime = this.beachBar.openingTime.value.split(":")[0] + ":00:00";
  // const closingTime = this.beachBar.closingTime.value.startsWith("00:")
  //   ? "24:00:00" : this.beachBar.closingTime.value.split(":")[0] + ":00:00";
  // await HourTime.find({ value: Between(openingTime, closingTime) });
  const hourTimes = TABLES.HOUR_TIME.filter(({ id }) => id >= +(beachBar.openingTimeId || 0) && id <= +(beachBar.closingTimeId || 0));

  const results: GetHoursAvailabilityReturn[] = [];
  for (let i = 0; i < hourTimes.length; i++) {
    const hourTime = hourTimes[i];
    const hasAvailability = await isAvailable(product, { date, startTimeId: hourTime.id, endTimeId: hourTime.id });
    results.push({ hourTime, isAvailable: hasAvailability });
  }
  return results;
};

// setRedisReservationLimits()
export const SetRedisReservationLimitsInclude = Prisma.validator<Prisma.ProductReservationLimitInclude>()({ product: true });
type SetRedisReservationLimits = Prisma.ProductReservationLimitGetPayload<{ include: typeof SetRedisReservationLimitsInclude }>;
type SetRedisReservationLimitsOptions = { atDelete?: boolean; elevator?: number };

export const setRedisReservationLimits = async (
  { product, limitNumber, from, to, startTimeId, endTimeId }: SetRedisReservationLimits,
  { atDelete = false, elevator }: SetRedisReservationLimitsOptions = {}
) => {
  for (const date of genDatesArr(dayjs(from), dayjs(to))) {
    for (let i = startTimeId || 0; i <= (endTimeId || 24); i++) {
      const redisKey = `available_products:${date.format(dayjsFormat.ISO_STRING)}:${i.toString().padStart(2, "0").padEnd(4, "0")}`;
      const fieldKey = `beach_bar:${product.beachBarId}:product:${product.id}`;
      if (atDelete) await redis.hdel(redisKey, fieldKey);
      else {
        let existingAvailable: number = await redis.hget(redisKey, fieldKey) as any;
        existingAvailable = (existingAvailable ? +existingAvailable : 0);
        let newQuantity: number;
        if (elevator) newQuantity = existingAvailable - elevator;
        else newQuantity = limitNumber - existingAvailable;
        await redis.hset(redisKey, fieldKey, newQuantity);
      }
    }
  }
};
