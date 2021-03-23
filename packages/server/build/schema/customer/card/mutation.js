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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardCrudMutation = void 0;
const common_1 = require("@beach_bar/common");
const apollo_server_express_1 = require("apollo-server-express");
const dayjs_1 = __importDefault(require("dayjs"));
const Card_1 = require("entity/Card");
const CardBrand_1 = require("entity/CardBrand");
const Country_1 = require("entity/Country");
const Customer_1 = require("entity/Customer");
const nexus_1 = require("nexus");
const typeorm_1 = require("typeorm");
const types_1 = require("../../types");
const types_2 = require("./types");
exports.CardCrudMutation = nexus_1.extendType({
    type: "Mutation",
    definition(t) {
        t.field("addCustomerPaymentMethod", {
            type: types_2.AddCardType,
            description: "Add a payment method (credit / debit card) to a customer",
            args: {
                source: nexus_1.stringArg({
                    description: "A token returned by Stripe (Stripe.js & Elements), which will automatically validate the card",
                }),
                customerId: nexus_1.nullable(nexus_1.idArg({
                    description: "The ID value of the registered customer",
                })),
                cardholderName: nexus_1.stringArg({ description: "The (full) name of the cardholder of the card registered" }),
                isDefault: nexus_1.nullable(nexus_1.booleanArg({
                    description: "A boolean that indicates if the card registered is the default one for the customer, to use in its transactions. Its default value is false",
                    default: false,
                })),
            },
            resolve: (_, { source, customerId, cardholderName, isDefault }, { payload, stripe }) => __awaiter(this, void 0, void 0, function* () {
                if (!source || source.trim().length === 0)
                    throw new apollo_server_express_1.UserInputError("Please provide a valid card", { code: common_1.errors.INVALID_ARGUMENTS });
                if (customerId && customerId <= 0)
                    throw new apollo_server_express_1.ApolloError("Please provide a valid customer", common_1.errors.INVALID_ARGUMENTS);
                if (!cardholderName || cardholderName.trim().length === 0)
                    throw new apollo_server_express_1.UserInputError("Please provide a valid cardholder name", { code: common_1.errors.INVALID_ARGUMENTS });
                if (!customerId && !payload)
                    throw new apollo_server_express_1.ApolloError(common_1.errors.SOMETHING_WENT_WRONG, common_1.errors.INVALID_ARGUMENTS);
                let customer = undefined;
                if (payload)
                    customer = yield Customer_1.Customer.findOne({
                        where: { userId: payload.sub },
                        relations: ["cards", "cards.customer", "cards.customer.cards", "user"],
                    });
                else
                    customer = yield Customer_1.Customer.findOne({
                        where: { id: customerId },
                        relations: ["cards", "cards.customer", "cards.customer.cards", "user"],
                    });
                if (!customer)
                    throw new apollo_server_express_1.ApolloError("Specified customer does not exists", common_1.errors.NOT_FOUND);
                try {
                    const stripeCard = yield stripe.customers.createSource(customer.stripeCustomerId, { source });
                    if (!stripeCard || stripeCard.customer !== customer.stripeCustomerId || stripeCard.object !== "card")
                        throw new apollo_server_express_1.ApolloError(common_1.errors.SOMETHING_WENT_WRONG);
                    const brand = yield CardBrand_1.CardBrand.findOne({ where: `"name" ILIKE '${stripeCard.brand}'` });
                    const country = yield Country_1.Country.findOne({ alpha2Code: stripeCard.country });
                    const newCustomerCard = yield typeorm_1.getCustomRepository(Card_1.CardRepository).createCard(stripe, stripeCard, customer, brand, country, isDefault, cardholderName);
                    return {
                        card: newCustomerCard,
                        added: true,
                    };
                }
                catch (err) {
                    throw new apollo_server_express_1.ApolloError(common_1.errors.SOMETHING_WENT_WRONG + ": " + err.message);
                }
            }),
        });
        t.field("updateCustomerPaymentMethod", {
            type: types_2.UpdateCardType,
            description: "Update the details of customer's card",
            args: {
                cardId: nexus_1.idArg({ description: "The ID of the card to update" }),
                cardholderName: nexus_1.nullable(nexus_1.stringArg({
                    description: "The (full) name of the cardholder of the card",
                })),
                expMonth: nexus_1.nullable(nexus_1.intArg({
                    description: "The expiration month of the card",
                })),
                expYear: nexus_1.nullable(nexus_1.intArg({
                    description: "The expiration year of the card",
                })),
                isDefault: nexus_1.nullable(nexus_1.booleanArg({
                    description: "A boolean that indicates if the card is the default one for the customer, to use in its transactions",
                })),
            },
            resolve: (_, { cardId, cardholderName, expMonth, expYear, isDefault }, { stripe }) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                if (!cardId || cardId <= 0)
                    throw new apollo_server_express_1.UserInputError("Please provide a valid card", { code: common_1.errors.INVALID_ARGUMENTS });
                if (cardholderName && cardholderName.trim().length === 0)
                    throw new apollo_server_express_1.UserInputError("Please provide a valid cardholder name", { code: common_1.errors.INVALID_ARGUMENTS });
                if (expMonth && (expMonth < dayjs_1.default().month() + 1 || expMonth < 1 || expMonth > 12))
                    throw new apollo_server_express_1.UserInputError("Please provide a valid expiration month", { code: common_1.errors.INVALID_ARGUMENTS });
                if (expYear && (expYear < dayjs_1.default().year() || expYear.toString().length !== 4))
                    throw new apollo_server_express_1.UserInputError("Please provide a valid expiration year", { code: common_1.errors.INVALID_ARGUMENTS });
                const card = yield Card_1.Card.findOne({
                    where: { id: cardId },
                    relations: ["brand", "country", "customer", "customer.user", "customer.cards"],
                });
                if (!card)
                    throw new apollo_server_express_1.ApolloError(common_1.errors.SOMETHING_WENT_WRONG + ": We could not find your card", common_1.errors.NOT_FOUND);
                if (card.isExpired)
                    throw new apollo_server_express_1.ApolloError("This card has expired");
                try {
                    const updatedCard = yield card.updateCard(cardholderName, expMonth, expYear, isDefault);
                    yield stripe.customers.updateSource(updatedCard.customer.stripeCustomerId, updatedCard.stripeId, {
                        name: updatedCard.cardholderName || undefined,
                        exp_month: ((_a = updatedCard.expMonth) === null || _a === void 0 ? void 0 : _a.toString()) || undefined,
                        exp_year: ((_b = updatedCard.expYear) === null || _b === void 0 ? void 0 : _b.toString()) || undefined,
                    });
                    if (isDefault && updatedCard.isDefault) {
                        yield stripe.customers.update(updatedCard.customer.stripeCustomerId, {
                            default_source: updatedCard.stripeId,
                        });
                    }
                    return {
                        card: updatedCard,
                        updated: true,
                    };
                }
                catch (err) {
                    throw new apollo_server_express_1.ApolloError(common_1.errors.SOMETHING_WENT_WRONG + ": " + err.message);
                }
            }),
        });
        t.field("deleteCustomerPaymentMethod", {
            type: types_1.DeleteGraphQlType,
            description: "Delete (remove) a payment method (credit / debit card) from a customer",
            args: {
                cardId: nexus_1.idArg({ description: "The ID value of the card to delete" }),
            },
            resolve: (_, { cardId }, { stripe }) => __awaiter(this, void 0, void 0, function* () {
                if (!cardId || cardId <= 0)
                    throw new apollo_server_express_1.UserInputError("Please provide a valid card", { code: common_1.errors.INVALID_ARGUMENTS });
                const card = yield Card_1.Card.findOne({ where: { id: cardId }, relations: ["customer"] });
                if (!card)
                    throw new apollo_server_express_1.ApolloError("Specified card does not exist", common_1.errors.NOT_FOUND);
                try {
                    yield card.customSoftRemove(stripe);
                }
                catch (err) {
                    throw new apollo_server_express_1.ApolloError(common_1.errors.SOMETHING_WENT_WRONG + ": " + err.message);
                }
                return {
                    deleted: true,
                };
            }),
        });
    },
});
