import { COMMON_CONFIG, errors, MyContext } from "@beach_bar/common";
import { ApolloError, UserInputError } from "apollo-server-errors";
import redisKeys from "constants/redisKeys";
import { BeachBar } from "entity/BeachBar";
import { BeachBarImgUrl } from "entity/BeachBarImgUrl";
import { Payment } from "entity/Payment";
import { UserFavoriteBar } from "entity/UserFavoriteBar";
import { UserHistory } from "entity/UserHistory";
import uniqBy from "lodash/uniqby";
import { arg, booleanArg, extendType, idArg, nullable, stringArg } from "nexus";
import { getConnection, In, Not } from "typeorm";
import { BeachBarAvailabilityReturnType } from "typings/beach_bar";
import { TProductAvailability } from "typings/beach_bar/product";
import { SearchInputType } from "../search/types";
import { BeachBarImgUrlType } from "./img_url/types";
import { ProductAvailabilityType } from "./product/types";
import { BeachBarAvailabilityType, BeachBarType } from "./types";

export const BeachBarQuery = extendType({
  type: "Query",
  definition(t) {
    t.nullable.field("beachBar", {
      type: BeachBarType,
      description: "Get the details of a #beach_bar",
      args: {
        slug: stringArg(),
        userVisit: nullable(
          booleanArg({
            description: "Indicates if to retrieve information for user search. Its default value is set to true",
            default: true,
          })
        ),
      },
      resolve: async (_, { slug, userVisit }, { redis, ipAddr, payload }: MyContext): Promise<BeachBar | null> => {
        if (!slug || slug.trim().length === 0) return null;

        const beachBars: BeachBar[] = (await redis.lrange(redisKeys.BEACH_BAR_CACHE_KEY, 0, -1)).map((x: string) => JSON.parse(x));
        const beachBar = beachBars.find(beachBar => beachBar.slug === slug);
        if (!beachBar) return null;
        if (userVisit)
          await UserHistory.create({
            activityId: COMMON_CONFIG.HISTORY_ACTIVITY.BEACH_BAR_QUERY_ID,
            objectId: BigInt(beachBar.id),
            userId: payload ? payload.sub : undefined,
            ipAddr,
          }).save();

        return beachBar;
      },
    });
    t.nullable.list.field("beachBarImgs", {
      type: BeachBarImgUrlType,
      description: "Get the images of a #beach_bar",
      args: { slug: stringArg() },
      resolve: async (_, { slug }, { redis }: MyContext): Promise<BeachBarImgUrl[] | null> => {
        if (!slug || slug.trim().length === 0) return null;

        const beachBars: BeachBar[] = (await redis.lrange(redisKeys.BEACH_BAR_CACHE_KEY, 0, -1)).map((x: string) => JSON.parse(x));
        const beachBar = beachBars.find(beachBar => beachBar.slug === slug);
        return beachBar?.imgUrls || null;
      },
    });
    t.field("checkBeachBarAvailability", {
      type: BeachBarAvailabilityType,
      description: "Check a #beach_bar's availability",
      args: { beachBarId: idArg(), availability: arg({ type: SearchInputType }) },
      resolve: async (_, { beachBarId, availability }): Promise<BeachBarAvailabilityReturnType> => {
        if (!beachBarId || beachBarId.trim().length === 0) throw new UserInputError("Please provide a valid beachBarId");
        if (!availability) throw new UserInputError("Please provide a valid availability");
        const { date, timeId } = availability;
        let { adults, children } = availability;
        adults = adults || 0;
        children = children || 0;
        const totalPeople = adults + children !== 0 ? adults + children : undefined;

        const beachBar = await BeachBar.findOne({
          where: { id: beachBarId },
          relations: ["products", "products.reservedProducts", "products.reservationLimits", "products.reservationLimits.product"],
        });
        if (!beachBar) throw new ApolloError(errors.BEACH_BAR_DOES_NOT_EXIST, errors.NOT_FOUND);
        return beachBar.checkAvailability({ date, timeId, totalPeople });
      },
    });
    t.list.field("availableProducts", {
      type: ProductAvailabilityType,
      description: "Get a list with a #beach_bar's available products",
      args: { beachBarId: idArg(), availability: arg({ type: SearchInputType }) },
      resolve: async (_, { beachBarId, availability }): Promise<TProductAvailability[]> => {
        const { date, timeId } = availability;
        let { adults, children } = availability;
        adults = adults || 0;
        children = children || 0;
        const totalPeople = adults + children !== 0 ? adults + children : undefined;

        const beachBar = await BeachBar.findOne({
          where: { id: beachBarId },
          relations: [
            "products",
            "products.category",
            "products.category.components",
            "products.category.components.component",
            "products.category.components.component.icon",
            "products.beachBar",
            "products.beachBar.products",
            "products.beachBar.products.reservedProducts",
            "products.beachBar.products.reservationLimits",
            "products.beachBar.products.reservationLimits.product",
          ],
        });
        if (!beachBar) throw new ApolloError(errors.BEACH_BAR_DOES_NOT_EXIST, errors.NOT_FOUND);
        return beachBar.getAvailableProducts({ date, timeId, totalPeople });
      },
    });
    t.list.field("getAllBeachBars", {
      type: BeachBarType,
      description: "A list with all the available #beach_bars",
      resolve: async (): Promise<BeachBar[]> => {
        const beachBars = await BeachBar.find({
          relations: [
            "owners",
            "owners.owner",
            "owners.owner.user",
            "owners.owner.user.account",
            "reviews",
            "restaurants",
            "restaurants.foodItems",
            "products",
            "features",
            "features.service",
            "features.service.icon",
            "location",
            "location.country",
            "location.city",
            "location.region",
            "styles",
            "styles.style",
          ],
        });
        beachBars.forEach(beachBar => (beachBar.features = beachBar.features.filter(feature => !feature.deletedAt)));
        return beachBars;
      },
    });
    t.list.field("getPersonalizedBeachBars", {
      type: BeachBarType,
      description: "A list with all the #beach_bars, related to a user or are top selections",
      resolve: async (_, __, { payload }: MyContext): Promise<BeachBar[]> => {
        const maxLength = parseInt(process.env.USER_PERSONALIZED_BEACH_BARS_LENGTH!);
        let userPayments: Payment[] = [];
        const userId = payload?.sub;

        if (payload) {
          userPayments = await getConnection()
            .getRepository(Payment)
            .createQueryBuilder("payment")
            .leftJoinAndSelect("payment.cart", "cart")
            .leftJoinAndSelect("cart.products", "cartProducts")
            .leftJoinAndSelect("cartProducts.product", "cartProductsProduct")
            .leftJoinAndSelect("cartProductsProduct.beachBar", "cartProductsProductBeachBar")
            .leftJoinAndSelect("cartProductsProductBeachBar.location", "cartProductsProductBeachBarLocation")
            .leftJoinAndSelect("cartProductsProductBeachBarLocation.city", "cartProductsProductBeachBarLocationCity")
            .leftJoinAndSelect("cartProductsProductBeachBarLocation.region", "cartProductsProductBeachBarLocationRegion")
            .where("cart.user_id = :userId", { userId: userId })
            .orderBy("payment.timestamp", "DESC")
            .limit(maxLength)
            .getMany();
        }

        const favouriteBeachBars = await UserFavoriteBar.find({
          take: maxLength - userPayments.length,
          where: userId ? { userId } : undefined,
          relations: ["beachBar", "beachBar.location", "beachBar.location.city", "beachBar.location.region"],
        });
        const uniqueFavouriteBeachBars = uniqBy(
          favouriteBeachBars.map(favourite => favourite.beachBar),
          "id"
        );

        const payments = await Payment.find({
          take: maxLength - userPayments.length - (userId ? Math.round((favouriteBeachBars.length * 30) / 100) : 0),
          order: { timestamp: "DESC" },
          relations: [
            "cart",
            "cart.products",
            "cart.products.product",
            "cart.products.product.beachBar",
            "cart.products.product.beachBar.location",
            "cart.products.product.beachBar.location.city",
            "cart.products.product.beachBar.location.region",
          ],
        });
        const paymentsBeachBars = payments.map(payment => payment.getBeachBars());
        const flatBeachBarArr = paymentsBeachBars.flat();
        const beachBarsPayments = flatBeachBarArr.reduce((obj, b) => {
          obj[b.id] = ++obj[b.id] || 1;
          return obj;
        }, {});

        const uniquePaymentsBeachBars = uniqBy(flatBeachBarArr, "id");
        uniquePaymentsBeachBars.sort((a, b) => (beachBarsPayments[a.id] > beachBarsPayments[b.id] ? -1 : 1));

        let finalArr = uniqBy([...uniqueFavouriteBeachBars, ...uniquePaymentsBeachBars], "id");

        if (finalArr.length < maxLength) {
          const otherBeachBars = await BeachBar.find({
            where: { id: Not(In(finalArr.map(({ id }) => id))) },
            relations: ["location", "location.city", "location.region"],
          });
          finalArr = finalArr.concat(otherBeachBars);
        }

        return finalArr;
      },
    });
    t.list.field("nearBeachBars", {
      type: BeachBarType,
      description: "A list with 6 #beach_bars, near to the user's location",
      args: {
        latitude: stringArg({ description: "The latitude of the user's location" }),
        longitude: stringArg({ description: "The longitude of the user's location" }),
      },
      resolve: async (_, { latitude, longitude }): Promise<BeachBar[]> => {
        const beachBars = await getConnection()
          .getRepository(BeachBar)
          .createQueryBuilder("beachBar")
          .leftJoinAndSelect("beachBar.location", "beachBarLocation")
          .leftJoinAndSelect("beachBarLocation.country", "beachBarLocationCountry")
          .leftJoinAndSelect("beachBarLocation.city", "beachBarLocationCity")
          .leftJoinAndSelect("beachBarLocation.region", "beachBarLocationRegion")
          // .where("", {})
          .orderBy(`beachBarLocation.where_is <-> ST_MakePoint(${latitude}, ${longitude})::geography`, "ASC")
          .limit(6)
          .getMany();
        return beachBars;
      },
    });
  },
});
