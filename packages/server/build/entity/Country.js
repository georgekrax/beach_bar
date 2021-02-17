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
exports.Country = void 0;
const typeorm_1 = require("typeorm");
const Account_1 = require("./Account");
const BeachBarLocation_1 = require("./BeachBarLocation");
const Card_1 = require("./Card");
const City_1 = require("./City");
const Currency_1 = require("./Currency");
const Customer_1 = require("./Customer");
const LoginDetails_1 = require("./LoginDetails");
const Region_1 = require("./Region");
const SearchInputValue_1 = require("./SearchInputValue");
const UserContactDetails_1 = require("./UserContactDetails");
let Country = class Country extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Country.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 100, name: "name", unique: true }),
    __metadata("design:type", String)
], Country.prototype, "name", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 100, name: "short_name", unique: true, nullable: true }),
    __metadata("design:type", String)
], Country.prototype, "shortName", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 10, name: "calling_code", unique: true }),
    __metadata("design:type", String)
], Country.prototype, "callingCode", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 2, name: "iso_code", unique: true }),
    __metadata("design:type", String)
], Country.prototype, "isoCode", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 3, name: "alpha_3_code", unique: true }),
    __metadata("design:type", String)
], Country.prototype, "alpha3Code", void 0);
__decorate([
    typeorm_1.Column({ type: "boolean", name: "is_eu" }),
    __metadata("design:type", Boolean)
], Country.prototype, "isEu", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 5, name: "language_identifier", unique: false }),
    __metadata("design:type", String)
], Country.prototype, "languageIdentifier", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "currency_id" }),
    __metadata("design:type", Number)
], Country.prototype, "currencyId", void 0);
__decorate([
    typeorm_1.Column({ type: "text", name: "flag_28x20", unique: true }),
    __metadata("design:type", String)
], Country.prototype, "flag28x20", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Currency_1.Currency, currency => currency.countries, { nullable: false }),
    typeorm_1.JoinColumn({ name: "currency_id" }),
    __metadata("design:type", Currency_1.Currency)
], Country.prototype, "currency", void 0);
__decorate([
    typeorm_1.OneToMany(() => City_1.City, city => city.country),
    __metadata("design:type", Array)
], Country.prototype, "cities", void 0);
__decorate([
    typeorm_1.OneToMany(() => Account_1.Account, account => account.country),
    __metadata("design:type", Array)
], Country.prototype, "accounts", void 0);
__decorate([
    typeorm_1.OneToMany(() => UserContactDetails_1.UserContactDetails, userContactDetails => userContactDetails.country),
    __metadata("design:type", Array)
], Country.prototype, "userContactDetails", void 0);
__decorate([
    typeorm_1.OneToMany(() => Region_1.Region, region => region.country),
    __metadata("design:type", Array)
], Country.prototype, "regions", void 0);
__decorate([
    typeorm_1.OneToMany(() => BeachBarLocation_1.BeachBarLocation, beachBarLocation => beachBarLocation.country),
    __metadata("design:type", Array)
], Country.prototype, "beachBarLocations", void 0);
__decorate([
    typeorm_1.OneToMany(() => Card_1.Card, card => card.country, { nullable: true }),
    __metadata("design:type", Array)
], Country.prototype, "cards", void 0);
__decorate([
    typeorm_1.OneToMany(() => Customer_1.Customer, customer => customer.country, { nullable: true }),
    __metadata("design:type", Array)
], Country.prototype, "customers", void 0);
__decorate([
    typeorm_1.OneToMany(() => SearchInputValue_1.SearchInputValue, searchInputValue => searchInputValue.country, { nullable: true }),
    __metadata("design:type", Array)
], Country.prototype, "searchInputValues", void 0);
__decorate([
    typeorm_1.OneToMany(() => LoginDetails_1.LoginDetails, loginDetails => loginDetails.country, { nullable: true }),
    __metadata("design:type", Array)
], Country.prototype, "loginDetails", void 0);
Country = __decorate([
    typeorm_1.Entity({ name: "country", schema: "public" })
], Country);
exports.Country = Country;
