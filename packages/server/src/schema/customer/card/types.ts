import { objectType, unionType } from "@nexus/schema";
import { CardBrandType } from "../../details/cardBrandTypes";
import { CountryType } from "../../details/countryTypes";
import { CustomerType } from "../types";
import { BigIntScalar } from "@beach_bar/common";

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
    t.string("stripeId", { nullable: false });
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

export const AddCardType = objectType({
  name: "AddCard",
  description: "Info to be returned when a card is added to a customer",
  definition(t) {
    t.field("card", {
      type: CardType,
      description: "The card that is added to a customer",
      nullable: false,
      resolve: o => o.card,
    });
    t.boolean("added", {
      nullable: false,
      description: "A boolean that indicates if the card has been successfully added",
    });
  },
});

export const AddCardResult = unionType({
  name: "AddCardResult",
  definition(t) {
    t.members("AddCard", "Error");
    t.resolveType(item => {
      if (item.error) {
        return "Error";
      } else {
        return "AddCard";
      }
    });
  },
});

export const UpdateCardType = objectType({
  name: "UpdateCard",
  description: "Info to be returned when a customer card details are updated",
  definition(t) {
    t.field("card", {
      type: CardType,
      description: "The card that is updated",
      nullable: false,
      resolve: o => o.card,
    });
    t.boolean("updated", {
      nullable: false,
      description: "A boolean that indicates if the card details have been successfully updated",
    });
  },
});

export const UpdateCardResult = unionType({
  name: "UpdateCardResult",
  definition(t) {
    t.members("UpdateCard", "Error");
    t.resolveType(item => {
      if (item.error) {
        return "Error";
      } else {
        return "UpdateCard";
      }
    });
  },
});
