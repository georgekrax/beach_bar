import { NexusGenObjects, NexusGenScalars } from "@/graphql/generated/nexusTypes";
import { isAuth } from "@/utils/auth";
import {
  calcCapacity,
  CalcCapacityPaymentInclude,
  findMostActiveTime,
  getPaymentDetails,
  GetPaymentDetailsInclude,
  isOwner,
  IsOwnerInclude,
} from "@/utils/beachBar";
import { getFoods, getProducts, getTotal, GetTotalCartInclude } from "@/utils/cart";
import { parseDates, toFixed2 } from "@/utils/data";
import { getRefundDetails } from "@/utils/payment";
import { dayjsFormat, errors } from "@beach_bar/common";
import { BeachBar, CartProduct, Prisma } from "@prisma/client";
import { UrlScalar } from "@the_hashtag/common/dist/graphql";
import { ApolloError, UserInputError } from "apollo-server-errors";
import { createHash, randomBytes } from "crypto";
import dayjs, { Dayjs } from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import groupBy from "lodash/groupBy";
import range from "lodash/range";
import { arg, extendType, idArg, nullable, stringArg } from "nexus";
import { DashboardBillingType, DashboardBookingsType, DashboardDatesArgType, DashboardHomePageType } from "./types";

dayjs.extend(isSameOrAfter);

const COMMON_ARGS = { beachBarId: idArg(), dates: nullable(arg({ type: DashboardDatesArgType })) };
type DashboardBilling = NexusGenObjects["DashboardBilling"];

type TotalDatePayments = { date: Dayjs; paymentIds: string[] }[];

const calcGrossVolume = (
  arr: Prisma.PaymentGetPayload<{ include: { cart: { include: typeof GetTotalCartInclude } } }>[],
  beachBar: BeachBar
): number => {
  const grossVolume = arr.reduce((prev, { cart }) => {
    const { totalWithEntryFees } = getTotal(cart, { beachBarId: beachBar.id });
    return prev + totalWithEntryFees;
  }, 0);
  return grossVolume;
};

const calcTotalDatePayments = (arr: TotalDatePayments, date: NexusGenScalars["Date"] | null, id: string) => {
  const itemIdx = arr.findIndex(revenue => dayjs(revenue.date).isSame(date, "date"));
  if (itemIdx === -1) return;
  const { paymentIds } = arr[itemIdx];
  arr[itemIdx] = {
    date: dayjs(date),
    paymentIds: !paymentIds.includes(id) ? paymentIds.concat(id) : paymentIds,
  };
};

export const DashboardQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("dashboardHomePage", {
      type: DashboardHomePageType,
      description: "Fetch the homepage data (of the day) for #beach_bar's dashboard",
      args: COMMON_ARGS,
      resolve: async (_, { beachBarId, dates }, { prisma, payload }) => {
        isAuth(payload);

        const beachBar = await prisma.beachBar.findUnique({
          where: { id: +beachBarId },
          include: { ...GetPaymentDetailsInclude, ...IsOwnerInclude, products: true },
        });
        if (!beachBar) throw new ApolloError(errors.BEACH_BAR_DOES_NOT_EXIST, errors.NOT_FOUND);

        isOwner(beachBar, { userId: payload!.sub });

        const { startDate, endDate, formattedDates, hours, datesArr } = parseDates(dates);

        const timeIdParams: Pick<Prisma.ProductReservationLimitWhereInput, "startTimeId" | "endTimeId"> = {
          startTimeId: { lte: hours.start },
          endTimeId: { gte: hours.end },
        };

        // Balance
        // where: { timestamp: Raw(
        //     alias => `DATE(${alias}) <= '${formattedDate}' AND DATE(${alias}) >= '${minus7days.format(dayjsFormat.ISO_STRING)}'`
        //   ) },
        let allPayments = await prisma.payment.findMany({
          include: {
            card: { include: { customer: true } },
            cart: { include: GetTotalCartInclude },
          },
        });
        let revenue = 0;
        let todayProducts: CartProduct[] = [];
        allPayments = allPayments.filter(({ cart }) => getProducts(cart, { beachBarId: beachBar.id }).length > 0);
        const datesPayments = allPayments.filter(({ timestamp }) => {
          return dayjs(timestamp).isBetween(endDate, startDate, "date", "[]");
        });
        for (const payment of datesPayments) {
          const { products, totalWithEntryFees } = getTotal(payment.cart, { beachBarId: beachBar.id });
          todayProducts = todayProducts.concat(
            products.filter(({ date, startTimeId, endTimeId }) => {
              return dayjs(date).isSame(startDate, "date") && startTimeId <= hours.start && endTimeId >= hours.start;
            })
          );
          let { transferAmount } = getPaymentDetails(beachBar, { total: totalWithEntryFees });
          if (payment.isRefunded) {
            const { refundedAmount } = getRefundDetails(payment, { beachBarId: beachBar.id });
            transferAmount = transferAmount - refundedAmount / 100;
          }
          revenue = revenue + transferAmount;
        }

        const datesGrossVolume = (datesArr.length <= 2 ? range(0, 24) : datesArr).map((val: number | Dayjs) => {
          const isHour = typeof val === "number";
          const newDate = isHour ? startDate.hour(val) : val;
          const datePayments = allPayments.filter(({ timestamp }) => dayjs(timestamp).isSame(newDate, isHour ? "hour" : "date"));
          return { date: newDate, value: calcGrossVolume(datePayments, beachBar) };
        });

        const productIds = beachBar.products.map(({ id }) => id);
        // const rProducts = await ReservedProduct.find({
        //   where: { ...timeIdParams, productId: In(productIds), date: formattedDates.start },
        //   relations: ["payment", "payment.cart", "payment.cart.products"],
        // });
        // const reservedCartProducts = rProducts.map(({ payment, productId }) =>
        //       payment.cart.products?.filter(
        //         // cartProduct => cartProduct.productId === productId && cartProduct.date.toString() === formattedDate
        //         cartProduct => cartProduct.productId === productId && cartProduct.date.toString() === "2021-04-16"
        //       ) || []).flat();
        // Total today customers (live per hour)
        let capacity: { hour: number; value: number }[] = range(beachBar.openingTimeId, beachBar.closingTimeId + 1).map(hour => ({
          hour,
          value: 0,
        }));
        for (const { people, startTimeId, endTimeId } of todayProducts) {
          range(startTimeId, endTimeId + 1).forEach(hour => {
            const idx = capacity.findIndex(capacity => capacity.hour === hour);
            if (idx === -1) return;
            const item = capacity[idx];
            capacity[idx] = { ...item, value: item.value + people };
          });
        }

        // Capacity
        const limits = await prisma.productReservationLimit.findMany({
          include: { product: true },
          where: { ...timeIdParams, productId: { in: productIds }, to: { lte: new Date(formattedDates.start) } },
        });
        // const limits = await ProductReservationLimit.find({
        //   where: {
        //     ...timeIdParams,
        //     productId: In(productIds),
        //     // // from: Raw(alias => `DATE(${alias}) >= '${formattedDates.end}'`),
        //     to: Raw(alias => `DATE(${alias}) <= '${formattedDates.start}'`),
        //   },
        //   relations: ["product"],
        // });
        const totalMaxPeopleCapacity = limits.reduce((prev, { limitNumber, product }) => prev + limitNumber * product.maxPeople, 0);
        const totalHourCustomers = capacity.find(({ hour }) => hour === hours.start)?.value || 0;

        // Date and value
        // before, because we want the old customers
        const beforeEndDatePayments = allPayments.filter(({ timestamp }) => dayjs(timestamp).isBefore(endDate, "date"));
        let oldCustomersIds = beforeEndDatePayments.map(({ card }) => card.customerId.toString());
        const chartData = datesArr.map(date => {
          const datePayments = allPayments.filter(({ timestamp }) => dayjs(timestamp).isSame(date, "date"));
          const grossVolume = calcGrossVolume(datePayments, beachBar);
          const totalPeople = datePayments.reduce((prev, { cart }) => {
            const products = getProducts(cart, { beachBarId: beachBar.id }).filter(cartProduct =>
              dayjs(cartProduct.date).isSame(date, "date")
            );
            return prev + products.reduce((prev, { people }) => prev + people, 0);
          }, 0);
          const avgSpend = grossVolume / totalPeople || 0;
          const customers = datePayments.map(({ card: { customer } }) => customer);
          const newCustomers = customers.filter(({ id }) => !oldCustomersIds.includes(id.toString()));
          oldCustomersIds = oldCustomersIds.concat(customers.map(({ id }) => id.toString()));
          return { date, grossVolume, avgSpend, newCustomers };
        });

        // Average rating
        const reviews = await prisma.beachBarReview.findMany({
          where: { timestamp: { lte: new Date(formattedDates.start), gte: new Date(formattedDates.end) } },
        });

        const avgRating = datesArr.map(date => {
          const dateReviews = reviews.filter(({ timestamp }) => dayjs(timestamp).isSame(date, "date"));
          const value = dateReviews.reduce((prev, cur) => prev + cur.ratingValue, 0) / dateReviews.length;
          return { date, value: value || 0 };
        });

        return {
          avgRating,
          newCustomers: chartData.map(({ newCustomers, ...rest }) => ({ ...rest, customers: newCustomers })),
          grossVolume: chartData.map(({ grossVolume, ...rest }) => ({ ...rest, value: grossVolume })),
          avgSpendPerPerson: chartData.map(({ avgSpend, ...rest }) => ({ ...rest, value: avgSpend })),
          totalCustomers: capacity.map(({ hour, ...rest }) => ({ ...rest, date: startDate.hour(hour) })),
          balance: { revenue: +revenue.toFixed(2), successfulPayments: datesPayments, grossVolume: datesGrossVolume },
          capacity: {
            totalHourCustomers,
            totalMaxPeopleCapacity,
            reservedProducts: todayProducts.length,
            availableProducts: limits.reduce((prev, cur) => prev + cur.limitNumber, 0),
            percentage: totalMaxPeopleCapacity > 0 ? toFixed2((totalHourCustomers / totalMaxPeopleCapacity) * 100) : 0,
          },
        };
      },
    });
    t.field("dashboardBilling", {
      type: DashboardBillingType,
      description: "Fetch the billing data for the dashboard",
      args: COMMON_ARGS,
      resolve: async (_, { beachBarId, dates }, { prisma, payload }) => {
        isAuth(payload);

        const beachBar = await prisma.beachBar.findUnique({ where: { id: +beachBarId }, include: IsOwnerInclude });
        if (!beachBar) throw new ApolloError(errors.BEACH_BAR_DOES_NOT_EXIST, errors.NOT_FOUND);

        isOwner(beachBar, { userId: payload!.sub });

        const { datesArr } = parseDates(dates);

        const allPayments = await prisma.payment.findMany({
          where: { cart: { products: { some: { product: { beachBarId: beachBar.id } } } } },
          include: {
            cart: { include: GetTotalCartInclude },
            card: {
              include: { customer: { include: { user: { include: { account: { include: { country: true } } } } } }, country: true },
            },
          },
        });
        const nonRefundedPayments = allPayments.filter(({ isRefunded }) => isRefunded === false);

        let productsRevenue = datesArr.map(date => ({ date, value: 0 }));
        let mostCommonProducts: DashboardBilling["products"]["mostCommon"] = [];
        let foodsRevenue = productsRevenue; // datesArr.map(date => ({ date, value: 0 }))
        let mostCommonFoods: DashboardBilling["foods"]["mostCommon"] = [];
        let totalDatePayments: TotalDatePayments = datesArr.map(date => ({ date, paymentIds: [] }));

        for (const payment of nonRefundedPayments) {
          const { products, foods } = getTotal(payment.cart, { beachBarId: beachBar.id });
          const paymentId = payment.id.toString();
          for (const { date, quantity, product } of products) {
            const has = productsRevenue.find(revenue => dayjs(revenue.date).isSame(date, "date"));
            calcTotalDatePayments(totalDatePayments, date, paymentId);
            if (has) {
              const { id: productId, price } = product;
              const id = productId.toString();
              const itemIdx = mostCommonProducts.findIndex(({ product }) => product.id.toString() === id);
              if (itemIdx !== -1) {
                const item = mostCommonProducts[itemIdx];
                mostCommonProducts[itemIdx] = { ...item, timesBooked: item.timesBooked + 1 };
              } else mostCommonProducts = mostCommonProducts.concat({ product, timesBooked: 1 });
              productsRevenue = productsRevenue.map(revenue => {
                return dayjs(revenue.date).isSame(date, "date")
                  ? { ...revenue, value: revenue.value + price.toNumber() * quantity }
                  : revenue;
              });
            }
          }
          for (const { date, quantity, food } of foods) {
            const has = foodsRevenue.find(revenue => dayjs(revenue.date).isSame(date, "date"));
            calcTotalDatePayments(totalDatePayments, date, paymentId);
            if (has) {
              const { id: foodId, price } = food;
              const id = foodId.toString();
              const itemIdx = mostCommonFoods.findIndex(({ food }) => food.id.toString() === id);
              if (itemIdx !== -1) {
                const item = mostCommonFoods[itemIdx];
                mostCommonFoods[itemIdx] = { ...item, timesPurchased: item.timesPurchased + 1 };
              } else mostCommonFoods = mostCommonFoods.concat({ food, timesPurchased: 1 });
              foodsRevenue = foodsRevenue.map(revenue => {
                return dayjs(revenue.date).isSame(date, "date")
                  ? { ...revenue, value: revenue.value + price.toNumber() * quantity }
                  : revenue;
              });
            }
          }
        }

        // Refunded payments
        let refundedPayments: any = Object.entries(
          groupBy(
            allPayments.filter(({ isRefunded }) => isRefunded === true),
            ({ timestamp }) => dayjs(timestamp).format(dayjsFormat.ISO_STRING)
          )
        );
        refundedPayments = datesArr.map(date => ({
          date,
          payments: refundedPayments.find(([paymentsDate]) => dayjs(paymentsDate).isSame(date, "date"))?.payments || ([] as any),
        }));

        // Customers per country
        let customersCountries: DashboardBilling["customersCountries"] = [];
        const allCustomerCountries = allPayments
          .map(({ card: { customer, country } }) => customer.user?.account?.country || country || [])
          .flat();

        for (const country of allCustomerCountries.concat(allCustomerCountries)) {
          const { name } = country;
          const itemIdx = customersCountries.findIndex(({ country }) => country.name === name);
          if (itemIdx === -1) customersCountries = customersCountries.concat({ country, value: 1 });
          else {
            const item = customersCountries[itemIdx];
            customersCountries[itemIdx] = { ...item, value: item.value + 1 };
          }
        }

        // Average products & foods
        const totalProducts = allPayments.map(({ cart }) => getProducts(cart, { beachBarId: beachBar.id })).flat();
        const totalFoods = allPayments.map(({ cart }) => getFoods(cart, { beachBarId: beachBar.id })).flat();
        const avgProducts = totalDatePayments.map(({ date, paymentIds }) => {
          const filteredArr = totalProducts.filter(common => dayjs(common.date).isSame(date, "date"));
          return { date, value: filteredArr.length / paymentIds.length || 0 };
        });

        const avgFoods = totalDatePayments.map(({ date, paymentIds }) => {
          const filteredArr = totalFoods.filter(common => dayjs(common.date).isSame(date, "date"));
          return { date, value: filteredArr.length / paymentIds.length || 0 };
        });

        return {
          avgProducts,
          avgFoods,
          refundedPayments,
          customersCountries,
          products: { revenue: productsRevenue, mostCommon: mostCommonProducts },
          foods: { revenue: foodsRevenue, mostCommon: mostCommonFoods },
        };
      },
    });
    t.field("dashboardBookings", {
      type: DashboardBookingsType,
      description: "Fetch the booking data (reservations) for the dashboard",
      args: COMMON_ARGS,
      resolve: async (_, { beachBarId, dates }, { prisma, payload }) => {
        isAuth(payload);

        const beachBar = await prisma.beachBar.findUnique({
          where: { id: +beachBarId },
          include: { ...IsOwnerInclude, products: true },
        });
        if (!beachBar) throw new ApolloError(errors.BEACH_BAR_DOES_NOT_EXIST, errors.NOT_FOUND);

        isOwner(beachBar, { userId: payload!.sub });

        const { startDate, endDate } = parseDates(dates, "date");

        let bookings = await prisma.payment.findMany({
          where: { deletedAt: { not: null }, cart: { products: { some: { product: { beachBarId: beachBar.id } } } } },
          include: CalcCapacityPaymentInclude,
        });
        bookings = bookings.filter(({ cart: { products } }) => {
          // const hasProducts = getProducts(cart, { beachBarId: beachBar.id }).length > 0;
          // if (hasProducts === false) return hasProducts;
          return products?.some(({ date }) => dayjs(date).isBetween(startDate, endDate, "date", "[]"));
        });

        const capacity = await calcCapacity({ dates, beachBar, payments: bookings });
        const mostActive = findMostActiveTime(capacity);

        bookings = bookings.sort(
          (a, b) => new Date(b.timestamp.toISOString()).getTime() - new Date(a.timestamp.toISOString()).getTime()
        );

        return { bookings, capacity, mostActive };
      },
    });
    t.nullable.field("stripeConnectUrl", {
      type: UrlScalar.name,
      description:
        "Returns the URL where the #beach_bar (owner) will be redirected to authorize and register with Stripe, for its connect account",
      args: { phoneNumber: nullable(stringArg()) },
      resolve: async (_, { phoneNumber }, { res, prisma, stripe, payload }) => {
        if (!payload) return null;

        const state = createHash("sha256").update(randomBytes(1024)).digest("hex");
        res.cookie("scstate", state, { httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 300000 });
        const user = await prisma.user.findUnique({
          where: { id: payload.sub },
          include: { owner: true, account: { include: { country: true } } },
        });
        if (!user || !user.owner || !user?.account?.city) return null;

        const url = stripe.oauth.authorizeUrl({
          client_id: process.env.STRIPE_OAUTH_CLIENT_ID,
          redirect_uri: process.env.STRIPE_CONNECT_OAUTH_REDIRECT_URI,
          response_type: "code",
          state,
          scope: "read_only",
          stripe_user: {
            email: user.email,
            first_name: user.firstName || undefined,
            last_name: user.lastName || undefined,
            business_type: "company",
            phone_number: phoneNumber || user.account.phoneNumber || undefined,
            country: user.account.country?.alpha2Code,
            city: user.account.city,
          },
          // suggested_capabilities: ["transfers", "card_payments"],
        });
        return url;
      },
    });
    t.field("getStripeLoginLink", {
      type: UrlScalar.name,
      description:
        "Returns the Stripe dashboard URL where the #beach_bar can access its Stripe dashboard, to view all transactions and payments",
      args: { beachBarId: idArg() },
      resolve: async (_, { beachBarId }, { prisma, stripe, payload }) => {
        isAuth(payload);

        if (beachBarId.toString().trim().length === 0) throw new UserInputError("Please provide a valid beachBarId");

        const beachBar = await prisma.beachBar.findUnique({ where: { id: +beachBarId }, include: IsOwnerInclude });
        if (!beachBar) throw new ApolloError(errors.BEACH_BAR_DOES_NOT_EXIST, errors.NOT_FOUND);
        isOwner(beachBar, { userId: payload!.sub });

        const loginLink = await stripe.accounts.createLoginLink(beachBar.stripeConnectId);
        // const link = await stripe.accountLinks.create({
        await stripe.accountLinks.create({
          type: "account_update",
          account: beachBar.stripeConnectId,
          return_url: process.env.STRIPE_CONNECT_OAUTH_REDIRECT_URI,
        });
        // console.log(link.url);
        return loginLink.url;
      },
    });
  },
});
