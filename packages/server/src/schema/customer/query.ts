import { errors, MyContext } from "@beach_bar/common";
import { EmailScalar } from "@the_hashtag/common/dist/graphql";
import { ApolloError, UserInputError } from "apollo-server-express";
import { CustomerRepository } from "entity/Customer";
import { arg, extendType, nullable, stringArg } from "nexus";
import { getCustomRepository } from "typeorm";
import { TAddCustomer } from "typings/customer";
import { AddCustomerType } from "./types";

export const CustomerQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("getOrCreateCustomer", {
      type: AddCustomerType,
      description: "Get or create a customer, depending on current authenticated or not user",
      args: {
        email: nullable(
          arg({
            type: EmailScalar,
            description: "The email address of an authenticated or not user, to register as a client",
          })
        ),
        phoneNumber: nullable(
          stringArg({
            description: "The phone number of the customer",
          })
        ),
        countryAlpha2Code: nullable(
          stringArg({
            description: "The ISO code of the country of customer's telephone",
          })
        ),
      },
      resolve: async (_, { email, phoneNumber, countryAlpha2Code }, { payload, stripe }: MyContext): Promise<TAddCustomer> => {
        if ((!email && !payload) || !payload?.sub)
          throw new ApolloError("You should either be authenticated or provide an email address", errors.INVALID_ARGUMENTS);
        if (email && email.trim().length === 0)
          throw new UserInputError("Please provide a valid email address", { code: errors.INVALID_ARGUMENTS });
        if (phoneNumber && phoneNumber.trim().length === 0)
          throw new UserInputError("Please provide a valid phone number", { code: errors.INVALID_ARGUMENTS });
        if (countryAlpha2Code && countryAlpha2Code.trim().length === 0)
          throw new UserInputError("Please provide a valid country", { code: errors.INVALID_ARGUMENTS });

        const response = await getCustomRepository(CustomerRepository).getOrCreateCustomer(
          stripe,
          email,
          phoneNumber,
          countryAlpha2Code,
          payload
        );

        if (response) return response;

        throw new ApolloError(errors.SOMETHING_WENT_WRONG);
      },
    });
  },
});
