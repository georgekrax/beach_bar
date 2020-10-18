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
exports.VotingResult = void 0;
const typeorm_1 = require("typeorm");
const VotingFeedback_1 = require("./VotingFeedback");
let VotingResult = class VotingResult extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], VotingResult.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "feedback_id", unique: true }),
    __metadata("design:type", Number)
], VotingResult.prototype, "feedbackId", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "upvotes", default: () => 0 }),
    __metadata("design:type", Number)
], VotingResult.prototype, "upvotes", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "downvotes", default: () => 0 }),
    __metadata("design:type", Number)
], VotingResult.prototype, "downvotes", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "total_votes", nullable: true }),
    __metadata("design:type", Number)
], VotingResult.prototype, "totalVotes", void 0);
__decorate([
    typeorm_1.OneToOne(() => VotingFeedback_1.VotingFeedback, votingFeedback => votingFeedback.votingResult, {
        nullable: false,
        cascade: ["soft-remove", "recover"],
    }),
    typeorm_1.JoinColumn({ name: "category_id" }),
    __metadata("design:type", VotingFeedback_1.VotingFeedback)
], VotingResult.prototype, "feedback", void 0);
VotingResult = __decorate([
    typeorm_1.Entity({ name: "voting_result", schema: "public" })
], VotingResult);
exports.VotingResult = VotingResult;
//# sourceMappingURL=VotingResult.js.map