"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const common_1 = require("@beach_bar/common");
const stripe_1 = require("constants/stripe");
const Card_1 = require("entity/Card");
const Customer_1 = require("entity/Customer");
const Payment_1 = require("entity/Payment");
const express_1 = require("express");
const typeorm_1 = require("typeorm");
const index_1 = require("../index");
exports.router = express_1.Router();
exports.router.get("/connect/callback", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const qs = new URL(req.url, process.env.HOSTNAME_WITH_HTTP).searchParams;
    const code = qs.get("code");
    const state = qs.get("state");
    return res.send(`<h2>Redirected from Stripe</h2><p>Code: ${code}</p><br><p>State: ${state}</p>`);
}));
exports.router.post("/webhooks/customer_and_cards", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sig = req.headers["stripe-signature"];
    let event;
    try {
        event = index_1.stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOKS_SECRET.toString());
    }
    catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    switch (event.type) {
        case stripe_1.webhook.CUSTOMER_CREATED:
            const createdStripeCustomer = event.data.object;
            if (createdStripeCustomer) {
                try {
                    yield typeorm_1.getCustomRepository(Customer_1.CustomerRepository).createStripeWebhookCustomer(createdStripeCustomer);
                }
                catch (err) {
                    return res.status(400).send({ error: err.message }).end();
                }
            }
            break;
        case stripe_1.webhook.CUSTOMER_UPDATED:
            const updatedStripeCustomer = event.data.object;
            if (updatedStripeCustomer) {
                try {
                    yield typeorm_1.getCustomRepository(Customer_1.CustomerRepository).updateStripeWebhookCustomer(updatedStripeCustomer);
                }
                catch (err) {
                    return res.status(400).send({ error: err.message }).end();
                }
            }
            break;
        case stripe_1.webhook.CUSTOMER_DELETED:
            const deletedStripeCustomer = event.data.object;
            const customer = yield Customer_1.Customer.findOne({ stripeCustomerId: deletedStripeCustomer.id });
            if (customer) {
                try {
                    yield customer.customSoftRemove(index_1.stripe, true);
                }
                catch (err) {
                    return res.status(400).send({ error: err.message }).end();
                }
            }
            break;
        case stripe_1.webhook.CUSTOMER_SOURCE_CREATED:
            const createdStripeCard = event.data.object;
            if (createdStripeCard) {
                try {
                    yield typeorm_1.getCustomRepository(Card_1.CardRepository).createStripeWebhookCard(index_1.stripe, createdStripeCard);
                }
                catch (err) {
                    return res.status(400).send({ error: err.message }).end();
                }
            }
            break;
        case stripe_1.webhook.CUSTOMER_SOURCE_UPDATED:
            const updatedStipeCard = event.data.object;
            if (updatedStipeCard) {
                try {
                    yield typeorm_1.getCustomRepository(Card_1.CardRepository).updateStripeWebhookCard(updatedStipeCard);
                }
                catch (err) {
                    return res.status(400).send({ error: err.message }).end();
                }
            }
            break;
        case stripe_1.webhook.CUSTOMER_SOURCE_DELETED:
            const deletedStripeCard = event.data.object;
            const deletedCard = yield Card_1.Card.findOne({ stripeId: deletedStripeCard.id, isExpired: false });
            if (deletedCard) {
                try {
                    yield deletedCard.customSoftRemove(index_1.stripe, true);
                }
                catch (err) {
                    return res.status(400).send({ error: err.message }).end();
                }
            }
            break;
        case stripe_1.webhook.CUSTOMER_SOURCE_EXPIRING:
            const expiredStripeCard = event.data.object;
            const expiredCard = yield Card_1.Card.findOne({ stripeId: expiredStripeCard.id });
            if (expiredCard) {
                try {
                    yield expiredCard.expireCard();
                }
                catch (err) {
                    return res.status(400).send({ error: err.message }).end();
                }
            }
            break;
        default:
            return res.status(400).end();
    }
    return res.json({ received: true });
}));
exports.router.post("/webhooks/payment", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sig = req.headers["stripe-signature"];
    let event;
    try {
        event = index_1.stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_PAYMENT_WEBHOOKS_SECRET.toString());
    }
    catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    switch (event.type) {
        case stripe_1.webhook.PAYMENT_INTENT_SUCCEEDED:
            const successfulPaymentIntent = event.data.object;
            if (successfulPaymentIntent) {
                try {
                    const payment = yield Payment_1.Payment.findOne({
                        where: { stripeId: successfulPaymentIntent.id },
                        relations: ["cart", "cart.products", "cart.products.product", "cart.products.time"],
                    });
                    if (!payment) {
                        return res.status(400).send({ error: common_1.errors.SOMETHING_WENT_WRONG }).end();
                    }
                    yield payment.createReservedProducts();
                    yield payment.cart.customSoftRemove(false);
                }
                catch (err) {
                    return res.status(400).send({ error: err.message }).end();
                }
            }
            break;
        default:
            return res.status(400).end();
    }
    return res.json({ received: true });
}));
