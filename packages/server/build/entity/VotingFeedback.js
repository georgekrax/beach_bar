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
exports.VotingFeedback = void 0;
const typeorm_1 = require("typeorm");
const Vote_1 = require("./Vote");
const VotingResult_1 = require("./VotingResult");
const dayjs_1 = require("dayjs");
let VotingFeedback = class VotingFeedback extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], VotingFeedback.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 255, name: "title" }),
    __metadata("design:type", String)
], VotingFeedback.prototype, "title", void 0);
__decorate([
    typeorm_1.Column({ type: "text", name: "description" }),
    __metadata("design:type", String)
], VotingFeedback.prototype, "description", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 4, name: "ref_code", unique: true }),
    __metadata("design:type", String)
], VotingFeedback.prototype, "refCode", void 0);
__decorate([
    typeorm_1.OneToOne(() => VotingResult_1.VotingResult, voteTag => voteTag.feedback, { nullable: true }),
    __metadata("design:type", VotingResult_1.VotingResult)
], VotingFeedback.prototype, "votingResult", void 0);
__decorate([
    typeorm_1.OneToMany(() => Vote_1.Vote, vote => vote.feedback, { nullable: true }),
    __metadata("design:type", Array)
], VotingFeedback.prototype, "votes", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` }),
    __metadata("design:type", dayjs_1.Dayjs)
], VotingFeedback.prototype, "timestamp", void 0);
__decorate([
    typeorm_1.DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true }),
    __metadata("design:type", dayjs_1.Dayjs)
], VotingFeedback.prototype, "deletedAt", void 0);
VotingFeedback = __decorate([
    typeorm_1.Entity({ name: "voting_feedback", schema: "public" })
], VotingFeedback);
exports.VotingFeedback = VotingFeedback;
