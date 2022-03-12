import { Product } from "@/entity/Product";
import { isAuth } from "@/utils/auth";
import { getTotal, GetTotalCartInclude } from "@/utils/cart";
import { getRefundPercentage } from "@/utils/payment";
import { errors } from "@beach_bar/common";
import { ApolloError, UserInputError } from "apollo-server-express";
import dayjs from "dayjs";
import minMax from "dayjs/plugin/minMax";
import { uniqBy } from "lodash";
import { extendType, idArg, intArg, nullable } from "nexus";
import { PaymentType, PaymentVisitsType } from "./types";

dayjs.extend(minMax);

export const PaymentQuery = extendType({
  type: "Query",
  definition(t) {
    t.boolean("hey", {
      resolve: async (): Promise<boolean> => {
        const product = await Product.findOne({ where: { id: 105 }, relations: ["reservationLimits", "reservedProducts"] });
        if (!product) return false;
        const limits = product.getReservationLimit({ date: dayjs("04/05/2021").format(), startTimeId: 12, endTimeId: 13 });
        if (!limits) return false;
        const reserved = product.getReservedProducts({ date: dayjs("04/05/2021").format(), startTimeId: 12, endTimeId: 13 });
        const available = reserved.length < limits;
        console.log(available);
        return true;
      },
    });
    // t.boolean("isProductAvailable", {
    //   resolve: async (_, __, {prisma}) => {
    //     // const me = await isProductAvailable(105, dayjs("04/06/2021"), "13");
    //     const product = await Product.findOne({
    //       where: { id: "105" },
    //       relations: ["reservedProducts", "reservationLimits", "beachBar", "beachBar.products", "beachBar.products.category"],
    //     });
    //     if (!product) return false;
    //     // const remainingAvailable = await redis.hget("available_products:2021-05-31:1300", product.getRedisAvailableProductsKey());
    //     const hey = await product.beachBar.calcRecommendedProducts({
    //       date: "2021-05-31",
    //       startTimeId: 13,
    //       endTimeId: 14,
    //       totalPeople: 5,
    //     });
    //     // const hey = await product.isAvailable({ date: "2021-05-31", timeId: "13" });
    //     console.log(hey);
    //     return true;
    //     // return !remainingAvailable ? false : (parseInt(remainingAvailable)) > 0;
    //   },
    // });
    t.list.field("payments", {
      type: PaymentVisitsType,
      description: "Get a list of payments for a specific / latest month of an authenticated user",
      args: {
        monthId: nullable(idArg({ description: "The ID of the month of the payments to fetch" })),
        year: nullable(intArg({ description: "The year of the payments to fetch" })),
      },
      resolve: async (_, { year, ...args }, { payload, prisma }) => {
        const monthId = args.monthId ? +args.monthId : undefined;
        isAuth(payload);
        if (monthId && (monthId < 1 || monthId > 12)) {
          throw new UserInputError("Invalid monthId. Please provide a value between 1 and 12");
        }

        // const payments = await getConnection()
        // .createQueryBuilder(Payment, "payment")
        // .leftJoinAndSelect("payment.cart", "cart")
        // .leftJoinAndSelect("cart.products", "products", "products.deletedAt IS NULL")
        // .leftJoinAndSelect("products.product", "cartProduct")
        // .leftJoinAndSelect("cartProduct.beachBar", "cartProductBeachBar", "cartProductBeachBar.deletedAt IS NULL")
        // .leftJoinAndSelect("cartProductBeachBar.location", "cartProductBeachBarLocation")
        // .leftJoinAndSelect("cartProductBeachBarLocation.city", "cartProductBeachBarLocationCity")
        // .leftJoinAndSelect("cartProductBeachBarLocation.region", "cartProductBeachBarLocationRegion")
        // .leftJoinAndSelect("products.time", "productsTime")
        // .getMany();

        // Even if the payment is refunded, we want to show to the user the details of it
        const userCarts = await prisma.cart.findMany({
          where: { userId: payload!.sub },
          orderBy: { timestamp: "desc" },
          include: {
            payment: true,
            products: {
              include: {
                startTime: true,
                endTime: true,
                product: { include: { beachBar: true } },
              },
            },
          },
        });

        const products = userCarts
          .filter(({ payment }) => payment)
          .map(({ products }) => products || [])
          .flat();
        if (products.length === 0) return [];
        // const uniqDates = uniq(products.map(product => product.date));

        // const latestMonth = monthId ? monthId - 1 : dayjs.max(uniqDates.map(date => dayjs(date))).month();
        // const latestYear = year ? year : dayjs.max(uniqDates.map(date => dayjs(date))).year();
        const monthProducts =
          monthId && year
            ? products.filter(({ date }) => {
                const parsedDate = dayjs(date);
                return (monthId ? parsedDate.month() === monthId - 1 : true) && (year ? parsedDate.year() === year : true);
              })
            : products;
        // const uniqMonthProducts = uniq(monthProducts);
        const uniqBeachBars = uniqBy(
          monthProducts.map(({ product: { beachBar } }) => beachBar),
          "id"
        );
        const res = uniqBeachBars.map(beachBar => ({
          beachBar,
          visits: monthProducts
            .filter(({ product: { beachBarId } }) => String(beachBarId) === String(beachBar.id))
            .map(({ date, startTime, endTime, cartId }) => {
              const payment = userCarts.find(({ id }) => id.toString() === cartId.toString())!.payment!;
              return {
                date: String(date),
                isUpcoming: dayjs(date).isAfter(dayjs()),
                isRefunded: payment.isRefunded ?? false,
                startTime,
                endTime,
                payment,
              };
            }),
        }));
        return res;
      },
    });
    t.field("payment", {
      type: PaymentType,
      description: "Get the details of a specific payment / trip",
      args: { refCode: idArg({ description: "The referral code of the payment to fetch" }) },
      resolve: async (_, { refCode }, { prisma }) => {
        if (refCode.toString().trim().length === 0) {
          throw new UserInputError("Invalid referral code (ID). Please provide a valid value.");
        }

        // Even if the payment is refunded, we want to show to the user the details of it
        const payment = await prisma.payment.findUnique({ where: { refCode: refCode.toString() } });
        if (!payment) throw new ApolloError("Payment was not found", errors.NOT_FOUND);
        return payment;
      },
    });
    t.float("paymentRefundAmount", {
      description: "Get the amount of refund of a specific payment / trip",
      args: { refCode: idArg({ description: "The referral code of the payment to fetch" }) },
      resolve: async (_, { refCode }, { prisma }) => {
        if (refCode.toString().trim().length === 0) {
          throw new UserInputError("Invalid refCode. Please provide a valid value", { code: errors.INVALID_ARGUMENTS });
        }

        const payment = await prisma.payment.findUnique({
          where: { refCode: refCode.toString() },
          include: { cart: { include: GetTotalCartInclude } },
        });
        if (!payment) throw new ApolloError("Payment was not found", errors.NOT_FOUND);

        const cartTotal = getTotal(payment.cart, { afterToday: false });
        const refundPercentage = getRefundPercentage(payment);
        if (!refundPercentage) throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.SOMETHING_WENT_WRONG);
        const res = cartTotal.totalWithEntryFees * (refundPercentage.percentageValue / 100);
        return +res.toFixed(2);
      },
    });
    // t.list.field("paymentDates", {
    //   type: PaymentVisitsDatesTypes,
    //   description: "Get a list with the months and years of the cart products in all the payments of an authenticated user",
    //   resolve: async (_, __, { payload }: MyContext): Promise<TPaymentVisitsDate[]> => {
    //     isAuth(payload);

    //     const payments = await getConnection()
    //       .createQueryBuilder(Payment, "payment")
    //       .leftJoinAndSelect("payment.cart", "cart")
    //       .leftJoinAndSelect("cart.products", "cartProduct", "cartProduct.deletedAt IS NULL")
    //       .where("cart.userId = :userId", { userId: payload!.sub })
    //       .orderBy("cartProduct.date", "DESC")
    //       .getMany();

    //     const dates = uniq(
    //       payments
    //         .map(({ cart: { products } }) => products)
    //         .flat()
    //         .map(product => dayjs(product?.date).format("YYYY-MM"))
    //     );
    //     console.log(dates);

    //     return dates.map(date => {
    //       const day = dayjs(String(date));
    //       const month = day.month();
    //       return { month: { id: month + 1, value: MONTHS[month], days: day.daysInMonth() }, year: day.year() };
    //     });
    //   },
    // });
  },
});
