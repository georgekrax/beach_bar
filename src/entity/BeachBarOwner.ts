import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";
import { BeachBar } from "./BeachBar";
import { User } from "./User";

@Entity({ name: "owner_beach_bar", schema: "public" })
@Unique("owner_beach_bar_beach_bar_id_user_id_key", ["beachBarId", "userId"])
export class BeachBarOwner extends BaseEntity {
  @PrimaryColumn({ type: "integer", name: "beach_bar_id" })
  beachBarId: number;

  @PrimaryColumn({ type: "integer", name: "user_id" })
  userId: number;

  @Column({ type: "boolean", name: "is_primary", default: () => false })
  isPrimary: boolean;

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
  @JoinColumn({ name: "beach_bar_id" })
  user: User;
}
