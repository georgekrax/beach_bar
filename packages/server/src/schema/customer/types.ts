import { BigIntScalar, EmailScalar } from "@georgekrax-hashtag/common";
import { objectType, unionType } from "@nexus/schema";
import { CountryType } from "../details/countryTypes";
import { UserType } from "../user/types";
import { CardType } from "./card/types";

export const CustomerType = objectType({
  name: "Customer",
  description: "Represents a customer",
  definition(t) {
    t.field("id", { type: BigIntScalar, nullable: false });
    t.field("email", { type: EmailScalar, nullable: false });
    t.string("phoneNumber", { nullable: false });
    t.field("user", {
      type: UserType,
      description: "The user that is a customer too",
      nullable: true,
      resolve: o => o.user,
    });
    t.list.field("cards", {
      type: CardType,
      description: "A list of all the customers cards",
      nullable: true,
      resolve: o => o.cards,
    });
    t.field("country", {
      type: CountryType,
      description: "The country of the customer",
      nullable: true,
      resolve: o => o.country,
    });
  },
});

export const AddCustomerType = objectType({
  name: "AddCustomer",
  description: "Info to be returned when a customer is added (registered)",
  definition(t) {
    t.field("customer", {
      type: CustomerType,
      description: "The customer that is added (registered)",
      nullable: false,
      resolve: o => o.customer,
    });
    t.boolean("added", {
      nullable: false,
      description: "A boolean that indicates if the customer has been successfully added (registered)",
    });
  },
});

export const AddCustomerResult = unionType({
  name: "AddCustomerResult",
  definition(t) {
    t.members("AddCustomer", "Error");
    t.resolveType(item => {
      if (item.error) {
        return "Error";
      } else {
        return "AddCustomer";
      }
    });
  },
});

export const UpdateCustomerType = objectType({
  name: "UpdateCustomer",
  description: "Info to be returned when a customer details are updated",
  definition(t) {
    t.field("customer", {
      type: CustomerType,
      description: "The customer that is updated",
      nullable: false,
      resolve: o => o.customer,
    });
    t.boolean("updated", {
      nullable: false,
      description: "A boolean that indicates if the customer details have been successfully updated",
    });
  },
});

export const UpdateCustomerResult = unionType({
  name: "UpdateCustomerResult",
  definition(t) {
    t.members("UpdateCustomer", "Error");
    t.resolveType(item => {
      if (item.error) {
        return "Error";
      } else {
        return "UpdateCustomer";
      }
    });
  },
});
