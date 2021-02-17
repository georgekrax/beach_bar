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
var BeachBarRestaurant_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeachBarRestaurant = void 0;
const dayjs_1 = require("dayjs");
const typeorm_1 = require("typeorm");
const softRemove_1 = require("utils/softRemove");
const BeachBar_1 = require("./BeachBar");
const RestaurantFoodItem_1 = require("./RestaurantFoodItem");
let BeachBarRestaurant = BeachBarRestaurant_1 = class BeachBarRestaurant extends typeorm_1.BaseEntity {
    update(name, description, isActive) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (name && name !== this.name && name.trim().length !== 0) {
                    this.name = name;
                }
                if (description && description !== this.description && description.trim().length !== 0) {
                    this.description = description;
                }
                if (isActive !== null && isActive !== undefined && isActive !== this.isActive) {
                    this.isActive = isActive;
                }
                yield this.save();
                yield this.beachBar.updateRedis();
                return this;
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    softRemove() {
        return __awaiter(this, void 0, void 0, function* () {
            const findOptions = { restaurantId: this.id };
            yield softRemove_1.softRemove(BeachBarRestaurant_1, { id: this.id }, [RestaurantFoodItem_1.RestaurantFoodItem], findOptions);
            yield this.beachBar.updateRedis();
        });
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], BeachBarRestaurant.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 255, name: "name" }),
    __metadata("design:type", String)
], BeachBarRestaurant.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ type: "text", name: "description", nullable: true }),
    __metadata("design:type", String)
], BeachBarRestaurant.prototype, "description", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "beach_bar_id" }),
    __metadata("design:type", Number)
], BeachBarRestaurant.prototype, "beachBarId", void 0);
__decorate([
    typeorm_1.Column({ type: "boolean", name: "is_active", default: () => false }),
    __metadata("design:type", Boolean)
], BeachBarRestaurant.prototype, "isActive", void 0);
__decorate([
    typeorm_1.ManyToOne(() => BeachBar_1.BeachBar, beachBar => beachBar.restaurants, { nullable: false, cascade: ["soft-remove", "recover"] }),
    typeorm_1.JoinColumn({ name: "beach_bar_id" }),
    __metadata("design:type", BeachBar_1.BeachBar)
], BeachBarRestaurant.prototype, "beachBar", void 0);
__decorate([
    typeorm_1.OneToMany(() => RestaurantFoodItem_1.RestaurantFoodItem, restaurantFoodItem => restaurantFoodItem.restaurant),
    __metadata("design:type", Array)
], BeachBarRestaurant.prototype, "foodItems", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ type: "timestamptz", name: "updated_at", default: () => `NOW()` }),
    __metadata("design:type", dayjs_1.Dayjs)
], BeachBarRestaurant.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` }),
    __metadata("design:type", dayjs_1.Dayjs)
], BeachBarRestaurant.prototype, "timestamp", void 0);
__decorate([
    typeorm_1.DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true }),
    __metadata("design:type", dayjs_1.Dayjs)
], BeachBarRestaurant.prototype, "deletedAt", void 0);
BeachBarRestaurant = BeachBarRestaurant_1 = __decorate([
    typeorm_1.Entity({ name: "beach_bar_restaurant", schema: "public" })
], BeachBarRestaurant);
exports.BeachBarRestaurant = BeachBarRestaurant;
