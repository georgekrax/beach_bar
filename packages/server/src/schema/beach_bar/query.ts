import { getAvailableProducts } from "@/utils/beachBar";
import { fetchFromRedis, getRedisKey } from "@/utils/db";
import { errors, TABLES } from "@beach_bar/common";
import { BeachBar, Payment, Prisma } from "@prisma/client";
import { DateScalar } from "@the_hashtag/common/dist/graphql";
import { ApolloError, UserInputError } from "apollo-server-express";
import uniqBy from "lodash/uniqby";
import { arg, booleanArg, extendType, idArg, intArg, nullable, stringArg } from "nexus";
import { HourTimeType } from "../details/time/types";
import { SearchInputType } from "../search/types";
import { BeachBarImgUrlType } from "./img_url/types";
import { ProductType } from "./product/types";
import { BeachBarType } from "./types";

const BEACH_BAR_REDIS_KEY = getRedisKey({ model: "BeachBar" });

export const BeachBarQuery = extendType({
  type: "Query",
  definition(t) {
    t.nullable.field("beachBar", {
      type: BeachBarType,
      description: "Get the details of a #beach_bar",
      args: {
        slug: nullable(stringArg()),
        id: nullable(idArg()),
        userVisit: nullable(
          booleanArg({
            default: true,
            description: "Indicates if to retrieve information for user search. Its default value is set to true",
          })
        ),
      },
      resolve: async (_, { slug, id, userVisit = true }, { prisma, redis, payload, ipAddr }) => {
        if (!slug && !id) throw new UserInputError("You should either provide a slug or an ID");
        // if (slug && slug.trim().length === 0) return null;
        if (id && id.toString().trim().length === 0) return null;

        const beachBars: BeachBar[] = (await redis.lrange(BEACH_BAR_REDIS_KEY, 0, -1)).map((x: string) => JSON.parse(x));
        const beachBar = beachBars.find(beachBar => beachBar.id.toString() === id || beachBar.slug === slug);
        if (!beachBar) return null;
        // if (availability) {
        //   const { date, startTimeId, endTimeId } = availability;
        //   const availableProducts = await getAvailableProducts({
        //     ...beachBar,
        //     date,
        //     startTimeId: +startTimeId,
        //     endTimeId: +endTimeId,
        //   });
        //   beachBar = { ...beachBar, products: availableProducts.map(({ product }) => product) } as BeachBar;
        // }
        if (userVisit) {
          await prisma.userHistory.create({
            data: {
              ipAddr,
              userId: payload?.sub,
              objectId: BigInt(beachBar.id),
              activityId: TABLES.HISTORY_ACTIVITY.find(({ name }) => name === "beach_bar_query")!.id,
            },
          });
        }
        
        return beachBar;
      },
    });
    t.string("accountLink", {
      args: { id: idArg() },
      resolve: async (_, { id }, { prisma, stripe }) => {
        const beachBar = await prisma.beachBar.findUnique({ where: { id: +id } });
        if (!beachBar) return "";
        const accountLinks = await stripe.accounts.createLoginLink(beachBar.stripeConnectId);
        return accountLinks.url;
      },
    });
    t.nullable.list.field("beachBarImgs", {
      type: BeachBarImgUrlType,
      description: "Get the images of a #beach_bar",
      args: { slug: stringArg() },
      resolve: async (_, { slug }, { redis }) => {
        if (slug.trim().length === 0) return null;

        const beachBars: Prisma.BeachBarGetPayload<{ include: { imgUrls: true } }>[] = (
          await redis.lrange(BEACH_BAR_REDIS_KEY, 0, -1)
        ).map((x: string) => JSON.parse(x));
        const beachBar = beachBars.find(beachBar => beachBar.slug === slug);
        return beachBar?.imgUrls || null;
      },
    });
    // t.list.field("availableProducts", {
    //   type: ProductAvailabilityType,
    //   description: "Get a list with a #beach_bar's available products",
    //   args: { beachBarId: idArg(), availability: arg({ type: SearchInputType }) },
    //   resolve: async (_, { beachBarId, availability }): Promise<AvailableProductsType> => {
    //     const { date, timeId } = availability;
    //     let { adults, children } = availability;
    //     adults = adults || 0;
    //     children = children || 0;
    //     const totalPeople = adults + children !== 0 ? adults + children : undefined;

    //     const beachBar = await BeachBar.findOne({
    //       where: { id: beachBarId },
    //       relations: [
    //         "products",
    //         "products.category",
    //         "products.category.components",
    //         "products.category.components.component",
    //         "products.category.components.component.icon",
    //         "products.beachBar",
    //         "products.beachBar.products",
    //         "products.beachBar.products.reservedProducts",
    //         "products.beachBar.products.reservationLimits",
    //         "products.beachBar.products.reservationLimits.product",
    //       ],
    //     });
    //     if (!beachBar) throw new ApolloError(errors.BEACH_BAR_DOES_NOT_EXIST, errors.NOT_FOUND);
    //     const available = await beachBar.getAvailableProducts({ date, timeId });
    //     return available;
    //   },
    // });
    t.list.field("getAllBeachBars", {
      type: BeachBarType,
      description: "A list with all the available #beach_bars",
      resolve: async (_, __, { prisma }) => {
        return await prisma.beachBar.findMany({ include: { features: { where: { deletedAt: null } } } });
      },
    });
    t.list.field("getPersonalizedBeachBars", {
      type: BeachBarType,
      description: "A list with all the #beach_bars, related to a user or are top selections",
      resolve: async (_, __, { prisma, payload }) => {
        const maxLength = +process.env.USER_PERSONALIZED_BEACH_BARS_LENGTH!;
        let userPayments: Payment[] = [];
        const userId = payload?.sub;

        if (payload) {
          userPayments = await prisma.payment.findMany({
            take: maxLength,
            where: { cart: { userId } },
            orderBy: { timestamp: "desc" },
          });
        }

        const favouriteBeachBars = await prisma.userFavoriteBar.findMany({
          where: userId ? { userId } : undefined,
          take: maxLength - userPayments.length,
          include: { beachBar: true },
        });
        const uniqueFavouriteBeachBars = uniqBy(
          favouriteBeachBars.map(({ beachBar }) => beachBar),
          "id"
        );

        const reservedProducts = await prisma.reservedProduct.findMany({
          orderBy: { timestamp: "desc" },
          include: { product: { include: { beachBar: true } } },
          take: maxLength - userPayments.length - (userId ? Math.round((favouriteBeachBars.length * 30) / 100) : 0),
        });
        const flatBeachBarArr = reservedProducts.map(({ product: { beachBar } }) => beachBar);
        const beachBarsPayments = flatBeachBarArr.reduce((obj, b) => {
          obj[b.id] = ++obj[b.id] || 1;
          return obj;
        }, {});

        const uniquePaymentsBeachBars = uniqBy(flatBeachBarArr, "id");
        uniquePaymentsBeachBars.sort((a, b) => (beachBarsPayments[a.id] > beachBarsPayments[b.id] ? -1 : 1));

        let finalArr = uniqBy([...uniqueFavouriteBeachBars, ...uniquePaymentsBeachBars], "id");

        if (finalArr.length < maxLength) {
          const otherBeachBars = await prisma.beachBar.findMany({
            where: { id: { notIn: finalArr.map(({ id }) => id) } },
          });
          finalArr = finalArr.concat(otherBeachBars);
        }

        return finalArr;
      },
    });
    t.list.field("nearBeachBars", {
      type: BeachBarType,
      description: "A list with #beach_bars, near to the user's location",
      args: {
        latitude: stringArg({ description: "The latitude of the user's location" }),
        longitude: stringArg({ description: "The longitude of the user's location" }),
        take: nullable(intArg({ description: "How many beach bars to fetch" })),
      },
      resolve: async (_, { latitude, longitude, take }, { prisma }) => {
        const locations = await prisma.$queryRaw<
          Prisma.BeachBarLocationGetPayload<{ select: { beachBarId: true } }>[]
        >`SELECT beach_bar_id AS "beachBarId" FROM public.beach_bar_location_view ORDER BY beach_bar_location_view.where_is <-> ST_MakePoint(${Prisma.raw(
          latitude
        )}, ${Prisma.raw(longitude)})::geography ASC LIMIT ${take || 6}`;

        return await prisma.beachBar.findMany({ where: { id: { in: locations.map(({ beachBarId }) => beachBarId) } } });
      },
    });
    t.list.field("availableHours", {
      type: HourTimeType,
      description: "Fetch the other available hours a #beach_bar is available during that time",
      args: {
        beachBarId: idArg(),
        date: arg({ type: DateScalar.name }),
        // hasOtherHours: nullable(booleanArg({ default: true })),
        // hasOtherDates: nullable(booleanArg({ default: false })),
        // timeId: idArg(),
      },
      resolve: async (_, args) => {
        // const beachBar = await BeachBar.findOne({ where: { id: beachBarId } });
        // if (!beachBar) throw new ApolloError(errors.BEACH_BAR_DOES_NOT_EXIST);

        // let dates: TOtherDatesAvailaility["otherDates"] = [];

        const timeIds = await fetchFromRedis({ ...args, model: "AvailableProducts" });
        if (!timeIds || !Array.isArray(timeIds)) throw new Error(errors.SOMETHING_WENT_WRONG);
        // if (hasOtherDates) {
        //   const parsedStartDate = dayjs(date);
        //   const days: string[] = [];
        //   const dateStart = parsedStartDate.subtract(3, "d");
        //   const dateEnd = parsedStartDate.add(7, "d");
        //   for (let i = 0; i < dateEnd.diff(dateStart, "d"); i++) {
        //     days.push(dateStart.add(i, "d").format(dayjsFormat.ISO_STRING));
        //   }

        //   dates = await Promise.all(
        //     days.map(async newDate => {
        //       const [__, timesInDate] = await redis.scan(0, "MATCH", `available_products:${newDate}:*`, "COUNT", 9 * 9);
        //       if (!timesInDate || timesInDate.length === 0) return [];
        //       const arr = await Promise.all(
        //         timesInDate.map(async val => {
        //           const res = await redis.hscan(val, 0, "MATCH", `beach_bar:${beachBarId}:product:*`);
        //           return {
        //             dateTime: val,
        //             products: chunk(res[1], 2).map(([key, remaining]) => ({ key, remaining: parseInt(remaining) })),
        //           };
        //         })
        //       );
        //       return arr.filter(({ products }) => products.length > 0 && products.some(({ remaining }) => remaining > 0)).length > 0
        //         ? newDate
        //         : [];
        //     })
        //   ).then(arr => arr.flat());
        // }
        return timeIds.sort((a, b) => +a.id - +b.id);
      },
    });
    t.list.field("availableProducts", {
      type: ProductType,
      description: "Fetch the available product of a #beach_bar for a date and a time period",
      args: {
        beachBarId: idArg(),
        availability: nullable(
          arg({
            type: SearchInputType,
            description:
              "Arguments to search against #beach_bar's availability. If provided, the #beach_bar's products will only be the available ones for the specified data and time",
          })
        ),
      },
      resolve: async (_, { beachBarId, availability }, { redis }) => {
        const beachBars: Prisma.BeachBarGetPayload<{ include: { products: true } }>[] = (
          await redis.lrange(BEACH_BAR_REDIS_KEY, 0, -1)
        ).map((x: string) => JSON.parse(x));

        const beachBar = beachBars.find(({ id }) => id.toString() === beachBarId.toString());
        if (!beachBar) throw new ApolloError(errors.BEACH_BAR_DOES_NOT_EXIST, errors.NOT_FOUND);

        let availableProducts = beachBar.products;
        if (availability) {
          const { date, startTimeId, endTimeId } = availability;
          const newProducts = await getAvailableProducts(beachBar, {
            date,
            startTimeId: +startTimeId,
            endTimeId: +endTimeId,
          });
          availableProducts = newProducts.map(({ product }) => product);
        }

        return availableProducts;
      },
    });
  },
});
