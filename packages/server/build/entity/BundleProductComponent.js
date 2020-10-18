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
exports.BundleProductComponent = void 0;
const dayjs_1 = require("dayjs");
const typeorm_1 = require("typeorm");
const Product_1 = require("./Product");
const ProductComponent_1 = require("./ProductComponent");
let BundleProductComponent = class BundleProductComponent extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryColumn({ type: "integer", name: "product_id" }),
    __metadata("design:type", Number)
], BundleProductComponent.prototype, "productId", void 0);
__decorate([
    typeorm_1.PrimaryColumn({ type: "integer", name: "component_id" }),
    __metadata("design:type", Number)
], BundleProductComponent.prototype, "componentId", void 0);
__decorate([
    typeorm_1.Column({ type: "smallint", name: "quantity", default: () => 1 }),
    __metadata("design:type", Number)
], BundleProductComponent.prototype, "quantity", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Product_1.Product, product => product.components, { nullable: false }),
    typeorm_1.JoinColumn({ name: "product_id" }),
    __metadata("design:type", Product_1.Product)
], BundleProductComponent.prototype, "product", void 0);
__decorate([
    typeorm_1.ManyToOne(() => ProductComponent_1.ProductComponent, productComponent => productComponent.products, { nullable: false }),
    typeorm_1.JoinColumn({ name: "component_id" }),
    __metadata("design:type", ProductComponent_1.ProductComponent)
], BundleProductComponent.prototype, "component", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ name: "timestamp", type: "timestamptz", default: () => `NOW()` }),
    __metadata("design:type", dayjs_1.Dayjs)
], BundleProductComponent.prototype, "timestamp", void 0);
__decorate([
    typeorm_1.DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true, primary: true }),
    __metadata("design:type", dayjs_1.Dayjs)
], BundleProductComponent.prototype, "deletedAt", void 0);
BundleProductComponent = __decorate([
    typeorm_1.Entity({ name: "bundle_product_component", schema: "public" })
], BundleProductComponent);
exports.BundleProductComponent = BundleProductComponent;
//# sourceMappingURL=BundleProductComponent.js.map