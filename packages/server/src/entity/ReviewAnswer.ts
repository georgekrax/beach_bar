import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { softRemove } from "../utils/softRemove";
import { BeachBarReview } from "./BeachBarReview";

@Entity({ name: "review_answer", schema: "public" })
export class ReviewAnswer extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: bigint;

  @Column({ type: "bigint", name: "review_id", unique: true })
  reviewId: bigint;

  @Column({ type: "text", name: "body" })
  body: string;

  @OneToOne(() => BeachBarReview, beachBarReview => beachBarReview.answer, { nullable: false, cascade: ["soft-remove", "recover"] })
  @JoinColumn({ name: "review_id" })
  review: BeachBarReview;

  @UpdateDateColumn({ type: "timestamptz", name: "updated_at", default: () => `NOW()` })
  updatedAt: Date;

  @CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` })
  timestamp: Date;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt?: Date;

  async softRemove(): Promise<any> {
    await softRemove(ReviewAnswer, { id: this.id });
  }
}
