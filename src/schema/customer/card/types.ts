import { objectType } from "@nexus/schema";
import { CardBrandType } from "../../details/cardBrandTypes";
import { CountryType } from "../../details/countryTypes";
import { CustomerType } from "../types";
import { BigIntScalar } from "../../../common/bigIntScalar";

export const CardType = objectType({
  name: "Card",
  description: "Represents a customer's credit or debit card",
  definition(t) {
    t.field("id", { type: BigIntScalar, nullable: false });
    t.string("type", { nullable: false });
    t.int("expMonth", { nullable: true });
    t.int("expYear", { nullable: true });
    t.string("last4", { nullable: false });
    t.string("cardholderName", { nullable: true });
    t.boolean("isDefault", { nullable: false });
    t.field("customer", {
      type: CustomerType,
      description: "The customer that owns this credit or debit card",
      nullable: false,
      resolve: o => o.customer,
    });
    t.field("brand", {
      type: CardBrandType,
      description: "The brand of the credit or debit card",
      nullable: true,
      resolve: o => o.brand,
    });
    t.field("country", {
      type: CountryType,
      description: "The country of the customer's card",
      nullable: true,
      resolve: o => o.country,
    });
  },
});
