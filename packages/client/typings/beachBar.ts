import { BeachBarQuery } from "@/graphql/generated";

export type AvailableProductsArr = Omit<NonNullable<BeachBarQuery["beachBar"]>["products"][number], "__typename">[];
