import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { OneToOne, JoinColumn } from "typeorm";
import { BeachBarReview } from "./BeachBarReview";

@Entity({ name: "review_answer", schema: "public" })
export class ReviewAnswer extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: bigint;

  @Column({ type: "bigint", name: "review_id", unique: true })
  reviewId: bigint;

  @Column({ type: "text", name: "body" })
  body: string;

  @OneToOne(() => BeachBarReview, beachBarReview => beachBarReview.answer, { nullable: false })
  @JoinColumn({ name: "review_id" })
  review: BeachBarReview;
}
