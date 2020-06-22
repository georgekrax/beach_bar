import { objectType } from "@nexus/schema";

export const CardBrandType = objectType({
  name: "CardBrand",
  description: "Represents the brand of a credit or debit card",
  definition(t) {
    t.int("id", { nullable: false });
    t.string("name", { nullable: false });
  },
});
