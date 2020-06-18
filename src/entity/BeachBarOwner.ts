import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, UpdateDateColumn } from "typeorm";
import { BeachBar } from "./BeachBar";
import { User } from "./User";

@Entity({ name: "beach_bar_owner", schema: "public" })
export class BeachBarOwner extends BaseEntity {
  @Column({ type: "integer", name: "beach_bar_id" })
  beachBarId: number;

  @Column({ type: "integer", name: "user_id" })
  userId: number;

  @Column({ type: "boolean", name: "is_primary", default: () => false })
  isPrimary: boolean;

  @Column({ type: "boolean", name: "public_info", default: () => true })
  publicInfo: boolean;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt?: Date;

  @UpdateDateColumn({ type: "timestamptz", name: "updated_at", default: () => `NOW()` })
  updatedAt: Date;

  @CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` })
  timestamp: Date;

  @ManyToOne(() => BeachBar, beachBar => beachBar.owners, { nullable: false })
  @JoinColumn({ name: "beach_bar_id" })
  beachBar: BeachBar;

  @ManyToOne(() => User, user => user.beachBars, { nullable: false })
  @JoinColumn({ name: "user_id" })
  user: User;
}
