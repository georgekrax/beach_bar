import { Dayjs } from "dayjs";
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserHistory } from "./UserHistory";

@Entity({ name: "user_history_activity", schema: "public" })
export class UserHistoryActivity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "integer" })
  id: number;

  @Column("varchar", { length: 255, name: "name", unique: true })
  name: string;

  @OneToMany(() => UserHistory, userHistory => userHistory.activity, { nullable: true })
  userHistories: UserHistory[];

  @CreateDateColumn({ name: "timestamp", type: "timestamptz", default: () => `NOW()` })
  timestamp: Dayjs;
}
