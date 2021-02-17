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
exports.Region = void 0;
const typeorm_1 = require("typeorm");
const BeachBarLocation_1 = require("./BeachBarLocation");
const City_1 = require("./City");
const Country_1 = require("./Country");
const SearchInputValue_1 = require("./SearchInputValue");
let Region = class Region extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: "bigint" }),
    __metadata("design:type", typeof BigInt === "function" ? BigInt : Object)
], Region.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 100, name: "name" }),
    __metadata("design:type", String)
], Region.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "country_id" }),
    __metadata("design:type", Number)
], Region.prototype, "countryId", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "city_id", nullable: true }),
    __metadata("design:type", typeof BigInt === "function" ? BigInt : Object)
], Region.prototype, "cityId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Country_1.Country, country => country.regions, { nullable: false }),
    typeorm_1.JoinColumn({ name: "country_id" }),
    __metadata("design:type", Country_1.Country)
], Region.prototype, "country", void 0);
__decorate([
    typeorm_1.ManyToOne(() => City_1.City, city => city.regions, { nullable: true }),
    typeorm_1.JoinColumn({ name: "city_id" }),
    __metadata("design:type", City_1.City)
], Region.prototype, "city", void 0);
__decorate([
    typeorm_1.OneToMany(() => BeachBarLocation_1.BeachBarLocation, beachBarLocation => beachBarLocation.region),
    __metadata("design:type", Array)
], Region.prototype, "beachBarLocations", void 0);
__decorate([
    typeorm_1.OneToMany(() => SearchInputValue_1.SearchInputValue, searchInputValue => searchInputValue.region, { nullable: true }),
    __metadata("design:type", Array)
], Region.prototype, "searchInputValues", void 0);
Region = __decorate([
    typeorm_1.Entity({ name: "region", schema: "public" })
], Region);
exports.Region = Region;
