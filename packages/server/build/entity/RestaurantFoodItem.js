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
var RestaurantFoodItem_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantFoodItem = void 0;
const dayjs_1 = require("dayjs");
const typeorm_1 = require("typeorm");
const checkScopes_1 = require("utils/checkScopes");
const softRemove_1 = require("utils/softRemove");
const BeachBarRestaurant_1 = require("./BeachBarRestaurant");
const RestaurantMenuCategory_1 = require("./RestaurantMenuCategory");
let RestaurantFoodItem = RestaurantFoodItem_1 = class RestaurantFoodItem extends typeorm_1.BaseEntity {
    update(payload, name, price, menuCategoryId, imgUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (name && name !== this.name && name.trim().length !== 0) {
                    this.name = name;
                }
                if (price && price !== this.price) {
                    if (checkScopes_1.checkScopes(payload, ["beach_bar@update:restaurant_food_item"])) {
                        throw new Error("You are not allowed to modify the price of the food item product");
                    }
                    this.price = price;
                }
                if (menuCategoryId && menuCategoryId !== this.menuCategoryId) {
                    const menuCategory = yield RestaurantMenuCategory_1.RestaurantMenuCategory.findOne(menuCategoryId);
                    if (!menuCategory) {
                        throw new Error("Please provide a valid menu category");
                    }
                    this.menuCategory = menuCategory;
                }
                if (imgUrl && imgUrl !== this.imgUrl) {
                    this.imgUrl = imgUrl.toString();
                }
                yield this.save();
                yield this.restaurant.beachBar.updateRedis();
                return this;
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    softRemove() {
        return __awaiter(this, void 0, void 0, function* () {
            yield softRemove_1.softRemove(RestaurantFoodItem_1, { id: this.id });
            yield this.restaurant.beachBar.updateRedis();
        });
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: "bigint" }),
    __metadata("design:type", typeof BigInt === "function" ? BigInt : Object)
], RestaurantFoodItem.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 255, name: "name" }),
    __metadata("design:type", String)
], RestaurantFoodItem.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ type: "decimal", precision: 7, scale: 2, name: "price" }),
    __metadata("design:type", Number)
], RestaurantFoodItem.prototype, "price", void 0);
__decorate([
    typeorm_1.Column({ type: "text", name: "img_url", nullable: true }),
    __metadata("design:type", String)
], RestaurantFoodItem.prototype, "imgUrl", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "menu_category_id" }),
    __metadata("design:type", Number)
], RestaurantFoodItem.prototype, "menuCategoryId", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "restaurant_id" }),
    __metadata("design:type", Number)
], RestaurantFoodItem.prototype, "restaurantId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => BeachBarRestaurant_1.BeachBarRestaurant, beachBarRestaurant => beachBarRestaurant.foodItems, {
        nullable: false,
        cascade: ["soft-remove", "recover"],
    }),
    typeorm_1.JoinColumn({ name: "restaurant_id" }),
    __metadata("design:type", BeachBarRestaurant_1.BeachBarRestaurant)
], RestaurantFoodItem.prototype, "restaurant", void 0);
__decorate([
    typeorm_1.ManyToOne(() => RestaurantMenuCategory_1.RestaurantMenuCategory, restaurantMenuCategory => restaurantMenuCategory.foodItems, {
        nullable: false,
    }),
    typeorm_1.JoinColumn({ name: "menu_category_id" }),
    __metadata("design:type", RestaurantMenuCategory_1.RestaurantMenuCategory)
], RestaurantFoodItem.prototype, "menuCategory", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ type: "timestamptz", name: "updated_at", default: () => `NOW()` }),
    __metadata("design:type", dayjs_1.Dayjs)
], RestaurantFoodItem.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` }),
    __metadata("design:type", dayjs_1.Dayjs)
], RestaurantFoodItem.prototype, "timestamp", void 0);
__decorate([
    typeorm_1.DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true }),
    __metadata("design:type", dayjs_1.Dayjs)
], RestaurantFoodItem.prototype, "deletedAt", void 0);
RestaurantFoodItem = RestaurantFoodItem_1 = __decorate([
    typeorm_1.Entity({ name: "restaurant_food_item", schema: "public" })
], RestaurantFoodItem);
exports.RestaurantFoodItem = RestaurantFoodItem;
//# sourceMappingURL=RestaurantFoodItem.js.map