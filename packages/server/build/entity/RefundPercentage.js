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
exports.RefundPercentage = void 0;
const typeorm_1 = require("typeorm");
let RefundPercentage = class RefundPercentage extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], RefundPercentage.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "percentage_value" }),
    __metadata("design:type", Number)
], RefundPercentage.prototype, "percentageValue", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "days_limit" }),
    __metadata("design:type", Number)
], RefundPercentage.prototype, "daysLimit", void 0);
__decorate([
    typeorm_1.Column({ type: "bigint", name: "days_milliseconds" }),
    __metadata("design:type", Number)
], RefundPercentage.prototype, "daysMilliseconds", void 0);
RefundPercentage = __decorate([
    typeorm_1.Entity({ name: "refund_percentage", schema: "public" })
], RefundPercentage);
exports.RefundPercentage = RefundPercentage;
