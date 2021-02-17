import { errors, MyContext } from "@beach_bar/common";
import { BigIntScalar, EmailScalar } from "@the_hashtag/common/dist/graphql";
import { Customer, CustomerRepository } from "entity/Customer";
import { User } from "entity/User";
import { arg, extendType, nullable, stringArg } from "nexus";
import { getCustomRepository, IsNull } from "typeorm";
import { DeleteType } from "typings/.index";
import { AddCustomerType, UpdateCustomerType } from "typings/customer";
import { DeleteResult } from "../types";
import { AddCustomerResult, UpdateCustomerResult } from "./types";

export const CustomerCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("getOrAddCustomer", {
      type: AddCustomerResult,
      description: "Add a customer",
      args: {
        email: arg({
          type: EmailScalar,
          description: "The email address of an authenticated or non user, to register as a client",
        }),
        phoneNumber: nullable(
          stringArg({
            description: "The phone number of the customer",
          })
        ),
        countryIsoCode: nullable(
          stringArg({
            description: "The ISO code of the country of customer's telephone",
          })
        ),
      },
      resolve: async (_, { email, phoneNumber, countryIsoCode }, { payload, stripe }: MyContext): Promise<AddCustomerType> => {
        if (!email && !payload) {
          return {
            error: { code: errors.INVALID_ARGUMENTS, message: "You should either be authenticated or provide an email address" },
          };
        }

        if (!email || email.trim().length === 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid email address" } };
        }
        if (phoneNumber || phoneNumber.trim().length === 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid phone number" } };
        }
        if (countryIsoCode || countryIsoCode.trim().length === 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid country" } };
        }

        const response = await getCustomRepository(CustomerRepository).getOrCreateCustomer(
          stripe,
          email,
          phoneNumber,
          countryIsoCode,
          payload
        );

        if (response) {
          return response;
        }
        return { error: { message: errors.SOMETHING_WENT_WRONG } };
      },
    });
    t.field("updateCustomer", {
      type: UpdateCustomerResult,
      description: "Update a customer's details",
      args: {
        customerId: arg({
          type: BigIntScalar,
          description: "The ID value of the customer",
        }),
        phoneNumber: nullable(stringArg({ description: "The phone number of the customer" })),
        countryIsoCode: nullable(stringArg({ description: "The ISO code of the country of customer's telephone" })),
      },
      resolve: async (_, { customerId, phoneNumber, countryIsoCode }): Promise<UpdateCustomerType> => {
        if (!customerId || customerId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid customer ID" } };
        }
        if (phoneNumber && phoneNumber.trim().length === 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid phone number" } };
        }
        if (countryIsoCode && countryIsoCode.trim().length === 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid country" } };
        }

        const customer = await Customer.findOne({ where: { id: customerId }, relations: ["country", "user", "cards"] });
        if (!customer) {
          return { error: { code: errors.CONFLICT, message: "Specified customer does not exist" } };
        }

        try {
          const response = await customer.update(phoneNumber, countryIsoCode);
          if (!response) {
            return { error: { message: errors.SOMETHING_WENT_WRONG } };
          }

          return {
            customer: response,
            updated: true,
          };
        } catch (err) {
          return { error: { message: `${errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
        }
      },
    });
    t.field("deleteCustomer", {
      type: DeleteResult,
      description: "Delete (remove) a customer",
      args: {
        customerId: nullable(arg({
          type: BigIntScalar,
          description: "The ID value of the registered customer to delete",
        })),
      },
      resolve: async (_, { customerId }, { payload, stripe }: MyContext): Promise<DeleteType> => {
        if (customerId && customerId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid customer" } };
        }
        if (!customerId && !payload) {
          return {
            error: { code: errors.INVALID_ARGUMENTS, message: errors.SOMETHING_WENT_WRONG },
          };
        }

        let user: User | undefined = undefined;
        if (payload && payload.sub) {
          user = await User.findOne(payload.sub);
          if (!user) {
            return { error: { code: errors.CONFLICT, message: errors.SOMETHING_WENT_WRONG } };
          }
        }

        const customer = await Customer.findOne({ where: [{ id: customerId }, { userId: user ? user.id : IsNull() }] });
        if (!customer) {
          return { error: { code: errors.CONFLICT, message: "Specified customer does not exist" } };
        }

        try {
          // deletes customer in DB & Stripe
          await customer.customSoftRemove(stripe);
        } catch (err) {
          return { error: { message: `${errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
        }

        return {
          deleted: true,
        };
      },
    });
  },
});
