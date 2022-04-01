import { NexusGenObjects } from "@/graphql/generated/nexusTypes";
import { AvailableProductsType, BeachBarCapacity } from "@/typings/search";
import { getProducts } from "@/utils/cart";
import { numberTypeToNum, parseDates, ParseDatesOptions, toFixed2 } from "@/utils/data";
import { dayjsFormat, errors } from "@beach_bar/common";
import { Prisma } from "@prisma/client";
import { ApolloError } from "apollo-server-express";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import chunk from "lodash/chunk";
import range from "lodash/range";
import { prisma, redis } from "..";

dayjs.extend(isBetween);

// isOwner()
export const IsOwnerInclude = Prisma.validator<Prisma.BeachBarInclude>()({ owners: { include: { owner: true } } });
type IsOwnerBeachBar = Prisma.BeachBarGetPayload<{ include: typeof IsOwnerInclude }>;
type IsOnwerOptions = { userId: number; mustBePrimary?: boolean };

export const isOwner = ({ owners }: IsOwnerBeachBar, { userId, mustBePrimary = false }: IsOnwerOptions) => {
  const owner = owners.find(({ owner, deletedAt }) => String(owner.userId) === String(userId) && !deletedAt);
  if (!owner) throw new ApolloError(errors.YOU_ARE_NOT_BEACH_BAR_OWNER, errors.NOT_FOUND);
  if (mustBePrimary && !owner.isPrimary) {
    throw new ApolloError(errors.YOU_ARE_NOT_BEACH_BAR_PRIMARY_OWNER, errors.UNAUTHORIZED_CODE);
  }
  return owner;
};

// fetchBarPayments()
type FetchBarPaymentsOptions = { beachBarId: NexusGenObjects["BeachBar"]["id"] };

export const fetchBarPayments = async ({ beachBarId }: FetchBarPaymentsOptions) => {
  const payments = await prisma.payment.findMany({
    where: { isRefunded: false, cart: { products: { some: { product: { beachBarId: +beachBarId } } } } },
  });
  return payments;
};

// getAvailableProducts()
export const GetAvailableProductsInclude = Prisma.validator<Prisma.BeachBarInclude>()({
  products: true,
});
type GetAvailableProductsBeachBar = Prisma.BeachBarGetPayload<{ include: typeof GetAvailableProductsInclude }>;
type GetAvailableProductsOptions = Omit<BeachBarCapacity, "totalPeople">;

export const getAvailableProducts = async (
  { id, products: barProducts }: GetAvailableProductsBeachBar,
  { date, startTimeId, endTimeId }: GetAvailableProductsOptions
): Promise<AvailableProductsType> => {
  let products: string[] = [];
  for (let i = +startTimeId; i <= +endTimeId; i++) {
    const [_, arr] = await redis.hscan(
      `available_products:${dayjs(date).format(dayjsFormat.ISO_STRING)}:${i.toString().padStart(2, "0").padEnd(4, "0")}`,
      0,
      "MATCH",
      `beach_bar:${id}:product:*`,
      "COUNT",
      Math.pow(10, 10)
    );
    products = [...products, ...arr];
  }
  let groupedProducts: string[][] = chunk(products, 2);
  const counts: Record<string, { count: number; min: number }> = groupedProducts.reduce((acc, value) => {
    const item = value[0];
    const accItem = acc[item];
    return { ...acc, [item]: { count: (accItem ? accItem.count : 0) + 1, min: Math.min(parseInt(value[1]), 10000) } };
  }, {});
  // First filter, and then find the unique ones, so that fewer iterations are made
  // Filter the products that are available during the arrival and departure time,
  // and find the remaing available for both times, which is the smallest one value
  groupedProducts = groupedProducts.filter(([key, remaining]) => {
    const { count, min } = counts[key];
    return count === +endTimeId - +startTimeId + 1 && min === +remaining;
  });
  // Remove repeatable values
  groupedProducts = Array.from(new Set(groupedProducts.map(val => JSON.stringify(val)))).map(val => JSON.parse(val));
  const parsed = groupedProducts
    .map(([key, val]) => {
      const product = barProducts.find(({ id }) => id.toString() === key.split(":")[3]);
      if (!product) return [];
      return { product, remainingAvailable: parseInt(val) };
    })
    .flat();
  return parsed.filter(({ remainingAvailable }) => remainingAvailable > 0);
};

// getPaymentDetails()
export const GetPaymentDetailsInclude = Prisma.validator<Prisma.BeachBarInclude>()({ appFee: true });
type GetPaymentDetailsBeachBar = Prisma.BeachBarGetPayload<{ select: typeof GetPaymentDetailsInclude }>;
type GetPaymentDetailsOptions = { total: number; stripeFee?: number };

export const getPaymentDetails = <T extends GetPaymentDetailsBeachBar>(
  { appFee }: T,
  { total, stripeFee = 0 }: GetPaymentDetailsOptions
) => {
  const barFee = toFixed2((total * appFee.percentageValue.toNumber()) / 100);
  // const beachBarAppFee = toFixed2(percentageFee + parseFloat(currencyFee.numericValue.toString()));
  const transferAmount = toFixed2(total - barFee - stripeFee);
  return { total, transferAmount, barFee, stripeFee };
};

type TotalCustomer = NexusGenObjects["DashboardBookingsCapacity"]["totalCustomers"];

// findMostActiveTime()
type FindMostActiveTimeOptions = { totalHourCustomers: TotalCustomer };

export const findMostActiveTime = ({ totalHourCustomers }: FindMostActiveTimeOptions): NexusGenObjects["DashboardMostActive"] => {
  // .slice() so not to modify param arr
  const sortedArr = totalHourCustomers.slice().sort((a, b) => b.value - a.value);
  const date = dayjs(sortedArr[0].date);
  return { weekDay: date.format("dddd"), hour: date.hour() };
};

// calcCapacity()
export const CalcCapacityPaymentInclude = Prisma.validator<Prisma.PaymentInclude>()({
  cart: { include: { products: { include: { product: true } }, foods: { include: { food: true } } } },
});
type CalcCapacityPayment = Prisma.PaymentGetPayload<{ include: typeof CalcCapacityPaymentInclude }>;
type CalcCapacityBeachBar = Prisma.BeachBarGetPayload<{ include: { products: true } }>;
type CalcCapacityOptions = ParseDatesOptions & { beachBar: CalcCapacityBeachBar; payments: CalcCapacityPayment[] };

export const calcCapacity = async ({ dates, beachBar, payments }: CalcCapacityOptions) => {
  const { startDate, endDate, datesArr } = parseDates(dates);

  if (payments) payments = payments.filter(({ isRefunded, deletedAt }) => isRefunded === false && deletedAt == null);
  else {
    payments = await prisma.payment.findMany({
      include: CalcCapacityPaymentInclude,
      where: { isRefunded: false, cart: { products: { some: { product: { beachBarId: beachBar.id } } } } },
    });
  }

  const allCartProducts = payments
    .map(({ cart }) => {
      const arr = getProducts(cart, { beachBarId: beachBar.id });
      return arr.filter(({ date }) => dayjs(date).isBetween(endDate, startDate, "date", "[]"));
    })
    .flat();
  let totalHourCustomers: TotalCustomer = [];
  const totalCustomers: TotalCustomer = datesArr.map(date => {
    const filtered = allCartProducts.filter(product => dayjs(product.date).isSame(date, "date"));
    const arr: TotalCustomer = range(beachBar.openingTimeId, beachBar.closingTimeId + 1).map(hour => {
      return {
        date: date.hour(hour).toISOString(),
        value: filtered
          .filter(({ startTimeId, endTimeId }) => startTimeId <= hour && endTimeId >= hour)
          .reduce((prev, { people }) => prev + people, 0),
      };
    });
    totalHourCustomers = totalHourCustomers.concat(arr.flat());
    return { date: date.toISOString(), value: filtered.reduce((prev, { people }) => prev + people, 0) };
  });

  let limits = await prisma.productReservationLimit.findMany({
    include: { product: true },
    where: {
      productId: { in: beachBar.products.map(({ id }) => id) },
      // startTimeId: Raw(alias => alias + " <= " + hours.start),
      // endTimeId: Raw(alias => alias + " >= " + hours.end),
      // from: Raw(alias => `DATE(${alias}) >= '${formattedDates.end}'`),
      // to: Raw(alias => `DATE(${alias}) >= '${formattedDates.start}'`),
    },
  });
  const maxCapacity: NexusGenObjects["DashboardMaxCapacity"][] = datesArr.map(date => {
    const filtered = limits.filter(({ from, to }) => date.isBetween(dayjs(to), dayjs(from), "date", "[]"));
    return {
      date: date.toISOString(),
      limitPeople: filtered.reduce((prev, { limitNumber, product }) => prev + limitNumber * product.maxPeople, 0),
      availableProducts: filtered.reduce((prev, { limitNumber }) => prev + limitNumber, 0),
    };
  });
  const arr: NexusGenObjects["DashboardCapacityPercentage"][] = totalCustomers.map(({ date, value }) => {
    const max = maxCapacity.find(limit => dayjs(limit.date).isSame(date, "date"));
    return { date, percentage: max?.limitPeople ? +((value / max.limitPeople) * 100).toFixed(2) : 0 };
  });

  return { arr, maxCapacity, totalCustomers, totalHourCustomers };
};

// calcRecommendedProducts()
export const CalcRecommendedProductsInclude = GetAvailableProductsInclude;
type CalcRecommendedProductsBeachBar = GetAvailableProductsBeachBar;
type CalcRecommendedProductsOptions = BeachBarCapacity;
export type CalcRecommendedProductsReturn = NexusGenObjects["ProductRecommended"][];

export const calcRecommendedProducts = async (
  beachBar: CalcRecommendedProductsBeachBar,
  { totalPeople, ...capacity }: CalcRecommendedProductsOptions
): Promise<CalcRecommendedProductsReturn> => {
  const availableProducts = await getAvailableProducts(beachBar, capacity);
  const filtered = availableProducts.filter(({ product: { maxPeople } }) => maxPeople >= totalPeople);
  if (availableProducts.length === 0) return [];
  if (filtered.length > 0) {
    const { product } = filtered.sort(({ product: { price: aPrice } }, { product: { price: bPrice } }) => {
      return numberTypeToNum(aPrice.toNumber()) - numberTypeToNum(bPrice.toNumber());
    })[0];
    return [{ product, quantity: 1 }];
  }

  let res: CalcRecommendedProductsReturn = [];
  let remainingPeople = totalPeople;
  // const mostWithRemainings = Math.max(...availableProducts.map(({ remainingAvailable }) => remainingAvailable));
  if (totalPeople === 0) throw new Error("totalPeople cannot be zero (0)");
  while (remainingPeople > 0) {
    const availableWithQuantity = availableProducts
      .sort((a, b) => a.product.maxPeople - b.product.maxPeople)
      .map(({ product, remainingAvailable }) => {
        const maxPeople = product.maxPeople;
        const quantity = maxPeople >= remainingPeople ? 1 : Math.floor(remainingPeople / maxPeople);
        // console.log(product.id, totalPeople, quantity, remainingAvailable);
        return {
          product,
          // check for availability after new quantity
          quantity: remainingAvailable < quantity ? remainingAvailable : quantity,
        };
      })
      .filter(({ quantity }) => quantity >= 1);
    // const wholeQuantityArr = availableWithQuantity.filter(({ quantity }) => quantity % 1 === 0);
    const whoMinQuantity = availableWithQuantity.sort(
      ({ product: { price: aPrice }, quantity: aQuantity }, { product: { price: bPrice }, quantity: bQuantity }) => {
        if (aQuantity < bQuantity && numberTypeToNum(aPrice.toNumber()) > numberTypeToNum(bPrice.toNumber()) && res.length > 0) {
          return 1;
        }
        return aQuantity - bQuantity;
      }
    )[0];
    if (res.find(({ product: { id } }) => whoMinQuantity.product.id === id)) {
      res = res.map(item => {
        if (item.product.id === whoMinQuantity.product.id) return { ...item, quantity: item.quantity + whoMinQuantity.quantity };
        else return item;
      });
    } else res.push(whoMinQuantity);
    remainingPeople =
      totalPeople - res.reduce((prev, { product: { maxPeople }, quantity }) => prev + Math.floor(quantity) * maxPeople, 0);
  }
  return res;
};

// hasCapacity()
type HasCapacityCalcRecommendedProductsBeachBar = CalcRecommendedProductsBeachBar;
type HasCapacityOptions = { capacity: BeachBarCapacity; recommendedArr?: CalcRecommendedProductsReturn };

export const hasCapacity = async (
  beachBar: HasCapacityCalcRecommendedProductsBeachBar,
  { capacity, recommendedArr }: HasCapacityOptions
) => {
  const recommendedProducts = recommendedArr ? recommendedArr : await calcRecommendedProducts(beachBar, capacity);
  return recommendedProducts.length > 0;
};

// getReservedProducts()
export const GetReservedProductsInclude = Prisma.validator<Prisma.BeachBarInclude>()({
  products: { include: { reservedProducts: true } },
});
type GetReservedProductsBeachBar = Prisma.BeachBarGetPayload<{ include: typeof GetReservedProductsInclude }>;
type GetReservedProductsOptions = Pick<Partial<BeachBarCapacity>, "date" | "startTimeId" | "endTimeId">;

export const getReservedProducts = <T extends GetReservedProductsBeachBar>(
  { products }: T,
  { date, startTimeId, endTimeId }: GetReservedProductsOptions
): T["products"][number]["reservedProducts"] => {
  let reservedProducts = products.map(({ reservedProducts }) => reservedProducts || []).flat();
  // const redisReservedProducts = await redis.lrange(
  //   `${redisKeys.BEACH_BAR_CACHE_KEY}:${beachBar.id}:${redisKeys.RESERVED_PRODUCT_CACHE_KEY}`,
  //   0,
  //   -1
  // );
  // let reservedProducts: ReservedProduct[] = redisReservedProducts.map(x => JSON.parse(x));
  if (date) {
    reservedProducts = reservedProducts.filter(product => dayjs(product.date).format(dayjsFormat.ISO_STRING) === date);
  }
  if (startTimeId) {
    reservedProducts = reservedProducts.filter(product => product.startTimeId >= startTimeId);
  }
  if (endTimeId) reservedProducts = reservedProducts.filter(product => product.endTimeId <= endTimeId);
  return reservedProducts;
};

// getReservationLimits()
export const GetReservationLimitsInclude = Prisma.validator<Prisma.BeachBarInclude>()({
  products: { include: { reservationLimits: true } },
});
type GetReservationLimitsBeachBar = Prisma.BeachBarGetPayload<{ include: typeof GetReservationLimitsInclude }>;
type GetReservationLimitsOptions = GetReservedProductsOptions;

export const getReservationLimits = <T extends GetReservationLimitsBeachBar>(
  { products }: T,
  { date, startTimeId, endTimeId }: GetReservationLimitsOptions
): T["products"][number]["reservationLimits"] => {
  let reservationLimits = products.flatMap(product => product.reservationLimits || []).flat();

  if (date) reservationLimits = reservationLimits.filter(({ from, to }) => dayjs(date).isBetween(from, to, undefined, "[]"));
  if (startTimeId && endTimeId) {
    reservationLimits = reservationLimits.filter(limit => {
      return (limit.startTimeId || 0) >= startTimeId && (limit.endTimeId || 0) <= endTimeId;
    });
  }
  return reservationLimits;
};

// checkAvailability()
export const CheckAvailabilityInclude = Prisma.validator<Prisma.BeachBarInclude>()({
  products: {
    include: {
      reservedProducts: { include: { product: true } },
      reservationLimits: { include: { product: true } },
    },
  },
});
type CheckAvailabilityBeachBar = Prisma.BeachBarGetPayload<{ include: typeof CheckAvailabilityInclude }>;
type CheckAvailabilityOptions = Pick<BeachBarCapacity, "date"> &
  Pick<Partial<BeachBarCapacity>, "startTimeId" | "endTimeId" | "totalPeople">;
type CheckAvailabilityReturn = { isOpen?: boolean; hasCapacity?: boolean };

export const checkAvailability = (
  beachBar: CheckAvailabilityBeachBar,
  { date, startTimeId, endTimeId, totalPeople }: CheckAvailabilityOptions
): CheckAvailabilityReturn => {
  const reservedProducts = getReservedProducts(beachBar, { date, startTimeId, endTimeId });
  const reservationLimits = getReservationLimits(beachBar, { date, startTimeId, endTimeId });
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

// import { errors } from "@beach_bar/common";
// import { CurrencyProductPrice } from "@/entity/CurrencyProductPrice";
// import { ProductCategory } from "@/entity/ProductCategory";

// export const checkMinimumProductPrice = async (
//   price: number,
//   category: ProductCategory,
//   currencyId: number
// ): Promise<Error | void> => {
//   const productPrice = await CurrencyProductPrice.findOne({ where: { currencyId }, relations: ["currency"] });
//   if (!productPrice) throw new Error(errors.SOMETHING_WENT_WRONG);
//   if (!category.zeroPrice && price === 0) {
//     throw new Error("You are not allowed to have 0 as a price for this type of product.");
//   }
//   if (!category.whitelist && price > productPrice.price) {
//     throw new Error("You should set an entry fee for the next days, to have 0 as a price for this type of product.");
//   }
//   if (price < productPrice.price && (!category.zeroPrice || !category.whitelist)) {
//     throw new Error(
//       `You are not allowed to have a price lower than ${productPrice.price}${productPrice.currency.symbol} for this type of product.`
//     );
//   }
// };
