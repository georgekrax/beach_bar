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
exports.CardBrand = void 0;
const typeorm_1 = require("typeorm");
const Card_1 = require("./Card");
let CardBrand = class CardBrand extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], CardBrand.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 35, name: "name", unique: true }),
    __metadata("design:type", String)
], CardBrand.prototype, "name", void 0);
__decorate([
    typeorm_1.OneToMany(() => Card_1.Card, card => card.brand, { nullable: true }),
    __metadata("design:type", Array)
], CardBrand.prototype, "cards", void 0);
CardBrand = __decorate([
    typeorm_1.Entity({ name: "card_brand", schema: "public" })
], CardBrand);
exports.CardBrand = CardBrand;
