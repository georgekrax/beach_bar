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
exports.RestaurantMenuCategory = void 0;
const typeorm_1 = require("typeorm");
const RestaurantFoodItem_1 = require("./RestaurantFoodItem");
let RestaurantMenuCategory = class RestaurantMenuCategory extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], RestaurantMenuCategory.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 255, name: "name" }),
    __metadata("design:type", String)
], RestaurantMenuCategory.prototype, "name", void 0);
__decorate([
    typeorm_1.OneToMany(() => RestaurantFoodItem_1.RestaurantFoodItem, restaurantFoodItem => restaurantFoodItem.menuCategory),
    __metadata("design:type", Array)
], RestaurantMenuCategory.prototype, "foodItems", void 0);
RestaurantMenuCategory = __decorate([
    typeorm_1.Entity({ name: "restaurant_menu_category", schema: "public" })
], RestaurantMenuCategory);
exports.RestaurantMenuCategory = RestaurantMenuCategory;
