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
} from "typeorm";
import { BeachBar } from "./BeachBar";
import { User } from "./User";

@Entity({ name: "user_favorite_bar", schema: "public" })
export class UserFavoriteBar extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: bigint;

  @Column({ type: "integer", name: "user_id" })
  userId: number;

  @Column({ type: "integer", name: "beach_bar_id" })
  beachBarId: number;

  @ManyToOne(() => User, user => user.favoriteBars, { nullable: false })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => BeachBar, beachBar => beachBar.usersFavorite, { nullable: false })
  @JoinColumn({ name: "beach_bar_id" })
  beachBar: BeachBar;

  @CreateDateColumn({ name: "timestamp", type: "timestamptz", default: () => `NOW()` })
  timestamp: Dayjs;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt?: Dayjs;

  async softRemove(): Promise<any> {
    await softRemove(UserFavoriteBar, { userId: this.userId, beachBarId: this.beachBarId });
  }
}
