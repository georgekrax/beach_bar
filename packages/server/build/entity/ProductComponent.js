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
exports.ProductComponent = void 0;
const typeorm_1 = require("typeorm");
const BundleProductComponent_1 = require("./BundleProductComponent");
const ProductCategory_1 = require("./ProductCategory");
let ProductComponent = class ProductComponent extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], ProductComponent.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 50, name: "title", unique: true }),
    __metadata("design:type", String)
], ProductComponent.prototype, "title", void 0);
__decorate([
    typeorm_1.Column({ type: "text", name: "description" }),
    __metadata("design:type", String)
], ProductComponent.prototype, "description", void 0);
__decorate([
    typeorm_1.Column({ type: "text", name: "icon_url" }),
    __metadata("design:type", String)
], ProductComponent.prototype, "iconUrl", void 0);
__decorate([
    typeorm_1.OneToMany(() => BundleProductComponent_1.BundleProductComponent, bundleProductComponent => bundleProductComponent.component),
    __metadata("design:type", Array)
], ProductComponent.prototype, "products", void 0);
__decorate([
    typeorm_1.ManyToMany(() => ProductCategory_1.ProductCategory, productCategory => productCategory.productComponents),
    __metadata("design:type", Array)
], ProductComponent.prototype, "productCategories", void 0);
ProductComponent = __decorate([
    typeorm_1.Entity({ name: "product_component", schema: "public" })
], ProductComponent);
exports.ProductComponent = ProductComponent;
//# sourceMappingURL=ProductComponent.js.map