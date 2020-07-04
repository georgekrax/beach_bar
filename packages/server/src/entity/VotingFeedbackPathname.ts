import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { VotingFeedback } from "./VotingFeedback";

@Entity({ name: "voting_feedback_pathname", schema: "public" })
export class VotingFeedbackPathname extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "integer", name: "feedback_id" })
  feedbackId: number;

  @Column({ type: "text", name: "path_value" })
  pathValue: string;

  @ManyToOne(() => VotingFeedback, votingFeedback => votingFeedback.pathnames, { nullable: false })
  @JoinColumn({ name: "feedback_id" })
  feedback: VotingFeedback;
}
