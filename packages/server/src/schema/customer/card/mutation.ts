import { errors, MyContext } from "@beach_bar/common";
import { BigIntScalar } from "@georgekrax-hashtag/common";
import { arg, booleanArg, extendType, intArg, stringArg } from "@nexus/schema";
import dayjs from "dayjs";
import { Card, CardRepository } from "entity/Card";
import { CardBrand } from "entity/CardBrand";
import { Country } from "entity/Country";
import { Customer } from "entity/Customer";
import { getCustomRepository } from "typeorm";
import { DeleteType } from "typings/.index";
import { AddCardType, UpdateCardType } from "typings/customer/card";
import { DeleteResult } from "../../types";
import { AddCardResult, UpdateCardResult } from "./types";

export const CardCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addCustomerCard", {
      type: AddCardResult,
      description: "Add a credit / debit card to a customer",
      nullable: false,
      args: {
        source: stringArg({
          required: true,
          description: "A token returned by Stripe (Stripe.js & Elements), which will automatically validate the card",
        }),
        customerId: arg({
          type: BigIntScalar,
          required: false,
          description: "The ID value of the registered customer",
        }),
        cardholderName: stringArg({
          required: false,
          description: "The (full) name of the cardholder of the card registered",
        }),
        isDefault: booleanArg({
          required: false,
          description:
            "A boolean that indicates if the card registered is the default one for the customer, to use in its transactions. Its default value is false",
          default: false,
        }),
      },
      resolve: async (_, { source, customerId, cardholderName, isDefault }, { payload, stripe }: MyContext): Promise<AddCardType> => {
        if (!source || source.trim().length === 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid card" } };
        }
        if (customerId && customerId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid customer" } };
        }
        if (cardholderName && cardholderName.trim().length === 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid name" } };
        }
        if (!customerId && !payload) {
          return {
            error: { code: errors.INVALID_ARGUMENTS, message: errors.SOMETHING_WENT_WRONG },
          };
        }

        let customer: Customer | undefined = undefined;
        if (payload) {
          customer = await Customer.findOne({ where: { userId: payload.sub }, relations: ["cards", "user"] });
        } else {
          customer = await Customer.findOne({ where: { id: customerId }, relations: ["cards", "user"] });
        }
        if (!customer) {
          return { error: { code: errors.CONFLICT, message: "Specified customer does not exist" } };
        }

        try {
          const stripeCard: any = await stripe.customers.createSource(customer.stripeCustomerId, { source });
          if (!stripeCard || stripeCard.customer !== customer.stripeCustomerId || stripeCard.object !== "card") {
            return { error: { message: errors.SOMETHING_WENT_WRONG } };
          }

          const brand = await CardBrand.findOne({ name: stripeCard.brand });
          const country = await Country.findOne({ isoCode: stripeCard.country });

          const newCustomerCard = await getCustomRepository(CardRepository).createCard(
            stripe,
            stripeCard,
            customer,
            brand,
            country,
            isDefault,
            cardholderName
          );
          return {
            card: newCustomerCard,
            added: true,
          };
        } catch (err) {
          return { error: { message: `${errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
        }
      },
    });
    t.field("updateCustomerCard", {
      type: UpdateCardResult,
      description: "Update the details of customer's card",
      nullable: false,
      args: {
        cardId: arg({
          type: BigIntScalar,
          required: true,
          description: "The ID values of the card to update",
        }),
        cardholderName: stringArg({
          required: false,
          description: "The (full) name of the cardholder of the card",
        }),
        expMonth: intArg({
          required: false,
          description: "The expiration month of the card",
        }),
        expYear: intArg({
          required: false,
          description: "The expiration year of the card",
        }),
        isDefault: booleanArg({
          required: false,
          description: "A boolean that indicates if the card is the default one for the customer, to use in its transactions",
        }),
      },
      resolve: async (_, { cardId, cardholderName, expMonth, expYear, isDefault }, { stripe }: MyContext): Promise<UpdateCardType> => {
        if (!cardId || cardId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid card" } };
        }
        if (cardholderName && cardholderName.trim().length === 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid name" } };
        }
        if (expMonth && (expMonth < dayjs().month() + 1 || expMonth < 1 || expMonth > 12)) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid expiration month" } };
        }
        if (expYear && (expYear < dayjs().year() || expYear.toString().length !== 4)) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid expiration year" } };
        }

        const card = await Card.findOne({
          where: { id: cardId },
          relations: ["brand", "country", "customer", "customer.user", "customer.cards"],
        });
        if (!card) {
          return { error: { code: errors.CONFLICT, message: `${errors.SOMETHING_WENT_WRONG}: We could not find your card` } };
        }
        if (card.isExpired) {
          return { error: { message: "This card is expired" } };
        }

        try {
          const updatedCard = await card.updateCard(cardholderName, expMonth, expYear, isDefault);

          await stripe.customers.updateSource(updatedCard.customer.stripeCustomerId, updatedCard.stripeId, {
            name: updatedCard.cardholderName || undefined,
            exp_month: updatedCard.expMonth?.toString() || undefined,
            exp_year: updatedCard.expYear?.toString() || undefined,
          });
          if (isDefault && updatedCard.isDefault) {
            await stripe.customers.update(updatedCard.customer.stripeCustomerId, {
              default_source: updatedCard.stripeId,
            });
          }
          return {
            card: updatedCard,
            updated: true,
          };
        } catch (err) {
          return { error: { message: `${errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
        }
      },
    });
    t.field("deleteCustomerCard", {
      type: DeleteResult,
      description: "Delete (remove) a card from a customer",
      nullable: false,
      args: {
        cardId: arg({
          type: BigIntScalar,
          required: true,
          description: "The ID values of the card to delete",
        }),
      },
      resolve: async (_, { cardId }, { stripe }: MyContext): Promise<DeleteType> => {
        if (!cardId || cardId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid card" } };
        }

        const card = await Card.findOne({ where: { id: cardId }, relations: ["customer"] });
        if (!card) {
          return { error: { code: errors.CONFLICT, message: "Specified card does not exist" } };
        }

        try {
          await card.customSoftRemove(stripe);
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
