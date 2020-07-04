import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { VotingFeedback } from "./VotingFeedback";

@Entity({ name: "voting_result", schema: "public" })
export class VotingResult extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "integer", name: "feedback_id", unique: true })
  feedbackId: number;

  @Column({ type: "integer", name: "upvotes", default: () => 0 })
  upvotes: number;

  @Column({ type: "integer", name: "downvotes", default: () => 0 })
  downvotes: number;

  @Column({ type: "integer", name: "total_votes", nullable: true })
  totalVotes: number;

  @OneToOne(() => VotingFeedback, votingFeedback => votingFeedback.votingResult, {
    nullable: false,
    cascade: ["soft-remove", "recover"],
  })
  @JoinColumn({ name: "category_id" })
  feedback: VotingFeedback;
}
