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
import { softRemove } from "../utils/softRemove";
import { BeachBar } from "./BeachBar";

@Entity({ name: "beach_bar_entry_fee", schema: "public" })
export class BeachBarEntryFee extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: bigint;

  @Column({ type: "decimal", name: "fee", precision: 5, scale: 2 })
  fee: number;

  @Column({ type: "integer", name: "beach_bar_id" })
  beachBarId: number;

  @Column({ type: "date", name: "date" })
  date: Dayjs;

  @ManyToOne(() => BeachBar, beachBar => beachBar.entryFees)
  @JoinColumn({ name: "beach_bar_id" })
  beachBar: BeachBar;

  @UpdateDateColumn({ type: "timestamptz", name: "updated_at", default: () => `NOW()` })
  updatedAt: Dayjs;

  @CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` })
  timestamp: Dayjs;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt?: Dayjs;

  async update(fee?: number): Promise<BeachBarEntryFee | any> {
    try {
      if (fee && fee > 0) {
        this.fee = fee;
        await this.save();
      }
      return this;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async softRemove(): Promise<any> {
    await softRemove(BeachBarEntryFee, { id: this.id });
  }
}
