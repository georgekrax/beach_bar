import { createCard, CreateCardCustomer, CreateCardSelect, updateCard, UpdateCardInclude } from "@/utils/card";
import { errors, TABLES } from "@beach_bar/common";
import { COUNTRIES_ARR } from "@the_hashtag/common";
import { ApolloError, UserInputError } from "apollo-server-express";
import { booleanArg, extendType, idArg, intArg, nullable, stringArg } from "nexus";
import { CardType } from "./types";

export const CardCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addCustomerPaymentMethod", {
      type: CardType,
      description: "Add a payment method (credit / debit card) to a customer",
      args: {
        source: stringArg({
          description: "A token returned by Stripe (Stripe.js & Elements), which will automatically validate the card",
        }),
        customerId: nullable(idArg({ description: "The ID value of the registered customer" })),
        cardholderName: stringArg({ description: "The (full) name of the cardholder of the card registered" }),
        isDefault: nullable(
          booleanArg({
            description:
              "A boolean that indicates if the card registered is the default one for the customer, to use in its transactions. Its default value is false",
            default: false,
          })
        ),
        savedForFuture: nullable(
          booleanArg({
            description: "A boolean that indicates if the card should be saved for future payments. Defaults to true",
            default: true,
          })
        ),
      },
      resolve: async (_, { source, customerId, isDefault, ...args }, { prisma, payload, stripe }) => {
        if (!source || source.trim().length === 0) throw new UserInputError("Please provide a valid source");
        if (customerId && customerId.toString().trim().length === 0) {
          throw new UserInputError("Please provide a valid customerId");
        }
        if (!customerId && !payload) throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.INVALID_ARGUMENTS);

        let customer: CreateCardCustomer | null = null;
        if (payload) {
          customer = await prisma.customer.findUnique({ where: { userId: payload!.sub }, select: CreateCardSelect });
        } else {
          customer = await prisma.customer.findUnique({ where: { userId: +(customerId || 0) }, select: CreateCardSelect });
        }
        if (!customer) throw new ApolloError("Customer was not found", errors.NOT_FOUND);

        try {
          const stripeCard: any = await stripe.customers.createSource(customer.stripeCustomerId, { source });
          if (!stripeCard || stripeCard.customer !== customer.stripeCustomerId || stripeCard.object !== "card") {
            throw new ApolloError(errors.SOMETHING_WENT_WRONG);
          }

          const brand = TABLES.CARD_BRAND.find(({ name }) => name.includes(stripeCard.brand));
          const country = COUNTRIES_ARR.find(({ alpha2Code }) => alpha2Code.toLowerCase() === stripeCard.country?.toLowerCase());

          return await createCard(customer, {
            ...args,
            stripeCard,
            brandId: brand?.id || null,
            countryId: country?.id || null,
            isDefault: isDefault || false,
          });
        } catch (err) {
          throw new ApolloError(err.message);
        }
      },
    });
    t.field("updateCustomerPaymentMethod", {
      type: CardType,
      description: "Update the details of customer's card",
      args: {
        cardId: idArg({ description: "The ID of the card to update" }),
        cardholderName: nullable(stringArg({ description: "The (full) name of the cardholder of the card" })),
        expMonth: nullable(intArg({ description: "The expiration month of the card" })),
        expYear: nullable(intArg({ description: "The expiration year of the card" })),
        isDefault: nullable(booleanArg({
          description: "A boolean that indicates if the card is the default one for the customer, to use in its transactions",
        })),
      },
      resolve: async (_, { cardId, ...args }, { prisma }) => {
        if (cardId.toString().trim().length === 0) {
          throw new UserInputError("Please provide a valid cardId", { code: errors.INVALID_ARGUMENTS });
        }
        // if (cardholderName && cardholderName.trim().length === 0)
        //   throw new UserInputError("Please provide a valid cardholder name", { code: errors.INVALID_ARGUMENTS });
        // if (expMonth && (expMonth < dayjs().month() + 1 || expMonth < 1 || expMonth > 12))
        //   throw new UserInputError("Please provide a valid expiration month", { code: errors.INVALID_ARGUMENTS });
        // if (expYear && (expYear < dayjs().year() || expYear.toString().length !== 4))
        //   throw new UserInputError("Please provide a valid expiration year", { code: errors.INVALID_ARGUMENTS });

        const card = await prisma.card.findUnique({ where: { id: BigInt(cardId || 0) }, include: UpdateCardInclude });
        if (!card) throw new ApolloError(errors.SOMETHING_WENT_WRONG + ": We could not find your card", errors.NOT_FOUND);
        if (card.isExpired) throw new ApolloError("This card has expired");

        try {
          return await updateCard(card, args);
        } catch (err) {
          throw new ApolloError(err.message);
        }
      },
    });
    t.boolean("deleteCustomerPaymentMethod", {
      description: "Delete (remove) a payment method (credit / debit card) from a customer",
      args: { cardId: idArg() },
      resolve: async (_, { cardId }, { prisma }) => {
        if (cardId.toString().trim().length === 0) throw new UserInputError("Please provide a valid cardId");

        await prisma.card.delete({ where: { id: BigInt(cardId || 0) } });
        // const card = await Card.findOne({ where: { id: cardId }, relations: ["customer"] });
        // if (!card) throw new ApolloError("Card was not found", errors.NOT_FOUND);

        try {
          // TODO: fix
          // await card.customSoftRemove(stripe);
        } catch (err) {
          throw new ApolloError(err.message);
        }

        return true;
      },
    });
  },
});
