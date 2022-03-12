import { softRemove } from "@/utils/softRemove";
import { Dayjs } from "dayjs";
import {
  BaseEntity,
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
import { BeachBarReview } from "./BeachBarReview";
import { ReviewVoteType } from "./ReviewVoteType";
import { User } from "./User";

@Entity({ name: "review_vote", schema: "public" })
export class ReviewVote extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: bigint;

  @Column({ type: "bigint", name: "review_id" })
  reviewId: bigint;

  @Column({ name: "user_id", type: "integer" })
  userId: number;

  @Column({ name: "type_id", type: "smallint" })
  typeId: number;

  @OneToOne(() => BeachBarReview, beachBarReview => beachBarReview.votes, { nullable: false, cascade: ["soft-remove", "recover"] })
  @JoinColumn({ name: "review_id" })
  review: BeachBarReview;

  @ManyToOne(() => User, user => user.reviewVotes, { nullable: false, cascade: ["soft-remove", "recover"] })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => ReviewVoteType, type => type.votes, { nullable: false, cascade: ["soft-remove", "recover"] })
  @JoinColumn({ name: "type_id" })
  type: ReviewVoteType;

  @UpdateDateColumn({ type: "timestamptz", name: "updated_at", default: () => `NOW()` })
  updatedAt: Dayjs;

  @CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` })
  timestamp: Dayjs;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt?: Dayjs;

  async softRemove(): Promise<any> {
    await softRemove(ReviewVote, { id: this.id });
    // TODO: Change later
    // await this.review.beachBar.updateRedis();
  }
}
