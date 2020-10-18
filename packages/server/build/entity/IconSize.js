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
exports.IconSize = void 0;
const typeorm_1 = require("typeorm");
const CountryFlagIcon_1 = require("./CountryFlagIcon");
let IconSize = class IconSize extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], IconSize.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ type: "smallint", name: "value", unique: true }),
    __metadata("design:type", Number)
], IconSize.prototype, "value", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 25, name: "formatted_value", unique: true }),
    __metadata("design:type", String)
], IconSize.prototype, "formattedValue", void 0);
__decorate([
    typeorm_1.OneToMany(() => CountryFlagIcon_1.CountryFlagIcon, countryFlagIcon => countryFlagIcon.size, { nullable: true }),
    __metadata("design:type", Array)
], IconSize.prototype, "flagIcons", void 0);
IconSize = __decorate([
    typeorm_1.Entity({ name: "icon_size", schema: "public" })
], IconSize);
exports.IconSize = IconSize;
//# sourceMappingURL=IconSize.js.map