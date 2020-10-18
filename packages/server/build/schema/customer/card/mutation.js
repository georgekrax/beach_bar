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
const common_2 = require("@georgekrax-hashtag/common");
const schema_1 = require("@nexus/schema");
const dayjs_1 = __importDefault(require("dayjs"));
const Card_1 = require("entity/Card");
const CardBrand_1 = require("entity/CardBrand");
const Country_1 = require("entity/Country");
const Customer_1 = require("entity/Customer");
const typeorm_1 = require("typeorm");
const types_1 = require("../../types");
const types_2 = require("./types");
exports.CardCrudMutation = schema_1.extendType({
    type: "Mutation",
    definition(t) {
        t.field("addCustomerCard", {
            type: types_2.AddCardResult,
            description: "Add a credit / debit card to a customer",
            nullable: false,
            args: {
                source: schema_1.stringArg({
                    required: true,
                    description: "A token returned by Stripe (Stripe.js & Elements), which will automatically validate the card",
                }),
                customerId: schema_1.arg({
                    type: common_2.BigIntScalar,
                    required: false,
                    description: "The ID value of the registered customer",
                }),
                cardholderName: schema_1.stringArg({
                    required: false,
                    description: "The (full) name of the cardholder of the card registered",
                }),
                isDefault: schema_1.booleanArg({
                    required: false,
                    description: "A boolean that indicates if the card registered is the default one for the customer, to use in its transactions. Its default value is false",
                    default: false,
                }),
            },
            resolve: (_, { source, customerId, cardholderName, isDefault }, { payload, stripe }) => __awaiter(this, void 0, void 0, function* () {
                if (!source || source.trim().length === 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid card" } };
                }
                if (customerId && customerId <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid customer" } };
                }
                if (cardholderName && cardholderName.trim().length === 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid name" } };
                }
                if (!customerId && !payload) {
                    return {
                        error: { code: common_1.errors.INVALID_ARGUMENTS, message: common_1.errors.SOMETHING_WENT_WRONG },
                    };
                }
                let customer = undefined;
                if (payload) {
                    customer = yield Customer_1.Customer.findOne({ where: { userId: payload.sub }, relations: ["cards", "user"] });
                }
                else {
                    customer = yield Customer_1.Customer.findOne({ where: { id: customerId }, relations: ["cards", "user"] });
                }
                if (!customer) {
                    return { error: { code: common_1.errors.CONFLICT, message: "Specified customer does not exist" } };
                }
                try {
                    const stripeCard = yield stripe.customers.createSource(customer.stripeCustomerId, { source });
                    if (!stripeCard || stripeCard.customer !== customer.stripeCustomerId || stripeCard.object !== "card") {
                        return { error: { message: common_1.errors.SOMETHING_WENT_WRONG } };
                    }
                    const brand = yield CardBrand_1.CardBrand.findOne({ name: stripeCard.brand });
                    const country = yield Country_1.Country.findOne({ isoCode: stripeCard.country });
                    const newCustomerCard = yield typeorm_1.getCustomRepository(Card_1.CardRepository).createCard(stripe, stripeCard, customer, brand, country, isDefault, cardholderName);
                    return {
                        card: newCustomerCard,
                        added: true,
                    };
                }
                catch (err) {
                    return { error: { message: `${common_1.errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
                }
            }),
        });
        t.field("updateCustomerCard", {
            type: types_2.UpdateCardResult,
            description: "Update the details of customer's card",
            nullable: false,
            args: {
                cardId: schema_1.arg({
                    type: common_2.BigIntScalar,
                    required: true,
                    description: "The ID values of the card to update",
                }),
                cardholderName: schema_1.stringArg({
                    required: false,
                    description: "The (full) name of the cardholder of the card",
                }),
                expMonth: schema_1.intArg({
                    required: false,
                    description: "The expiration month of the card",
                }),
                expYear: schema_1.intArg({
                    required: false,
                    description: "The expiration year of the card",
                }),
                isDefault: schema_1.booleanArg({
                    required: false,
                    description: "A boolean that indicates if the card is the default one for the customer, to use in its transactions",
                }),
            },
            resolve: (_, { cardId, cardholderName, expMonth, expYear, isDefault }, { stripe }) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                if (!cardId || cardId <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid card" } };
                }
                if (cardholderName && cardholderName.trim().length === 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid name" } };
                }
                if (expMonth && (expMonth < dayjs_1.default().month() + 1 || expMonth < 1 || expMonth > 12)) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid expiration month" } };
                }
                if (expYear && (expYear < dayjs_1.default().year() || expYear.toString().length !== 4)) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid expiration year" } };
                }
                const card = yield Card_1.Card.findOne({
                    where: { id: cardId },
                    relations: ["brand", "country", "customer", "customer.user", "customer.cards"],
                });
                if (!card) {
                    return { error: { code: common_1.errors.CONFLICT, message: `${common_1.errors.SOMETHING_WENT_WRONG}: We could not find your card` } };
                }
                if (card.isExpired) {
                    return { error: { message: "This card is expired" } };
                }
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
                    return { error: { message: `${common_1.errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
                }
            }),
        });
        t.field("deleteCustomerCard", {
            type: types_1.DeleteResult,
            description: "Delete (remove) a card from a customer",
            nullable: false,
            args: {
                cardId: schema_1.arg({
                    type: common_2.BigIntScalar,
                    required: true,
                    description: "The ID values of the card to delete",
                }),
            },
            resolve: (_, { cardId }, { stripe }) => __awaiter(this, void 0, void 0, function* () {
                if (!cardId || cardId <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid card" } };
                }
                const card = yield Card_1.Card.findOne({ where: { id: cardId }, relations: ["customer"] });
                if (!card) {
                    return { error: { code: common_1.errors.CONFLICT, message: "Specified card does not exist" } };
                }
                try {
                    yield card.customSoftRemove(stripe);
                }
                catch (err) {
                    return { error: { message: `${common_1.errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
                }
                return {
                    deleted: true,
                };
            }),
        });
    },
});
//# sourceMappingURL=mutation.js.map