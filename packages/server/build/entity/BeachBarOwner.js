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
var BeachBarOwner_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeachBarOwner = void 0;
const dayjs_1 = require("dayjs");
const typeorm_1 = require("typeorm");
const softRemove_1 = require("utils/softRemove");
const BeachBar_1 = require("./BeachBar");
const Owner_1 = require("./Owner");
let BeachBarOwner = BeachBarOwner_1 = class BeachBarOwner extends typeorm_1.BaseEntity {
    softRemove() {
        return __awaiter(this, void 0, void 0, function* () {
            yield softRemove_1.softRemove(BeachBarOwner_1, { ownerId: this.owner.id, beachBarId: this.beachBar.id });
            yield this.beachBar.updateRedis();
        });
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], BeachBarOwner.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "beach_bar_id" }),
    __metadata("design:type", Number)
], BeachBarOwner.prototype, "beachBarId", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "owner_id" }),
    __metadata("design:type", Number)
], BeachBarOwner.prototype, "ownerId", void 0);
__decorate([
    typeorm_1.Column({ type: "boolean", name: "is_primary", default: () => false }),
    __metadata("design:type", Boolean)
], BeachBarOwner.prototype, "isPrimary", void 0);
__decorate([
    typeorm_1.Column({ type: "boolean", name: "public_info", default: () => true }),
    __metadata("design:type", Boolean)
], BeachBarOwner.prototype, "publicInfo", void 0);
__decorate([
    typeorm_1.ManyToOne(() => BeachBar_1.BeachBar, beachBar => beachBar.owners, { nullable: false, cascade: ["soft-remove", "recover"] }),
    typeorm_1.JoinColumn({ name: "beach_bar_id" }),
    __metadata("design:type", BeachBar_1.BeachBar)
], BeachBarOwner.prototype, "beachBar", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Owner_1.Owner, owner => owner.beachBars, { nullable: false, cascade: ["soft-remove", "recover"] }),
    typeorm_1.JoinColumn({ name: "owner_id" }),
    __metadata("design:type", Owner_1.Owner)
], BeachBarOwner.prototype, "owner", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ type: "timestamptz", name: "updated_at", default: () => `NOW()` }),
    __metadata("design:type", dayjs_1.Dayjs)
], BeachBarOwner.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` }),
    __metadata("design:type", dayjs_1.Dayjs)
], BeachBarOwner.prototype, "timestamp", void 0);
__decorate([
    typeorm_1.DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true }),
    __metadata("design:type", dayjs_1.Dayjs)
], BeachBarOwner.prototype, "deletedAt", void 0);
BeachBarOwner = BeachBarOwner_1 = __decorate([
    typeorm_1.Entity({ name: "beach_bar_owner", schema: "public" })
], BeachBarOwner);
exports.BeachBarOwner = BeachBarOwner;
//# sourceMappingURL=BeachBarOwner.js.map