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
exports.PricingFee = void 0;
const dayjs_1 = require("dayjs");
const typeorm_1 = require("typeorm");
const BeachBar_1 = require("./BeachBar");
let PricingFee = class PricingFee extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], PricingFee.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 75, name: "name", unique: true }),
    __metadata("design:type", String)
], PricingFee.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ type: "decimal", precision: 4, scale: 2, name: "percentage_value" }),
    __metadata("design:type", Number)
], PricingFee.prototype, "percentageValue", void 0);
__decorate([
    typeorm_1.Column({ type: "decimal", precision: 4, scale: 2, name: "max_capacity_percentage" }),
    __metadata("design:type", Number)
], PricingFee.prototype, "maxCapacityPercentage", void 0);
__decorate([
    typeorm_1.OneToMany(() => BeachBar_1.BeachBar, beachBar => beachBar.fee),
    __metadata("design:type", Array)
], PricingFee.prototype, "beachBars", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` }),
    __metadata("design:type", dayjs_1.Dayjs)
], PricingFee.prototype, "timestamp", void 0);
PricingFee = __decorate([
    typeorm_1.Entity({ name: "pricing_fee", schema: "public" })
], PricingFee);
exports.PricingFee = PricingFee;
