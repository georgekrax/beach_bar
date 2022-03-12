import { NullableNested } from "@/typings/index";
import { Card, Prisma } from "@prisma/client";
import { prisma, stripe } from "..";
import { getFullName } from "./user";

// createCard()
export const CreateCardSelect = Prisma.validator<Prisma.CustomerSelect>()({
  id: true,
  stripeCustomerId: true,
  user: true,
  cards: true,
});
export type CreateCardCustomer = Prisma.CustomerGetPayload<{ select: typeof CreateCardSelect }>;
type CreateCardOptions = { stripeCard: any } & Pick<Card, "brandId" | "isDefault" | "savedForFuture" | "cardholderName" | "countryId">;

export const createCard = async (
  { id: customerId, stripeCustomerId, cards, user }: CreateCardCustomer,
  { stripeCard, isDefault, cardholderName, ...args }: CreateCardOptions
) => {
  if (isDefault && cards.length > 0) {
    const defaultCards = cards.filter(({ isDefault }) => isDefault);

    if (defaultCards.length > 0) {
      await prisma.card.updateMany({ where: { id: { in: defaultCards.map(({ id }) => id) } }, data: { isDefault: false } });
    }
  }
  const userFullName = getFullName(user || {});

  try {
    const newCard = await prisma.card.create({
      data: {
        ...args,
        customerId,
        stripeId: stripeCard.id,
        expMonth: stripeCard.exp_month,
        expYear: stripeCard.exp_year,
        last4: stripeCard.last4,
        isDefault: (cards && cards.length === 0) || !cards?.find(({ isDefault }) => isDefault) ? true : isDefault,
        cardholderName: userFullName && !cardholderName ? userFullName : cardholderName,
      },
    });

    if (newCard.isDefault) {
      await stripe.customers.update(stripeCustomerId, { default_source: newCard.stripeId });
    }
    return newCard;
  } catch (err) {
    throw new Error(err.message);
  }
};

// updateCard()
export const UpdateCardInclude = Prisma.validator<Prisma.CardInclude>()({ customer: { include: { cards: true } } });
type UpdateCardCustomer = Prisma.CardGetPayload<{ include: typeof UpdateCardInclude }>;
type UpdateCardOptions = { atWebhook?: boolean } & Pick<
  NullableNested<Prisma.CardUpdateInput>,
  "isDefault" | "cardholderName" | "expMonth" | "expYear"
>;

export const updateCard = async (
  { stripeId, customer: { stripeCustomerId, cards }, ...card }: UpdateCardCustomer,
  { isDefault, cardholderName, atWebhook = false, ...newArgs }: UpdateCardOptions
) => {
  try {
    if (isDefault != null && cards.length > 0) {
      const defaultCards = cards.filter(({ isDefault, isExpired }) => isDefault && !isExpired);
      await prisma.card.updateMany({ where: { id: { in: defaultCards.map(({ id }) => id) } }, data: { isDefault: false } });
    }
    const newCard = await prisma.card.update({
      where: { id: card.id },
      data: { ...newArgs, cardholderName: cardholderName ?? undefined, isDefault: isDefault ?? undefined },
    });
    if (!atWebhook) {
      await stripe.customers.updateSource(stripeCustomerId, stripeId, {
        name: newCard.cardholderName || undefined,
        exp_month: newCard.expMonth?.toString() || undefined,
        exp_year: newCard.expYear?.toString() || undefined,
      });
      if (newCard.isDefault) await stripe.customers.update(stripeCustomerId, { default_source: stripeId });
    }
    return newCard;
  } catch (err) {
    throw new Error(err.message);
  }
};
