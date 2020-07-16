import dayjs, { Dayjs } from "dayjs";
import { Redis } from "ioredis";
import { dayjsFormat } from "../../constants/dayjs";
import redisKeys from "../../constants/redisKeys";
import { BeachBar } from "../../entity/BeachBar";
import { ReservedProduct } from "../../entity/ReservedProduct";

export const getReservedProducts = async (
  redis: Redis,
  beachBar: BeachBar,
  date?: Dayjs,
  timeId?: number,
): Promise<ReservedProduct[]> => {
  const redisReservedProducts = await redis.lrange(
    `${redisKeys.BEACH_BAR_CACHE_KEY}:${beachBar.id}:${redisKeys.RESERVED_PRODUCT_CACHE_KEY}`,
    0,
    -1,
  );
  let reservedProducts: ReservedProduct[] = redisReservedProducts.map(x => JSON.parse(x));
  if (date) {
    reservedProducts = reservedProducts.filter(
      product => dayjs(product.date).format(dayjsFormat.ISO_STRING) === date.format(dayjsFormat.ISO_STRING),
    );
  }
  if (timeId) {
    reservedProducts = reservedProducts.filter(product => product.timeId === timeId);
  }
  return reservedProducts;
};
