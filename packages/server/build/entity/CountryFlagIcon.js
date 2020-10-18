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
exports.CountryFlagIcon = void 0;
const typeorm_1 = require("typeorm");
const Country_1 = require("./Country");
const IconSize_1 = require("./IconSize");
let CountryFlagIcon = class CountryFlagIcon extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], CountryFlagIcon.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ type: "text", name: "url_value" }),
    __metadata("design:type", String)
], CountryFlagIcon.prototype, "urlValue", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "size_id" }),
    __metadata("design:type", Number)
], CountryFlagIcon.prototype, "sizeId", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "country_id", nullable: false }),
    __metadata("design:type", Number)
], CountryFlagIcon.prototype, "countryId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => IconSize_1.IconSize, iconSize => iconSize.flagIcons, { nullable: false }),
    typeorm_1.JoinColumn({ name: "size_id" }),
    __metadata("design:type", IconSize_1.IconSize)
], CountryFlagIcon.prototype, "size", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Country_1.Country, country => country.flagIcons, { nullable: false }),
    typeorm_1.JoinColumn({ name: "country_id" }),
    __metadata("design:type", Country_1.Country)
], CountryFlagIcon.prototype, "country", void 0);
CountryFlagIcon = __decorate([
    typeorm_1.Entity({ name: "country_flag_icon", schema: "public" }),
    typeorm_1.Unique("country_flag_icon_unique", ["sizeId", "countryId"])
], CountryFlagIcon);
exports.CountryFlagIcon = CountryFlagIcon;
//# sourceMappingURL=CountryFlagIcon.js.map