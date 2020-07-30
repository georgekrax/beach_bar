import { softRemove } from "@utils/softRemove";
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

@Entity({ name: "beach_bar_img_url", schema: "public" })
export class BeachBarImgUrl extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: bigint;

  @Column({ type: "integer", name: "beach_bar_id" })
  beachBarId: number;

  @Column({ type: "text", name: "img_url" })
  imgUrl: string;

  @Column({ type: "text", name: "description", nullable: true })
  description?: string;

  @ManyToOne(() => BeachBar, beachBar => beachBar.imgUrls, { nullable: false })
  @JoinColumn({ name: "beach_bar_id" })
  beachBar: BeachBar;

  @UpdateDateColumn({ type: "timestamptz", name: "updated_at", default: () => `NOW()` })
  updatedAt: Dayjs;

  @CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` })
  timestamp: Dayjs;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt?: Dayjs;

  async update(imgUrl?: string, description?: string): Promise<BeachBarImgUrl | any> {
    try {
      if (imgUrl && imgUrl !== this.imgUrl) {
        this.imgUrl = imgUrl.toString();
      }
      if (description && description !== this.description) {
        this.description = description;
      }
      await this.save();
      return this;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async softRemove(): Promise<any> {
    await softRemove(BeachBarImgUrl, { id: this.id });
    await this.beachBar.updateRedis();
  }
}
