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
exports.BeachBarCategory = void 0;
const typeorm_1 = require("typeorm");
const BeachBar_1 = require("./BeachBar");
let BeachBarCategory = class BeachBarCategory extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], BeachBarCategory.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 255, name: "name", unique: true }),
    __metadata("design:type", String)
], BeachBarCategory.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ type: "text", name: "description", nullable: true }),
    __metadata("design:type", String)
], BeachBarCategory.prototype, "description", void 0);
__decorate([
    typeorm_1.OneToMany(() => BeachBar_1.BeachBar, beachBar => beachBar.category, { nullable: true }),
    __metadata("design:type", Array)
], BeachBarCategory.prototype, "beachBars", void 0);
BeachBarCategory = __decorate([
    typeorm_1.Entity({ name: "beach_bar_category", schema: "public" })
], BeachBarCategory);
exports.BeachBarCategory = BeachBarCategory;
