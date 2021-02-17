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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var ReservedProduct_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservedProduct = void 0;
const redisKeys_1 = __importDefault(require("constants/redisKeys"));
const dayjs_1 = require("dayjs");
const typeorm_1 = require("typeorm");
const softRemove_1 = require("utils/softRemove");
const index_1 = require("../index");
const Payment_1 = require("./Payment");
const Product_1 = require("./Product");
const Time_1 = require("./Time");
let ReservedProduct = ReservedProduct_1 = class ReservedProduct extends typeorm_1.BaseEntity {
    updateAlsoInRedis() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.updateRedis(index_1.redis, true);
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    getRedisKey() {
        return `${redisKeys_1.default.BEACH_BAR_CACHE_KEY}:${this.product.beachBarId}:${redisKeys_1.default.RESERVED_PRODUCT_CACHE_KEY}`;
    }
    getPrice() {
        return __awaiter(this, void 0, void 0, function* () {
            const entryFee = yield this.payment.cart.getBeachBarEntryFee(this.product.beachBarId);
            if (entryFee === undefined) {
                return undefined;
            }
            const productTotal = yield this.payment.cart.getProductTotalPrice(this.productId);
            if (productTotal === undefined) {
                return undefined;
            }
            return productTotal + entryFee;
        });
    }
    getRedisIdx(redis) {
        return __awaiter(this, void 0, void 0, function* () {
            const reservedProducts = yield redis.lrange(this.getRedisKey(), 0, -1);
            const idx = reservedProducts.findIndex((x) => JSON.parse(x).id === this.id);
            return idx;
        });
    }
    updateRedis(redis, create = false) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reservedProduct = yield ReservedProduct_1.findOne({
                    where: { id: this.id },
                    relations: ["product", "product.beachBar", "product.category", "product.components", "time", "payment"],
                });
                if (!reservedProduct) {
                    throw new Error();
                }
                if (create) {
                    yield redis.lpush(this.getRedisKey(), JSON.stringify(this));
                }
                else {
                    const idx = yield reservedProduct.getRedisIdx(redis);
                    yield redis.lset(reservedProduct.getRedisKey(), idx, JSON.stringify(reservedProduct));
                }
                yield reservedProduct.product.beachBar.updateRedis();
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    customSoftRemove(redis, daysDiff) {
        return __awaiter(this, void 0, void 0, function* () {
            if (daysDiff) {
                this.isRefunded = true;
                yield this.save();
            }
            try {
                const idx = yield this.getRedisIdx(redis);
                yield redis.lset(this.getRedisKey(), idx, "");
                yield redis.lrem(this.getRedisKey(), 0, "");
            }
            catch (err) {
                throw new Error(err.message);
            }
            yield softRemove_1.softRemove(ReservedProduct_1, { id: this.id });
            yield this.product.beachBar.updateRedis();
        });
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: "bigint" }),
    __metadata("design:type", typeof BigInt === "function" ? BigInt : Object)
], ReservedProduct.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "product_id" }),
    __metadata("design:type", Number)
], ReservedProduct.prototype, "productId", void 0);
__decorate([
    typeorm_1.Column({ type: "bigint", name: "payment_id" }),
    __metadata("design:type", typeof BigInt === "function" ? BigInt : Object)
], ReservedProduct.prototype, "paymentId", void 0);
__decorate([
    typeorm_1.Column({ type: "date", name: "date" }),
    __metadata("design:type", dayjs_1.Dayjs)
], ReservedProduct.prototype, "date", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "time_id" }),
    __metadata("design:type", Number)
], ReservedProduct.prototype, "timeId", void 0);
__decorate([
    typeorm_1.Column({ type: "boolean", name: "is_refunded", default: () => false }),
    __metadata("design:type", Boolean)
], ReservedProduct.prototype, "isRefunded", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Product_1.Product, product => product.reservedProducts, { nullable: false }),
    typeorm_1.JoinColumn({ name: "product_id" }),
    __metadata("design:type", Product_1.Product)
], ReservedProduct.prototype, "product", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Payment_1.Payment, payment => payment.reservedProducts, { nullable: false }),
    typeorm_1.JoinColumn({ name: "payment_id" }),
    __metadata("design:type", Payment_1.Payment)
], ReservedProduct.prototype, "payment", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Time_1.HourTime, hourTime => hourTime.reservedProductTimes, { nullable: false }),
    typeorm_1.JoinColumn({ name: "time_id" }),
    __metadata("design:type", Time_1.HourTime)
], ReservedProduct.prototype, "time", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ type: "timestamptz", name: "updated_at", default: () => `NOW()` }),
    __metadata("design:type", dayjs_1.Dayjs)
], ReservedProduct.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` }),
    __metadata("design:type", dayjs_1.Dayjs)
], ReservedProduct.prototype, "timestamp", void 0);
__decorate([
    typeorm_1.DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true }),
    __metadata("design:type", dayjs_1.Dayjs)
], ReservedProduct.prototype, "deletedAt", void 0);
__decorate([
    typeorm_1.AfterInsert(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReservedProduct.prototype, "updateAlsoInRedis", null);
ReservedProduct = ReservedProduct_1 = __decorate([
    typeorm_1.Entity({ name: "reserved_product", schema: "public" })
], ReservedProduct);
exports.ReservedProduct = ReservedProduct;
