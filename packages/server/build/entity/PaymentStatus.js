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
exports.PaymentStatus = void 0;
const typeorm_1 = require("typeorm");
const Payment_1 = require("./Payment");
let PaymentStatus = class PaymentStatus extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], PaymentStatus.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 25, name: "status", unique: true }),
    __metadata("design:type", String)
], PaymentStatus.prototype, "status", void 0);
__decorate([
    typeorm_1.OneToMany(() => Payment_1.Payment, payment => payment.status, { nullable: true }),
    __metadata("design:type", Array)
], PaymentStatus.prototype, "payments", void 0);
PaymentStatus = __decorate([
    typeorm_1.Entity({ name: "payment_status", schema: "public" })
], PaymentStatus);
exports.PaymentStatus = PaymentStatus;
//# sourceMappingURL=PaymentStatus.js.map