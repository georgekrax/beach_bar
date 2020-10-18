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
var Owner_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Owner = void 0;
const dayjs_1 = require("dayjs");
const typeorm_1 = require("typeorm");
const softRemove_1 = require("utils/softRemove");
const BeachBarOwner_1 = require("./BeachBarOwner");
const ProductPriceHistory_1 = require("./ProductPriceHistory");
const User_1 = require("./User");
let Owner = Owner_1 = class Owner extends typeorm_1.BaseEntity {
    softRemove() {
        return __awaiter(this, void 0, void 0, function* () {
            const findOptions = { ownerId: this.id };
            yield softRemove_1.softRemove(Owner_1, { id: this.id }, [BeachBarOwner_1.BeachBarOwner], findOptions);
        });
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Owner.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "user_id" }),
    __metadata("design:type", Number)
], Owner.prototype, "userId", void 0);
__decorate([
    typeorm_1.OneToOne(() => User_1.User, user => user.owner, { nullable: false, cascade: ["soft-remove", "recover"] }),
    typeorm_1.JoinColumn({ name: "user_id" }),
    __metadata("design:type", User_1.User)
], Owner.prototype, "user", void 0);
__decorate([
    typeorm_1.OneToMany(() => BeachBarOwner_1.BeachBarOwner, beachBarOwner => beachBarOwner.owner),
    __metadata("design:type", Array)
], Owner.prototype, "beachBars", void 0);
__decorate([
    typeorm_1.OneToMany(() => ProductPriceHistory_1.ProductPriceHistory, productPriceHistory => productPriceHistory.owner),
    __metadata("design:type", Array)
], Owner.prototype, "priceHistory", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ type: "timestamptz", name: "updated_at", default: () => `NOW()` }),
    __metadata("design:type", dayjs_1.Dayjs)
], Owner.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` }),
    __metadata("design:type", dayjs_1.Dayjs)
], Owner.prototype, "timestamp", void 0);
__decorate([
    typeorm_1.DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true }),
    __metadata("design:type", dayjs_1.Dayjs)
], Owner.prototype, "deletedAt", void 0);
Owner = Owner_1 = __decorate([
    typeorm_1.Entity({ name: "owner", schema: "public" })
], Owner);
exports.Owner = Owner;
//# sourceMappingURL=Owner.js.map