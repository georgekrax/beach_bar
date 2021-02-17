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
exports.UserHistory = void 0;
const dayjs_1 = require("dayjs");
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const UserHistoryActivity_1 = require("./UserHistoryActivity");
let UserHistory = class UserHistory extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: "bigint" }),
    __metadata("design:type", typeof BigInt === "function" ? BigInt : Object)
], UserHistory.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "activity_id" }),
    __metadata("design:type", Number)
], UserHistory.prototype, "activityId", void 0);
__decorate([
    typeorm_1.Column({ type: "bigint", name: "object_id", nullable: true }),
    __metadata("design:type", typeof BigInt === "function" ? BigInt : Object)
], UserHistory.prototype, "objectId", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "user_id", nullable: true }),
    __metadata("design:type", Number)
], UserHistory.prototype, "userId", void 0);
__decorate([
    typeorm_1.Column({ type: "cidr", name: "ip_addr", nullable: true }),
    __metadata("design:type", String)
], UserHistory.prototype, "ipAddr", void 0);
__decorate([
    typeorm_1.ManyToOne(() => UserHistoryActivity_1.UserHistoryActivity, userHistoryActivity => userHistoryActivity.userHistories, { nullable: false }),
    typeorm_1.JoinColumn({ name: "activity_id" }),
    __metadata("design:type", UserHistoryActivity_1.UserHistoryActivity)
], UserHistory.prototype, "activity", void 0);
__decorate([
    typeorm_1.ManyToOne(() => User_1.User, user => user.history, { nullable: true }),
    typeorm_1.JoinColumn({ name: "user_id" }),
    __metadata("design:type", User_1.User)
], UserHistory.prototype, "user", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => "NOW()" }),
    __metadata("design:type", dayjs_1.Dayjs)
], UserHistory.prototype, "timestamp", void 0);
UserHistory = __decorate([
    typeorm_1.Entity({ name: "user_history", schema: "public" })
], UserHistory);
exports.UserHistory = UserHistory;
