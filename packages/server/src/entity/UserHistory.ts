import { Dayjs } from "dayjs";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { UserHistoryActivity } from "./UserHistoryActivity";

@Entity({ name: "user_history", schema: "public" })
export class UserHistory extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: bigint;

  @Column({ type: "integer", name: "activity_id" })
  activityId: number;

  @Column({ type: "bigint", name: "object_id", nullable: true })
  objectId?: bigint;

  @Column({ type: "integer", name: "user_id", nullable: true })
  userId?: number;

  @Column({ type: "cidr", name: "ip_addr", nullable: true })
  ipAddr?: string;

  @ManyToOne(() => UserHistoryActivity, userHistoryActivity => userHistoryActivity.userHistories, { nullable: false })
  @JoinColumn({ name: "activity_id" })
  activity: UserHistoryActivity;

  @ManyToOne(() => User, user => user.history, { nullable: true })
  @JoinColumn({ name: "user_id" })
  user?: User;

  @CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => "NOW()" })
  timestamp: Dayjs;
}
