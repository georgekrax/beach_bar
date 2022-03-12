import { NexusGenScalars } from "@/graphql/generated/nexusTypes";
import { toFixed2 } from "@/utils/data";
import { isAvailable, IsAvailableProductInclude } from "@/utils/product";
import { BeachBar, Cart, CartProduct, Prisma } from "@prisma/client";
import dayjs, { Dayjs } from "dayjs";
import uniqBy from "lodash/uniqBy";
import { prisma } from "..";
import { MyContext } from "../typings";

// verifyZeroCart()
type VerifyZeroCartOptions = { beachBar: BeachBar };

export const verifyZeroCart = ({ beachBar }: VerifyZeroCartOptions): boolean => beachBar.zeroCartTotal;

// getProducts()
export const GetProductsInclude = Prisma.validator<Prisma.CartInclude>()({
  products: { include: { product: true } },
});
type GetProductsCart = Prisma.CartGetPayload<{ include: typeof GetProductsInclude }>;
type GetProductsOptions = { beachBarId: number };

export const getProducts = <T extends GetProductsCart>(cart: T, { beachBarId }: GetProductsOptions): T["products"] => {
  return cart.products?.filter(({ product, deletedAt }) => product.beachBarId === beachBarId && !deletedAt) || [];
};

// getFoods()
export const GetFoodsInclude = Prisma.validator<Prisma.CartInclude>()({
  foods: { include: { food: true } },
});
type GetFoodsCart = Prisma.CartGetPayload<{ include: typeof GetFoodsInclude }>;
type GetFoodsOptions = { beachBarId: number };

export const getFoods = <T extends GetFoodsCart>(cart: T, { beachBarId }: GetFoodsOptions): T["foods"] => {
  return cart.foods?.filter(({ food, deletedAt }) => food.beachBarId === beachBarId && !deletedAt) || [];
};

// getUniqBeachBars()
export const GetUniqBeachBarsInclude = Prisma.validator<Prisma.CartInclude>()({
  products: { include: { product: { include: { beachBar: true } } } },
});
type GetUniqBeachBarsCart = Prisma.CartGetPayload<{ include: typeof GetUniqBeachBarsInclude }>;

export const getUniqBeachBars = <T extends GetUniqBeachBarsCart>({ products }: T): T["products"][number]["product"]["beachBar"][] => {
  const beachBars = products?.map(({ product: { beachBar } }) => beachBar) || [];
  return uniqBy(beachBars, "id");
};

// getEntryFees()
export const GetEntryFeesInclude = GetUniqBeachBarsInclude;
type GetEntryFeesCart = Prisma.CartGetPayload<{ include: typeof GetEntryFeesInclude }>;
type GetEntryFeesOptions = { beachBarId?: number } & Pick<Partial<GetEntryFeesCart>, "products">;

export const getEntryFees = (cart: GetEntryFeesCart, { beachBarId, products }: GetEntryFeesOptions = {}): number => {
  if (!cart.products || cart.products.length === 0) return 0;
  let beachBars = getUniqBeachBars(cart).filter(({ entryFee }) => entryFee != null && entryFee.toNumber() > 0);
  if (beachBarId) beachBars = beachBars.filter(({ id }) => String(id) === String(beachBarId));
  let entryFeeTotal = 0;
  // const uniqueProductDates = Array.from(new Set(this.products.map(product => product.date)));
  // const entryFee = await BeachBarEntryFee.findOne({ where: { beachBar, date: productDate } });
  // if (entryFee) entryFeeTotal = entryFeeTotal + parseFloat(entryFee.fee.toString());
  beachBars.forEach(({ id, entryFee }) => {
    const arr = products || getProducts(cart, { beachBarId: id });
    entryFeeTotal = entryFeeTotal + arr.reduce((prev, { people }) => prev + people * (entryFee?.toNumber() || 0), 0);
  });
  return entryFeeTotal;
};

// getTotal()
export const GetTotalCartInclude = Prisma.validator<Prisma.CartInclude>()({
  ...GetProductsInclude,
  ...GetFoodsInclude,
  ...GetEntryFeesInclude,
});
type GetTotalCart = Prisma.CartGetPayload<{ include: typeof GetTotalCartInclude }>;
type GetTotalOptions = { beachBarId?: number; date?: Dayjs; afterToday?: boolean; discount?: number };

export const getTotal = (cart: GetTotalCart, { beachBarId, date, afterToday, discount = 0 }: GetTotalOptions = {}) => {
  let filteredProducts = (beachBarId ? getProducts(cart, { beachBarId }) : cart.products) || [];
  if (afterToday) filteredProducts = filteredProducts.filter(product => dayjs(product.date).isAfter(dayjs()));
  if (date) filteredProducts = filteredProducts.filter(product => dayjs(product.date).isSame(date, "date"));
  const productsTotal = filteredProducts.reduce((sum, { quantity, product: { price } }) => sum + price.toNumber() * quantity, 0);
  // const totalMinSpending = filteredProducts.reduce((sum, { product: { minFoodSpending } }) => sum + (minFoodSpending || 0), 0);
  let filteredFoods = (beachBarId ? getFoods(cart, { beachBarId }) : cart.foods) || [];
  if (date) filteredFoods = filteredFoods.filter(food => dayjs(food.date).isSame(date, "date"));
  const foodsTotal = filteredFoods.reduce((sum, { quantity, food: { price } }) => sum + price.toNumber() * quantity, 0);
  // if (foodsTotal < totalMinSpending) {
  //   throw new ApolloError("For the products you have selected, the total minimum spending is: " + totalMinSpending);
  // }
  const total = productsTotal + foodsTotal;
  const entryFeesTotal = getEntryFees(cart, { beachBarId, products: filteredProducts });
  return {
    productsTotal,
    foodsTotal,
    products: filteredProducts,
    foods: filteredFoods,
    totalWithoutEntryFees: toFixed2(total - discount),
    totalWithEntryFees: toFixed2(total + entryFeesTotal - discount),
  };
};

// checkAllProductsAvailable()
export const CheckAllProductsAvailableCartInclude = Prisma.validator<Prisma.CartInclude>()({
  products: { include: { product: { include: IsAvailableProductInclude } } },
});
type CheckAllProductsAvailableCart = Prisma.CartGetPayload<{ include: typeof CheckAllProductsAvailableCartInclude }>;
type CheckAllProductsAvailableReturn = { bool: boolean; notAvailable: CartProduct[] };

export const checkAllProductsAvailable = async ({
  products,
}: CheckAllProductsAvailableCart): Promise<CheckAllProductsAvailableReturn> => {
  const booleanArr = await Promise.all(
    products.map(async item => {
      const { product, date, startTimeId, endTimeId, quantity: elevator } = item;
      const bool = await !isAvailable(product, { startTimeId, endTimeId, elevator, date: date.toString() });
      return { ...item, isAvailable: bool };
    })
  );
  const notAvailable = booleanArr.filter(({ isAvailable }) => isAvailable).map(({ isAvailable, ...product }) => product);
  return { bool: notAvailable.length == 0, notAvailable: notAvailable };
};

const GetOrCreateCartInclude = Prisma.validator<Prisma.CartInclude>()({
  products: { include: { product: true } },
  foods: { include: { food: true } },
});
type GetOrCreateCartCart = Prisma.CartGetPayload<{ include: typeof GetOrCreateCartInclude }>;

// createCart()
type CreateCartOptions = Pick<Partial<Cart>, "userId">;

export const createCart = async ({ userId }: CreateCartOptions = {}): Promise<GetOrCreateCartCart | null> => {
  try {
    return await prisma.cart.create({ data: { userId, total: 0 }, include: GetOrCreateCartInclude });
  } catch {
    return null;
  }
};

const FIND_CART_OPTIONS = { orderBy: { timestamp: "desc" }, include: GetOrCreateCartInclude } as const;

// getOrCreateCart()
type GetOrCreateCartOptions = Pick<MyContext, "payload"> & { cartId?: NexusGenScalars["ID"]; getOnly?: boolean };

export const getOrCreateCart = async ({
  payload,
  cartId,
  getOnly = false,
}: GetOrCreateCartOptions): Promise<GetOrCreateCartCart | null> => {
  if (payload?.sub && !cartId) {
    let cart = await prisma.cart.findFirst({ ...FIND_CART_OPTIONS, where: { userId: payload.sub, payment: null } });

    if (!cart && !getOnly) {
      const user = await prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user) return null;
      cart = await createCart({ userId: user.id });
    }
    return cart;
  }
  if (cartId) {
    const cart = await prisma.cart.findFirst({ ...FIND_CART_OPTIONS, where: { id: BigInt(cartId), payment: null } });

    if (!cart && !getOnly) return await createCart();
    return cart;
  } else if (!cartId && !getOnly) return await createCart();
  else return null;
};
