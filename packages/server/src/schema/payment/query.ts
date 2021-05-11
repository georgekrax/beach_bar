import { errors, MyContext } from "@beach_bar/common";
import { MONTHS } from "@the_hashtag/common";
import { ApolloError, UserInputError } from "apollo-server-express";
import dayjs from "dayjs";
import minMax from "dayjs/plugin/minMax";
import { Cart } from "entity/Cart";
import { Payment } from "entity/Payment";
import { uniqBy } from "lodash";
import uniq from "lodash/uniq";
import { extendType, idArg, intArg, nullable, stringArg } from "nexus";
import { getConnection } from "typeorm";
import { TPaymentVisits, TPaymentVisitsDate } from "typings/payment";
import { isAuth } from "utils/auth/payload";
import { PaymentType, PaymentVisitsDatesTypes, PaymentVisitsType } from "./types";

dayjs.extend(minMax);

export const PaymentQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("payments", {
      type: PaymentVisitsType,
      description: "Get a list of payments for a specific / latest month of an authenticated user",
      args: {
        monthId: nullable(idArg({ description: "The ID of the month of the payments to fetch" })),
        year: nullable(intArg({ description: "The year of the payments to fetch" })),
      },
      resolve: async (_, { monthId, year }, { payload }: MyContext): Promise<TPaymentVisits[]> => {
        monthId = parseInt(monthId);
        isAuth(payload);
        if (monthId < 1 || monthId > 12) throw new UserInputError("Invalid monthId. Please provide a value between 1 and 12");

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
        const userCarts = await Cart.find({
          where: { userId: payload!.sub },
          relations: [
            "payment",
            "products",
            "products.time",
            "products.product",
            "products.product.beachBar",
            "products.product.beachBar.location",
            "products.product.beachBar.location.city",
            "products.product.beachBar.location.region",
          ],
          order: { timestamp: "DESC" },
        });

        const products = userCarts
          .filter(cart => cart.payment)
          .map(({ products }) => products || [])
          .flat();
        const uniqDates = uniq(products.map(product => product.date));

        const latestMonth = monthId ? monthId - 1 : dayjs.max(uniqDates.map(date => dayjs(date))).month();
        const latestYear = year ? year : dayjs.max(uniqDates.map(date => dayjs(date))).year();
        const monthProducts = products.filter(({ date }) => dayjs(date).month() === latestMonth && dayjs(date).year() === latestYear);
        // const uniqMonthProducts = uniq(monthProducts);
        const uniqBeachBars = uniqBy(
          monthProducts.map(({ product: { beachBar } }) => beachBar),
          "id"
        );
        const res: TPaymentVisits[] = uniqBeachBars.map(beachBar => ({
          beachBar,
          visits: monthProducts
            .filter(product => String(product.product.beachBarId) === String(beachBar.id))
            .map(({ date, time, cartId }) => {
              const payment = userCarts.find(({ id }) => id.toString() === cartId.toString())!.payment!;
              return {
                date: String(date),
                isUpcoming: dayjs(date).isAfter(dayjs()),
                isRefunded: payment.isRefunded ?? false,
                time: { id: time.id, value: time.value },
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
      args: { refCode: stringArg({ description: "The referral code of the payment to fetch" }) },
      resolve: async (_, { refCode }): Promise<Payment> => {
        if (!refCode || refCode.trim().length === 0)
          throw new UserInputError("Invalid referral code (ID). Please provide a valid value.");

        // Even if the payment is refunded, we want to show to the user the details of it
        const payment = await Payment.findOne({
          where: { refCode },
          relations: [
            "status",
            "cart",
            "cart.user",
            "cart.products",
            "cart.products.time",
            "cart.products.product",
            "cart.products.product.beachBar",
            "cart.products.product.beachBar.defaultCurrency",
            "cart.products.product.beachBar.location",
            "cart.products.product.beachBar.location.country",
            "cart.products.product.beachBar.location.city",
            "cart.products.product.beachBar.location.region",
            "card",
            "card.brand",
            "card.country",
            "card.country.currency",
            "card.customer",
            "card.customer.user",
            "card.customer.country",
            "reservedProducts",
            "voucherCode",
            "voucherCode.offerCode",
            "voucherCode.offerCode.campaign",
            "voucherCode.offerCode.campaign.products",
            "voucherCode.couponCode",
            "voucherCode.couponCode.beachBar",
          ],
        });
        if (!payment) throw new ApolloError("Payment was not found", errors.NOT_FOUND);
        return payment;
      },
    });
    t.float("paymentRefundAmount", {
      description: "Get the amount of refund of a specific payment / trip",
      args: { refCode: stringArg({ description: "The referral code of the payment to fetch" }) },
      resolve: async (_, { refCode }): Promise<number> => {
        if (!refCode || refCode.trim().length === 0)
          throw new UserInputError("Invalid referral code (ID). Please provide a valid value.", { code: errors.INVALID_ARGUMENTS });

        const payment = await Payment.findOne({
          where: { refCode },
          relations: ["cart", "cart.products", "cart.products.product", "cart.products.product.beachBar"],
        });
        if (!payment) throw new ApolloError("The payment requested does not exits", errors.NOT_FOUND);

        const cartTotal = await payment.cart.getTotalPrice(true);
        if (!cartTotal) throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.SOMETHING_WENT_WRONG);
        const refundPercentage = await payment.getRefundPercentage();
        if (!refundPercentage) throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.SOMETHING_WENT_WRONG);
        const res = cartTotal.totalWithEntryFees * (parseInt(refundPercentage.refundPercentage.percentageValue.toString()) / 100);
        return parseFloat(res.toFixed(2));
      },
    });
    t.list.field("paymentDates", {
      type: PaymentVisitsDatesTypes,
      description: "Get a list with the months and years of the cart products in all the payments of an authenticated user",
      resolve: async (_, __, { payload }: MyContext): Promise<TPaymentVisitsDate[]> => {
        isAuth(payload);

        const payments = await getConnection()
          .createQueryBuilder(Payment, "payment")
          .leftJoinAndSelect("payment.cart", "cart")
          .leftJoinAndSelect("cart.products", "cartProduct", "cartProduct.deletedAt IS NULL")
          .where("cart.userId = :userId", { userId: payload!.sub })
          .orderBy("cartProduct.date", "DESC")
          .getMany();

        const dates = uniq(
          payments
            .map(({ cart: { products } }) => products)
            .flat()
            .map(product => dayjs(product?.date).format("YYYY-MM"))
        );

        return dates.map(date => {
          const day = dayjs(String(date));
          const month = day.month();
          return { month: { id: month + 1, value: MONTHS[month], days: day.daysInMonth() }, year: day.year() };
        });
      },
    });
  },
});
