"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var Card_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardRepository = exports.Card = exports.cardFunding = exports.cardType = void 0;
const dayjs_1 = require("dayjs");
const typeorm_1 = require("typeorm");
const softRemove_1 = require("utils/softRemove");
const __1 = require("..");
const CardBrand_1 = require("./CardBrand");
const Country_1 = require("./Country");
const Customer_1 = require("./Customer");
const Payment_1 = require("./Payment");
var cardType;
(function (cardType) {
    cardType["physical"] = "physical";
    cardType["virtual"] = "virtual";
    cardType["unknown"] = "unknown";
})(cardType = exports.cardType || (exports.cardType = {}));
var cardFunding;
(function (cardFunding) {
    cardFunding["credit"] = "credit";
    cardFunding["debit"] = "debit";
    cardFunding["prepaid"] = "prepaid";
    cardFunding["unknown"] = "unknown";
})(cardFunding = exports.cardFunding || (exports.cardFunding = {}));
let Card = Card_1 = class Card extends typeorm_1.BaseEntity {
    updateCard(cardholderName, expMonth, expYear, isDefault, webhook = false) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (cardholderName && cardholderName !== this.cardholderName) {
                    this.cardholderName = cardholderName;
                }
                if (expMonth && expMonth !== this.expMonth) {
                    this.expMonth = expMonth;
                }
                if (expYear && expYear !== this.expYear) {
                    this.expYear = expYear;
                }
                if (isDefault !== null && isDefault !== undefined && isDefault !== this.isDefault) {
                    if (this.customer.cards) {
                        const defaultCard = this.customer.cards.find(card => card.isDefault === true && card.isExpired === false);
                        if (!webhook && defaultCard) {
                            throw new Error("You are not allowed to have more than one default card");
                        }
                        else if (webhook && defaultCard) {
                            defaultCard.isDefault = false;
                            yield defaultCard.save();
                        }
                        this.isDefault = isDefault;
                    }
                }
                yield this.save();
                if (!webhook) {
                    yield __1.stripe.customers.updateSource(this.customer.stripeCustomerId, this.stripeId, {
                        name: this.cardholderName || undefined,
                        exp_month: ((_a = this.expMonth) === null || _a === void 0 ? void 0 : _a.toString()) || undefined,
                        exp_year: ((_b = this.expYear) === null || _b === void 0 ? void 0 : _b.toString()) || undefined,
                    });
                    if (isDefault && this.isDefault) {
                        yield __1.stripe.customers.update(this.customer.stripeCustomerId, {
                            default_source: this.stripeId,
                        });
                    }
                }
                return this;
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    expireCard() {
        return __awaiter(this, void 0, void 0, function* () {
            this.isExpired = true;
            yield this.save();
        });
    }
    customSoftRemove(stripe, webhook = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!webhook) {
                try {
                    yield stripe.customers.deleteSource(this.customer.stripeCustomerId, this.stripeId);
                }
                catch (err) {
                    throw new Error(err.message);
                }
            }
            yield softRemove_1.softRemove(Card_1, { id: this.id }, [Payment_1.Payment], { cardId: this.id });
        });
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: "bigint" }),
    __metadata("design:type", typeof BigInt === "function" ? BigInt : Object)
], Card.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ type: "enum", name: "type", enum: cardType, enumName: "card_type", default: () => "unknown" }),
    __metadata("design:type", String)
], Card.prototype, "type", void 0);
__decorate([
    typeorm_1.Column({ type: "enum", name: "funding", enum: cardFunding, enumName: "card_funding", default: () => "unknown" }),
    __metadata("design:type", String)
], Card.prototype, "funding", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "brand_id", nullable: true }),
    __metadata("design:type", Number)
], Card.prototype, "brandId", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "country_id", nullable: true }),
    __metadata("design:type", Number)
], Card.prototype, "countryId", void 0);
__decorate([
    typeorm_1.Column({ type: "smallint", name: "exp_month", nullable: true }),
    __metadata("design:type", Number)
], Card.prototype, "expMonth", void 0);
__decorate([
    typeorm_1.Column({ type: "smallint", name: "exp_year", nullable: true }),
    __metadata("design:type", Number)
], Card.prototype, "expYear", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 4, name: "last_4" }),
    __metadata("design:type", String)
], Card.prototype, "last4", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 255, name: "cardholder_name", nullable: true }),
    __metadata("design:type", String)
], Card.prototype, "cardholderName", void 0);
__decorate([
    typeorm_1.Column({ type: "boolean", name: "is_default", default: () => false }),
    __metadata("design:type", Boolean)
], Card.prototype, "isDefault", void 0);
__decorate([
    typeorm_1.Column({ type: "boolean", name: "is_expired", default: () => false }),
    __metadata("design:type", Boolean)
], Card.prototype, "isExpired", void 0);
__decorate([
    typeorm_1.Column({ type: "bigint", name: "customer_id" }),
    __metadata("design:type", typeof BigInt === "function" ? BigInt : Object)
], Card.prototype, "customerId", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 255, name: "stripe_id" }),
    __metadata("design:type", String)
], Card.prototype, "stripeId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => CardBrand_1.CardBrand, cardBrand => cardBrand.cards, { nullable: true }),
    typeorm_1.JoinColumn({ name: "brand_id" }),
    __metadata("design:type", CardBrand_1.CardBrand)
], Card.prototype, "brand", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Country_1.Country, country => country.cards, { nullable: true }),
    typeorm_1.JoinColumn({ name: "country_id" }),
    __metadata("design:type", Country_1.Country)
], Card.prototype, "country", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Customer_1.Customer, customer => customer.cards, { nullable: false, cascade: ["soft-remove", "recover"] }),
    typeorm_1.JoinColumn({ name: "customer_id" }),
    __metadata("design:type", Customer_1.Customer)
], Card.prototype, "customer", void 0);
__decorate([
    typeorm_1.OneToMany(() => Payment_1.Payment, payment => payment.card, { nullable: true }),
    __metadata("design:type", Array)
], Card.prototype, "payments", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ name: "updated_at", type: "timestamptz", default: () => `NOW()` }),
    __metadata("design:type", dayjs_1.Dayjs)
], Card.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ name: "timestamp", type: "timestamptz", default: () => `NOW()` }),
    __metadata("design:type", dayjs_1.Dayjs)
], Card.prototype, "timestamp", void 0);
__decorate([
    typeorm_1.DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true }),
    __metadata("design:type", dayjs_1.Dayjs)
], Card.prototype, "deletedAt", void 0);
Card = Card_1 = __decorate([
    typeorm_1.Entity({ name: "card", schema: "public" }),
    typeorm_1.Check(`"expMonth" >= 0 AND "expMonth" <= 12`),
    typeorm_1.Check(`length("expYear"::text) = 4`),
    typeorm_1.Check(`length("last4") = 4`)
], Card);
exports.Card = Card;
let CardRepository = class CardRepository extends typeorm_1.Repository {
    createCard(stripe, stripeCard, customer, brand, country, isDefault, cardholderName) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newCustomerCard = Card.create({
                    brand,
                    country,
                    customer,
                    stripeId: stripeCard.id,
                    expMonth: stripeCard.exp_month,
                    expYear: stripeCard.exp_year,
                    last4: stripeCard.last4,
                    isDefault: customer.cards && isDefault && customer.cards.length === 0 ? true : false,
                    cardholderName: ((_a = customer.user) === null || _a === void 0 ? void 0 : _a.getFullName()) && !cardholderName ? (_b = customer.user) === null || _b === void 0 ? void 0 : _b.getFullName() : cardholderName ? cardholderName : undefined,
                });
                yield newCustomerCard.save();
                if (newCustomerCard.isDefault) {
                    yield stripe.customers.update(customer.stripeCustomerId, { default_source: newCustomerCard.stripeId });
                }
                return newCustomerCard;
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    createStripeWebhookCard(stripe, stripeCard) {
        return __awaiter(this, void 0, void 0, function* () {
            const customer = yield Customer_1.Customer.findOne({ stripeCustomerId: stripeCard.customer });
            if (!customer) {
                throw new Error("Specified customer does not exist");
            }
            const brand = yield CardBrand_1.CardBrand.findOne({ name: stripeCard.brand });
            const country = yield Country_1.Country.findOne({ isoCode: stripeCard.country });
            try {
                yield this.createCard(stripe, stripeCard, customer, brand, country, undefined, stripeCard.name);
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    updateStripeWebhookCard(stripeCard) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, name, exp_month: expMonth, exp_year: expYear } = stripeCard;
            const card = yield Card.findOne({
                where: { stripeId: id, isExpired: false },
                relations: ["customer"],
            });
            if (!card) {
                throw new Error("Card does not exist");
            }
            try {
                yield card.updateCard(name, expMonth, expYear);
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
};
CardRepository = __decorate([
    typeorm_1.EntityRepository(Card)
], CardRepository);
exports.CardRepository = CardRepository;
//# sourceMappingURL=Card.js.map