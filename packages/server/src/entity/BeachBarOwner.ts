import { softRemove } from "@/utils/softRemove";
import { Dayjs } from "dayjs";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { BeachBar } from "./BeachBar";
import { Owner } from "./Owner";

@Entity({ name: "beach_bar_owner", schema: "public" })
export class BeachBarOwner extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "integer", name: "beach_bar_id" })
  beachBarId: number;

  @Column({ type: "integer", name: "owner_id" })
  ownerId: number;

  @Column({ type: "boolean", name: "is_primary", default: () => false })
  isPrimary: boolean;

  @Column({ type: "boolean", name: "public_info", default: () => true })
  publicInfo: boolean;

  @ManyToOne(() => BeachBar, beachBar => beachBar.owners, { nullable: false, cascade: ["soft-remove", "recover"] })
  @JoinColumn({ name: "beach_bar_id" })
  beachBar: BeachBar;

  @ManyToOne(() => Owner, owner => owner.beachBars, { nullable: false, cascade: ["soft-remove", "recover"] })
  @JoinColumn({ name: "owner_id" })
  owner: Owner;

  @UpdateDateColumn({ type: "timestamptz", name: "updated_at", default: () => `NOW()` })
  updatedAt: Dayjs;

  @CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` })
  timestamp: Dayjs;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt?: Dayjs;

  async softRemove(): Promise<any> {
    await softRemove(BeachBarOwner, { ownerId: this.owner.id, beachBarId: this.beachBar.id });
    await this.beachBar.updateRedis();
  }
}
