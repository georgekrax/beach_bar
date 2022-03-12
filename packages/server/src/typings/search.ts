import { NexusGenInputs } from "@/graphql/generated/nexusTypes";
import { CalcRecommendedProductsReturn } from "@/utils/beachBar";
import { Prisma, Product, UserSearch } from "@prisma/client";

export type SearchResultReturn = {
  beachBar: Prisma.BeachBarGetPayload<{ include: { products: true } }>;
  // isOpen: boolean;
  hasCapacity: boolean;
  totalPrice: number;
  recommendedProducts: CalcRecommendedProductsReturn;
};

export type RedisSearchReturn = {
  results: SearchResultReturn[];
  search: UserSearch;
};

export type BeachBarCapacity = Pick<NexusGenInputs["SearchInput"], "date" | "startTimeId" | "endTimeId"> & { totalPeople: number };
export type AvailableProductsType = { product: Product; remainingAvailable: number }[];
