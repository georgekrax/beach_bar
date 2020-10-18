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
var CartProduct_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartProduct = void 0;
const dayjs_1 = require("dayjs");
const typeorm_1 = require("typeorm");
const softRemove_1 = require("utils/softRemove");
const Cart_1 = require("./Cart");
const Product_1 = require("./Product");
const Time_1 = require("./Time");
let CartProduct = CartProduct_1 = class CartProduct extends typeorm_1.BaseEntity {
    softRemove() {
        return __awaiter(this, void 0, void 0, function* () {
            yield softRemove_1.softRemove(CartProduct_1, { cartId: this.cartId, productId: this.productId });
        });
    }
};
__decorate([
    typeorm_1.PrimaryColumn({ type: "bigint", name: "cart_id" }),
    __metadata("design:type", typeof BigInt === "function" ? BigInt : Object)
], CartProduct.prototype, "cartId", void 0);
__decorate([
    typeorm_1.PrimaryColumn({ type: "integer", name: "product_id" }),
    __metadata("design:type", Number)
], CartProduct.prototype, "productId", void 0);
__decorate([
    typeorm_1.Column({ type: "smallint", name: "quantity", default: () => 1 }),
    __metadata("design:type", Number)
], CartProduct.prototype, "quantity", void 0);
__decorate([
    typeorm_1.Column({ type: "date", name: "date", default: () => `CURRENT_DATE` }),
    __metadata("design:type", dayjs_1.Dayjs)
], CartProduct.prototype, "date", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "time_id" }),
    __metadata("design:type", Number)
], CartProduct.prototype, "timeId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Cart_1.Cart, cart => cart.products, { nullable: false, cascade: ["soft-remove", "recover"] }),
    typeorm_1.JoinColumn({ name: "cart_id" }),
    __metadata("design:type", Cart_1.Cart)
], CartProduct.prototype, "cart", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Product_1.Product, product => product.carts, { nullable: false, cascade: ["soft-remove", "recover"] }),
    typeorm_1.JoinColumn({ name: "product_id" }),
    __metadata("design:type", Product_1.Product)
], CartProduct.prototype, "product", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Time_1.HourTime, hourTime => hourTime.cartProductTimes, { nullable: false }),
    typeorm_1.JoinColumn({ name: "time_id" }),
    __metadata("design:type", Time_1.HourTime)
], CartProduct.prototype, "time", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ name: "updated_at", type: "timestamptz", default: () => `NOW()` }),
    __metadata("design:type", dayjs_1.Dayjs)
], CartProduct.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ name: "timestamp", type: "timestamptz", default: () => `NOW()` }),
    __metadata("design:type", dayjs_1.Dayjs)
], CartProduct.prototype, "timestamp", void 0);
__decorate([
    typeorm_1.DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true }),
    __metadata("design:type", dayjs_1.Dayjs)
], CartProduct.prototype, "deletedAt", void 0);
CartProduct = CartProduct_1 = __decorate([
    typeorm_1.Entity({ name: "cart_product", schema: "public" }),
    typeorm_1.Check(`"quantity" >= 0 AND "quantity" <= 20`)
], CartProduct);
exports.CartProduct = CartProduct;
//# sourceMappingURL=CartProduct.js.map