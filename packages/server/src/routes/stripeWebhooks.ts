/* eslint-disable no-case-declarations */
import { errors } from "@beach_bar/common";
import { webhook } from "constants/stripe";
import { Card, CardRepository } from "entity/Card";
import { Customer, CustomerRepository } from "entity/Customer";
import { Payment } from "entity/Payment";
import { Request, Response, Router } from "express";
import { getCustomRepository } from "typeorm";
import { stripe } from "../index";

export const router = Router();

router.get("/connect/callback", async (req: Request, res: Response) => {
  const qs = new URL(req.url, process.env.HOSTNAME_WITH_HTTP).searchParams;
  const code = qs.get("code");
  const state = qs.get("state");
  return res.send(`<h2>Redirected from Stripe</h2><p>Code: ${code}</p><br><p>State: ${state}</p>`);
});

router.post("/webhooks/customer_and_cards", async (req, res) => {
  const sig: any = req.headers["stripe-signature"];

  let event: any;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOKS_SECRET!.toString());
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case webhook.CUSTOMER_CREATED:
      const createdStripeCustomer = event.data.object;
      if (createdStripeCustomer) {
        try {
          await getCustomRepository(CustomerRepository).createStripeWebhookCustomer(createdStripeCustomer);
        } catch (err) {
          return res.status(400).send({ error: err.message }).end();
        }
      }
      break;

    case webhook.CUSTOMER_UPDATED:
      const updatedStripeCustomer = event.data.object;
      if (updatedStripeCustomer) {
        try {
          await getCustomRepository(CustomerRepository).updateStripeWebhookCustomer(updatedStripeCustomer);
        } catch (err) {
          return res.status(400).send({ error: err.message }).end();
        }
      }
      break;

    case webhook.CUSTOMER_DELETED:
      const deletedStripeCustomer = event.data.object;
      const customer = await Customer.findOne({ stripeCustomerId: deletedStripeCustomer.id });
      if (customer) {
        try {
          await customer.customSoftRemove(stripe, true);
        } catch (err) {
          return res.status(400).send({ error: err.message }).end();
        }
      }
      break;

    case webhook.CUSTOMER_SOURCE_CREATED:
      const createdStripeCard = event.data.object;
      if (createdStripeCard) {
        try {
          await getCustomRepository(CardRepository).createStripeWebhookCard(stripe, createdStripeCard);
        } catch (err) {
          return res.status(400).send({ error: err.message }).end();
        }
      }
      break;

    case webhook.CUSTOMER_SOURCE_UPDATED:
      const updatedStipeCard = event.data.object;
      if (updatedStipeCard) {
        try {
          await getCustomRepository(CardRepository).updateStripeWebhookCard(updatedStipeCard);
        } catch (err) {
          return res.status(400).send({ error: err.message }).end();
        }
      }
      break;

    case webhook.CUSTOMER_SOURCE_DELETED:
      const deletedStripeCard = event.data.object;
      const deletedCard = await Card.findOne({ stripeId: deletedStripeCard.id, isExpired: false });
      if (deletedCard) {
        try {
          await deletedCard.customSoftRemove(stripe, true);
        } catch (err) {
          return res.status(400).send({ error: err.message }).end();
        }
      }
      break;

    case webhook.CUSTOMER_SOURCE_EXPIRING:
      const expiredStripeCard = event.data.object;
      const expiredCard = await Card.findOne({ stripeId: expiredStripeCard.id });
      if (expiredCard) {
        try {
          await expiredCard.expireCard();
        } catch (err) {
          return res.status(400).send({ error: err.message }).end();
        }
      }
      break;

    default:
      // Unexpected event type
      return res.status(400).end();
  }

  return res.json({ received: true });
});

router.post("/webhooks/payment", async (req, res) => {
  const sig: any = req.headers["stripe-signature"];

  let event: any;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_PAYMENT_WEBHOOKS_SECRET!.toString());
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case webhook.PAYMENT_INTENT_SUCCEEDED:
      const successfulPaymentIntent = event.data.object;
      if (successfulPaymentIntent) {
        try {
          const payment = await Payment.findOne({
            where: { stripeId: successfulPaymentIntent.id },
            relations: [
              "cart",
              "cart.products",
              "cart.products.time",
              "cart.products.product",
              "cart.products.product.reservationLimits",
              "cart.products.product.reservedProducts",
            ],
          });
          if (!payment) return res.status(400).send({ error: errors.SOMETHING_WENT_WRONG }).end();
          await payment.createReservedProducts();
          await payment.cart.customSoftRemove(false);
        } catch (err) {
          return res.status(400).send({ error: err.message }).end();
        }
      }
      break;

    default:
      // Unexpected event type
      return res.status(400).end();
  }

  return res.json({ received: true });
});
