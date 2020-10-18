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
var CouponCode_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponCode = void 0;
const common_1 = require("@georgekrax-hashtag/common");
const _index_1 = require("constants/_index");
const dayjs_1 = require("dayjs");
const typeorm_1 = require("typeorm");
const softRemove_1 = require("utils/softRemove");
const BeachBar_1 = require("./BeachBar");
const PaymentVoucherCode_1 = require("./PaymentVoucherCode");
let CouponCode = CouponCode_1 = class CouponCode extends typeorm_1.BaseEntity {
    generateRefCode() {
        this.refCode = common_1.generateId({ length: _index_1.voucherCodeLength.COUPON_CODE, specialCharacters: _index_1.generateIdSpecialCharacters.VOUCHER_CODE });
    }
    update(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, discountPercentage, validUntil, isActive, timesLimit } = options;
            try {
                if (title && title !== this.title) {
                    this.title = title;
                }
                if (discountPercentage && discountPercentage !== this.discountPercentage) {
                    this.discountPercentage = discountPercentage;
                }
                if (validUntil && validUntil !== this.validUntil) {
                    this.validUntil = validUntil;
                }
                if (isActive !== null && isActive !== undefined && isActive !== this.isActive) {
                    this.isActive = isActive;
                }
                if (timesLimit && timesLimit !== this.timesLimit) {
                    this.timesLimit = timesLimit;
                }
                if (timesLimit && timesLimit < this.timesUsed) {
                    yield this.softRemove();
                    return { deleted: true };
                }
                yield this.save();
                return this;
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    softRemove() {
        return __awaiter(this, void 0, void 0, function* () {
            yield softRemove_1.softRemove(CouponCode_1, { id: this.id });
        });
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: "bigint" }),
    __metadata("design:type", typeof BigInt === "function" ? BigInt : Object)
], CouponCode.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 255, name: "title" }),
    __metadata("design:type", String)
], CouponCode.prototype, "title", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: _index_1.voucherCodeLength.COUPON_CODE, name: "ref_code", unique: true }),
    __metadata("design:type", String)
], CouponCode.prototype, "refCode", void 0);
__decorate([
    typeorm_1.Column({ type: "decimal", precision: 3, scale: 0, name: "discount_percentage" }),
    __metadata("design:type", Number)
], CouponCode.prototype, "discountPercentage", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "beach_bar_id", nullable: true }),
    __metadata("design:type", Number)
], CouponCode.prototype, "beachBarId", void 0);
__decorate([
    typeorm_1.Column({ type: "boolean", name: "is_active", default: () => false }),
    __metadata("design:type", Boolean)
], CouponCode.prototype, "isActive", void 0);
__decorate([
    typeorm_1.Column({ type: "timestamptz", name: "valid_until", nullable: true }),
    __metadata("design:type", dayjs_1.Dayjs)
], CouponCode.prototype, "validUntil", void 0);
__decorate([
    typeorm_1.Column({ type: "smallint", name: "times_limit", nullable: true }),
    __metadata("design:type", Number)
], CouponCode.prototype, "timesLimit", void 0);
__decorate([
    typeorm_1.Column({ type: "smallint", name: "times_used", default: () => 0 }),
    __metadata("design:type", Number)
], CouponCode.prototype, "timesUsed", void 0);
__decorate([
    typeorm_1.ManyToOne(() => BeachBar_1.BeachBar, beachBar => beachBar.couponCodes, { nullable: true }),
    typeorm_1.JoinColumn({ name: "beach_bar_id" }),
    __metadata("design:type", BeachBar_1.BeachBar)
], CouponCode.prototype, "beachBar", void 0);
__decorate([
    typeorm_1.OneToMany(() => PaymentVoucherCode_1.PaymentVoucherCode, paymentVoucherCode => paymentVoucherCode.couponCode, { nullable: true }),
    __metadata("design:type", Array)
], CouponCode.prototype, "payments", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ name: "updated_at", type: "timestamptz", default: () => `NOW()` }),
    __metadata("design:type", dayjs_1.Dayjs)
], CouponCode.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ name: "timestamp", type: "timestamptz", default: () => `NOW()` }),
    __metadata("design:type", dayjs_1.Dayjs)
], CouponCode.prototype, "timestamp", void 0);
__decorate([
    typeorm_1.DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true }),
    __metadata("design:type", dayjs_1.Dayjs)
], CouponCode.prototype, "deletedAt", void 0);
__decorate([
    typeorm_1.BeforeInsert(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CouponCode.prototype, "generateRefCode", null);
CouponCode = CouponCode_1 = __decorate([
    typeorm_1.Entity({ name: "coupon_code", schema: "public" }),
    typeorm_1.Check(`"timesLimit" IS NULL OR "timesLimit" > 0`),
    typeorm_1.Check(`"timesUsed" <= "timesLimit"`)
], CouponCode);
exports.CouponCode = CouponCode;
//# sourceMappingURL=CouponCode.js.map