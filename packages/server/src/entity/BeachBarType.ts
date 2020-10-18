import { Dayjs } from "dayjs";
import { BaseEntity, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { softRemove } from "utils/softRemove";
import { BeachBar } from "./BeachBar";
import { BeachBarStyle } from "./BeachBarStyle";

@Entity({ name: "beach_bar_type", schema: "public" })
export class BeachBarType extends BaseEntity {
  @PrimaryColumn({ type: "integer", name: "beach_bar_id" })
  beachBarId: number;

  @PrimaryColumn({ type: "integer", name: "style_id" })
  styleId: number;

  @ManyToOne(() => BeachBar, beachBar => beachBar.styles, { nullable: false })
  @JoinColumn({ name: "beach_bar_id" })
  beachBar: BeachBar;

  @ManyToOne(() => BeachBarStyle, beachBarStyle => beachBarStyle.beachBars, { nullable: false })
  @JoinColumn({ name: "style_id" })
  style: BeachBarStyle;

  @CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` })
  timestamp: Dayjs;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt: Dayjs;

  async softRemove(): Promise<any> {
    const findOptions: any = { beachBarId: this.beachBarId, styleId: this.styleId };
    await softRemove(BeachBarType, findOptions);
  }
}
