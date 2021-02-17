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
exports.BeachBarService = void 0;
const typeorm_1 = require("typeorm");
const BeachBarFeature_1 = require("./BeachBarFeature");
let BeachBarService = class BeachBarService extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], BeachBarService.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 255, unique: true, name: "name" }),
    __metadata("design:type", String)
], BeachBarService.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ type: "text", name: "icon_url" }),
    __metadata("design:type", String)
], BeachBarService.prototype, "iconUrl", void 0);
__decorate([
    typeorm_1.Column({ type: "text", name: "colored_icon_url", nullable: true }),
    __metadata("design:type", String)
], BeachBarService.prototype, "coloredIconUrl", void 0);
__decorate([
    typeorm_1.OneToMany(() => BeachBarFeature_1.BeachBarFeature, beachBarFeature => beachBarFeature.service, { nullable: true }),
    __metadata("design:type", Array)
], BeachBarService.prototype, "beachBars", void 0);
BeachBarService = __decorate([
    typeorm_1.Entity({ name: "beach_bar_service", schema: "public" })
], BeachBarService);
exports.BeachBarService = BeachBarService;
