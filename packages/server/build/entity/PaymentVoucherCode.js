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
exports.PaymentVoucherCode = void 0;
const dayjs_1 = require("dayjs");
const typeorm_1 = require("typeorm");
const CouponCode_1 = require("./CouponCode");
const OfferCampaignCode_1 = require("./OfferCampaignCode");
const Payment_1 = require("./Payment");
let PaymentVoucherCode = class PaymentVoucherCode extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: "bigint" }),
    __metadata("design:type", typeof BigInt === "function" ? BigInt : Object)
], PaymentVoucherCode.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ type: "bigint", name: "payment_id" }),
    __metadata("design:type", typeof BigInt === "function" ? BigInt : Object)
], PaymentVoucherCode.prototype, "paymentId", void 0);
__decorate([
    typeorm_1.Column({ type: "bigint", name: "coupon_code_id", nullable: true }),
    __metadata("design:type", typeof BigInt === "function" ? BigInt : Object)
], PaymentVoucherCode.prototype, "couponCodeId", void 0);
__decorate([
    typeorm_1.Column({ type: "bigint", name: "offer_code_id", nullable: true }),
    __metadata("design:type", typeof BigInt === "function" ? BigInt : Object)
], PaymentVoucherCode.prototype, "offerCodeId", void 0);
__decorate([
    typeorm_1.OneToOne(() => Payment_1.Payment, payment => payment.voucherCode, { nullable: false }),
    typeorm_1.JoinColumn({ name: "payment_id" }),
    __metadata("design:type", Payment_1.Payment)
], PaymentVoucherCode.prototype, "payment", void 0);
__decorate([
    typeorm_1.ManyToOne(() => CouponCode_1.CouponCode, couponCode => couponCode.payments, { nullable: true }),
    typeorm_1.JoinColumn({ name: "coupon_code_id" }),
    __metadata("design:type", CouponCode_1.CouponCode)
], PaymentVoucherCode.prototype, "couponCode", void 0);
__decorate([
    typeorm_1.ManyToOne(() => OfferCampaignCode_1.OfferCampaignCode, offerCampaignCode => offerCampaignCode.payments, { nullable: true }),
    typeorm_1.JoinColumn({ name: "offer_code_id" }),
    __metadata("design:type", OfferCampaignCode_1.OfferCampaignCode)
], PaymentVoucherCode.prototype, "offerCode", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` }),
    __metadata("design:type", dayjs_1.Dayjs)
], PaymentVoucherCode.prototype, "timestamp", void 0);
PaymentVoucherCode = __decorate([
    typeorm_1.Entity({ name: "payment_voucher_code", schema: "public" })
], PaymentVoucherCode);
exports.PaymentVoucherCode = PaymentVoucherCode;
