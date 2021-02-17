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
exports.PricingFeeCurrency = void 0;
const dayjs_1 = require("dayjs");
const typeorm_1 = require("typeorm");
const Currency_1 = require("./Currency");
let PricingFeeCurrency = class PricingFeeCurrency extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryColumn({ type: "integer", name: "currency_id" }),
    __metadata("design:type", Number)
], PricingFeeCurrency.prototype, "currencyId", void 0);
__decorate([
    typeorm_1.Column({ type: "decimal", precision: 4, scale: 2, name: "numeric_value" }),
    __metadata("design:type", Number)
], PricingFeeCurrency.prototype, "numericValue", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Currency_1.Currency, currency => currency.beachBarFees),
    typeorm_1.JoinColumn({ name: "currency_id" }),
    __metadata("design:type", Currency_1.Currency)
], PricingFeeCurrency.prototype, "currency", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` }),
    __metadata("design:type", dayjs_1.Dayjs)
], PricingFeeCurrency.prototype, "timestamp", void 0);
PricingFeeCurrency = __decorate([
    typeorm_1.Entity({ name: "pricing_fee_currency", schema: "public" })
], PricingFeeCurrency);
exports.PricingFeeCurrency = PricingFeeCurrency;
