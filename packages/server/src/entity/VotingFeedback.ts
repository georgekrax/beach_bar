import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Vote } from "./Vote";
import { VotingResult } from "./VotingResult";
import { Dayjs } from "dayjs";

@Entity({ name: "voting_feedback", schema: "public" })
export class VotingFeedback extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 255, name: "title" })
  title: string;

  @Column({ type: "text", name: "description" })
  description: string;

  @Column("varchar", { length: 4, name: "ref_code", unique: true })
  refCode: string;

  @OneToOne(() => VotingResult, voteTag => voteTag.feedback, { nullable: true })
  votingResult?: VotingResult;

  @OneToMany(() => Vote, vote => vote.feedback, { nullable: true })
  votes?: Vote[];

  @CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` })
  timestamp: Dayjs;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt?: Dayjs;
}
