"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var Payment_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const common_1 = require("@beach_bar/common");
const status_1 = require("constants/status");
const dayjs_1 = __importStar(require("dayjs"));
const minMax_1 = __importDefault(require("dayjs/plugin/minMax"));
const typeorm_1 = require("typeorm");
const softRemove_1 = require("utils/softRemove");
const BeachBarReview_1 = require("./BeachBarReview");
const Card_1 = require("./Card");
const Cart_1 = require("./Cart");
const PaymentStatus_1 = require("./PaymentStatus");
const PaymentVoucherCode_1 = require("./PaymentVoucherCode");
const RefundPercentage_1 = require("./RefundPercentage");
const ReservedProduct_1 = require("./ReservedProduct");
let Payment = Payment_1 = class Payment extends typeorm_1.BaseEntity {
    createReservedProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            const cartProducts = this.cart.products;
            if (cartProducts) {
                const newReservedProducts = [];
                for (let i = 0; i < cartProducts.length; i++) {
                    const cartProduct = cartProducts[i];
                    const newReservedProduct = ReservedProduct_1.ReservedProduct.create({
                        product: cartProduct.product,
                        payment: this,
                        date: cartProduct.date,
                        time: cartProduct.time,
                    });
                    yield newReservedProduct.save();
                    newReservedProducts.push(newReservedProduct);
                }
                if (newReservedProducts.length === 0) {
                    throw new Error(common_1.errors.SOMETHING_WENT_WRONG);
                }
                const status = yield PaymentStatus_1.PaymentStatus.findOne({ status: status_1.payment.PAID });
                if (!status) {
                    throw new Error(common_1.errors.SOMETHING_WENT_WRONG);
                }
                this.status = status;
                yield this.save();
                return newReservedProducts;
            }
            else {
                throw new Error(common_1.errors.SOMETHING_WENT_WRONG);
            }
        });
    }
    getRefundPercentage() {
        return __awaiter(this, void 0, void 0, function* () {
            dayjs_1.default.extend(minMax_1.default);
            const products = this.cart.products;
            if (!products) {
                return undefined;
            }
            const minDate = dayjs_1.default.min(products.map(product => dayjs_1.default(product.date)));
            const daysDiff = dayjs_1.default().toDate().getTime() - dayjs_1.default(minDate).toDate().getTime();
            const refundPercentage = yield RefundPercentage_1.RefundPercentage.findOne({ daysMilliseconds: typeorm_1.MoreThanOrEqual(daysDiff) });
            if (!refundPercentage) {
                return undefined;
            }
            return {
                refundPercentage,
                daysDiff,
            };
        });
    }
    hasBeachBarProduct(beachBarId) {
        if (this.cart.products) {
            return this.cart.products.some(product => product.product.beachBarId === beachBarId && !product.product.deletedAt);
        }
        else {
            return false;
        }
    }
    getProductsMonth(beachBarId) {
        if (!this.cart.products) {
            return undefined;
        }
        return this.cart.products
            .filter(product => product.product.beachBarId === beachBarId)
            .map(product => dayjs_1.default(product.date).month() + 1);
    }
    getBeachBarProducts(beachBarId) {
        if (!this.hasBeachBarProduct(beachBarId) || !this.cart.products) {
            return undefined;
        }
        const beachBarProducts = this.cart.products.map(product => product.product).filter(product => product.beachBarId === beachBarId);
        return beachBarProducts;
    }
    softRemove() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.cart.customSoftRemove(false);
            const refundedStatus = yield PaymentStatus_1.PaymentStatus.findOne({ status: status_1.payment.REFUNDED });
            if (refundedStatus) {
                this.status = refundedStatus;
                yield this.save();
            }
            const findOptions = { paymentId: this.id };
            yield softRemove_1.softRemove(Payment_1, { id: this.id }, [ReservedProduct_1.ReservedProduct], findOptions);
        });
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: "bigint" }),
    __metadata("design:type", typeof BigInt === "function" ? BigInt : Object)
], Payment.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ type: "bigint", name: "cart_id" }),
    __metadata("design:type", typeof BigInt === "function" ? BigInt : Object)
], Payment.prototype, "cartId", void 0);
__decorate([
    typeorm_1.Column({ type: "bigint", name: "card_id" }),
    __metadata("design:type", typeof BigInt === "function" ? BigInt : Object)
], Payment.prototype, "cardId", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 16, name: "ref_code", unique: true }),
    __metadata("design:type", String)
], Payment.prototype, "refCode", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "status_id", default: () => 1 }),
    __metadata("design:type", Number)
], Payment.prototype, "statusId", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 255, name: "stripe_id" }),
    __metadata("design:type", String)
], Payment.prototype, "stripeId", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 19, name: "transfer_group_code", unique: true }),
    __metadata("design:type", String)
], Payment.prototype, "transferGroupCode", void 0);
__decorate([
    typeorm_1.Column({ type: "boolean", name: "is_refunded", default: () => false }),
    __metadata("design:type", Boolean)
], Payment.prototype, "isRefunded", void 0);
__decorate([
    typeorm_1.Column({ type: "decimal", precision: 12, scale: 2, name: "app_fee", nullable: true }),
    __metadata("design:type", Number)
], Payment.prototype, "appFee", void 0);
__decorate([
    typeorm_1.Column({ type: "decimal", precision: 12, scale: 2, name: "transfer_amount", nullable: true }),
    __metadata("design:type", Number)
], Payment.prototype, "transferAmount", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Cart_1.Cart, cart => cart.payment, { nullable: false }),
    typeorm_1.JoinColumn({ name: "cart_id" }),
    __metadata("design:type", Cart_1.Cart)
], Payment.prototype, "cart", void 0);
__decorate([
    typeorm_1.OneToOne(() => Card_1.Card, card => card.payments, { nullable: false }),
    typeorm_1.JoinColumn({ name: "card_id" }),
    __metadata("design:type", Card_1.Card)
], Payment.prototype, "card", void 0);
__decorate([
    typeorm_1.ManyToOne(() => PaymentStatus_1.PaymentStatus, paymentStatus => paymentStatus.payments, { nullable: false }),
    typeorm_1.JoinColumn({ name: "status_id" }),
    __metadata("design:type", PaymentStatus_1.PaymentStatus)
], Payment.prototype, "status", void 0);
__decorate([
    typeorm_1.OneToMany(() => BeachBarReview_1.BeachBarReview, beachBarReview => beachBarReview.payment, { nullable: true }),
    __metadata("design:type", Array)
], Payment.prototype, "reviews", void 0);
__decorate([
    typeorm_1.OneToOne(() => PaymentVoucherCode_1.PaymentVoucherCode, paymentVoucherCode => paymentVoucherCode.payment, { nullable: true }),
    __metadata("design:type", PaymentVoucherCode_1.PaymentVoucherCode)
], Payment.prototype, "voucherCode", void 0);
__decorate([
    typeorm_1.OneToMany(() => ReservedProduct_1.ReservedProduct, reservedProduct => reservedProduct.payment, { nullable: true }),
    __metadata("design:type", Array)
], Payment.prototype, "reservedProducts", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ type: "timestamptz", name: "updated_at", default: () => `NOW()` }),
    __metadata("design:type", dayjs_1.Dayjs)
], Payment.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` }),
    __metadata("design:type", dayjs_1.Dayjs)
], Payment.prototype, "timestamp", void 0);
Payment = Payment_1 = __decorate([
    typeorm_1.Entity({ name: "payment", schema: "public" })
], Payment);
exports.Payment = Payment;
//# sourceMappingURL=Payment.js.map