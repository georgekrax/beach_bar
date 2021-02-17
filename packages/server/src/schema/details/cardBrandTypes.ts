import { objectType } from "nexus";

export const CardBrandType = objectType({
  name: "CardBrand",
  description: "Represents the brand of a credit or debit card",
  definition(t) {
    t.id("id");
    t.string("name");
  },
});
