import { BigIntScalar } from "@the_hashtag/common/dist/graphql";
import { objectType, unionType } from "nexus";
import { CardBrandType } from "../../details/cardBrandTypes";
import { CountryType } from "../../details/countryTypes";
import { CustomerType } from "../types";

export const CardType = objectType({
  name: "Card",
  description: "Represents a customer's credit or debit card",
  definition(t) {
    t.field("id", { type: BigIntScalar });
    t.string("type", );
    t.nullable.int("expMonth");
    t.nullable.int("expYear");
    t.string("last4");
    t.nullable.string("cardholderName");
    t.boolean("isDefault");
    t.string("stripeId");
    t.field("customer", {
      type: CustomerType,
      description: "The customer that owns this credit or debit card",
      resolve: o => o.customer,
    });
    t.nullable.field("brand", {
      type: CardBrandType,
      description: "The brand of the credit or debit card",
      resolve: o => o.brand,
    });
    t.nullable.field("country", {
      type: CountryType,
      description: "The country of the customer's card",
      resolve: o => o.country,
    });
  },
});

export const AddCardType = objectType({
  name: "AddCard",
  description: "Info to be returned when a card is added to a customer",
  definition(t) {
    t.field("card", {
      type: CardType,
      description: "The card that is added to a customer",
      resolve: o => o.card,
    });
    t.boolean("added", {
      description: "A boolean that indicates if the card has been successfully added",
    });
  },
});

export const AddCardResult = unionType({
  name: "AddCardResult",
  definition(t) {
    t.members("AddCard", "Error");
  },
  resolveType: item => {
    if (item.name === "Error") {
      return "Error";
    } else {
      return "AddCard";
    }
  },
});

export const UpdateCardType = objectType({
  name: "UpdateCard",
  description: "Info to be returned when a customer card details are updated",
  definition(t) {
    t.field("card", {
      type: CardType,
      description: "The card that is updated",
      resolve: o => o.card,
    });
    t.boolean("updated", {
      description: "A boolean that indicates if the card details have been successfully updated",
    });
  },
});

export const UpdateCardResult = unionType({
  name: "UpdateCardResult",
  definition(t) {
    t.members("UpdateCard", "Error");
  },
  resolveType: item => {
    if (item.name === "Error") {
      return "Error";
    } else {
      return "UpdateCard";
    }
  },
});
