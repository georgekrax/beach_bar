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
var SearchInputValue_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchInputValue = void 0;
const dayjs_1 = require("dayjs");
const typeorm_1 = require("typeorm");
const softRemove_1 = require("utils/softRemove");
const BeachBar_1 = require("./BeachBar");
const City_1 = require("./City");
const Country_1 = require("./Country");
const Region_1 = require("./Region");
const UserSearch_1 = require("./UserSearch");
let SearchInputValue = SearchInputValue_1 = class SearchInputValue extends typeorm_1.BaseEntity {
    format() {
        let formattedString = "";
        if (this.beachBar) {
            formattedString = this.beachBar.name;
            return formattedString;
        }
        else {
            if (this.country) {
                if (this.country.shortName && this.country.shortName.trim().length > 0) {
                    formattedString = this.country.shortName;
                }
                else {
                    formattedString = this.country.name;
                }
            }
            if (this.city) {
                formattedString = this.city.name;
                if (this.city.secondName && this.city.secondName.trim().length > 0) {
                    formattedString.concat(`(${this.city.secondName})`);
                }
                if (this.country) {
                    formattedString = formattedString.concat(`, ${this.country.name}`);
                }
            }
            if (this.region) {
                formattedString = this.region.name;
                if (this.city && this.country) {
                    formattedString = formattedString.concat(`, ${this.city.name}`).concat(`, ${this.country.name}`);
                }
                else if (this.city) {
                    formattedString = formattedString.concat(`, ${this.city.name}`);
                }
                else if (this.country) {
                    formattedString = formattedString.concat(`, ${this.country.name}`);
                }
            }
        }
        return formattedString;
    }
    softRemove() {
        return __awaiter(this, void 0, void 0, function* () {
            yield softRemove_1.softRemove(SearchInputValue_1, { id: this.id });
        });
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: "bigint" }),
    __metadata("design:type", typeof BigInt === "function" ? BigInt : Object)
], SearchInputValue.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 5, name: "public_id", unique: true }),
    __metadata("design:type", String)
], SearchInputValue.prototype, "publicId", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "country_id", nullable: true }),
    __metadata("design:type", Number)
], SearchInputValue.prototype, "countryId", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "city_id", nullable: true }),
    __metadata("design:type", typeof BigInt === "function" ? BigInt : Object)
], SearchInputValue.prototype, "cityId", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "region_id", nullable: true }),
    __metadata("design:type", Number)
], SearchInputValue.prototype, "regionId", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "beach_bar_id", nullable: true }),
    __metadata("design:type", Number)
], SearchInputValue.prototype, "beachBarId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Country_1.Country, country => country.searchInputValues, { nullable: true }),
    typeorm_1.JoinColumn({ name: "country_id" }),
    __metadata("design:type", Country_1.Country)
], SearchInputValue.prototype, "country", void 0);
__decorate([
    typeorm_1.ManyToOne(() => City_1.City, city => city.searchInputValues, { nullable: true }),
    typeorm_1.JoinColumn({ name: "city_id" }),
    __metadata("design:type", City_1.City)
], SearchInputValue.prototype, "city", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Region_1.Region, region => region.searchInputValues, { nullable: true }),
    typeorm_1.JoinColumn({ name: "region_id" }),
    __metadata("design:type", Region_1.Region)
], SearchInputValue.prototype, "region", void 0);
__decorate([
    typeorm_1.ManyToOne(() => BeachBar_1.BeachBar, beachBar => beachBar.searchInputValues, { nullable: true }),
    typeorm_1.JoinColumn({ name: "beach_bar_id" }),
    __metadata("design:type", BeachBar_1.BeachBar)
], SearchInputValue.prototype, "beachBar", void 0);
__decorate([
    typeorm_1.OneToMany(() => UserSearch_1.UserSearch, userSearch => userSearch.inputValue, { nullable: true }),
    __metadata("design:type", Array)
], SearchInputValue.prototype, "searches", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ name: "updated_at", type: "timestamptz", default: () => `NOW()` }),
    __metadata("design:type", dayjs_1.Dayjs)
], SearchInputValue.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ name: "timestamp", type: "timestamptz", default: () => `NOW()` }),
    __metadata("design:type", dayjs_1.Dayjs)
], SearchInputValue.prototype, "timestamp", void 0);
__decorate([
    typeorm_1.DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true }),
    __metadata("design:type", dayjs_1.Dayjs)
], SearchInputValue.prototype, "deletedAt", void 0);
SearchInputValue = SearchInputValue_1 = __decorate([
    typeorm_1.Entity({ name: "search_input_value", schema: "public" })
], SearchInputValue);
exports.SearchInputValue = SearchInputValue;
