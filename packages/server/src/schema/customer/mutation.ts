import { errors } from "@beach_bar/common";
import { User } from "@prisma/client";
import { COUNTRIES_ARR } from "@the_hashtag/common";
import { ApolloError, UserInputError } from "apollo-server-express";
import { extendType, idArg, nullable, stringArg } from "nexus";
import { CustomerType } from "./types";

export const CustomerCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("updateCustomer", {
      type: CustomerType,
      description: "Update a customer's details",
      args: {
        customerId: idArg({ description: "The ID value of the customer" }),
        phoneNumber: nullable(stringArg({ description: "The phone number of the customer" })),
        countryIsoCode: nullable(stringArg({ description: "The ISO code of the country of customer's telephone" })),
      },
      resolve: async (_, { customerId, phoneNumber, countryIsoCode }, { prisma }) => {
        if (customerId.toString().trim().length === 0) throw new UserInputError("Please provide a valid customerId");

        const newCountryId = !countryIsoCode ? undefined : COUNTRIES_ARR.find(({ alpha2Code }) => alpha2Code === countryIsoCode)?.id;
        const customer = await prisma.customer.update({
          where: { id: BigInt(customerId) },
          data: {
            countryId: newCountryId,
            phoneNumber: !phoneNumber ? undefined : phoneNumber,
          },
        });
        return customer;
      },
    });
    t.boolean("deleteCustomer", {
      description: "Delete (remove) a customer",
      args: { customerId: nullable(idArg()) },
      resolve: async (_, { customerId }, { prisma, payload }) => {
        if (customerId && customerId.toString().trim().length === 0) {
          throw new UserInputError("Please provide a valid customerId");
        }
        if (!customerId && !payload) throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.INVALID_ARGUMENTS);

        let user: User | null = null;
        if (payload?.sub) {
          user = await prisma.user.findUnique({ where: { id: payload.sub } });
          if (!user) throw new ApolloError(errors.USER_NOT_FOUND_MESSAGE, errors.NOT_AUTHENTICATED_MESSAGE);
        }

        const customer = await prisma.customer.findFirst({
          where: { OR: [{ id: BigInt(customerId || 0) }, { userId: user ? user.id : null }] },
        });
        if (!customer) throw new ApolloError("Specified customer does not exist", errors.NOT_FOUND);

        try {
          // TODO: Fix
          // deletes customer in DB & Stripe
          // await customer.customSoftRemove(stripe);
        } catch (err) {
          throw new ApolloError(err.message);
        }

        return true;
      },
    });
  },
});
