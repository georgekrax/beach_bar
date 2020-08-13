import { softRemove } from "@utils/softRemove";
import { Dayjs } from "dayjs";
import { BaseEntity, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { BeachBar } from "./BeachBar";
import { User } from "./User";

@Entity({ name: "user_favorite_bar", schema: "public" })
export class UserFavoriteBar extends BaseEntity {
  @PrimaryColumn({ type: "integer", name: "user_id" })
  userId: number;

  @PrimaryColumn({ type: "integer", name: "beach_bar_id" })
  beachBarId: number;

  @ManyToOne(() => User, user => user.favoriteBars, { nullable: false })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => BeachBar, beachBar => beachBar.usersFavorite, { nullable: false })
  @JoinColumn({ name: "bar_id" })
  beachBar: BeachBar;

  @CreateDateColumn({ name: "timestamp", type: "timestamptz", default: () => `NOW()` })
  timestamp: Dayjs;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt?: Dayjs;

  async softRemove(): Promise<any> {
    await softRemove(UserFavoriteBar, { userId: this.userId, beachBarId: this.beachBarId });
  }
}
