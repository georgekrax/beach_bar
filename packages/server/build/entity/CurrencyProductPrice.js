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
exports.CurrencyProductPrice = void 0;
const dayjs_1 = require("dayjs");
const typeorm_1 = require("typeorm");
const Currency_1 = require("./Currency");
let CurrencyProductPrice = class CurrencyProductPrice extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], CurrencyProductPrice.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "currency_id", unique: true }),
    __metadata("design:type", Number)
], CurrencyProductPrice.prototype, "currencyId", void 0);
__decorate([
    typeorm_1.Column({ type: "decimal", precision: 5, scale: 2, name: "price" }),
    __metadata("design:type", Number)
], CurrencyProductPrice.prototype, "price", void 0);
__decorate([
    typeorm_1.OneToOne(() => Currency_1.Currency, currency => currency.productPrice, { nullable: false }),
    typeorm_1.JoinColumn({ name: "currency_id" }),
    __metadata("design:type", Currency_1.Currency)
], CurrencyProductPrice.prototype, "currency", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ name: "updated_at", type: "timestamptz", default: () => `NOW()` }),
    __metadata("design:type", dayjs_1.Dayjs)
], CurrencyProductPrice.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ name: "timestamp", type: "timestamptz", default: () => `NOW()` }),
    __metadata("design:type", dayjs_1.Dayjs)
], CurrencyProductPrice.prototype, "timestamp", void 0);
CurrencyProductPrice = __decorate([
    typeorm_1.Entity({ name: "currency_product_price", schema: "public" })
], CurrencyProductPrice);
exports.CurrencyProductPrice = CurrencyProductPrice;
//# sourceMappingURL=CurrencyProductPrice.js.map