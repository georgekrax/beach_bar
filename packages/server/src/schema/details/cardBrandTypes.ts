import { objectType } from "nexus";
import { CardBrand } from "nexus-prisma";

export const CardBrandType = objectType({
  name: CardBrand.$name,
  description: "Represents the brand of a credit or debit card",
  definition(t) {
    // t.id("id");
    // t.string("name");
    t.field(CardBrand.id)
    t.field(CardBrand.name)
  },
});
