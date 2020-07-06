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
import { softRemove } from "../utils/softRemove";
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

  @Column({ type: "integer", name: "month_time_id" })
  monthTimeId: number;

  @Column({ type: "integer", name: "upvotes", nullable: true, default: () => 0 })
  upvotes: number;

  @Column({ type: "integer", name: "downvotes", nullable: true, default: () => 0 })
  downvotes: number;

  @Column({ type: "text", name: "nice_comment", nullable: true })
  niceComment?: string;

  @Column({ type: "text", name: "bad_comment", nullable: true })
  badComment?: string;

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

  @ManyToOne(() => MonthTime, monthTime => monthTime.reviews, { nullable: false })
  @JoinColumn({ name: "month_time_id" })
  monthTime: MonthTime;

  @OneToOne(() => ReviewAnswer, reviewAnswer => reviewAnswer.review)
  answer: ReviewAnswer;

  @UpdateDateColumn({ type: "timestamptz", name: "updated_at", default: () => `NOW()` })
  updatedAt: Date;

  @CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` })
  timestamp: Date;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt: Date;

  async softRemove(): Promise<any> {
    const findOptions: any = { reviewId: this.id };
    await softRemove(BeachBarReview, { id: this.id }, [ReviewAnswer], findOptions);
  }
}
