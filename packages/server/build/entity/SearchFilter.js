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
exports.SearchFilter = void 0;
const typeorm_1 = require("typeorm");
const SearchFilterCategory_1 = require("./SearchFilterCategory");
const UserSearch_1 = require("./UserSearch");
let SearchFilter = class SearchFilter extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], SearchFilter.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 3, name: "public_id", unique: true }),
    __metadata("design:type", String)
], SearchFilter.prototype, "publicId", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 255, name: "name", unique: true }),
    __metadata("design:type", String)
], SearchFilter.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ type: "text", name: "description", nullable: true }),
    __metadata("design:type", String)
], SearchFilter.prototype, "description", void 0);
__decorate([
    typeorm_1.ManyToMany(() => SearchFilterCategory_1.SearchFilterCategory, searchFilterCategory => searchFilterCategory.filters, { nullable: false }),
    typeorm_1.JoinTable({
        name: "search_filter_section",
        joinColumn: {
            name: "filter_id",
            referencedColumnName: "id",
        },
        inverseJoinColumn: {
            name: "category_id",
            referencedColumnName: "id",
        },
    }),
    __metadata("design:type", Array)
], SearchFilter.prototype, "categories", void 0);
__decorate([
    typeorm_1.ManyToMany(() => UserSearch_1.UserSearch, userSearch => userSearch.filters, { nullable: true }),
    __metadata("design:type", Array)
], SearchFilter.prototype, "userSearches", void 0);
SearchFilter = __decorate([
    typeorm_1.Entity({ name: "search_filter", schema: "public" })
], SearchFilter);
exports.SearchFilter = SearchFilter;
