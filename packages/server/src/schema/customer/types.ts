import { EmailScalar } from "@the_hashtag/common/dist/graphql";
import { objectType } from "nexus";
import { CountryType } from "../details/countryTypes";
import { UserType } from "../user/types";
import { CardType } from "./card/types";

export const CustomerType = objectType({
  name: "Customer",
  description: "Represents a customer",
  definition(t) {
    t.id("id");
    t.field("email", { type: EmailScalar });
    t.nullable.string("phoneNumber");
    t.nullable.field("user", { type: UserType,      description: "The user that is a customer too" });
    t.nullable.list.field("cards", { type: CardType,description: "A list of all the customers cards" });
    t.nullable.field("country", { type: CountryType, description: "The country of the customer" });
  },
});

export const AddCustomerType = objectType({
  name: "AddCustomer",
  description: "Info to be returned when a customer is added (registered)",
  definition(t) {
    t.field("customer", { type: CustomerType, description: "The customer that is added (registered)" });
    t.boolean("added");
  },
});

// export const AddCustomerResult = unionType({
//   name: "AddCustomerResult",
//   definition(t) {
//     t.members("AddCustomer", "Error");
//   },
//   resolveType: item => {
//     if (item.error) {
//       return "Error";
//     } else {
//       return "AddCustomer";
//     }
//   },
// });

export const UpdateCustomerType = objectType({
  name: "UpdateCustomer",
  description: "Info to be returned when a customer details are updated",
  definition(t) {
    t.field("customer", { type: CustomerType, description: "The customer that is updated" });
    t.boolean("updated");
  },
});

// export const UpdateCustomerResult = unionType({
//   name: "UpdateCustomerResult",
//   definition(t) {
//     t.members("UpdateCustomer", "Error");
//   },
//   resolveType: item => {
//     if (item.error) {
//       return "Error";
//     } else {
//       return "UpdateCustomer";
//     }
//   },
// });
