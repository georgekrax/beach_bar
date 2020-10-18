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
exports.City = void 0;
const typeorm_1 = require("typeorm");
const Account_1 = require("./Account");
const BeachBarLocation_1 = require("./BeachBarLocation");
const Country_1 = require("./Country");
const LoginDetails_1 = require("./LoginDetails");
const Region_1 = require("./Region");
const SearchInputValue_1 = require("./SearchInputValue");
let City = class City extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: "bigint" }),
    __metadata("design:type", typeof BigInt === "function" ? BigInt : Object)
], City.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 100, name: "name", unique: true }),
    __metadata("design:type", String)
], City.prototype, "name", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 100, name: "second_name", unique: true, nullable: true }),
    __metadata("design:type", String)
], City.prototype, "secondName", void 0);
__decorate([
    typeorm_1.Column({ name: "country_id", type: "integer" }),
    __metadata("design:type", Number)
], City.prototype, "countryId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Country_1.Country, country => country.cities, { nullable: false }),
    typeorm_1.JoinColumn({ name: "country_id" }),
    __metadata("design:type", Country_1.Country)
], City.prototype, "country", void 0);
__decorate([
    typeorm_1.OneToMany(() => Account_1.Account, account => account.city, { nullable: true }),
    __metadata("design:type", Array)
], City.prototype, "accounts", void 0);
__decorate([
    typeorm_1.OneToMany(() => Region_1.Region, region => region.city, { nullable: true }),
    __metadata("design:type", Array)
], City.prototype, "regions", void 0);
__decorate([
    typeorm_1.OneToMany(() => BeachBarLocation_1.BeachBarLocation, beachBarLocation => beachBarLocation.city, { nullable: true }),
    __metadata("design:type", Array)
], City.prototype, "beachBarLocations", void 0);
__decorate([
    typeorm_1.OneToMany(() => SearchInputValue_1.SearchInputValue, searchInputValue => searchInputValue.city, { nullable: true }),
    __metadata("design:type", Array)
], City.prototype, "searchInputValues", void 0);
__decorate([
    typeorm_1.OneToMany(() => LoginDetails_1.LoginDetails, loginDetails => loginDetails.city, { nullable: true }),
    __metadata("design:type", Array)
], City.prototype, "loginDetails", void 0);
City = __decorate([
    typeorm_1.Entity({ name: "city", schema: "public" })
], City);
exports.City = City;
//# sourceMappingURL=City.js.map