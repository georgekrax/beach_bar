/* eslint-disable @typescript-eslint/ban-ts-comment */
import { BigIntScalar, EmailScalar, MyContext } from "@beach_bar/common";
import { arg, extendType, stringArg } from "@nexus/schema";
import { getCustomRepository, IsNull } from "typeorm";
import errors from "../../constants/errors";
import { Customer, CustomerRepository } from "../../entity/Customer";
import { User } from "../../entity/User";
import { DeleteType, ErrorType } from "../returnTypes";
import { DeleteResult } from "../types";
import { AddCustomerType, UpdateCustomerType } from "./returnTypes";
import { AddCustomerResult, UpdateCustomerResult } from "./types";

export const CustomerCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("getOrAddCustomer", {
      type: AddCustomerResult,
      description: "Add a customer",
      nullable: false,
      args: {
        email: arg({
          type: EmailScalar,
          required: true,
          description: "The email address of an authenticated or non user, to register as a client",
        }),
        phoneNumber: stringArg({
          required: false,
          description: "The phone number of the customer",
        }),
        countryIsoCode: stringArg({
          required: false,
          description: "The ISO code of the country of customer's telephone",
        }),
      },
      resolve: async (
        _,
        { email, phoneNumber, countryIsoCode },
        { payload, stripe }: MyContext,
      ): Promise<AddCustomerType | ErrorType> => {
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
          payload,
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
      nullable: false,
      args: {
        customerId: arg({
          type: BigIntScalar,
          required: true,
          description: "The ID value of the customer",
        }),
        phoneNumber: stringArg({
          required: false,
          description: "The phone number of the customer",
        }),
        countryIsoCode: stringArg({
          required: false,
          description: "The ISO code of the country of customer's telephone",
        }),
      },
      resolve: async (_, { customerId, phoneNumber, countryIsoCode }): Promise<UpdateCustomerType | ErrorType> => {
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
      nullable: false,
      args: {
        customerId: arg({
          type: BigIntScalar,
          required: false,
          description: "The ID value of the registered customer to delete",
        }),
      },
      resolve: async (_, { customerId }, { payload, stripe }: MyContext): Promise<DeleteType | ErrorType> => {
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
