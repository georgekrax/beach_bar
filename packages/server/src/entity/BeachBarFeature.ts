import { Dayjs } from "dayjs";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { softRemove } from "../utils/softRemove";
import { BeachBar } from "./BeachBar";
import { BeachBarService } from "./BeachBarService";

@Entity({ name: "beach_bar_feature", schema: "public" })
export class BeachBarFeature extends BaseEntity {
  @PrimaryColumn({ type: "integer", name: "beach_bar_id" })
  beachBarId: number;

  @PrimaryColumn({ type: "integer", name: "service_id" })
  serviceId: number;

  @Column({ type: "smallint", name: "quantity", default: () => 1 })
  quantity: number;

  @Column({ type: "text", name: "description", nullable: true })
  description?: string;

  @ManyToOne(() => BeachBar, beachBar => beachBar.features, { nullable: false, cascade: ["soft-remove", "recover"] })
  @JoinColumn({ name: "beach_bar_id" })
  beachBar: BeachBar;

  @ManyToOne(() => BeachBarService, beachBarService => beachBarService.beachBars, { nullable: false })
  @JoinColumn({ name: "service_id" })
  service: BeachBarService;

  @UpdateDateColumn({ type: "timestamptz", name: "updated_at", default: () => `NOW()` })
  updatedAt: Dayjs;

  @CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` })
  timestamp: Dayjs;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt?: Dayjs;

  async customSoftRemove(featureId: number): Promise<any> {
    await softRemove(BeachBarFeature, { beachBarId: this.beachBarId, serviceId: featureId });
    await this.beachBar.updateRedis();
  }
}
