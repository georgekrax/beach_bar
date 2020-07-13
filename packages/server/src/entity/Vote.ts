import { BaseEntity, Check, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { VotingFeedback } from "./VotingFeedback";
import { Dayjs } from "dayjs";

@Entity({ name: "vote", schema: "public" })
@Check(`"rating" IN ('y', 'n')`)
export class Vote extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: bigint;

  @Column({ type: "integer", name: "feedback_id" })
  feedbackId: number;

  @Column({ type: "integer", name: "user_id", nullable: true })
  userId: number;

  @Column({ type: "char", name: "rating" })
  rating: string;

  @ManyToOne(() => VotingFeedback, votingFeedback => votingFeedback.votes, { nullable: false })
  @JoinColumn({ name: "feedback_id" })
  feedback: VotingFeedback;

  @ManyToOne(() => User, user => user.votes, { nullable: true })
  @JoinColumn({ name: "user_id" })
  user: User;

  @CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` })
  timestamp: Dayjs;
}
