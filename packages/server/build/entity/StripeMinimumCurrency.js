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
exports.StripeMinimumCurrency = void 0;
const typeorm_1 = require("typeorm");
const Currency_1 = require("./Currency");
let StripeMinimumCurrency = class StripeMinimumCurrency extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], StripeMinimumCurrency.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ type: "decimal", precision: 4, scale: 2, name: "charge_amount" }),
    __metadata("design:type", Number)
], StripeMinimumCurrency.prototype, "chargeAmount", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "currency_id", unique: true }),
    __metadata("design:type", Number)
], StripeMinimumCurrency.prototype, "currencyId", void 0);
__decorate([
    typeorm_1.OneToOne(() => Currency_1.Currency, currency => currency.stripeMinimumCurrency, { nullable: false }),
    typeorm_1.JoinColumn({ name: "currency_id" }),
    __metadata("design:type", Currency_1.Currency)
], StripeMinimumCurrency.prototype, "currency", void 0);
StripeMinimumCurrency = __decorate([
    typeorm_1.Entity({ name: "stripe_minimum_currency", schema: "public" })
], StripeMinimumCurrency);
exports.StripeMinimumCurrency = StripeMinimumCurrency;
//# sourceMappingURL=StripeMinimumCurrency.js.map