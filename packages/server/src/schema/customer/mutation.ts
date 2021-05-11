import { errors, MyContext } from "@beach_bar/common";
import { ApolloError, UserInputError } from "apollo-server-express";
import { Customer } from "entity/Customer";
import { User } from "entity/User";
import { extendType, idArg, nullable, stringArg } from "nexus";
import { IsNull } from "typeorm";
import { TDelete } from "typings/.index";
import { TUpdateCustomer } from "typings/customer";
import { DeleteGraphQlType } from "../types";
import { UpdateCustomerType } from "./types";

export const CustomerCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("updateCustomer", {
      type: UpdateCustomerType,
      description: "Update a customer's details",
      args: {
        customerId: idArg({ description: "The ID value of the customer" }),
        phoneNumber: nullable(stringArg({ description: "The phone number of the customer" })),
        countryIsoCode: nullable(stringArg({ description: "The ISO code of the country of customer's telephone" })),
      },
      resolve: async (_, { customerId, phoneNumber, countryIsoCode }): Promise<TUpdateCustomer> => {
        if (!customerId || customerId.trim().length === 0) throw new UserInputError("Please provide a valid customerId");
        // if (phoneNumber && phoneNumber.trim().length === 0)
        //   throw new UserInputError("Please provide a valid phone number");
        // if (countryIsoCode && countryIsoCode.trim().length === 0)
        //   throw new UserInputError("Please provide a valid country");

        const customer = await Customer.findOne({ where: { id: customerId }, relations: ["country", "user", "cards"] });
        if (!customer) throw new ApolloError("Specified customer does not exist", errors.NOT_FOUND);

        try {
          const response = await customer.update(phoneNumber, countryIsoCode);
          if (!response) throw new ApolloError(errors.SOMETHING_WENT_WRONG);

          return { customer: response, updated: true };
        } catch (err) {
          throw new ApolloError(err.message);
        }
      },
    });
    t.field("deleteCustomer", {
      type: DeleteGraphQlType,
      description: "Delete (remove) a customer",
      args: { customerId: nullable(idArg()) },
      resolve: async (_, { customerId }, { payload, stripe }: MyContext): Promise<TDelete> => {
        if (customerId && customerId.trim().lengtj === 0)
          throw new UserInputError("Please provide a valid customerId");
        if (!customerId && !payload) throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.INVALID_ARGUMENTS);

        let user: User | undefined = undefined;
        if (payload && payload.sub) {
          user = await User.findOne(payload.sub);
          if (!user) throw new ApolloError(errors.USER_NOT_FOUND_MESSAGE, errors.NOT_AUTHENTICATED_MESSAGE);
        }

        const customer = await Customer.findOne({ where: [{ id: customerId }, { userId: user ? user.id : IsNull() }] });
        if (!customer) throw new ApolloError("Specified customer does not exist", errors.NOT_FOUND);

        try {
          // deletes customer in DB & Stripe
          await customer.customSoftRemove(stripe);
        } catch (err) {
          throw new ApolloError(err.message);
        }

        return { deleted: true };
      },
    });
  },
});
