import { BaseEntity, Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ReviewVote } from "./ReviewVote";

@Entity({ name: "review_vote_type", schema: "public" })
export class ReviewVoteType extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 255, name: "value", unique: true })
  value: string;

  @OneToMany(() => ReviewVote, reviewVote => reviewVote.type, { nullable: false, cascade: ["soft-remove", "recover"] })
  @JoinColumn({ name: "review_id" })
  votes: ReviewVote[];
}
