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
exports.ProductCategory = void 0;
const typeorm_1 = require("typeorm");
const Product_1 = require("./Product");
const ProductComponent_1 = require("./ProductComponent");
let ProductCategory = class ProductCategory extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], ProductCategory.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 50, name: "name", unique: true }),
    __metadata("design:type", String)
], ProductCategory.prototype, "name", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 50, name: "underscored_name", unique: true }),
    __metadata("design:type", String)
], ProductCategory.prototype, "underscoredName", void 0);
__decorate([
    typeorm_1.Column({ type: "boolean", name: "zero_price" }),
    __metadata("design:type", Boolean)
], ProductCategory.prototype, "zeroPrice", void 0);
__decorate([
    typeorm_1.Column({ type: "boolean", name: "whitelist" }),
    __metadata("design:type", Boolean)
], ProductCategory.prototype, "whitelist", void 0);
__decorate([
    typeorm_1.Column({ type: "text", name: "description", nullable: true }),
    __metadata("design:type", String)
], ProductCategory.prototype, "description", void 0);
__decorate([
    typeorm_1.ManyToMany(() => ProductComponent_1.ProductComponent, productComponent => productComponent.productCategories, { nullable: false }),
    typeorm_1.JoinTable({
        name: "product_category_component",
        joinColumn: {
            name: "category_id",
            referencedColumnName: "id",
        },
        inverseJoinColumn: {
            name: "component_id",
            referencedColumnName: "id",
        },
    }),
    __metadata("design:type", Array)
], ProductCategory.prototype, "productComponents", void 0);
__decorate([
    typeorm_1.OneToMany(() => Product_1.Product, product => product.category),
    __metadata("design:type", Array)
], ProductCategory.prototype, "products", void 0);
ProductCategory = __decorate([
    typeorm_1.Entity({ name: "product_category", schema: "public" })
], ProductCategory);
exports.ProductCategory = ProductCategory;
//# sourceMappingURL=ProductCategory.js.map