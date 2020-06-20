import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn, DeleteDateColumn, OneToMany } from "typeorm";
import { BeachBar } from "./BeachBar";
import { User } from "./User";
import { BeachBarOwner } from "./BeachBarOwner";

@Entity({ name: "owner", schema: "public" })
export class Owner extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "integer", name: "user_id" })
  userId: number;

  @OneToOne(() => User, user => user.owner, { nullable: false })
  @JoinColumn({ name: "user_id" })
  user: User;

  @OneToMany(() => BeachBarOwner, beachBarOwner => beachBarOwner.owner)
  beachBars: BeachBarOwner[];

  @UpdateDateColumn({ type: "timestamptz", name: "updated_at", default: () => `NOW()` })
  updatedAt: Date;

  @CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` })
  timestamp: Date;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt?: Date;
}
