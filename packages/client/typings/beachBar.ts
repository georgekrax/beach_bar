<<<<<<< HEAD
import { BeachBarQuery } from "@/graphql/generated";

export type AvailableProductsArr = Omit<NonNullable<BeachBarQuery["beachBar"]>["products"][number], "__typename">[];
=======
import { BeachBarQuery } from "@/graphql/generated";

export type AvailableProductsArr = Omit<NonNullable<BeachBarQuery["beachBar"]>["products"][number], "__typename">[];
>>>>>>> 3c094b84c4b6a5e6c8400166ac60b7393b7ddcff
