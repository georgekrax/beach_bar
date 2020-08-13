import { softRemove } from "@utils/softRemove";
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
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { BeachBar } from "./BeachBar";
import { Customer } from "./Customer";
import { Payment } from "./Payment";
import { ReviewAnswer } from "./ReviewAnswer";
import { ReviewVisitType } from "./ReviewVisitType";
import { MonthTime } from "./Time";

@Entity({ name: "beach_bar_review", schema: "public" })
@Check(`"ratingValue" >= 0 AND "ratingValue" <= 10`)
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

  @Column({ type: "integer", name: "upvotes", default: () => 0 })
  upvotes: number;

  @Column({ type: "integer", name: "downvotes", default: () => 0 })
  downvotes: number;

  @Column({ type: "text", name: "positive_comment", nullable: true })
  positiveComment?: string;

  @Column({ type: "text", name: "negative_comment", nullable: true })
  negativeComment?: string;

  @Column({ type: "text", name: "review", nullable: true })
  review?: string;

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
  visitType?: ReviewVisitType;

  @ManyToOne(() => MonthTime, monthTime => monthTime.reviews, { nullable: true })
  @JoinColumn({ name: "month_time_id" })
  monthTime?: MonthTime;

  @OneToOne(() => ReviewAnswer, reviewAnswer => reviewAnswer.review)
  answer: ReviewAnswer;

  @UpdateDateColumn({ type: "timestamptz", name: "updated_at", default: () => `NOW()` })
  updatedAt: Dayjs;

  @CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` })
  timestamp: Dayjs;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt: Dayjs;

  async update(options: {
    ratingValue?: number;
    visitTypeId?: number;
    monthTimeId?: number;
    positiveComment?: string;
    negativeComment?: string;
    review?: string;
  }): Promise<BeachBarReview | any> {
    const { ratingValue, visitTypeId, monthTimeId, positiveComment, negativeComment, review } = options;
    try {
      if (ratingValue && ratingValue !== this.ratingValue && ratingValue >= 1 && ratingValue <= 10) {
        this.ratingValue = ratingValue;
      }
      if (visitTypeId && visitTypeId !== this.visitTypeId) {
        const visitType = await ReviewVisitType.findOne(visitTypeId);
        if (!visitType) {
          throw new Error();
        }
        this.visitType = visitType;
      }
      if (monthTimeId && monthTimeId !== this.monthTimeId) {
        const monthTime = await MonthTime.findOne(monthTimeId);
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
      await this.save();
      await this.beachBar.updateRedis();
      return this;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async vote(upvote?: boolean, downvote?: boolean): Promise<BeachBarReview | any> {
    try {
      if (upvote) {
        this.upvotes = this.upvotes + 1;
        await this.save();
      } else if (downvote) {
        this.downvotes = this.downvotes + 1;
        await this.save();
      }
      await this.beachBar.updateRedis();
      return this;
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
