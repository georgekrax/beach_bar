import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
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

  @ManyToOne(() => BeachBar, beachBar => beachBar.features, { nullable: false })
  @JoinColumn({ name: "beach_bar_id" })
  beachBar: BeachBar;

  @ManyToOne(() => BeachBarService, beachBarService => beachBarService.beachBars, { nullable: false })
  @JoinColumn({ name: "service_id" })
  service: BeachBarService;
}
