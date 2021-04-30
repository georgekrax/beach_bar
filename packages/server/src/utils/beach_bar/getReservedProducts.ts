import { dayjsFormat } from "@beach_bar/common";
import dayjs from "dayjs";
import { BeachBar } from "entity/BeachBar";
import { ReservedProduct } from "entity/ReservedProduct";

export const getReservedProducts = (
  // redis: Redis,
  beachBar: BeachBar,
  date?: string,
  timeId?: string
): ReservedProduct[] => {
  let reservedProducts = beachBar.products.map(({ reservedProducts }) => reservedProducts || []).flat();
  // const redisReservedProducts = await redis.lrange(
  //   `${redisKeys.BEACH_BAR_CACHE_KEY}:${beachBar.id}:${redisKeys.RESERVED_PRODUCT_CACHE_KEY}`,
  //   0,
  //   -1
  // );
  // let reservedProducts: ReservedProduct[] = redisReservedProducts.map(x => JSON.parse(x));
  if (date) reservedProducts = reservedProducts.filter(product => dayjs(product.date).format(dayjsFormat.ISO_STRING) === date);
  if (timeId) reservedProducts = reservedProducts.filter(product => product.timeId.toString() === timeId);
  return reservedProducts;
};
