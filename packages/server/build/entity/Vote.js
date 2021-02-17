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
exports.Vote = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const VotingFeedback_1 = require("./VotingFeedback");
const dayjs_1 = require("dayjs");
let Vote = class Vote extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: "bigint" }),
    __metadata("design:type", typeof BigInt === "function" ? BigInt : Object)
], Vote.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "feedback_id" }),
    __metadata("design:type", Number)
], Vote.prototype, "feedbackId", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "user_id", nullable: true }),
    __metadata("design:type", Number)
], Vote.prototype, "userId", void 0);
__decorate([
    typeorm_1.Column({ type: "char", name: "rating" }),
    __metadata("design:type", String)
], Vote.prototype, "rating", void 0);
__decorate([
    typeorm_1.ManyToOne(() => VotingFeedback_1.VotingFeedback, votingFeedback => votingFeedback.votes, { nullable: false }),
    typeorm_1.JoinColumn({ name: "feedback_id" }),
    __metadata("design:type", VotingFeedback_1.VotingFeedback)
], Vote.prototype, "feedback", void 0);
__decorate([
    typeorm_1.ManyToOne(() => User_1.User, user => user.votes, { nullable: true }),
    typeorm_1.JoinColumn({ name: "user_id" }),
    __metadata("design:type", User_1.User)
], Vote.prototype, "user", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` }),
    __metadata("design:type", dayjs_1.Dayjs)
], Vote.prototype, "timestamp", void 0);
Vote = __decorate([
    typeorm_1.Entity({ name: "vote", schema: "public" }),
    typeorm_1.Check(`"rating" IN ('y', 'n')`)
], Vote);
exports.Vote = Vote;
