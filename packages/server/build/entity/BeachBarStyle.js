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
exports.BeachBarStyle = void 0;
const typeorm_1 = require("typeorm");
const BeachBarType_1 = require("./BeachBarType");
let BeachBarStyle = class BeachBarStyle extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], BeachBarStyle.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 255, name: "name", unique: true }),
    __metadata("design:type", String)
], BeachBarStyle.prototype, "name", void 0);
__decorate([
    typeorm_1.OneToMany(() => BeachBarType_1.BeachBarType, beachBarType => beachBarType.style),
    __metadata("design:type", Array)
], BeachBarStyle.prototype, "beachBars", void 0);
BeachBarStyle = __decorate([
    typeorm_1.Entity({ name: "beach_bar_style", schema: "public" })
], BeachBarStyle);
exports.BeachBarStyle = BeachBarStyle;
