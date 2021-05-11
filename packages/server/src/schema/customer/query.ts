import { errors, MyContext } from "@beach_bar/common";
import { EmailScalar } from "@the_hashtag/common/dist/graphql";
import { ApolloError } from "apollo-server-express";
import { CustomerRepository } from "entity/Customer";
import { arg, extendType, idArg, nullable, stringArg } from "nexus";
import { getCustomRepository } from "typeorm";
import { TAddCustomer } from "typings/customer";
import { AddCustomerType } from "./types";

export const CustomerQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("customer", {
      type: AddCustomerType,
      description: "Get or create a customer, depending on current authenticated or not user",
      args: {
        email: nullable(arg({ type: EmailScalar, description: "The email address of an authenticated or not user" })),
        phoneNumber: nullable(stringArg({ description: "The phone number of the customer" })),
        countryId: nullable(idArg({ description: "The ID value of the country of customer's telephone" })),
      },
      resolve: async (_, { email, phoneNumber, countryId }, { payload, stripe }: MyContext): Promise<TAddCustomer> => {
        if (!email && !payload)
          throw new ApolloError("You should either be authenticated or provide an email address", errors.INVALID_ARGUMENTS);

        const response = await getCustomRepository(CustomerRepository).getOrCreateCustomer(
          stripe,
          email,
          phoneNumber,
          countryId,
          payload
        );
        if (response) return response;

        throw new ApolloError(errors.SOMETHING_WENT_WRONG);
      },
    });
  },
});
