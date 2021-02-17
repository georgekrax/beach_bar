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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSearch = void 0;
const redisKeys_1 = __importDefault(require("constants/redisKeys"));
const dayjs_1 = require("dayjs");
const typeorm_1 = require("typeorm");
const SearchFilter_1 = require("./SearchFilter");
const SearchInputValue_1 = require("./SearchInputValue");
const User_1 = require("./User");
let UserSearch = class UserSearch extends typeorm_1.BaseEntity {
    getRedisKey(userId) {
        if (userId !== undefined) {
            return `${redisKeys_1.default.USER}:${userId}:${redisKeys_1.default.USER_SEARCH}`;
        }
        else {
            return redisKeys_1.default.USER_SEARCH;
        }
    }
    getRedisIdx(redis, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userSearches = yield redis.lrange(this.getRedisKey(userId), 0, -1);
            const idx = userSearches.findIndex((x) => JSON.parse(x).id === this.id);
            return idx;
        });
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: "bigint" }),
    __metadata("design:type", typeof BigInt === "function" ? BigInt : Object)
], UserSearch.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ type: "date", name: "search_date", nullable: true }),
    __metadata("design:type", dayjs_1.Dayjs)
], UserSearch.prototype, "searchDate", void 0);
__decorate([
    typeorm_1.Column({ type: "smallint", name: "search_adults", nullable: true }),
    __metadata("design:type", Number)
], UserSearch.prototype, "searchAdults", void 0);
__decorate([
    typeorm_1.Column({ type: "smallint", name: "search_children", nullable: true }),
    __metadata("design:type", Number)
], UserSearch.prototype, "searchChildren", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "user_id", nullable: true }),
    __metadata("design:type", Number)
], UserSearch.prototype, "userId", void 0);
__decorate([
    typeorm_1.Column({ type: "bigint", name: "input_value_id" }),
    __metadata("design:type", typeof BigInt === "function" ? BigInt : Object)
], UserSearch.prototype, "inputValueId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => User_1.User, user => user.searches, { nullable: true, cascade: ["soft-remove", "recover"] }),
    typeorm_1.JoinColumn({ name: "user_id" }),
    __metadata("design:type", User_1.User)
], UserSearch.prototype, "user", void 0);
__decorate([
    typeorm_1.ManyToOne(() => SearchInputValue_1.SearchInputValue, searchInputValue => searchInputValue.searches, { nullable: false }),
    typeorm_1.JoinColumn({ name: "input_value_id" }),
    __metadata("design:type", SearchInputValue_1.SearchInputValue)
], UserSearch.prototype, "inputValue", void 0);
__decorate([
    typeorm_1.ManyToMany(() => SearchFilter_1.SearchFilter, searchFilter => searchFilter.userSearches, { nullable: true }),
    typeorm_1.JoinTable({
        name: "user_search_filter",
        joinColumn: {
            name: "search_id",
            referencedColumnName: "id",
        },
        inverseJoinColumn: {
            name: "filter_id",
            referencedColumnName: "id",
        },
    }),
    __metadata("design:type", Array)
], UserSearch.prototype, "filters", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ type: "timestamptz", name: "updated_at", default: () => `NOW()` }),
    __metadata("design:type", dayjs_1.Dayjs)
], UserSearch.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` }),
    __metadata("design:type", dayjs_1.Dayjs)
], UserSearch.prototype, "timestamp", void 0);
UserSearch = __decorate([
    typeorm_1.Entity({ name: "user_search", schema: "public" }),
    typeorm_1.Check(`"searchAdults" <= 12`),
    typeorm_1.Check(`"searchChildren" <= 8`)
], UserSearch);
exports.UserSearch = UserSearch;
