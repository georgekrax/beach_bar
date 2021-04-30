import { errors, MyContext } from "@beach_bar/common";
import { ApolloError, UserInputError } from "apollo-server-express";
import { Card, CardRepository } from "entity/Card";
import { CardBrand } from "entity/CardBrand";
import { Country } from "entity/Country";
import { Customer } from "entity/Customer";
import { booleanArg, extendType, idArg, intArg, nullable, stringArg } from "nexus";
import { getCustomRepository } from "typeorm";
import { TDelete } from "typings/.index";
import { TAddCard, TUpdateCard } from "typings/customer/card";
import { DeleteGraphQlType } from "../../types";
import { AddCardType, UpdateCardType } from "./types";

export const CardCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addCustomerPaymentMethod", {
      type: AddCardType,
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
      resolve: async (_, { source, customerId, cardholderName, isDefault, savedForFuture }, { payload, stripe }: MyContext): Promise<TAddCard> => {
        if (!source || source.trim().length === 0) throw new UserInputError("Please provide a valid source");
        if (customerId && customerId.trim().length === 0) throw new UserInputError("Please provide a valid customerId");
        // if (!cardholderName || cardholderName.trim().length === 0) throw new UserInputError("Please provide a valid cardholderName");
        if (!customerId && !payload) throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.INVALID_ARGUMENTS);

        // Do not remove extra relationships, because they are used in entity's / custom repositories
        const relations = ["cards", "cards.customer", "cards.customer.cards", "user"];
        let customer: Customer | undefined = undefined;
        if (payload) customer = await Customer.findOne({ where: { userId: payload.sub }, relations });
        else customer = await Customer.findOne({ where: { id: customerId }, relations });
        if (!customer) throw new ApolloError("Customer was not found", errors.NOT_FOUND);

        try {
          const stripeCard: any = await stripe.customers.createSource(customer.stripeCustomerId, { source });
          if (!stripeCard || stripeCard.customer !== customer.stripeCustomerId || stripeCard.object !== "card")
            throw new ApolloError(errors.SOMETHING_WENT_WRONG);

          const brand = await CardBrand.findOne({ where: `"name" ILIKE '${stripeCard.brand}'` });
          const country = await Country.findOne({ alpha2Code: stripeCard.country });

          const newCustomerCard = await getCustomRepository(CardRepository).createCard(
            stripe,
            stripeCard,
            customer,
            brand,
            country,
            isDefault,
            savedForFuture,
            cardholderName
          );
          return { card: newCustomerCard, added: true };
        } catch (err) {
          throw new ApolloError(err.message);
        }
      },
    });
    t.field("updateCustomerPaymentMethod", {
      type: UpdateCardType,
      description: "Update the details of customer's card",
      args: {
        cardId: idArg({ description: "The ID of the card to update" }),
        cardholderName: nullable(stringArg({ description: "The (full) name of the cardholder of the card" })),
        expMonth: nullable(intArg({ description: "The expiration month of the card" })),
        expYear: nullable(intArg({ description: "The expiration year of the card" })),
        isDefault: nullable(
          booleanArg({
            description: "A boolean that indicates if the card is the default one for the customer, to use in its transactions",
          })
        ),
      },
      resolve: async (_, { cardId, cardholderName, expMonth, expYear, isDefault }, { stripe }: MyContext): Promise<TUpdateCard> => {
        if (!cardId || cardId.trim().length === 0)
          throw new UserInputError("Please provide a valid cardId", { code: errors.INVALID_ARGUMENTS });
        // if (cardholderName && cardholderName.trim().length === 0)
        //   throw new UserInputError("Please provide a valid cardholder name", { code: errors.INVALID_ARGUMENTS });
        // if (expMonth && (expMonth < dayjs().month() + 1 || expMonth < 1 || expMonth > 12))
        //   throw new UserInputError("Please provide a valid expiration month", { code: errors.INVALID_ARGUMENTS });
        // if (expYear && (expYear < dayjs().year() || expYear.toString().length !== 4))
        //   throw new UserInputError("Please provide a valid expiration year", { code: errors.INVALID_ARGUMENTS });

        const card = await Card.findOne({
          where: { id: cardId },
          relations: ["brand", "country", "customer", "customer.user", "customer.cards"],
        });
        if (!card) throw new ApolloError(errors.SOMETHING_WENT_WRONG + ": We could not find your card", errors.NOT_FOUND);
        if (card.isExpired) throw new ApolloError("This card has expired");

        try {
          const updatedCard = await card.updateCard(cardholderName, expMonth, expYear, isDefault);

          await stripe.customers.updateSource(updatedCard.customer.stripeCustomerId, updatedCard.stripeId, {
            name: updatedCard.cardholderName || undefined,
            exp_month: updatedCard.expMonth?.toString() || undefined,
            exp_year: updatedCard.expYear?.toString() || undefined,
          });
          if (isDefault && updatedCard.isDefault)
            await stripe.customers.update(updatedCard.customer.stripeCustomerId, { default_source: updatedCard.stripeId });
          return { card: updatedCard, updated: true };
        } catch (err) {
          throw new ApolloError(err.message);
        }
      },
    });
    t.field("deleteCustomerPaymentMethod", {
      type: DeleteGraphQlType,
      description: "Delete (remove) a payment method (credit / debit card) from a customer",
      args: { cardId: idArg() },
      resolve: async (_, { cardId }, { stripe }: MyContext): Promise<TDelete> => {
        if (!cardId || cardId.trim().length === 0) throw new UserInputError("Please provide a valid cardId");

        const card = await Card.findOne({ where: { id: cardId }, relations: ["customer"] });
        if (!card) throw new ApolloError("Card was not found", errors.NOT_FOUND);

        try {
          await card.customSoftRemove(stripe);
        } catch (err) {
          throw new ApolloError(err.message);
        }

        return { deleted: true };
      },
    });
  },
});
