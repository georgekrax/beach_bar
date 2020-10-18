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
var BeachBarFeature_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeachBarFeature = void 0;
const dayjs_1 = require("dayjs");
const typeorm_1 = require("typeorm");
const softRemove_1 = require("utils/softRemove");
const BeachBar_1 = require("./BeachBar");
const BeachBarService_1 = require("./BeachBarService");
let BeachBarFeature = BeachBarFeature_1 = class BeachBarFeature extends typeorm_1.BaseEntity {
    customSoftRemove(featureId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield softRemove_1.softRemove(BeachBarFeature_1, { beachBarId: this.beachBarId, serviceId: featureId });
            yield this.beachBar.updateRedis();
        });
    }
};
__decorate([
    typeorm_1.PrimaryColumn({ type: "integer", name: "beach_bar_id" }),
    __metadata("design:type", Number)
], BeachBarFeature.prototype, "beachBarId", void 0);
__decorate([
    typeorm_1.PrimaryColumn({ type: "integer", name: "service_id" }),
    __metadata("design:type", Number)
], BeachBarFeature.prototype, "serviceId", void 0);
__decorate([
    typeorm_1.Column({ type: "smallint", name: "quantity", default: () => 1 }),
    __metadata("design:type", Number)
], BeachBarFeature.prototype, "quantity", void 0);
__decorate([
    typeorm_1.Column({ type: "text", name: "description", nullable: true }),
    __metadata("design:type", String)
], BeachBarFeature.prototype, "description", void 0);
__decorate([
    typeorm_1.ManyToOne(() => BeachBar_1.BeachBar, beachBar => beachBar.features, { nullable: false, cascade: ["soft-remove", "recover"] }),
    typeorm_1.JoinColumn({ name: "beach_bar_id" }),
    __metadata("design:type", BeachBar_1.BeachBar)
], BeachBarFeature.prototype, "beachBar", void 0);
__decorate([
    typeorm_1.ManyToOne(() => BeachBarService_1.BeachBarService, beachBarService => beachBarService.beachBars, { nullable: false }),
    typeorm_1.JoinColumn({ name: "service_id" }),
    __metadata("design:type", BeachBarService_1.BeachBarService)
], BeachBarFeature.prototype, "service", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ type: "timestamptz", name: "updated_at", default: () => `NOW()` }),
    __metadata("design:type", dayjs_1.Dayjs)
], BeachBarFeature.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` }),
    __metadata("design:type", dayjs_1.Dayjs)
], BeachBarFeature.prototype, "timestamp", void 0);
__decorate([
    typeorm_1.DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true }),
    __metadata("design:type", dayjs_1.Dayjs)
], BeachBarFeature.prototype, "deletedAt", void 0);
BeachBarFeature = BeachBarFeature_1 = __decorate([
    typeorm_1.Entity({ name: "beach_bar_feature", schema: "public" })
], BeachBarFeature);
exports.BeachBarFeature = BeachBarFeature;
//# sourceMappingURL=BeachBarFeature.js.map