import { resolve } from "@/utils/data";
import { objectType } from "nexus";
import { Customer } from "nexus-prisma";

export const CustomerType = objectType({
  name: Customer.$name,
  description: "Represents a customer",
  definition(t) {
    // t.id("id");
    // t.email("email", { type: EmailScalar });
    // t.nullable.string("phoneNumber");
    // t.nullable.field("user", { type: UserType, description: "The user that is a customer too" });
    // t.nullable.list.field("cards", { type: CardType, description: "A list of all the customers cards" });
    // t.nullable.field("country", { type: CountryType, description: "The country of the customer" });
    t.field(Customer.id);
    t.field(Customer.email);
    t.field(Customer.phoneNumber);
    t.field(resolve(Customer.user));
    t.field(resolve(Customer.country));
    t.field(resolve(Customer.cards));
  },
});

// export const AddCustomerType = objectType({
//   name: "AddCustomer",
//   description: "Info to be returned when a customer is added (registered)",
//   definition(t) {
//     t.field("customer", { type: CustomerType, description: "The customer that is added (registered)" });
//     t.boolean("added");
//   },
// });

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

// export const UpdateCustomerType = objectType({
//   name: "UpdateCustomer",
//   description: "Info to be returned when a customer details are updated",
//   definition(t) {
//     t.field("customer", { type: CustomerType, description: "The customer that is updated" });
//     t.boolean("updated");
//   },
// });

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
