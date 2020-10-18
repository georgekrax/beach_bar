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
const _index_1 = require("constants/_index");
const dayjs_1 = require("dayjs");
const typeorm_1 = require("typeorm");
const softRemove_1 = require("utils/softRemove");
const BeachBar_1 = require("./BeachBar");
const Customer_1 = require("./Customer");
const Payment_1 = require("./Payment");
const ReviewAnswer_1 = require("./ReviewAnswer");
const ReviewVisitType_1 = require("./ReviewVisitType");
const Time_1 = require("./Time");
let BeachBarReview = BeachBarReview_1 = class BeachBarReview extends typeorm_1.BaseEntity {
    update(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ratingValue, visitTypeId, monthTimeId, positiveComment, negativeComment, review } = options;
            try {
                if (ratingValue && ratingValue !== this.ratingValue && ratingValue >= 1 && ratingValue <= 10) {
                    this.ratingValue = ratingValue;
                }
                if (visitTypeId && visitTypeId !== this.visitTypeId) {
                    const visitType = yield ReviewVisitType_1.ReviewVisitType.findOne(visitTypeId);
                    if (!visitType) {
                        throw new Error();
                    }
                    this.visitType = visitType;
                }
                if (monthTimeId && monthTimeId !== this.monthTimeId) {
                    const monthTime = yield Time_1.MonthTime.findOne(monthTimeId);
                    if (!monthTime) {
                        throw new Error();
                    }
                    this.monthTime = monthTime;
                }
                if (positiveComment && positiveComment !== this.positiveComment) {
                    this.positiveComment = positiveComment;
                }
                if (negativeComment && negativeComment !== this.negativeComment) {
                    this.negativeComment = negativeComment;
                }
                if (review && review !== this.review) {
                    this.review = review;
                }
                yield this.save();
                yield this.beachBar.updateRedis();
                return this;
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    vote(upvote, downvote) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (upvote) {
                    this.upvotes = this.upvotes + 1;
                    yield this.save();
                }
                else if (downvote) {
                    this.downvotes = this.downvotes + 1;
                    yield this.save();
                }
                yield this.beachBar.updateRedis();
                return this;
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
            yield this.beachBar.updateRedis();
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
    typeorm_1.Column({ type: "integer", name: "upvotes", default: () => 0 }),
    __metadata("design:type", Number)
], BeachBarReview.prototype, "upvotes", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "downvotes", default: () => 0 }),
    __metadata("design:type", Number)
], BeachBarReview.prototype, "downvotes", void 0);
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
    __metadata("design:type", ReviewVisitType_1.ReviewVisitType)
], BeachBarReview.prototype, "visitType", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Time_1.MonthTime, monthTime => monthTime.reviews, { nullable: true }),
    typeorm_1.JoinColumn({ name: "month_time_id" }),
    __metadata("design:type", Time_1.MonthTime)
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
//# sourceMappingURL=BeachBarReview.js.map