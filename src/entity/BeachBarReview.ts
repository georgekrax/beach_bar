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
import { ReviewAnswer } from "./ReviewAnswer";
import { ReviewVisitType } from "./ReviewVisitType";
import { User } from "./User";

@Entity({ name: "beach_bar_review", schema: "public" })
export class BeachBarReview extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: bigint;

  @Column({ type: "integer", name: "beach_bar_id" })
  beachBarId: number;

  @Column({ type: "integer", name: "user_id" })
  userId: number;

  @Column({ type: "smallint", name: "rating_value" })
  @Check(`"ratingValue" >= 0 AND "ratingValue" <= 10`)
  ratingValue: number;

  @Column({ type: "integer", name: "visit_type_id", nullable: true })
  visitTypeId: number;

  @Column({ type: "date", name: "visit_time", nullable: true })
  visitTime: Date;

  @Column({ type: "integer", name: "upvotes", nullable: true })
  upvotes: number;

  @Column({ type: "integer", name: "downvotes", nullable: true })
  downvotes: number;

  @Column({ type: "text", name: "nice_comment", nullable: true })
  niceComment: string;

  @Column({ type: "text", name: "bad_comment", nullable: true })
  badComment: string;

  @UpdateDateColumn({ type: "timestamptz", name: "updated_at", default: () => `NOW()` })
  updatedAt: Date;

  @CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` })
  timestamp: Date;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt: Date;

  @ManyToOne(() => BeachBar, beachBar => beachBar.reviews, { nullable: false, eager: true })
  @JoinColumn({ name: "beach_bar_id" })
  beachBar: BeachBar;

  @ManyToOne(() => User, user => user.reviews, { nullable: false, eager: true })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => ReviewVisitType, reviewVisitType => reviewVisitType.reviews)
  @JoinColumn({ name: "visit_type_id" })
  visitType: ReviewVisitType;

  @OneToOne(() => ReviewAnswer, reviewAnswer => reviewAnswer.review, { eager: true })
  answer: ReviewAnswer;
}
