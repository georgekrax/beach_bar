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
var Customer_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRepository = exports.Customer = void 0;
const common_1 = require("@beach_bar/common");
const common_2 = require("@georgekrax-hashtag/common");
const dayjs_1 = require("dayjs");
const typeorm_1 = require("typeorm");
const softRemove_1 = require("utils/softRemove");
const BeachBarReview_1 = require("./BeachBarReview");
const Card_1 = require("./Card");
const City_1 = require("./City");
const Country_1 = require("./Country");
const User_1 = require("./User");
let Customer = Customer_1 = class Customer extends typeorm_1.BaseEntity {
    checkReviewsQuantity(beachBarId, payment) {
        if (this.reviews) {
            const customerBeachBarReviews = this.reviews.filter(review => review.beachBarId === beachBarId && !review.deletedAt);
            if (customerBeachBarReviews && customerBeachBarReviews.length >= 1) {
                const paymentBeachBarProducts = payment.getBeachBarProducts(beachBarId);
                if (paymentBeachBarProducts && paymentBeachBarProducts.length <= customerBeachBarReviews.length) {
                    return false;
                }
                return true;
            }
            return true;
        }
        return true;
    }
    update(phoneNumber, countryIsoCode) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (phoneNumber && phoneNumber !== this.phoneNumber && phoneNumber.trim().length !== 0) {
                    this.phoneNumber = phoneNumber;
                }
                if (countryIsoCode && countryIsoCode.trim().length !== 0) {
                    const country = yield Country_1.Country.findOne({ isoCode: countryIsoCode });
                    if (country) {
                        this.country = country;
                    }
                }
                yield this.save();
                return this;
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    customSoftRemove(stripe, webhook = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!webhook) {
                try {
                    yield stripe.customers.del(this.stripeCustomerId);
                }
                catch (err) {
                    throw new Error(err.message);
                }
            }
            const findOptions = { customerId: this.id };
            yield softRemove_1.softRemove(Customer_1, { id: this.id }, [Card_1.Card], findOptions);
        });
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: "bigint" }),
    __metadata("design:type", typeof BigInt === "function" ? BigInt : Object)
], Customer.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "user_id", nullable: true }),
    __metadata("design:type", Number)
], Customer.prototype, "userId", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 255, name: "email" }),
    __metadata("design:type", String)
], Customer.prototype, "email", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 20, name: "phone_number", nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "phoneNumber", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "country_id", nullable: true }),
    __metadata("design:type", Number)
], Customer.prototype, "countryId", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 255, name: "stripe_customer_id" }),
    __metadata("design:type", String)
], Customer.prototype, "stripeCustomerId", void 0);
__decorate([
    typeorm_1.OneToOne(() => User_1.User, user => user.customer, { nullable: true, cascade: ["soft-remove", "recover"] }),
    typeorm_1.JoinColumn({ name: "user_id" }),
    __metadata("design:type", User_1.User)
], Customer.prototype, "user", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Country_1.Country, country => country.customers, { nullable: true }),
    typeorm_1.JoinColumn({ name: "country_id" }),
    __metadata("design:type", Country_1.Country)
], Customer.prototype, "country", void 0);
__decorate([
    typeorm_1.OneToMany(() => Card_1.Card, card => card.customer, { nullable: true }),
    __metadata("design:type", Array)
], Customer.prototype, "cards", void 0);
__decorate([
    typeorm_1.OneToMany(() => BeachBarReview_1.BeachBarReview, beachBarReview => beachBarReview.customer, { nullable: true }),
    __metadata("design:type", Array)
], Customer.prototype, "reviews", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ type: "timestamptz", name: "updated_at", default: () => `NOW()` }),
    __metadata("design:type", dayjs_1.Dayjs)
], Customer.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` }),
    __metadata("design:type", dayjs_1.Dayjs)
], Customer.prototype, "timestamp", void 0);
__decorate([
    typeorm_1.DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true }),
    __metadata("design:type", dayjs_1.Dayjs)
], Customer.prototype, "deletedAt", void 0);
Customer = Customer_1 = __decorate([
    typeorm_1.Entity({ name: "customer", schema: "public" })
], Customer);
exports.Customer = Customer;
let CustomerRepository = class CustomerRepository extends typeorm_1.Repository {
    getOrCreateCustomer(stripe, email, phoneNumber, countryIsoCode, payload) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            let user = undefined;
            if (payload && payload.sub) {
                user = yield User_1.User.findOne({
                    where: [{ id: payload.sub }, { email }],
                    relations: [
                        "account",
                        "account.city",
                        "account.country",
                        "account.contactDetails",
                        "customer",
                        "customer.user",
                        "customer.cards",
                        "customer.country",
                    ],
                });
                if (!user) {
                    return { error: { code: common_1.errors.CONFLICT, message: common_1.errors.USER_DOES_NOT_EXIST } };
                }
            }
            else {
                user = yield User_1.User.findOne({
                    where: { email },
                    relations: [
                        "account",
                        "account.city",
                        "account.country",
                        "account.contactDetails",
                        "customer",
                        "customer.user",
                        "customer.cards",
                        "customer.country",
                    ],
                });
            }
            if (user && user.customer) {
                return {
                    customer: user.customer,
                    added: false,
                };
            }
            if (email && !user) {
                try {
                    yield common_2.validateEmailSchema(email);
                }
                catch (err) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: err.message } };
                }
            }
            const newCustomer = Customer.create({
                user,
                email: user ? user.email : email,
            });
            try {
                if (user && user.account && user.account.contactDetails && user.account.contactDetails[0]) {
                    newCustomer.phoneNumber = user.account.contactDetails[0].phoneNumber;
                }
                else {
                    newCustomer.phoneNumber = phoneNumber;
                }
                if (countryIsoCode) {
                    const country = yield Country_1.Country.findOne({ isoCode: countryIsoCode });
                    if (country) {
                        newCustomer.country = country;
                    }
                }
                let userAccount = undefined;
                if (user && user.account) {
                    userAccount = user.account;
                }
                const stripeCustomer = yield stripe.customers.create({
                    email: newCustomer.email,
                    description: user ? "#beach_bar user" : undefined,
                    name: user ? user.getFullName() : undefined,
                    address: userAccount
                        ? {
                            line1: userAccount.address || "",
                            country: ((_a = userAccount.country) === null || _a === void 0 ? void 0 : _a.isoCode) || undefined,
                            city: ((_b = userAccount.city) === null || _b === void 0 ? void 0 : _b.name) || undefined,
                            postal_code: userAccount.zipCode || undefined,
                        }
                        : undefined,
                    phone: newCustomer.phoneNumber,
                    metadata: {
                        is_signed_up: user ? "true" : "false",
                    },
                });
                if (!stripeCustomer && (stripeCustomer.email !== email || stripeCustomer.email !== (user === null || user === void 0 ? void 0 : user.email))) {
                    return { error: { message: common_1.errors.SOMETHING_WENT_WRONG } };
                }
                newCustomer.stripeCustomerId = stripeCustomer.id;
                yield newCustomer.save();
            }
            catch (err) {
                return { error: { message: `${common_1.errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
            }
            return {
                customer: newCustomer,
                added: true,
            };
        });
    }
    createStripeWebhookCustomer(stripeCustomer) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, id } = stripeCustomer;
            const user = yield User_1.User.findOne({
                where: { email },
                relations: [
                    "account",
                    "account.city",
                    "account.country",
                    "account.contactDetails",
                    "customer",
                    "customer.user",
                    "customer.cards",
                ],
            });
            if (email && !user) {
                try {
                    yield common_2.validateEmailSchema(email);
                }
                catch (err) {
                    throw new Error(err.message);
                }
            }
            const newCustomer = Customer.create({
                user,
                email: user ? user.email : email,
            });
            try {
                newCustomer.stripeCustomerId = id;
                yield newCustomer.save();
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    updateStripeWebhookCustomer(stripeCustomer) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, address, name, phone, default_source: defaultSource } = stripeCustomer;
            const customer = yield Customer.findOne({
                where: { stripeCustomerId: stripeCustomer.id },
                relations: ["user", "user.account", "user.account.contactDetails", "cards", "cards.customer", "cards.customer.cards"],
            });
            if (!customer) {
                throw new Error("Customer does not exist");
            }
            if (customer.user) {
                let country = undefined;
                if (address.country) {
                    country = yield Country_1.Country.findOne({ isoCode: address.country });
                }
                let city = undefined;
                if (address.city) {
                    city = yield City_1.City.findOne({ name: address.city });
                }
                yield customer.user.update({
                    email,
                    firstName: name.split(" ")[0],
                    lastName: name.split(" ")[1],
                    address: address.line1,
                    countryId: country ? country.id : undefined,
                    cityId: city ? city.id : undefined,
                    zipCode: address.zipCode ? address.zipCode : undefined,
                });
                if (phone) {
                    customer.phoneNumber = phone;
                    yield customer.save();
                }
                if (defaultSource && customer.cards) {
                    const defaultCard = customer.cards.find(card => card.stripeId === defaultSource && card.isExpired === false);
                    if (defaultCard) {
                        yield defaultCard.updateCard(undefined, undefined, undefined, true, true);
                    }
                }
            }
        });
    }
};
CustomerRepository = __decorate([
    typeorm_1.EntityRepository(Customer)
], CustomerRepository);
exports.CustomerRepository = CustomerRepository;
//# sourceMappingURL=Customer.js.map