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
var BeachBarReview_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeachBarReview = void 0;
const common_1 = require("@beach_bar/common");
const _index_1 = require("constants/_index");
const dayjs_1 = require("dayjs");
const typeorm_1 = require("typeorm");
const softRemove_1 = require("utils/softRemove");
const BeachBar_1 = require("./BeachBar");
const Customer_1 = require("./Customer");
const Payment_1 = require("./Payment");
const ReviewAnswer_1 = require("./ReviewAnswer");
const ReviewVisitType_1 = require("./ReviewVisitType");
const ReviewVote_1 = require("./ReviewVote");
const ReviewVoteType_1 = require("./ReviewVoteType");
const Time_1 = require("./Time");
const User_1 = require("./User");
let BeachBarReview = BeachBarReview_1 = class BeachBarReview extends typeorm_1.BaseEntity {
    update(options) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const { ratingValue, visitTypeId, monthTimeId, positiveComment, negativeComment, review } = options;
            try {
                if (ratingValue && ratingValue !== this.ratingValue && ratingValue >= 1 && ratingValue <= _index_1.beachBarReviewRatingMaxValue)
                    this.ratingValue = ratingValue;
                if (visitTypeId && visitTypeId !== ((_a = this.visitTypeId) === null || _a === void 0 ? void 0 : _a.toString())) {
                    if (visitTypeId.toLowerCase() === "none")
                        this.visitType = null;
                    else {
                        const visitType = yield ReviewVisitType_1.ReviewVisitType.findOne(visitTypeId);
                        if (!visitType)
                            throw new Error();
                        this.visitType = visitType;
                    }
                }
                if (monthTimeId && monthTimeId !== ((_b = this.monthTimeId) === null || _b === void 0 ? void 0 : _b.toString())) {
                    if (monthTimeId.toLowerCase() === "none")
                        this.monthTime = null;
                    else {
                        const monthTime = yield Time_1.MonthTime.findOne(monthTimeId);
                        if (!monthTime)
                            throw new Error();
                        this.monthTime = monthTime;
                    }
                }
                if (positiveComment && positiveComment !== this.positiveComment)
                    this.positiveComment = positiveComment;
                if (negativeComment && negativeComment !== this.negativeComment)
                    this.negativeComment = negativeComment;
                if (review && review !== this.review)
                    this.review = review;
                yield this.save();
                return this;
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    vote(userId, upvote, downvote) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findOne({ where: { id: userId }, relations: ["reviewVotes"] });
            if (!user)
                throw new Error(common_1.errors.USER_NOT_FOUND_MESSAGE);
            const userVoteForThisReview = yield ReviewVote_1.ReviewVote.findOne({
                where: { reviewId: this.id, userId },
                relations: ["review", "type", "user"],
            });
            try {
                if (!userVoteForThisReview)
                    yield ReviewVote_1.ReviewVote.create({
                        typeId: upvote ? 1 : 2,
                        userId,
                        review: this,
                    }).save();
                else if ((userVoteForThisReview.typeId.toString() === "1" && upvote) ||
                    (userVoteForThisReview.typeId.toString() === "2" && downvote))
                    yield userVoteForThisReview.softRemove();
                else if (upvote || downvote) {
                    const type = yield ReviewVoteType_1.ReviewVoteType.findOne({ where: { value: upvote ? "upvote" : "downvote" } });
                    if (type) {
                        userVoteForThisReview.type = type;
                        yield userVoteForThisReview.save();
                    }
                }
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    softRemove() {
        return __awaiter(this, void 0, void 0, function* () {
            const findOptions = { reviewId: this.id };
            yield softRemove_1.softRemove(BeachBarReview_1, { id: this.id }, [ReviewAnswer_1.ReviewAnswer], findOptions);
        });
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: "bigint" }),
    __metadata("design:type", typeof BigInt === "function" ? BigInt : Object)
], BeachBarReview.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "beach_bar_id" }),
    __metadata("design:type", Number)
], BeachBarReview.prototype, "beachBarId", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "customer_id" }),
    __metadata("design:type", Number)
], BeachBarReview.prototype, "customerId", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "payment_id" }),
    __metadata("design:type", Number)
], BeachBarReview.prototype, "paymentId", void 0);
__decorate([
    typeorm_1.Column({ type: "smallint", name: "rating_value" }),
    __metadata("design:type", Number)
], BeachBarReview.prototype, "ratingValue", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "visit_type_id", nullable: true }),
    __metadata("design:type", Number)
], BeachBarReview.prototype, "visitTypeId", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "month_time_id", nullable: true }),
    __metadata("design:type", Number)
], BeachBarReview.prototype, "monthTimeId", void 0);
__decorate([
    typeorm_1.Column({ type: "text", name: "positive_comment", nullable: true }),
    __metadata("design:type", String)
], BeachBarReview.prototype, "positiveComment", void 0);
__decorate([
    typeorm_1.Column({ type: "text", name: "negative_comment", nullable: true }),
    __metadata("design:type", String)
], BeachBarReview.prototype, "negativeComment", void 0);
__decorate([
    typeorm_1.Column({ type: "text", name: "review", nullable: true }),
    __metadata("design:type", String)
], BeachBarReview.prototype, "review", void 0);
__decorate([
    typeorm_1.OneToMany(() => ReviewVote_1.ReviewVote, vote => vote.review, { nullable: false, cascade: ["soft-remove", "recover"] }),
    __metadata("design:type", Array)
], BeachBarReview.prototype, "votes", void 0);
__decorate([
    typeorm_1.ManyToOne(() => BeachBar_1.BeachBar, beachBar => beachBar.reviews, { nullable: false, cascade: ["soft-remove", "recover"] }),
    typeorm_1.JoinColumn({ name: "beach_bar_id" }),
    __metadata("design:type", BeachBar_1.BeachBar)
], BeachBarReview.prototype, "beachBar", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Customer_1.Customer, customer => customer.reviews, { nullable: false, cascade: ["soft-remove", "recover"] }),
    typeorm_1.JoinColumn({ name: "customer_id" }),
    __metadata("design:type", Customer_1.Customer)
], BeachBarReview.prototype, "customer", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Payment_1.Payment, payment => payment.reviews, { nullable: false, cascade: ["soft-remove", "recover"] }),
    typeorm_1.JoinColumn({ name: "payment_id" }),
    __metadata("design:type", Payment_1.Payment)
], BeachBarReview.prototype, "payment", void 0);
__decorate([
    typeorm_1.ManyToOne(() => ReviewVisitType_1.ReviewVisitType, reviewVisitType => reviewVisitType.reviews, { nullable: true }),
    typeorm_1.JoinColumn({ name: "visit_type_id" }),
    __metadata("design:type", Object)
], BeachBarReview.prototype, "visitType", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Time_1.MonthTime, monthTime => monthTime.reviews, { nullable: true }),
    typeorm_1.JoinColumn({ name: "month_time_id" }),
    __metadata("design:type", Object)
], BeachBarReview.prototype, "monthTime", void 0);
__decorate([
    typeorm_1.OneToOne(() => ReviewAnswer_1.ReviewAnswer, reviewAnswer => reviewAnswer.review),
    __metadata("design:type", ReviewAnswer_1.ReviewAnswer)
], BeachBarReview.prototype, "answer", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ type: "timestamptz", name: "updated_at", default: () => `NOW()` }),
    __metadata("design:type", dayjs_1.Dayjs)
], BeachBarReview.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` }),
    __metadata("design:type", dayjs_1.Dayjs)
], BeachBarReview.prototype, "timestamp", void 0);
__decorate([
    typeorm_1.DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true }),
    __metadata("design:type", dayjs_1.Dayjs)
], BeachBarReview.prototype, "deletedAt", void 0);
BeachBarReview = BeachBarReview_1 = __decorate([
    typeorm_1.Entity({ name: "beach_bar_review", schema: "public" }),
    typeorm_1.Check(`"ratingValue" >= 0 AND "ratingValue" <= ${_index_1.beachBarReviewRatingMaxValue}`)
], BeachBarReview);
exports.BeachBarReview = BeachBarReview;
