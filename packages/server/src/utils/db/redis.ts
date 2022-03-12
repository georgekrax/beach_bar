import { NexusGenScalars } from "@/graphql/generated/nexusTypes";
import { SearchResultReturn } from "@/typings/search";
import { TABLES } from "@beach_bar/common";
import { Prisma, Product, UserSearch } from "@prisma/client";
import chunk from "lodash/chunk";
import { prisma, redis } from "../..";

// export const RELATIONS: { BEACH_BAR_EXTENSIVE: Prisma.BeachBarFindUniqueArgs["include"] } = {
export const RELATIONS = {
  BEACH_BAR_EXTENSIVE: {
    category: true,
    openingTime: true,
    closingTime: true,
    imgUrls: true,
    appFee: true, // TODO: @ignore
    currency: true,
    styles: true,
    owners: { include: { owner: { include: { user: true } } } },
    foods: { include: { category: { include: { icon: true } } } },
    restaurants: { include: { foodItems: { include: { menuCategory: true } } } },
    features: {
      where: { deletedAt: null },
      include: { service: { include: { icon: true } } },
    },
    location: {
      include: {
        country: { include: { currency: true } },
        city: { include: { country: true } },
        region: { include: { country: true, city: true } },
      },
    },
    products: {
      where: { deletedAt: null },
      include: {
        reservationLimits: { where: { deletedAt: null }, include: { startTime: true, endTime: true, product: true } },
        category: { include: { components: { include: { component: { include: { icon: true } } } } } },
      },
    },
    reviews: {
      include: {
        payment: true,
        visitType: true,
        month: true,
        votes: { include: { user: true, type: true } },
        customer: { include: { user: { include: { account: true } } } },
      },
    },
  },
  // BEACH_BAR_QUERY: [
  //   "category",
  //   "openingTime",
  //   "closingTime",
  //   "products",
  //   "products.category",
  //   "products.components",
  //   "features",
  //   "features.service",
  //   "location",
  //   "location.country",
  //   "location.city",
  //   "location.region",
  //   "reviews",
  //   "reviews.customer",
  //   // "reviews.answer",
  //   "defaultCurrency",
  //   // "entryFees",
  //   "restaurants",
  //   "restaurants.foodItems",
  //   "restaurants.foodItems.menuCategory",
  // ],
} as const;

const REDIS_KEYS = {
  USER: "user",
  USER_SEARCH: "search",
  USER_SCOPE: "scope",
  BEACH_BAR_CACHE_KEY: "beach_bar",
  RESERVED_PRODUCT_CACHE_KEY: "reserved_product",
  AWS_S3_BUCKET: "aws_s3_bucket",
} as const;

// getRedisIdx()
type GetRedisIdxOptions =
  | ({
      model: "UserSearch";
    } & Prisma.UserSearchGetPayload<{ select: { id: true; userId: true } }>)
  | ({
      model: "BeachBar";
    } & Prisma.BeachBarGetPayload<{ select: { id: true } }>)
  | ({ model: "ReservedProduct" } & Prisma.ReservedProductGetPayload<{
      select: { id: true; product: { select: { beachBarId: true } } };
    }>);

export const getRedisIdx = async (params: GetRedisIdxOptions): Promise<number> => {
  switch (params.model) {
    case "BeachBar": {
      const { id } = params;
      const beachBars = await redis.lrange(getRedisKey({ model: "BeachBar" }), 0, -1);
      return beachBars.findIndex((x: string) => JSON.parse(x).id === id);
    }
    case "UserSearch": {
      const { id, userId } = params;
      const userSearches = await redis.lrange(getRedisKey({ model: "UserSearch", userId }), 0, -1);
      return userSearches.findIndex((x: string) => JSON.parse(x).search.id.toString() === id.toString());
    }
    case "ReservedProduct": {
      const { id, product } = params;
      const reservedProducts = await redis.lrange(getRedisKey({ model: "ReservedProduct", beachBarId: product.beachBarId }), 0, -1);
      return reservedProducts.findIndex((x: string) => JSON.parse(x).id.toString() === id.toString());
    }

    // ! Should not be called at all
    default:
      return 0;
  }
};

// type GetRedisKeyModel = "User" | "BeachBar";
type GetRedisKeyOptions =
  | ({
      model: "User";
      scope?: boolean;
    } & Prisma.UserGetPayload<{ select: { id: true } }>)
  | ({ model: "UserSearch" } & Partial<Prisma.UserSearchGetPayload<{ select: { userId: true } }>>)
  | {
      model: "BeachBar";
    }
  | ({ model: "ReservedProduct" } & Pick<Product, "beachBarId">);

export const getRedisKey = (params: GetRedisKeyOptions): string => {
  switch (params.model) {
    case "User": {
      const { scope = false, id } = params;
      if (scope) return REDIS_KEYS.USER + ":" + id + ":" + REDIS_KEYS.USER_SCOPE;
      return REDIS_KEYS.USER + ":" + id;
    }
    case "UserSearch": {
      const { userId } = params;
      if (userId !== undefined) return REDIS_KEYS.USER + ":" + userId + ":" + REDIS_KEYS.USER_SEARCH;
      return REDIS_KEYS.USER_SEARCH;
    }
    case "BeachBar":
      return REDIS_KEYS.BEACH_BAR_CACHE_KEY;
    case "ReservedProduct": {
      const { beachBarId } = params;
      return REDIS_KEYS.BEACH_BAR_CACHE_KEY + ":" + beachBarId + ":" + REDIS_KEYS.RESERVED_PRODUCT_CACHE_KEY;
    }

    // ! Should not be called at all
    default:
      return "";
  }
};

// updateRedis()
// type UpdateRedisModel = "BeachBar" | "ReservedProduct";
type UpdateRedisOptions =
  | ({
      model: "BeachBar";
    } & Prisma.BeachBarGetPayload<{ select: { id: true } }>)
  | ({
      model: "ReservedProduct";
      atCreate?: boolean;
    } & Prisma.ReservedProductGetPayload<{ select: { id: true } }>);

export const updateRedis = async (params: UpdateRedisOptions) => {
  try {
    switch (params.model) {
      case "BeachBar": {
        const beachBar = await prisma.beachBar.findUnique({ where: { id: params.id }, include: RELATIONS.BEACH_BAR_EXTENSIVE });
        if (!beachBar) throw new Error();
        const idx = await getRedisIdx({ model: "BeachBar", id: beachBar.id });

        await redis.lset(getRedisKey({ model: "BeachBar" }), idx, JSON.stringify(beachBar));
        break;
      }
      case "ReservedProduct": {
        const { id, atCreate = false } = params;
        const reservedProduct = await prisma.reservedProduct.findUnique({
          where: { id },
          include: {
            startTime: true,
            endTime: true,
            payment: true,
            product: { include: { beachBar: true, category: { include: { components: true } } } },
          },
        });
        if (!reservedProduct) throw new Error();
        const { beachBarId } = reservedProduct.product;
        const redisKey = getRedisKey({ model: "ReservedProduct", beachBarId });
        if (atCreate) {
          await redis.lpush(redisKey, JSON.stringify(this));
        } else {
          const idx = await getRedisIdx({ model: "ReservedProduct", ...reservedProduct });
          await redis.lset(redisKey, idx, JSON.stringify(reservedProduct));
        }
        await updateRedis({ model: "BeachBar", id: beachBarId });
        break;
      }
      default:
        break;
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

type SearchReturn = {
  results: SearchResultReturn[];
  search: UserSearch;
};

// fetchFromRedis()
type FetchFromRedisParams =
  | ({ model: "UserSearch"; id: string; type?: "findUnique" } & Partial<Prisma.UserSearchGetPayload<{ select: { userId: true } }>>)
  | { model: "BeachBar" }
  | { model: "AvailableProducts"; date: NexusGenScalars["Date"]; beachBarId: NexusGenScalars["ID"] };

export const fetchFromRedis = async (params: FetchFromRedisParams) => {
  switch (params.model) {
    case "UserSearch": {
      const { id: searchId } = params;
      const searches: SearchReturn[] = (await redis.lrange(getRedisKey({ model: "UserSearch", userId: params.userId }), 0, -1)).map(
        (x: string) => JSON.parse(x)
      );
      const userSearch = searches.find(({ search }) => search.id.toString() === searchId);
      if (!userSearch) return undefined;
      userSearch.search.id = BigInt(userSearch.search.id);
      return userSearch;
    }
    case "AvailableProducts": {
      const { date, beachBarId } = params;
      const [_, products] = await redis.scan(0, "MATCH", `available_products:${date}:*`, "COUNT", Math.pow(10, 10));
      const arr = await Promise.all(
        products.map(async dateTime => {
          const [___, res] = await redis.hscan(dateTime, 0, "MATCH", `beach_bar:${beachBarId}:product:*`, "COUNT", Math.pow(10, 10));
          return {
            dateTime,
            products: chunk(res, 2).map(([key, remaining]) => ({ key, remaining: +remaining })),
          };
        })
      );
      const timeIds = arr
        .filter(({ products }) => products.length > 0 && products.some(({ remaining }) => remaining > 0))
        .map(({ dateTime }) => {
          const parsedId = +dateTime.split(":")[2].slice(0, 2);
          return TABLES.HOUR_TIME.find(({ id }) => id === parsedId) || [];
        })
        .flat();
      return timeIds;
    }
    default:
      break;
  }
};
