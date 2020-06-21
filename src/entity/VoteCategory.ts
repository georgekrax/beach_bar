import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { VoteTag } from "./VoteTag";

@Entity({ name: "vote_category", schema: "public" })
export class VoteCategory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 255, name: "title" })
  title: string;

  @Column({ type: "text", name: "description" })
  description: string;

  @Column("varchar", { length: 4, name: "ref_code", unique: true })
  refCode: string;

  @OneToOne(() => VoteTag, voteTag => voteTag.category, { nullable: true })
  voteTag?: VoteTag;

  @CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` })
  timestamp: Date;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt?: Date;
}
