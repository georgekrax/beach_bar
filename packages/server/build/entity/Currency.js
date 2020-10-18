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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Currency = void 0;
const typeorm_1 = require("typeorm");
const BeachBar_1 = require("./BeachBar");
const PricingFeeCurrency_1 = require("./PricingFeeCurrency");
const Country_1 = require("./Country");
const CurrencyProductPrice_1 = require("./CurrencyProductPrice");
const StripeFee_1 = require("./StripeFee");
const StripeMinimumCurrency_1 = require("./StripeMinimumCurrency");
let Currency = class Currency extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Currency.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 50, name: "name", unique: true }),
    __metadata("design:type", String)
], Currency.prototype, "name", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 3, name: "iso_code", unique: true }),
    __metadata("design:type", String)
], Currency.prototype, "isoCode", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 10, name: "symbol", unique: true }),
    __metadata("design:type", String)
], Currency.prototype, "symbol", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 10, name: "second_symbol", nullable: true }),
    __metadata("design:type", String)
], Currency.prototype, "secondSymbol", void 0);
__decorate([
    typeorm_1.OneToMany(() => Country_1.Country, country => country.currency, { nullable: true }),
    __metadata("design:type", Array)
], Currency.prototype, "countries", void 0);
__decorate([
    typeorm_1.OneToOne(() => CurrencyProductPrice_1.CurrencyProductPrice, currencyProductPrice => currencyProductPrice.currency),
    __metadata("design:type", CurrencyProductPrice_1.CurrencyProductPrice)
], Currency.prototype, "productPrice", void 0);
__decorate([
    typeorm_1.OneToMany(() => BeachBar_1.BeachBar, beachBar => beachBar.defaultCurrency, { nullable: true }),
    __metadata("design:type", Array)
], Currency.prototype, "beachBars", void 0);
__decorate([
    typeorm_1.OneToMany(() => PricingFeeCurrency_1.PricingFeeCurrency, pricingFeeCurrency => pricingFeeCurrency.currency, { nullable: true }),
    __metadata("design:type", Array)
], Currency.prototype, "beachBarFees", void 0);
__decorate([
    typeorm_1.OneToMany(() => StripeFee_1.StripeFee, stripeFee => stripeFee.currency, { nullable: true }),
    __metadata("design:type", Array)
], Currency.prototype, "stripeFees", void 0);
__decorate([
    typeorm_1.OneToOne(() => StripeMinimumCurrency_1.StripeMinimumCurrency, stripeMinimumCurrency => stripeMinimumCurrency.currency),
    __metadata("design:type", StripeMinimumCurrency_1.StripeMinimumCurrency)
], Currency.prototype, "stripeMinimumCurrency", void 0);
Currency = __decorate([
    typeorm_1.Entity({ name: "currency", schema: "public" })
], Currency);
exports.Currency = Currency;
//# sourceMappingURL=Currency.js.map