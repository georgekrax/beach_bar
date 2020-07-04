/* eslint-disable no-case-declarations */
import * as bodyParser from "body-parser";
import * as express from "express";
import { getCustomRepository } from "typeorm";
import { webhook } from "../constants/stripe";
import { Card, CardRepository } from "../entity/Card";
import { Customer, CustomerRepository } from "../entity/Customer";
import { stripe } from "../index";

export const router = express.Router();

router.post("/webhooks", bodyParser.raw({ type: "application/json" }), async (req, res) => {
  const sig: any = req.headers["stripe-signature"];

  let event: any;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!.toString());
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
