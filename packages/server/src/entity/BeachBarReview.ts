import { errors } from "@beach_bar/common";
import { beachBarReviewRatingMaxValue } from "constants/_index";
import { Dayjs } from "dayjs";
import {
  BaseEntity,
  Check,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { softRemove } from "utils/softRemove";
import { BeachBar } from "./BeachBar";
import { Customer } from "./Customer";
import { Payment } from "./Payment";
import { ReviewAnswer } from "./ReviewAnswer";
import { ReviewVisitType } from "./ReviewVisitType";
import { ReviewVote } from "./ReviewVote";
import { ReviewVoteType } from "./ReviewVoteType";
import { MonthTime } from "./Time";
import { User } from "./User";

@Entity({ name: "beach_bar_review", schema: "public" })
@Check(`"ratingValue" >= 0 AND "ratingValue" <= ${beachBarReviewRatingMaxValue}`)
export class BeachBarReview extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: bigint;

  @Column({ type: "integer", name: "beach_bar_id" })
  beachBarId: number;

  @Column({ type: "integer", name: "customer_id" })
  customerId: number;

  @Column({ type: "integer", name: "payment_id" })
  paymentId: number;

  @Column({ type: "smallint", name: "rating_value" })
  ratingValue: number;

  @Column({ type: "integer", name: "visit_type_id", nullable: true })
  visitTypeId?: number;

  @Column({ type: "integer", name: "month_time_id", nullable: true })
  monthTimeId?: number;

  @Column({ type: "text", name: "positive_comment", nullable: true })
  positiveComment?: string;

  @Column({ type: "text", name: "negative_comment", nullable: true })
  negativeComment?: string;

  @Column({ type: "text", name: "review", nullable: true })
  review?: string;

  @OneToMany(() => ReviewVote, vote => vote.review, { nullable: false, cascade: ["soft-remove", "recover"] })
  votes: ReviewVote[];

  @ManyToOne(() => BeachBar, beachBar => beachBar.reviews, { nullable: false, cascade: ["soft-remove", "recover"] })
  @JoinColumn({ name: "beach_bar_id" })
  beachBar: BeachBar;

  @ManyToOne(() => Customer, customer => customer.reviews, { nullable: false, cascade: ["soft-remove", "recover"] })
  @JoinColumn({ name: "customer_id" })
  customer: Customer;

  @ManyToOne(() => Payment, payment => payment.reviews, { nullable: false, cascade: ["soft-remove", "recover"] })
  @JoinColumn({ name: "payment_id" })
  payment: Payment;

  @ManyToOne(() => ReviewVisitType, reviewVisitType => reviewVisitType.reviews, { nullable: true })
  @JoinColumn({ name: "visit_type_id" })
  visitType?: ReviewVisitType | null;

  @ManyToOne(() => MonthTime, monthTime => monthTime.reviews, { nullable: true })
  @JoinColumn({ name: "month_time_id" })
  month?: MonthTime | null;

  @OneToOne(() => ReviewAnswer, reviewAnswer => reviewAnswer.review, { nullable: true })
  answer?: ReviewAnswer;

  @UpdateDateColumn({ type: "timestamptz", name: "updated_at", default: () => `NOW()` })
  updatedAt: Dayjs;

  @CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` })
  timestamp: Dayjs;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt: Dayjs;

  async update(options: {
    ratingValue?: number;
    visitTypeId?: string;
    monthTimeId?: string;
    positiveComment?: string;
    negativeComment?: string;
    review?: string;
  }): Promise<BeachBarReview> {
    const { ratingValue, visitTypeId, monthTimeId, positiveComment, negativeComment, review } = options;
    try {
      if (ratingValue && ratingValue !== this.ratingValue && ratingValue >= 1 && ratingValue <= beachBarReviewRatingMaxValue)
        this.ratingValue = ratingValue;
      if (visitTypeId && visitTypeId !== this.visitTypeId?.toString()) {
        if (visitTypeId.toLowerCase() === "none") this.visitType = null;
        else {
          const visitType = await ReviewVisitType.findOne(visitTypeId);
          if (!visitType) throw new Error();
          this.visitType = visitType;
        }
      }
      if (monthTimeId && monthTimeId !== this.monthTimeId?.toString()) {
        if (monthTimeId.toLowerCase() === "none") this.month = null;
        else {
          const monthTime = await MonthTime.findOne(monthTimeId);
          if (!monthTime) throw new Error();
          this.month = monthTime;
        }
      }
      if (positiveComment && positiveComment !== this.positiveComment) this.positiveComment = positiveComment;
      if (negativeComment && negativeComment !== this.negativeComment) this.negativeComment = negativeComment;
      if (review && review !== this.review) this.review = review;
      await this.save();
      await this.beachBar.updateRedis();
      return this;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async vote(userId: number, upvote?: boolean, downvote?: boolean): Promise<void> {
    const user = await User.findOne({ where: { id: userId }, relations: ["reviewVotes"] });
    if (!user) throw new Error(errors.USER_NOT_FOUND_MESSAGE);
    const userVoteForThisReview = await ReviewVote.findOne({
      where: { reviewId: this.id, userId },
      relations: ["review", "type", "user"],
    });

    try {
      if (!userVoteForThisReview)
        await ReviewVote.create({
          typeId: upvote ? 1 : 2,
          userId,
          review: this,
        }).save();
      else if (
        (userVoteForThisReview.typeId.toString() === "1" && upvote) ||
        (userVoteForThisReview.typeId.toString() === "2" && downvote)
      )
        await userVoteForThisReview.softRemove();
      else if (upvote || downvote) {
        const type = await ReviewVoteType.findOne({ where: { value: upvote ? "upvote" : "downvote" } });
        if (type) {
          userVoteForThisReview.type = type;
          await userVoteForThisReview.save();
        }
      }
      await this.beachBar.updateRedis();
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async softRemove(): Promise<any> {
    const findOptions: any = { reviewId: this.id };
    await softRemove(BeachBarReview, { id: this.id }, [ReviewAnswer], findOptions);
    await this.beachBar.updateRedis();
  }
}
