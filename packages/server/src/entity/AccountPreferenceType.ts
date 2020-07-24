import { BaseEntity, CreateDateColumn, Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Dayjs } from "dayjs";
import { AccountPreference } from "./AccountPreference";

@Entity({ name: "account_preference_type", schema: "public" })
export class AccountPreferenceType extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text", name: "name", unique: true })
  name: number;

  @Column({ type: "text", name: "description", nullable: true })
  description: number;

  @OneToMany(() => AccountPreference, accountPreference => accountPreference.preference, { nullable: true })
  accounts?: AccountPreference[];

  @CreateDateColumn({ name: "timestamp", type: "timestamptz", default: () => `NOW()` })
  timestamp: Dayjs;
}
