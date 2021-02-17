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
exports.ProductPriceHistory = void 0;
const typeorm_1 = require("typeorm");
const Owner_1 = require("./Owner");
const Product_1 = require("./Product");
const dayjs_1 = require("dayjs");
let ProductPriceHistory = class ProductPriceHistory extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], ProductPriceHistory.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "product_id" }),
    __metadata("design:type", Number)
], ProductPriceHistory.prototype, "productId", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "owner_id" }),
    __metadata("design:type", Number)
], ProductPriceHistory.prototype, "ownerId", void 0);
__decorate([
    typeorm_1.Column({ type: "decimal", precision: 5, scale: 2, name: "diff_amount" }),
    __metadata("design:type", Number)
], ProductPriceHistory.prototype, "diffAmount", void 0);
__decorate([
    typeorm_1.Column({ type: "decimal", precision: 5, scale: 2, name: "new_price" }),
    __metadata("design:type", Number)
], ProductPriceHistory.prototype, "newPrice", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Product_1.Product, product => product.priceHistory, { nullable: false }),
    typeorm_1.JoinColumn({ name: "product_id" }),
    __metadata("design:type", Product_1.Product)
], ProductPriceHistory.prototype, "product", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Owner_1.Owner, owner => owner.priceHistory, { nullable: false }),
    typeorm_1.JoinColumn({ name: "owner_id" }),
    __metadata("design:type", Owner_1.Owner)
], ProductPriceHistory.prototype, "owner", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ name: "timestamp", type: "timestamptz", default: () => `NOW()` }),
    __metadata("design:type", dayjs_1.Dayjs)
], ProductPriceHistory.prototype, "timestamp", void 0);
ProductPriceHistory = __decorate([
    typeorm_1.Entity({ name: "product_price_history", schema: "public" })
], ProductPriceHistory);
exports.ProductPriceHistory = ProductPriceHistory;
