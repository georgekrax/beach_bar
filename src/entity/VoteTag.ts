import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { VoteCategory } from "./VoteCategory";

@Entity({ name: "vote_tag", schema: "public" })
export class VoteTag extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "integer", name: "category_id", unique: true })
  categoryId: number;

  @Column({ type: "integer", name: "upvotes", default: () => 0 })
  upvotes: number;

  @Column({ type: "integer", name: "downvotes", default: () => 0 })
  downvotes: number;

  @Column({ type: "integer", name: "total_votes", nullable: true })
  totalVotes: number;

  @OneToOne(() => VoteCategory, voteCategory => voteCategory.voteTag, { nullable: false })
  @JoinColumn({ name: "category_id" })
  category: VoteCategory;
}
