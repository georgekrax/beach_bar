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
exports.UserHistoryActivity = void 0;
const dayjs_1 = require("dayjs");
const typeorm_1 = require("typeorm");
const UserHistory_1 = require("./UserHistory");
let UserHistoryActivity = class UserHistoryActivity extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: "integer" }),
    __metadata("design:type", Number)
], UserHistoryActivity.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 255, name: "name", unique: true }),
    __metadata("design:type", String)
], UserHistoryActivity.prototype, "name", void 0);
__decorate([
    typeorm_1.OneToMany(() => UserHistory_1.UserHistory, userHistory => userHistory.activity, { nullable: true }),
    __metadata("design:type", Array)
], UserHistoryActivity.prototype, "userHistories", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ name: "timestamp", type: "timestamptz", default: () => `NOW()` }),
    __metadata("design:type", dayjs_1.Dayjs)
], UserHistoryActivity.prototype, "timestamp", void 0);
UserHistoryActivity = __decorate([
    typeorm_1.Entity({ name: "user_history_activity", schema: "public" })
], UserHistoryActivity);
exports.UserHistoryActivity = UserHistoryActivity;
