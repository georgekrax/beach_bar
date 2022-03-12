import { getFullName } from "@/utils/user";
import { errors } from "@beach_bar/common";
import { Account, Prisma } from "@prisma/client";
import { COUNTRIES_ARR, validateEmailSchema } from "@the_hashtag/common";
import { EmailScalar } from "@the_hashtag/common/dist/graphql";
import { ApolloError } from "apollo-server-express";
import { arg, extendType, idArg, nullable, stringArg } from "nexus";
import { CustomerType } from "./types";

export const CustomerQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("customer", {
      type: CustomerType,
      description: "Get or create a customer, depending on current authenticated or not user",
      args: {
        email: nullable(arg({ type: EmailScalar.name, description: "The email address of an authenticated or not user" })),
        phoneNumber: nullable(stringArg({ description: "The phone number of the customer" })),
        countryId: nullable(idArg({ description: "The ID value of the country of customer's telephone" })),
      },
      resolve: async (_, { email: argsEmail, countryId: argsCountryId, ...args }, { prisma, payload, stripe }) => {
        if (!argsEmail && !payload) {
          throw new ApolloError("You should either be authenticated or provide an email address", errors.INVALID_ARGUMENTS);
        }

        const include = Prisma.validator<Prisma.UserInclude>()({ customer: true, account: { include: { country: true } } });
        let user: Prisma.UserGetPayload<{ include: typeof include }> | null = null;
        if (payload && payload.sub) {
          user = await prisma.user.findFirst({ where: { OR: [{ id: payload.sub }, { email: argsEmail || undefined }] }, include });
          if (!user) throw new Error(errors.USER_NOT_FOUND_MESSAGE);
        } else user = await prisma.user.findUnique({ where: { email: argsEmail || undefined }, include });

        if (user && user.customer) return user.customer;

        if (argsEmail && !user) {
          try {
            await validateEmailSchema(argsEmail);
          } catch (err) {
            throw new Error(err.message);
          }
        }

        try {
          const phoneNumber = user?.account?.phoneNumber || args.phoneNumber || undefined;
          const email = (user ? user?.email : argsEmail) || undefined;
          const country = !argsCountryId ? null : COUNTRIES_ARR.find(({ id }) => id.toString() === argsCountryId);

          // create a customer in Stripe too, to get its Stripe customer ID
          let userAccount: Account | null = null;
          if (user?.account) userAccount = user.account;

          const stripeCustomer: any = await stripe.customers.create({
            email,
            description: user ? "#beach_bar user" : undefined,
            name: getFullName(user || {}) || undefined,
            phone: phoneNumber,
            metadata: { is_signed_up: String(!!user) },
            address: !userAccount
              ? undefined
              : {
                  line1: userAccount.address || "",
                  country: (country || user?.account?.country)?.alpha2Code,
                  city: userAccount.city || undefined,
                  postal_code: userAccount.zipCode || undefined,
                },
          });
          if (!stripeCustomer && (stripeCustomer.email !== email || stripeCustomer.email !== user?.email)) {
            throw new Error(errors.SOMETHING_WENT_WRONG);
          }
          return await prisma.customer.create({
            data: { email, userId: user?.id, stripeCustomerId: stripeCustomer.id, phoneNumber, countryId: country?.id },
          });
        } catch (err) {
          throw new Error(err.message);
        }
      },
    });
  },
});
